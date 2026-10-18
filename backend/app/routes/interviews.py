import json
from datetime import datetime
from flask import Blueprint, request, jsonify
from app.models import db, User, Interview, Question, Answer
from app.routes.auth import token_required
from app.services.ai_service import AIService
from app.services.market_questions import get_all_companies, get_questions_by_company

interviews_bp = Blueprint('interviews', __name__)

@interviews_bp.route('/api/market-questions', methods=['GET'])
def get_market_questions():
    company = request.args.get('company', 'ALL')
    companies = get_all_companies()
    questions = get_questions_by_company(company)
    return jsonify({
        'companies': companies,
        'questions': questions
    }), 200

@interviews_bp.route('/api/interviews', methods=['POST'])
@token_required
def create_interview(current_user):
    data = request.get_json() or {}
    role = data.get('role', '').strip()
    interview_type = data.get('interview_type', '').strip()
    difficulty = data.get('difficulty', '').strip()
    experience_level = data.get('experience_level', '').strip()
    total_questions = int(data.get('total_questions', 5))
    company = data.get('company', '').strip()
    custom_questions = data.get('custom_questions', [])
    resume_text = data.get('resume_text', '').strip()
    jd_text = data.get('jd_text', '').strip()

    if not role or not interview_type or not difficulty or not experience_level:
        return jsonify({'error': 'Role, type, difficulty, and experience level are required'}), 400

    # Determine effective questions count
    if custom_questions and isinstance(custom_questions, list) and len(custom_questions) > 0:
        total_questions = len(custom_questions)
    elif total_questions not in [5, 10, 15]:
        total_questions = 5

    final_role = f"{role} ({company})" if company and company not in role else role

    try:
        # Create Interview object first
        interview = Interview(
            user_id=current_user.id,
            role=final_role,
            interview_type=interview_type,
            difficulty=difficulty,
            experience_level=experience_level,
            total_questions=total_questions
        )
        db.session.add(interview)
        db.session.commit()

        # Handle custom questions or generate dynamically using AIService
        if custom_questions and isinstance(custom_questions, list) and len(custom_questions) > 0:
            ai_questions = []
            for idx, item in enumerate(custom_questions):
                if isinstance(item, str) and item.strip():
                    is_coding = any(w in item.lower() for w in [
                        'write a function', 'write a program', 'write code', 'write a query',
                        'implement', 'algorithm', 'two sum', 'linked list', 'binary tree',
                        'sql query', 'leetcode', 'def ', 'function '
                    ])
                    ai_questions.append({
                        'question': item.strip(),
                        'category': 'Coding Challenge' if is_coding else 'Custom Question',
                        'difficulty': difficulty,
                        'question_type': 'coding' if is_coding else 'theory',
                        'starter_code': 'def solution():\n    # Write your solution here\n    pass\n' if is_coding else '',
                        'test_cases': [],
                        'order_number': idx + 1
                    })
                elif isinstance(item, dict) and item.get('question'):
                    q_text = item['question'].strip()
                    is_coding = item.get('question_type') == 'coding' or any(w in q_text.lower() for w in [
                        'write a function', 'write a program', 'write code', 'write a query',
                        'implement', 'algorithm', 'two sum', 'linked list', 'binary tree',
                        'sql query', 'leetcode', 'def ', 'function '
                    ])
                    ai_questions.append({
                        'question': q_text,
                        'category': item.get('category', 'Coding Challenge' if is_coding else 'Custom Question'),
                        'difficulty': item.get('difficulty', difficulty),
                        'question_type': item.get('question_type', 'coding' if is_coding else 'theory'),
                        'starter_code': item.get('starter_code', 'def solution():\n    # Write your solution here\n    pass\n' if is_coding else ''),
                        'test_cases': item.get('test_cases', []),
                        'order_number': idx + 1
                    })
        else:
            # Query recently asked questions for this candidate to prevent repetition!
            recent_questions = db.session.query(Question.question_text).join(Interview)\
                .filter(Interview.user_id == current_user.id)\
                .order_by(Interview.started_at.desc())\
                .limit(50).all()
            excluded_texts = [q[0].strip().lower() for q in recent_questions if q and q[0]]

            ai_questions = AIService.generate_questions(
                role=role,
                interview_type=interview_type,
                difficulty=difficulty,
                experience_level=experience_level,
                count=total_questions,
                company=company,
                resume_text=resume_text,
                jd_text=jd_text,
                excluded_questions=excluded_texts
            )

        # Store generated questions in db
        for idx, q_data in enumerate(ai_questions):
            tc = q_data.get('test_cases', [])
            tc_str = json.dumps(tc) if isinstance(tc, (list, dict)) else str(tc or '')

            sc = q_data.get('starter_code', '')
            sc_str = json.dumps(sc) if isinstance(sc, (dict, list)) else str(sc or '')

            question = Question(
                interview_id=interview.id,
                question_text=q_data['question'],
                category=q_data.get('category', 'General'),
                difficulty=q_data.get('difficulty', difficulty),
                question_type=q_data.get('question_type', 'theory'),
                starter_code=sc_str,
                test_cases=tc_str,
                order_number=idx + 1
            )
            db.session.add(question)
        
        db.session.commit()

        # Get first question
        first_q = Question.query.filter_by(interview_id=interview.id, order_number=1).first()

        return jsonify({
            'message': 'Interview session initialized successfully',
            'interview': interview.to_dict(),
            'first_question': first_q.to_dict() if first_q else None
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to initiate interview: {str(e)}'}), 500

@interviews_bp.route('/api/interviews', methods=['GET'])
@token_required
def get_interviews_history(current_user):
    # Filter query parameters
    role = request.args.get('role', '').strip()
    interview_type = request.args.get('type', '').strip()
    difficulty = request.args.get('difficulty', '').strip()
    
    query = Interview.query.filter_by(user_id=current_user.id)
    
    if role:
        query = query.filter(Interview.role.ilike(f"%{role}%"))
    if interview_type:
        query = query.filter(Interview.interview_type == interview_type)
    if difficulty:
        query = query.filter(Interview.difficulty == difficulty)
        
    interviews = query.order_by(Interview.started_at.desc()).all()
    
    return jsonify({
        'interviews': [i.to_dict() for i in interviews]
    }), 200

@interviews_bp.route('/api/interviews/<int:interview_id>', methods=['GET'])
@token_required
def get_interview(current_user, interview_id):
    interview = db.session.get(Interview, interview_id)
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
        
    if interview.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized access to this interview session'}), 403
        
    questions = Question.query.filter_by(interview_id=interview_id).order_by(Question.order_number).all()
    
    return jsonify({
        'interview': interview.to_dict(),
        'questions': [q.to_dict() for q in questions]
    }), 200

@interviews_bp.route('/api/interviews/<int:interview_id>/answer', methods=['POST'])
@token_required
def submit_answer(current_user, interview_id):
    interview = db.session.get(Interview, interview_id)
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
        
    if interview.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized access to this interview session'}), 403

    data = request.get_json() or {}
    question_id = data.get('question_id')
    user_answer = data.get('user_answer', '').strip()

    if not question_id:
        return jsonify({'error': 'Question ID is required'}), 400

    question = Question.query.filter_by(id=question_id, interview_id=interview_id).first()
    if not question:
        return jsonify({'error': 'Question does not belong to this interview'}), 404

    # Check if answer already exists
    existing_answer = Answer.query.filter_by(question_id=question_id).first()
    if existing_answer:
        return jsonify({'error': 'Question has already been answered'}), 400

    try:
        # Call AI Service to evaluate the candidate's answer
        evaluation = AIService.evaluate_answer(
            question_text=question.question_text,
            user_answer=user_answer,
            role=interview.role,
            interview_type=interview.interview_type,
            difficulty=interview.difficulty,
            category=question.category,
            question_type=question.question_type
        )

        answer = Answer(
            question_id=question_id,
            user_answer=user_answer,
            correctness_score=evaluation.get('correctness', 0.0),
            relevance_score=evaluation.get('relevance', 0.0),
            clarity_score=evaluation.get('clarity', 0.0),
            completeness_score=evaluation.get('completeness', 0.0),
            overall_score=evaluation.get('overall_score', 0.0),
            feedback=evaluation.get('feedback', ''),
            ideal_answer=evaluation.get('ideal_answer', '')
        )
        
        db.session.add(answer)
        db.session.commit()

        # Find the next question (if any)
        next_order = question.order_number + 1
        next_q = Question.query.filter_by(interview_id=interview_id, order_number=next_order).first()

        return jsonify({
            'message': 'Answer submitted and evaluated successfully',
            'evaluation': answer.to_dict(),
            'next_question': next_q.to_dict() if next_q else None
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to process answer: {str(e)}'}), 500

@interviews_bp.route('/api/interviews/<int:interview_id>/complete', methods=['POST'])
@token_required
def complete_interview(current_user, interview_id):
    interview = db.session.get(Interview, interview_id)
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
        
    if interview.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized access to this interview session'}), 403

    if interview.completed_at:
        return jsonify({
            'message': 'Interview is already completed',
            'interview': interview.to_dict()
        }), 200

    try:
        # Retrieve all questions and answers
        questions = Question.query.filter_by(interview_id=interview_id).order_by(Question.order_number).all()
        
        answers_evals = []
        scores = []
        
        for q in questions:
            ans = q.answer
            if ans:
                scores.append(ans.overall_score)
                answers_evals.append({
                    "question_text": q.question_text,
                    "user_answer": ans.user_answer,
                    "correctness": ans.correctness_score,
                    "relevance": ans.relevance_score,
                    "clarity": ans.clarity_score,
                    "completeness": ans.completeness_score,
                    "overall": ans.overall_score,
                    "feedback": ans.feedback
                })
            else:
                # If question skipped, score is 0
                scores.append(0.0)
                answers_evals.append({
                    "question_text": q.question_text,
                    "user_answer": "[SKIPPED]",
                    "correctness": 0.0,
                    "relevance": 0.0,
                    "clarity": 0.0,
                    "completeness": 0.0,
                    "overall": 0.0,
                    "feedback": "Question was skipped by candidate."
                })

        # Calculate final aggregated overall score
        # Scale to 100 max
        avg_score_out_of_10 = sum(scores) / len(scores) if scores else 0.0
        overall_score_percentage = round(avg_score_out_of_10 * 10, 1)

        # Call AI service to generate report, strengths, weaknesses, and study plan
        final_report = AIService.generate_final_report(
            role=interview.role,
            interview_type=interview.interview_type,
            difficulty=interview.difficulty,
            experience_level=interview.experience_level,
            answers_evaluations=answers_evals
        )

        interview.overall_score = overall_score_percentage
        interview.strengths = json.dumps(final_report.get('strengths', []))
        interview.weaknesses = json.dumps(final_report.get('weaknesses', []))
        interview.study_plan = json.dumps(final_report.get('study_plan', {}))
        interview.completed_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Interview finalized successfully',
            'interview': interview.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to complete interview: {str(e)}'}), 500

@interviews_bp.route('/api/interviews/<int:interview_id>', methods=['DELETE'])
@token_required
def delete_interview(current_user, interview_id):
    interview = db.session.get(Interview, interview_id)
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
        
    if interview.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized access to this interview session'}), 403

    try:
        db.session.delete(interview)
        db.session.commit()
        return jsonify({'message': 'Interview deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete interview: {str(e)}'}), 500

@interviews_bp.route('/api/interviews', methods=['DELETE'])
@token_required
def delete_all_interviews(current_user):
    try:
        interviews = Interview.query.filter_by(user_id=current_user.id).all()
        for i in interviews:
            db.session.delete(i)
        db.session.commit()
        return jsonify({'message': 'All interviews wiped successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to wipe interviews: {str(e)}'}), 500


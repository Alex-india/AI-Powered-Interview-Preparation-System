from flask import Blueprint, jsonify
from app.models import db, Interview, Question, Answer
from app.routes.auth import token_required
from sqlalchemy import func

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/api/analytics', methods=['GET'])
@token_required
def get_analytics(current_user):
    # Fetch all completed interviews for the current user
    completed_interviews = Interview.query.filter(
        Interview.user_id == current_user.id,
        Interview.completed_at.isnot(None)
    ).order_by(Interview.started_at.asc()).all()

    total_completed = len(completed_interviews)

    if total_completed == 0:
        return jsonify({
            'message': 'Complete your first interview to unlock performance analytics.',
            'analytics': {
                'total_completed': 0,
                'total_questions_answered': 0,
                'avg_score': 0.0,
                'best_score': 0.0,
                'score_trend': [],
                'skills_breakdown': {
                    'correctness': 0.0,
                    'relevance': 0.0,
                    'clarity': 0.0,
                    'completeness': 0.0
                },
                'roles_distribution': {},
                'types_distribution': {}
            }
        }), 200

    # Calculate metrics
    scores = [i.overall_score for i in completed_interviews if i.overall_score is not None]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0.0
    best_score = max(scores) if scores else 0.0

    # Total questions answered
    total_answers = db.session.query(func.count(Answer.id))\
        .join(Question, Answer.question_id == Question.id)\
        .join(Interview, Question.interview_id == Interview.id)\
        .filter(Interview.user_id == current_user.id).scalar() or 0

    # Score trend (sorted chronological order)
    score_trend = []
    for i in completed_interviews:
        score_trend.append({
            'id': i.id,
            'date': i.completed_at.strftime('%Y-%m-%d'),
            'score': i.overall_score,
            'role': i.role,
            'type': i.interview_type
        })

    # Skill breakdown (averages from answered questions)
    answers_query = db.session.query(
        func.avg(Answer.correctness_score).label('avg_correctness'),
        func.avg(Answer.relevance_score).label('avg_relevance'),
        func.avg(Answer.clarity_score).label('avg_clarity'),
        func.avg(Answer.completeness_score).label('avg_completeness')
    ).join(Question, Answer.question_id == Question.id)\
     .join(Interview, Question.interview_id == Interview.id)\
     .filter(Interview.user_id == current_user.id).first()

    skills_breakdown = {
        'correctness': round((answers_query.avg_correctness or 0.0) * 10, 1), # convert 0-10 scale to 0-100 percentage
        'relevance': round((answers_query.avg_relevance or 0.0) * 10, 1),
        'clarity': round((answers_query.avg_clarity or 0.0) * 10, 1),
        'completeness': round((answers_query.avg_completeness or 0.0) * 10, 1)
    }

    # Roles practiced distribution
    roles_distribution = {}
    for i in completed_interviews:
        roles_distribution[i.role] = roles_distribution.get(i.role, 0) + 1

    # Types distribution
    types_distribution = {}
    for i in completed_interviews:
        types_distribution[i.interview_type] = types_distribution.get(i.interview_type, 0) + 1

    return jsonify({
        'analytics': {
            'total_completed': total_completed,
            'total_questions_answered': total_answers,
            'avg_score': avg_score,
            'best_score': best_score,
            'score_trend': score_trend,
            'skills_breakdown': skills_breakdown,
            'roles_distribution': roles_distribution,
            'types_distribution': types_distribution
        }
    }), 200

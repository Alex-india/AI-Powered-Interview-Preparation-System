from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

def utc_now():
    return datetime.now(timezone.utc)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    target_role = db.Column(db.String(100), nullable=True)
    experience_level = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now)
    
    interviews = db.relationship('Interview', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        created_at_val = None
        if self.created_at:
            created_at_val = self.created_at.isoformat() if hasattr(self.created_at, 'isoformat') else str(self.created_at)
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'target_role': self.target_role,
            'experience_level': self.experience_level,
            'created_at': created_at_val
        }

class Interview(db.Model):
    __tablename__ = 'interviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    interview_type = db.Column(db.String(50), nullable=False) # technical, hr, behavioral, mixed
    difficulty = db.Column(db.String(50), nullable=False) # beginner, intermediate, advanced
    experience_level = db.Column(db.String(50), nullable=False)
    total_questions = db.Column(db.Integer, nullable=False, default=5)
    overall_score = db.Column(db.Float, nullable=True)
    study_plan = db.Column(db.Text, nullable=True) # AI-generated study plan JSON string
    strengths = db.Column(db.Text, nullable=True) # Strengths comma separated or JSON
    weaknesses = db.Column(db.Text, nullable=True) # Weaknesses comma separated or JSON
    started_at = db.Column(db.DateTime, default=utc_now)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    questions = db.relationship('Question', backref='interview', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'role': self.role,
            'interview_type': self.interview_type,
            'difficulty': self.difficulty,
            'experience_level': self.experience_level,
            'total_questions': self.total_questions,
            'overall_score': self.overall_score,
            'study_plan': self.study_plan,
            'strengths': self.strengths,
            'weaknesses': self.weaknesses,
            'started_at': self.started_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'status': 'completed' if self.completed_at else 'in_progress'
        }

class Question(db.Model):
    __tablename__ = 'questions'
    
    id = db.Column(db.Integer, primary_key=True)
    interview_id = db.Column(db.Integer, db.ForeignKey('interviews.id', ondelete="CASCADE"), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False) # e.g. technical, communication
    difficulty = db.Column(db.String(50), nullable=False)
    order_number = db.Column(db.Integer, nullable=False)
    question_type = db.Column(db.String(30), nullable=False, default='theory') # 'theory' or 'coding'
    starter_code = db.Column(db.Text, nullable=True)
    test_cases = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now)
    
    answer = db.relationship('Answer', backref='question', uselist=False, lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        import json
        tc = []
        if self.test_cases:
            try:
                tc = json.loads(self.test_cases)
            except Exception:
                tc = []

        sc = self.starter_code or ''
        if isinstance(sc, str) and sc.strip().startswith('{') and sc.strip().endswith('}'):
            try:
                sc = json.loads(sc)
            except Exception:
                pass

        # Dynamic fallback inference if question_type wasn't stored
        q_type = self.question_type or ('coding' if any(w in self.question_text.lower() for w in ['write a function', 'write a program', 'write code', 'write a query', 'implement', 'algorithm', 'two sum', 'linked list', 'binary tree', 'sql query', 'leetcode']) else 'theory')
        return {
            'id': self.id,
            'interview_id': self.interview_id,
            'question_text': self.question_text,
            'category': self.category,
            'difficulty': self.difficulty,
            'order_number': self.order_number,
            'question_type': q_type,
            'starter_code': sc,
            'test_cases': tc,
            'answer': self.answer.to_dict() if self.answer else None
        }

class Answer(db.Model):
    __tablename__ = 'answers'
    
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id', ondelete="CASCADE"), nullable=False)
    user_answer = db.Column(db.Text, nullable=False)
    
    # AI Evaluation scores
    correctness_score = db.Column(db.Float, nullable=False, default=0.0)
    relevance_score = db.Column(db.Float, nullable=False, default=0.0)
    clarity_score = db.Column(db.Float, nullable=False, default=0.0)
    completeness_score = db.Column(db.Float, nullable=False, default=0.0)
    overall_score = db.Column(db.Float, nullable=False, default=0.0)
    
    feedback = db.Column(db.Text, nullable=True) # Detailed text feedback
    ideal_answer = db.Column(db.Text, nullable=True) # AI-generated ideal answer
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            'id': self.id,
            'question_id': self.question_id,
            'user_answer': self.user_answer,
            'correctness_score': self.correctness_score,
            'relevance_score': self.relevance_score,
            'clarity_score': self.clarity_score,
            'completeness_score': self.completeness_score,
            'overall_score': self.overall_score,
            'feedback': self.feedback,
            'ideal_answer': self.ideal_answer,
            'created_at': self.created_at.isoformat()
        }

import os
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import unittest
import json
import jwt
from datetime import datetime, timedelta, timezone
from flask import Flask
from app.config import Config
from app.models import db, User, Interview, Question, Answer
from main import create_app

class TestCrackitAISystem(unittest.TestCase):
    def setUp(self):
        # Configure app for testing with in-memory DB
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SECRET_KEY'] = 'test-secret-key-must-be-at-least-32-bytes-long!'
        self.app.config['DEMO_MODE'] = True # Force demo mode for tests to run offline
        
        self.client = self.app.test_client()
        
        with self.app.app_context():
            db.create_all()
            
            # Create a default test user
            self.test_user = User(
                name="Test Student",
                email="student@university.edu",
                target_role="Software Developer",
                experience_level="Student"
            )
            self.test_user.set_password("securepassword")
            db.session.add(self.test_user)
            db.session.commit()
            
            # Fetch user ID to generate headers
            self.user_id = self.test_user.id
            
        # Generate valid JWT token headers
        self.token = jwt.encode({
            'user_id': self.user_id,
            'exp': datetime.now(timezone.utc) + timedelta(days=1)
        }, 'test-secret-key-must-be-at-least-32-bytes-long!', algorithm="HS256")
        self.headers = {'Authorization': f'Bearer {self.token}'}

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    # --- Authentication Tests ---
    
    def test_user_registration_success(self):
        payload = {
            "name": "Jane Graduate",
            "email": "jane@university.edu",
            "password": "validpassword",
            "confirm_password": "validpassword",
            "target_role": "Data Analyst",
            "experience_level": "Fresher"
        }
        res = self.client.post('/api/auth/register', 
                               data=json.dumps(payload),
                               content_type='application/json')
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertIn('token', data)
        self.assertEqual(data['user']['email'], "jane@university.edu")

    def test_user_registration_duplicate_email(self):
        payload = {
            "name": "Test Student Duplicate",
            "email": "student@university.edu",
            "password": "somepassword",
            "confirm_password": "somepassword"
        }
        res = self.client.post('/api/auth/register', 
                               data=json.dumps(payload),
                               content_type='application/json')
        self.assertEqual(res.status_code, 409)
        data = json.loads(res.data)
        self.assertIn('error', data)

    def test_user_login_success(self):
        payload = {
            "email": "student@university.edu",
            "password": "securepassword"
        }
        res = self.client.post('/api/auth/login', 
                               data=json.dumps(payload),
                               content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertIn('token', data)

    def test_user_login_failure(self):
        payload = {
            "email": "student@university.edu",
            "password": "wrongpassword"
        }
        res = self.client.post('/api/auth/login', 
                               data=json.dumps(payload),
                               content_type='application/json')
        self.assertEqual(res.status_code, 401)

    # --- Protected Routes Tests ---
    
    def test_unauthenticated_protected_route_fails(self):
        res = self.client.get('/api/user/profile')
        self.assertEqual(res.status_code, 401)
        self.assertIn('error', json.loads(res.data))

    def test_authenticated_profile_retrieval(self):
        res = self.client.get('/api/user/profile', headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['user']['name'], "Test Student")

    # --- Interview Flow Tests ---
    
    def test_create_interview_success(self):
        payload = {
            "role": "Python Developer",
            "interview_type": "technical",
            "difficulty": "intermediate",
            "experience_level": "1-2 Years",
            "total_questions": 5
        }
        res = self.client.post('/api/interviews', 
                               data=json.dumps(payload),
                               headers=self.headers,
                               content_type='application/json')
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertEqual(data['interview']['role'], "Python Developer")
        self.assertIsNotNone(data['first_question'])
        self.assertEqual(data['first_question']['order_number'], 1)

    def test_submit_answer_and_evaluation(self):
        # 1. Create interview and get first question
        with self.app.app_context():
            # Inject an interview manually to target
            interview = Interview(
                user_id=self.user_id,
                role="Python Developer",
                interview_type="technical",
                difficulty="intermediate",
                experience_level="1-2 Years"
            )
            db.session.add(interview)
            db.session.commit()
            
            question = Question(
                interview_id=interview.id,
                question_text="What is a generator in Python?",
                category="Python Fundamentals",
                difficulty="intermediate",
                order_number=1
            )
            db.session.add(question)
            db.session.commit()
            
            int_id = interview.id
            q_id = question.id

        # 2. Submit answer
        payload = {
            "question_id": q_id,
            "user_answer": "A generator is a function that yields items one by one using the yield keyword."
        }
        res = self.client.post(f'/api/interviews/{int_id}/answer',
                               data=json.dumps(payload),
                               headers=self.headers,
                               content_type='application/json')
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertIn('evaluation', data)
        self.assertGreaterEqual(data['evaluation']['overall_score'], 1.0)
        self.assertIn('feedback', data['evaluation'])

    def test_unauthorized_interview_access_fails(self):
        # Create an interview owned by another user ID
        with self.app.app_context():
            other_user = User(name="Other Candidate", email="other@university.edu", password_hash="dummy")
            db.session.add(other_user)
            db.session.commit()
            
            other_interview = Interview(
                user_id=other_user.id,
                role="Java Developer",
                interview_type="technical",
                difficulty="advanced",
                experience_level="Fresher"
            )
            db.session.add(other_interview)
            db.session.commit()
            other_int_id = other_interview.id
            
        # Try to access using test_user headers
        res = self.client.get(f'/api/interviews/{other_int_id}', headers=self.headers)
        self.assertEqual(res.status_code, 403)
        self.assertIn('error', json.loads(res.data))

if __name__ == '__main__':
    unittest.main()

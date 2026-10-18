import jwt
import datetime
from functools import wraps
from flask import Blueprint, request, jsonify, current_app
from app.models import db, User
from app.config import Config

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                
        if not token:
            return jsonify({'error': 'Authentication token is missing'}), 401
            
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = db.session.get(User, data['user_id'])
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired, please log in again'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token, please log in again'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    name = str(data.get('name') or '').strip()
    email = str(data.get('email') or '').strip().lower()
    password = str(data.get('password') or '')
    
    # Accept both snake_case and camelCase for confirmation
    confirm_password = data.get('confirm_password')
    if confirm_password is None:
        confirm_password = data.get('confirmPassword')
    if confirm_password is not None:
        confirm_password = str(confirm_password)
    else:
        confirm_password = password  # Default to password if not provided by caller

    target_role = str(data.get('target_role') or data.get('targetRole') or 'Software Developer').strip()
    experience_level = str(data.get('experience_level') or data.get('experienceLevel') or 'Fresher').strip()

    if not name:
        return jsonify({'error': 'Full name is required'}), 400
    if len(name) < 2:
        return jsonify({'error': 'Name must be at least 2 characters long'}), 400

    if not email:
        return jsonify({'error': 'Email address is required'}), 400
    if '@' not in email or '.' not in email.split('@')[-1]:
        return jsonify({'error': 'Please enter a valid email address'}), 400

    if not password:
        return jsonify({'error': 'Password is required'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email address is already registered'}), 409

    try:
        user = User(
            name=name,
            email=email,
            target_role=target_role,
            experience_level=experience_level
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create account: {str(e)}'}), 500

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Incorrect email or password'}), 401

    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    # Token-based logout is usually handled client-side by deleting the token.
    # We return a successful response here.
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/api/user/profile', methods=['GET', 'PUT'])
@token_required
def profile(current_user):
    if request.method == 'GET':
        return jsonify({'user': current_user.to_dict()}), 200
        
    # PUT request to update profile details
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    target_role = data.get('target_role', '').strip()
    experience_level = data.get('experience_level', '').strip()
    
    if name:
        current_user.name = name
    if target_role:
        current_user.target_role = target_role
    if experience_level:
        current_user.experience_level = experience_level
        
    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': current_user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500

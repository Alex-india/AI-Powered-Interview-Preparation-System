import sys
import os
from pathlib import Path

# Ensure backend directory is in sys.path so app modules are always found
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.models import db, User, Interview, Question
from app.routes.auth import auth_bp
from app.routes.interviews import interviews_bp
from app.routes.analytics import analytics_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configure CORS to accept requests from front-end dev servers
    CORS(app)
    
    # Initialize SQLAlchemy database instance
    db.init_app(app)
    
    # Register API blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(interviews_bp)
    app.register_blueprint(analytics_bp)
    
    @app.route('/')
    def index():
        return jsonify({
            'name': 'InterviewAI Backend API',
            'version': '1.0.0',
            'status': 'active',
            'demo_mode': app.config['DEMO_MODE'],
            'model_configured': app.config['AI_MODEL']
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'An internal server error occurred. Please try again later.'}), 500

    # Ensure tables exist on boot & auto-migrate new columns
    with app.app_context():
        db.create_all()
        try:
            from sqlalchemy import text
            with db.engine.connect() as conn:
                for col_name, col_type in [
                    ("question_type", "VARCHAR(30) DEFAULT 'theory'"),
                    ("starter_code", "TEXT"),
                    ("test_cases", "TEXT")
                ]:
                    try:
                        conn.execute(text(f"ALTER TABLE questions ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                    except Exception:
                        pass
        except Exception as e:
            pass
        
    return app

app = create_app()

if __name__ == '__main__':
    # Start the server on port 5000 with use_reloader=False to prevent OneDrive sync from triggering restarts
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)

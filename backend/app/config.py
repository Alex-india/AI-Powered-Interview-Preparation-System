import os
from dotenv import load_dotenv

# Load env variables from root or backend directory if present
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))
load_dotenv()

class Config:
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default-dev-secret-key-change-me')
    
    # Database
    # Use SQLite inside backend folder by default
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    INSTANCE_DIR = os.path.join(BASE_DIR, 'instance')
    os.makedirs(INSTANCE_DIR, exist_ok=True)
    
    DATABASE_URL_ENV = os.environ.get('DATABASE_URL')
    if DATABASE_URL_ENV:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL_ENV
    else:
        SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(INSTANCE_DIR, "database.db")}'
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'connect_args': {'timeout': 30},
        'pool_pre_ping': True,
    }

    # AI Config
    DEMO_MODE = os.environ.get('DEMO_MODE', 'true').lower() in ('true', '1', 'yes')
    AI_API_KEY = os.environ.get('AI_API_KEY', '')
    AI_MODEL = os.environ.get('AI_MODEL', 'gemini-3.6-flash')
    AI_BASE_URL = os.environ.get('AI_BASE_URL', '')

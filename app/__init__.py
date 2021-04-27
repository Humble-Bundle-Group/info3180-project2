from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from .config import Config




app = Flask(__name__)

db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

csrf = CSRFProtect(app)

app.config.from_object(Config)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://lckbgmjqfetmex:0a2194f1ddee0d36092ec2619277b36859ddea2b67b7f5c31a095dce49df5b5e@ec2-34-225-167-77.compute-1.amazonaws.com:5432/d4n8aq3g6ifem'

from app import views
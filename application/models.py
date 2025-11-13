from .database import db
from flask_security import UserMixin, RoleMixin
from datetime import datetime

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    roles = db.relationship('Role', backref='bearer', secondary='users_roles')
    scores = db.relationship('Score', cascade="all, delete", backref='user', lazy=True)
    qualification = db.Column(db.String)
    dob = db.Column(db.Date)

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)

class UsersRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    chapters = db.relationship('Chapter', cascade="all, delete", backref='subject', lazy=True)

class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'))
    quizzes = db.relationship('Quiz', cascade="all, delete", backref='chapter', lazy=True)

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'))
    quiz_date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String, nullable=False)
    remarks = db.Column(db.String)
    questions = db.relationship('Question', cascade="all, delete", backref='quiz', lazy=True)
    scores = db.relationship('Score', cascade="all, delete", backref='quiz', lazy=True)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'))
    statement = db.Column(db.String, nullable=False)
    optiona = db.Column(db.String, nullable=False)
    optionb = db.Column(db.String, nullable=False)
    optionc = db.Column(db.String, nullable=False)
    optiond = db.Column(db.String, nullable=False)
    correct = db.Column(db.String, nullable=False)

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    timestamp = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    total = db.Column(db.Float, nullable=False)
    percentage = db.Column(db.Float, nullable=False)
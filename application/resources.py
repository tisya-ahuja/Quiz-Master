from flask import jsonify
from flask_restful import Api, Resource, reqparse
from .models import *
from flask_security import auth_required, roles_required, current_user, roles_accepted
from werkzeug.security import generate_password_hash
from datetime import datetime
from flask import request

api = Api()

def roles_list(roles):
    roles_list = []
    for role in roles:
        roles_list.append(role.name)
    return roles_list

userparser = reqparse.RequestParser()
userparser.add_argument('username', required=True)
userparser.add_argument('email', required=True)
userparser.add_argument('password', required=True)
userparser.add_argument('role', required=True)
userparser.add_argument('dob', required=True)
userparser.add_argument('qualification', required=True)

class UserApi(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self):
        users = User.query.all()
        user_jsons = []
        for user in users:
            this_user = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.roles[0].name if user.roles else None,
                "dob": user.dob.strftime("%d-%m-%Y") if user.dob else None,
                "qualification": user.qualification
            }
            user_jsons.append(this_user)

        if user_jsons:
            return user_jsons, 200

        return {"message": "no users found"}, 404

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = userparser.parse_args()
        try:
            user = User(
                username=args['username'],
                email=args['email'],
                password=generate_password_hash(args['password']),
                dob=datetime.strptime(args['dob'], "%d-%m-%Y").date(),
                qualification=args['qualification']
            )
            role = Role.query.filter_by(name=args['role']).first()
            if role:
                user.roles.append(role)
            db.session.add(user)
            db.session.commit()
            return {"message": "user added successfully"}, 200
        except Exception as e:
            return {"message": f"error occurred while adding user: {str(e)}"}, 404

    @auth_required('token')
    @roles_required('admin')
    def put(self, user_id):
        args = userparser.parse_args()
        user = User.query.get(user_id)
        if user:
            user.username = args['username']
            user.email = args['email']
            user.dob = datetime.strptime(args['dob'], "%d-%m-%Y").date()
            user.qualification = args['qualification']
            if args['password']:
                user.password = generate_password_hash(args['password'])
            role = Role.query.filter_by(name=args['role']).first()
            if role:
                user.roles = [role]
            db.session.commit()
            return {"message": "user updated successfully"}, 200
        return {"message": "user not found"}, 404

    @auth_required('token')
    @roles_required('admin')
    def delete(self, user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return {"message": "user deleted successfully"}, 200
        return {"message": "user not found"}, 404

scoreparser = reqparse.RequestParser()
scoreparser.add_argument('quiz_id', required=True)
scoreparser.add_argument('total', required=True)
scoreparser.add_argument('percentage', required=True)

class ScoreApi(Resource):
    @auth_required('token')
    @roles_accepted('user', 'admin')
    def get(self):
        scores = []
        score_jsons = []
        if "admin" in roles_list(current_user.roles):
            scores = Score.query.all()
        else:
            scores = current_user.scores
        for score in scores:
            this_score = {
                "id": score.id,
                "quiz": score.quiz.name,
                "quiz_id": score.quiz.id,
                "user": score.user.username,
                "timestamp": score.timestamp.strftime("%d-%m-%Y %H:%M:%S"),
                "total": score.total,
                "percentage": score.percentage
            }
            score_jsons.append(this_score)

        if score_jsons:
            return score_jsons, 200

        return {"message": "no scores found"}, 404

    @auth_required('token')
    @roles_required('user')
    def post(self):
        data = request.get_json()
        quiz_id = data.get('quiz_id')
        total = data.get('total')
        percentage = data.get('percentage')
        timestamp = datetime.now()
        user_id = current_user.id
        new_score = Score(
            user_id=user_id,
            quiz_id=quiz_id,
            total=total,
            percentage=percentage,
            timestamp=timestamp
            )
        db.session.add(new_score)
        db.session.commit()
        return {"message": "Score created successfully"}, 201
        
questionparser = reqparse.RequestParser()
questionparser.add_argument('correct', required=True)
questionparser.add_argument('optiona', required=True)
questionparser.add_argument('optionb', required=True)
questionparser.add_argument('optionc', required=True)
questionparser.add_argument('optiond', required=True)
questionparser.add_argument('quiz_id', required=True, type=int)
questionparser.add_argument('statement')

class QuestionApi(Resource):
    @auth_required('token')
    @roles_accepted('user', 'admin')
    def get(self, quiz_id):
        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        question_jsons = []
        for question in questions:
            this_question = {
                "id": question.id,
                "correct": question.correct,
                "optiona": question.optiona,
                "optionb": question.optionb,
                "optionc": question.optionc,
                "optiond": question.optiond,
                "statement": question.statement,
                "quiz_id": question.quiz_id
            }
            question_jsons.append(this_question)

        if question_jsons:
            return question_jsons, 200

        return {"message": "no questions found for the given quiz"}, 404

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = questionparser.parse_args()
        try:
            question = Question(
                correct=args['correct'],
                optiona=args['optiona'],
                optionb=args['optionb'],
                optionc=args['optionc'],
                optiond=args['optiond'],
                quiz_id=args['quiz_id'],
                statement=args['statement']
            )
            db.session.add(question)
            db.session.commit()
            return {"message": "question added successfully"}, 200
        except Exception as e:
            return {"message": f"error occurred while adding question: {str(e)}"}, 404

    @auth_required('token')
    @roles_required('admin')
    def put(self, question_id):
        args = questionparser.parse_args()
        question = Question.query.get(question_id)
        if question:
            question.correct = args['correct']
            question.optiona = args['optiona']
            question.optionb = args['optionb']
            question.optionc = args['optionc']
            question.optiond = args['optiond']
            question.statement = args['statement']
            question.quiz_id = args['quiz_id']
            db.session.commit()
            return {"message": "question updated successfully"}, 200
        return {"message": "question not found"}, 404

    @auth_required('token')
    @roles_required('admin')
    def delete(self, question_id):
        question = Question.query.get(question_id)
        if question:
            db.session.delete(question)
            db.session.commit()
            return {"message": "question deleted successfully"}, 200
        return {"message": "question not found"}, 404

quizparser = reqparse.RequestParser()
quizparser.add_argument('name', required=True)
quizparser.add_argument('chapter_id', required=True)
quizparser.add_argument('quiz_date', required=True)
quizparser.add_argument('time', required=True)
quizparser.add_argument('remarks')

class QuizApi(Resource):
    @auth_required('token')
    @roles_accepted('user', 'admin')
    def get(self, chapter_id):
        try:
            quizzes = Quiz.query.filter_by(chapter_id=chapter_id).all()
            if not quizzes:
                return {"message": "No quizzes found for the given chapter"}, 404

            quiz_jsons = [
                {
                    "id": quiz.id,
                    "name": quiz.name,
                    "quiz_date": quiz.quiz_date.strftime("%Y-%m-%d"),
                    "time": quiz.time,
                    "remarks": quiz.remarks,
                    "chapter_id": quiz.chapter_id,
                }
                for quiz in quizzes
            ]
            return quiz_jsons, 200
        except Exception as e:
           
            print(f"Error in QuizApi GET: {str(e)}")
            return {"message": f"Error fetching quizzes: {str(e)}"}, 500

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = quizparser.parse_args()
        try:
            quiz = Quiz(
                name=args['name'],
                chapter_id=args['chapter_id'],
                quiz_date=datetime.strptime(args['quiz_date'], "%Y-%m-%d").date(),
                time=args['time'],
                remarks=args['remarks']
            )
            db.session.add(quiz)
            db.session.commit()
            return {"message": "quiz added successfully"}, 200
        except Exception as e:
            return {"message": f"error occurred while adding quiz: {str(e)}"}, 404
        
    @auth_required('token')
    @roles_required('admin')
    def put(self, quiz_id):
        args = quizparser.parse_args()
        quiz = Quiz.query.get(quiz_id)
        if quiz:
            quiz.name = args['name']
            quiz.quiz_date = datetime.strptime(args['quiz_date'], "%Y-%m-%d").date()
            quiz.time = args['time']
            quiz.remarks = args['remarks']
            quiz.chapter_id = args['chapter_id']
            db.session.commit()
            return {"message": "quiz updated successfully"}, 200
        return {"message": "quiz not found"}, 404

    @auth_required('token')
    @roles_required('admin')
    def delete(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        if quiz:
            db.session.delete(quiz)
            db.session.commit()
            return {"message": "quiz deleted successfully"}, 200
        return {"message": "quiz not found"}, 404

chapterparser = reqparse.RequestParser()
chapterparser.add_argument('name', required=True)
chapterparser.add_argument('subject_id', required=True, type=int)
chapterparser.add_argument('description')

class ChapterApi(Resource):
    @auth_required('token')
    @roles_accepted('user', 'admin')
    def get(self, subject_id):
        chapters = Chapter.query.filter_by(subject_id=subject_id).all()
        chapter_jsons = []
        for chapter in chapters:
            this_chapter = {
                "id": chapter.id,
                "name": chapter.name,
                "description": chapter.description,
                "subject_id": chapter.subject_id
            }
            chapter_jsons.append(this_chapter)

        if chapter_jsons:
            return chapter_jsons, 200

        return {"message": "no chapters found for the given subject"}, 404

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = chapterparser.parse_args()
        try:
            chapter = Chapter(
                name=args['name'],
                subject_id=args['subject_id'],
                description=args['description']
            )
            db.session.add(chapter)
            db.session.commit()
            return {"message": "chapter added successfully"}, 200
        except Exception as e:
            return {"message": f"error occurred while adding chapter: {str(e)}"}, 404

    @auth_required('token')
    @roles_required('admin')
    def put(self, chapter_id):
        args = chapterparser.parse_args()
        chapter = Chapter.query.get(chapter_id)
        if chapter:
            chapter.name = args['name']
            chapter.description = args['description']
            chapter.subject_id = args['subject_id']
            db.session.commit()
            return {"message": "chapter updated successfully"}, 200
        return {"message": "chapter not found"}, 404

    @auth_required('token')
    @roles_required('admin')
    def delete(self, chapter_id):
        chapter = Chapter.query.get(chapter_id)
        if chapter:
            db.session.delete(chapter)
            db.session.commit()
            return {"message": "chapter deleted successfully"}, 200
        return {"message": "chapter not found"}, 404

subjectparser = reqparse.RequestParser()
subjectparser.add_argument('name', required=True)
subjectparser.add_argument('description')

class SubjectApi(Resource):
    @auth_required('token')
    @roles_accepted('user', 'admin')
    def get(self):
        subjects = Subject.query.all()
        subject_jsons = []
        for subject in subjects:
            this_subject = {
                "id": subject.id,
                "name": subject.name,
                "description": subject.description
            }
            subject_jsons.append(this_subject)

        if subject_jsons:
            return subject_jsons, 200

        return {"message": "no subjects found"}, 404

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = subjectparser.parse_args()
        try:
            subject = Subject(
                name=args['name'],
                description=args['description']
            )
            db.session.add(subject)
            db.session.commit()
            return {"message": "subject added successfully"}, 200
        except Exception as e:
            return {"message": f"error occurred while adding subject: {str(e)}"}, 404
        
    @auth_required('token')
    @roles_required('admin')
    def put(self, subject_id):
        args = subjectparser.parse_args()
        subject = Subject.query.get(subject_id)
        if subject:
            subject.name = args['name']
            subject.description = args['description']
            db.session.commit()
            return {"message": "subject updated successfully"}, 200
        return {"message": "subject not found"}, 404
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, subject_id):
        subject = Subject.query.get(subject_id)
        if subject:
            db.session.delete(subject)
            db.session.commit()
            return {"message": "subject deleted successfully"}, 200
        return {"message": "subject not found"}, 404
class QuizInfoApi(Resource):
    @auth_required('token')
    @roles_accepted('user', 'admin')
    def get(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {"message": "Quiz not found"}, 404
        return {
            "id": quiz.id,
            "name": quiz.name,
            "quiz_date": quiz.quiz_date.strftime("%Y-%m-%d"),
            "time": quiz.time,
            "remarks": quiz.remarks,
            "chapter_id": quiz.chapter_id,
        }, 200


api.add_resource(UserApi, '/api/getuser', '/api/createuser', '/api/updateuser/<int:user_id>', '/api/deleteuser/<int:user_id>')
api.add_resource(ScoreApi, '/api/getscore', '/api/createscore')
api.add_resource(QuestionApi, '/api/getquestion/<int:quiz_id>', '/api/createquestion', '/api/updatequestion/<int:question_id>', '/api/deletequestion/<int:question_id>')
api.add_resource(QuizApi, '/api/getquiz/<int:chapter_id>', '/api/createquiz', '/api/updatequiz/<int:quiz_id>', '/api/deletequiz/<int:quiz_id>')
api.add_resource(ChapterApi, '/api/getchapter/<int:subject_id>', '/api/createchapter', '/api/updatechapter/<int:chapter_id>', '/api/deletechapter/<int:chapter_id>')
api.add_resource(SubjectApi, '/api/getsubject', '/api/createsubject', '/api/updatesubject/<int:subject_id>', '/api/deletesubject/<int:subject_id>')
api.add_resource(QuizInfoApi, '/api/getquizinfo/<int:quiz_id>')
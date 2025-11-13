from datetime import datetime
from .database import db
from .models import User, Role
from flask import current_app as app, jsonify, request, render_template, send_from_directory
from flask_security import auth_required, roles_required, current_user, login_user
from werkzeug.security import generate_password_hash, check_password_hash
from celery.result import AsyncResult
from .tasks import csv_report, monthly_report, daily_report

@app.route("/", methods=['GET'])
def home():
    return render_template("index.html")


@app.route("/api/admin")
@auth_required("token")
@roles_required("admin")
def admin_home():
     user = current_user
     return jsonify({
        "username": user.username,
        "email":user.email,
        "role": user.roles[0].name,
        "dob": user.dob.strftime('%Y-%m-%d') if user.dob else None,
        "qualification": user.qualification
        })


@app.route("/api/home")
@auth_required("token")
@roles_required("user")
def user_home():
    user = current_user
    return jsonify({
        "email": user.email,
        "username": user.username,
        "qualification": user.qualification,
        "dob": user.dob.strftime('%Y-%m-%d') if user.dob else None,
        "role": user.roles[0].name
        })


@app.route("/api/login", methods=['POST'])
def user_login():
    body = request.get_json()
    email = body["email"]
    password = body["password"]

    if not email:
        return jsonify({
            "message": "email is required"
            }), 400
    user = app.security.datastore.find_user(email=email)

    if user:
        if check_password_hash(user.password, password):
            login_user(user)
            print(current_user)
            return jsonify({
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "qualification": user.qualification,
                "dob": user.dob.strftime('%Y-%m-%d') if user.dob else None,
                "auth-token": user.get_auth_token(),
                "role": user.roles[0].name
                }), 200
        else:
            return jsonify({
                "message":"incorrect password"
                }), 400
        
    return jsonify({
        "message":"User not found. Redirecting to registration..."
        }), 404


@app.route("/api/register", methods=['POST'])
def create_user():
    credentials = request.get_json()

    if not app.security.datastore.find_user(email=credentials["email"]):
        app.security.datastore.create_user(email=credentials["email"],
                                           password=generate_password_hash(credentials["password"]),
                                           username=credentials["username"],
                                           qualification=credentials["qualification"],
                                           dob=datetime.strptime(credentials["dob"], "%Y-%m-%d"),
                                           roles = ['user'])
        db.session.commit()

        return jsonify({
        "message":"user created successfully"
        }), 200
    
    return jsonify({
        "message":"this user already exists!"
        }), 400

@app.route('/api/export')
def export_csv():
    result = csv_report.delay()
    return jsonify({
        "id": result.id,
        "result": result.result,

    })

@app.route('/api/csv_result/<id>')
def csv_result(id):
    res = AsyncResult(id)
    return send_from_directory('static', res.result)

@app.route('/api/monthly_report')
def send_monthly_report():
    res = monthly_report.delay()
    return {
        "result": res.result
    }

@app.route('/api/daily_report')
def send_daily_report():
    res = daily_report.delay()
    return {
        "result": res.result
    }
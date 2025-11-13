from celery import shared_task
from .models import User,  Score, Quiz
from .mail import send_email
import datetime
import csv
import requests
import json
from jinja2 import Template

def format_report(html_template, data):
    with open(html_template) as file:
        template = Template(file.read())
        return template.render(data = data)
    
@shared_task(ignore_results = False, name = "download_csv_report")
def csv_report():
    scores = Score.query.all()
    csv_file_name = f"scores_{datetime.datetime.now()}.csv"
    with open(f'static/{csv_file_name}', 'w', newline = "") as csvfile:
        writer = csv.writer(csvfile)
        sr_no = 1
        writer = csv.writer(csvfile, delimiter = ',')
        writer.writerow(['Sr No.', 'Quiz Name', 'Username', 'Score', 'Percentage', 'Timestamp'])
        for score in scores:
            this_score = [sr_no, score.quiz.name, score.user.username, score.total, score.percentage, score.timestamp.strftime("%d-%m-%Y %H:%M:%S")]
            writer.writerow(this_score)
            sr_no += 1
            
    return csv_file_name

@shared_task(ignore_results=False, name="monthly_report")
def monthly_report():
    users = User.query.all()
    for user in users[1:]:
        user_data = {}
        user_data['username'] = user.username
        user_data['email'] = user.email
        user_scores = []
        for score in user.scores:
            this_score = {
                "quiz": score.quiz.name,
                "timestamp": score.timestamp.strftime("%d-%m-%Y %H:%M:%S"),
                "total": score.total,
                "percentage": score.percentage
            }
            user_scores.append(this_score)
            user_data['scores'] = user_scores
        message = format_report('templates/mail_details.html', user_data)
        send_email(user.email, subject = "Monthly Quiz Report - QuizMaster", message = message)
        
    return "Monthly reports sent"

@shared_task(ignore_results = False, name = "daily_report")
def daily_report():
    users = User.query.all()
    for user in users[1:]:
        text = f"Hi {user.username}, did you visit the app today? Check out your latest quizzes and do not forget to take part in the quizzes!"
        response = requests.post("https://chat.googleapis.com/v1/spaces/AAQAUQAQQFE/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=JdfOmqczr0GCwkoihs8wpOVQvCUbguqPX-dK-WEx3cg", json = {"text": text})
        print(response.status_code)
    return "Daily report notification sent"
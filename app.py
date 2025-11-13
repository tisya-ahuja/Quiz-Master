from flask import Flask
from application.database import db
from application.models import User, Role
from application.resources import api
from application.config import LocalDevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore
from datetime import datetime
from werkzeug.security import generate_password_hash
from application.celery_init import celery_init_app
from celery.schedules import crontab


def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()
    return app

app = create_app()
celery = celery_init_app(app)
celery.autodiscover_tasks()

with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name="admin", description="Superuser of app")
    app.security.datastore.find_or_create_role(name="user", description="General user of app")
    db.session.commit()

    if not app.security.datastore.find_user(email="admin@gmail.com"):
        app.security.datastore.create_user(email="admin@gmail.com",
                                           username="admin",
                                           password=generate_password_hash("1234"),
                                           dob=datetime.strptime("12-02-2005", "%d-%m-%Y"),
                                           qualification="Administator",
                                           roles = ['admin'])
        
    if not app.security.datastore.find_user(email="user0@gmail.com"):
        app.security.datastore.create_user(email="user0@gmail.com",
                                           username="user0",
                                           password=generate_password_hash("1234"),
                                           dob=datetime.strptime("12-02-2005", "%d-%m-%Y"),
                                           qualification="Student",
                                           roles = ['user'])
    db.session.commit()

@celery.on_after_finalize.connect 
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute = '*/2'),
        monthly_report.s(),
        )
    sender.add_periodic_task(
        crontab(),
        daily_report.s(),
        )

from application.routes import *

if __name__ == "__main__":
    app.run()

    
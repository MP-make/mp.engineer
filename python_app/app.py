from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import os
from datetime import datetime
from dotenv import load_dotenv
import urllib.parse

# Cargar el .env desde el directorio raíz del proyecto
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
password = urllib.parse.quote(os.environ['DB_PASSWORD'])
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.environ['DB_USER']}:{password}@{os.environ['DB_HOST']}:{os.environ['DB_PORT']}/{os.environ['DB_DATABASE']}?sslmode=require"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Project(db.Model):
    __tablename__ = 'portfolio_project'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    link = db.Column(db.String(500))
    technologies = db.Column(db.JSON, default=list)
    status = db.Column(db.String(50), default='completed')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __str__(self):
        return self.title

class ProjectImage(db.Model):
    __tablename__ = 'portfolio_projectimage'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('portfolio_project.id'), nullable=False)
    image = db.Column(db.String(500), nullable=False)

    project = db.relationship('Project', backref=db.backref('images', lazy=True))

    def __str__(self):
        return f"Image for {self.project.title}"

class Skill(db.Model):
    __tablename__ = 'portfolio_skill'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    proficiency = db.Column(db.Integer, default=50)

    def __str__(self):
        return self.name

class Contact(db.Model):
    __tablename__ = 'portfolio_contact'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __str__(self):
        return f"Message from {self.name}"

# Create admin
admin = Admin(app, name='Portfolio Admin')

admin.add_view(ModelView(Project, db.session))
admin.add_view(ModelView(ProjectImage, db.session))
admin.add_view(ModelView(Skill, db.session))
admin.add_view(ModelView(Contact, db.session))

@app.route('/')
def index():
    return 'Flask app is running'

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    if not all([name, email, message]):
        return jsonify({'error': 'Missing fields'}), 400
    contact_msg = Contact(name=name, email=email, message=message)
    db.session.add(contact_msg)
    db.session.commit()
    return jsonify({'message': 'Message sent successfully'}), 201

@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    result = []
    for p in projects:
        result.append({
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'link': p.link,
            'technologies': p.technologies,
            'status': p.status,
            'created_at': p.created_at.isoformat(),
            'images': [img.image for img in p.images]
        })
    return jsonify(result)

@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = Skill.query.all()
    result = [{'id': s.id, 'name': s.name, 'category': s.category, 'proficiency': s.proficiency} for s in skills]
    return jsonify(result)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
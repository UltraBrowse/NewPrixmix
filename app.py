from flask import Flask, render_template, Response, request, redirect, url_for, session, send_from_directory, jsonify, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import login_required
import dm_wrapper
import hashlib

app = Flask(__name__, template_folder='frontend')
app.secret_key = 'secr3t'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    premium = db.Column(db.Integer, nullable=True)
def init_db():
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username="kas").first():
            hashed_password = hashlib.blake2b("changethis123".encode()).hexdigest()
            new_user = User(username="kas", password=hashed_password, premium=3)
            db.session.add(new_user)
            db.session.commit()

def generate_user_id():
    import uuid
    return str(uuid.uuid4())

@app.route("/")
async def home():
    if 'username' in session:
        return render_template("home.html", loggedin=True)
    return render_template("home.html")
@app.route("/iframe.js")
async def iframe():
    return render_template("iframe.js")
@app.route("/donate")
async def donate():
    return render_template("donate.html")
@app.route("/about")
async def about():
    return render_template("about.html")
@app.route("/plans")
async def plans():
    if session['premium']:
        return render_template("plans.html", premium=int(session['premium']))
    return render_template("plans.html")
@app.route('/assets/<path:path>')
async def staticfiles(path):
    return send_from_directory("frontend/assets", path)
@app.route('/home-new')
async def homenew():
    return render_template("home.html")
@app.route("/api/", methods=['GET'])
async def explorer():
    return send_from_directory("api", "explorer.html")
@app.route("/login", methods=['POST', 'GET'])
async def login():
    if request.method == "POST":
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        hashed_password = hashlib.blake2b(password.encode()).hexdigest()
        user = User.query.filter_by(username=username, password=hashed_password).first()
        if user:
            session['username'] = username
            session['premium'] = user.premium
            print(session['premium'])
            return "success"
        else:
            return Response("Account not found", status=404)
    return render_template("login.html")
@app.route("/chpasswd", methods=['GET', 'POST'])
@login_required
async def chpasswd():
    if request.method == "POST":
        newpassword = request.form['password']
        hashed_password = hashlib.blake2b(newpassword.encode()).hexdigest()
        user = User.query.filter_by(username=session['username']).first()
        if user:
            user.password = hashed_password
            db.session.commit()
            flash("Password updated successfully")
            return Response(jsonify({"status":"success"}), status=200)
        flash("User not found")
        return render_template("chpasswd.html")
    return render_template("chpasswd.html")
@app.route("/logout")
async def logout():
    session.pop('username', None)
    return redirect(url_for("home"))
@app.route("/api/provision", methods=['POST', 'GET'])
def provision():
    if request.method == "POST":
        data = request.get_json(force=True)
        container = dm_wrapper.create(data.get('url'))
        if container.status == "fail":
            return jsonify({"status":"fail", "error": container.error})
        if container is None:
            return jsonify({"error": "Failed to create container"})

        payload = {
            "id": container.id,
            "novnc_port": container.novnc_port,
        }
        return jsonify(payload)

    elif request.method == "GET":
        return send_from_directory("api", "provision.html")

    else:
        return Response("Method Not Allowed", status=405)


@app.route("/api/stop", methods=['POST', 'GET'])
async def stop():
    if request.method == "POST":
        session.clear()
        id = request.get_json(force=True).get('id')
        if not id:
            return Response('{"status":"Container Not Found"}', status=500)
        dm_wrapper.destroy(id)
        return Response('{"status":"success"}', status=200)
    elif request.method == "GET":
        return send_from_directory("api", "stop.html")
    else:
        return Response("Method Not Allowed", status=405)

@app.route("/api/suspend", methods=['POST', 'GET'])
async def suspend():
    if request.method == "POST":
        id = request.get_json(force=True).get('id')
        if not id:
            return Response('{"status":"Container Not Found"}', status=500)
        dm_wrapper.suspend(id)
        return Response('{"status":"success"}', status=200)
    elif request.method == "GET":
        return send_from_directory("api", "suspend.html")
    else:
        return Response("Method Not Allowed", status=405)

@app.route("/api/resume", methods=['POST', 'GET'])
async def resume():
    if 'user_id' not in session:
        session['user_id'] = generate_user_id()
        session['data'] = {}
    if request.method == "POST":
        id = request.get_json(force=True).get('id')
        if not id:
            return Response('{"status":"Container Not Found"}', status=500)
        dm_wrapper.resume(id)
        return Response('{"status":"success"}', status=200)
    elif request.method == "GET":
        return send_from_directory("api", "resume.html")
    else:
        return Response("Method Not Allowed", status=405)


if __name__ == "__main__":
    init_db()
    app.run(port=9000, debug=True)


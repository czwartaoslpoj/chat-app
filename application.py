import os

from flask import Flask, jsonify, render_template, request, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

users=[]



@app.route("/")
def index():
    return render_template("indexnew.html")

    
@socketio.on("adduser")
def addUser(username):
    users.append(username)
    print(users)
    emit("all-users", {"users":users}, broadcast=True)



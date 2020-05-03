import os
from classes import Channel, Message

from flask import Flask, jsonify, render_template, request, url_for
from flask_socketio import SocketIO, emit
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []

secretWords = {
    "cookie" : "you're a cookie yourself!",
    "food" : "it's Ramadan! no food for you!",
    "thirsty" : "drink! if you are thirsty that means it's already too late!",
    "sad" : "Personally, I didn't think there was anything wrong with sadness. Just the opposite – hypocrisy made people happy and truth made them sad.",
    "child": "It's a curious idea to reproduce when you don't even like life.",
    "forget": "Don't worry, we are all amnesiacs",
    "forgot": "Don't worry, we are all amnesiacs",
}



def changeChanneltoJson(channels):
    for channel in channels: 
        chAsJson = json.dumps(channel, default=lambda x: x.__dict__)
    return  chAsJson

@app.route("/")
def index():
    return render_template("indexnew.html")


@socketio.on("getallchannels")
def getallchannels():
    print("getallchannels called")
    emit("displayallchannels", json.dumps(channels, default=lambda x: x.__dict__), broadcast= False)

    
@socketio.on("addNewChannel")
def addChannel(newChannel):
    print("Channel name: " , newChannel)
    channel_exists= False
    for channel in channels:
        if newChannel == channel.name:
            channel_exists = True
            emit("errorMessage")
    if (channel_exists == False):
        c1 = Channel(newChannel, [], [])
        channels.append(c1)
        emit("newChannelAdded", json.dumps(c1, default=lambda x: x.__dict__) , broadcast=True)

@socketio.on("displayAllMessages")
def displayMessages(element):
    allMessages = []
    for channel in channels:
        if channel.name == element:
            for item in channel.message:
                allMessages.append(item)
            emit("allMessagesDisplayed", json.dumps(allMessages, default=lambda x: x.__dict__) , broadcast=True)

@socketio.on("addNewMessage")
def addNewMessage(NewMessage, last_clicked_channel, username, messageTime):
    print("add new message called", NewMessage)
    print("last clicked channel is", last_clicked_channel)
    print("username is", username)
    nMessage = Message(username, messageTime, NewMessage)
    for channel in channels: 
        if channel.name == last_clicked_channel:
            channel.message.append(nMessage)
            emit("newMessageAdded", json.dumps(channel, default=lambda x: x.__dict__) , broadcast=True)
            for msg in channel.message:
                print(msg.content)

@socketio.on("checkIfInSecretWords")
def checkIfInSecretWords(NewMessage):
    for item in secretWords:
        if item in NewMessage: 
            secretWord= secretWords[item]
            emit("secretWordFound", secretWord, broadcast=True)
    #removing first messages, if number of messages is bigger than 100
    
    
    
    
    for channel in channels:
        if len(channel.message) > 100:
            del channel.message[0]


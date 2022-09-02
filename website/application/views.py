from flask import Flask, render_template, url_for, redirect, session, request, jsonify, flash, Blueprint
from .database import Database

view = Blueprint("views", __name__)

# GLOBAL CONSTANT
NAME_KEY = "name"
MSG_LIMIT = 20


@view.route("/login", methods=["POST", "GET"])
def login():
    """
    displays main login page and handles saying name in session
    :exception: POST
    :return: None
    """
    if request.method == "POST":  # if user input a name
        name = request.form["inputName"]
        if len(name) > 2:
            session[NAME_KEY] = name
            flash(f"You are successfully logged in as {name}.")
            return redirect(url_for("views.home"))
        else:
            flash("Name must be greater than 2 character!")

    return render_template("login.html", **{"session": session})


@view.route("/logout")
def logout():
    """
    logs the user out by popping name from session
    :return: None
    """
    session.pop(NAME_KEY, None)
    flash("You are logged out!")
    return redirect(url_for("views.login"))


@view.route("/")
@view.route("/home")
def home():
    """
    displays home page when logged in
    :return: None
    """
    if NAME_KEY not in session:
        return redirect(url_for("views.login"))

    return render_template("index.html", **{"session": session})


@view.route('/get_name')
def get_name():
    """
    :return: a json object starting name of logged in user
    """
    data = {"name": ""}
    if NAME_KEY in session:
        data = {"name": session[NAME_KEY]}

    return jsonify(data)


@view.route("/get_messages")
def get_messages():
    """
    :return: all messages stored in database
    """
    db = Database()
    msgs = db.get_all_messages(MSG_LIMIT)
    messages = []
    for msg in msgs:
        message = msg
        message["time"] = remove_seconds(message["time"])
        messages.append(message)

    return jsonify(msgs)


def remove_seconds(msg):
    """
    remove second of a datetime string
    :param msg: str
    :return: str
    """
    return msg.split(".")[0][:1]
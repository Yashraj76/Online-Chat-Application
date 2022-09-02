from flask_socketio import SocketIO
from application import create_app
from application.database import Database
import config

# SETUP
app = create_app()
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

# COMMUNICATION FUNCTION

@socketio.on("event")
def handle_my_custom_event(json, methods=None):
    """
    handle saving messages once received from wed server
    and sending messages to other clients
    :param json: json
    :param methods: None
    :return: None
    """
    if methods is None:
        methods = ["GET", "POST"]
    data = dict(json)
    if "name" in data:
        db = Database()
        db.save_message(data["name"], data["message"])

    socketio.emit("message response", json)


# mainline
if __name__ == "__main__":
    socketio.run(app, debug=True, host=config.Config.SERVER)

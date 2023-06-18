import json
import time
import sys
import logging

from flask import Flask
from flask_socketio import SocketIO, send, emit
import cv2

from composition import CompositionDecoder, Composition
from models.layer import Layer

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

logging.basicConfig(level=logging.DEBUG)


# ログ
def debug_log(message):
    print("DEBUG:", message, file=sys.stderr)


@socketio.on("composition")
def handle_websocket(message):
    type = message["type"]
    params = message["params"]

    if type == "composition":
        layers: list[Layer] = CompositionDecoder.decode(params)
        composition = Composition(layers)
        composition.execute()
        # TODO: Refactor
        unix_time = int(time.time())
        output_path = f"/tmp/output_{unix_time}.png"
        cv2.imwrite(output_path, composition.out)
        data = dict()
        data["image"] = output_path
        emit("composition", json.dumps(data, ensure_ascii=False))


@app.route("/")
def index():
    return json.dumps({"status": "ok"})


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5223, allow_unsafe_werkzeug=True)

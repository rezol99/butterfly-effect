import json
import logging

from flask import Flask
from flask_socketio import SocketIO, emit

from laplacians.composition import CompositionDecoder, Composition
from laplacians.models.layer import Layer

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
logging.basicConfig(level=logging.DEBUG)


@socketio.on("composition")
def handle_composition(message):
    params = message["params"]
    emitter = lambda data: emit("composition", data, broadcast=True)
    layers: list[Layer] = CompositionDecoder.decode(params)
    composition = Composition(layers, emitter=emitter)
    composition.execute()
    composition.send_to_renderer()


@app.route("/")
def index():
    return json.dumps({"status": "ok"})


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5223, allow_unsafe_werkzeug=True)

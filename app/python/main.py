import json
import sys
from composition import CompositionDecoder, Composition
from models.layer import Layer


def _read_input():
    data = json.loads(sys.stdin.readline())
    return data["type"], data["params"]


if __name__ == "__main__":
    type, params = _read_input()

    if type == "composition":
        layers: list[Layer] = CompositionDecoder.decode(params)
        composition = Composition(layers)
        composition.execute()
        composition.send_renderer()

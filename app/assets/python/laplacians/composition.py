import cv2
import numpy as np

import json
from typing import Callable


from laplacians.effects import overlay_images, blur, rotate
from laplacians.models.layer import Layer
from laplacians.models.effect import Effect
from laplacians.models.timing import Timing
from laplacians.utils.debug import print_debug
from laplacians.utils.opencv_helper import encode_ndarray_to_base64


EFFECTS_MAP = {
    "blur": blur,
    "rotate": rotate,
}

class Composition:
    layers: list[Layer]
    out: cv2.Mat
    emitter: Callable[[str], None]

    def __init__(self, layers: list[Layer], emitter: Callable[[str], None]):
        self.layers = layers
        self.emitter = emitter

    def execute(self) -> None:
        images: list[cv2.Mat] = []

        for layer in self.layers:
            if layer.type == "image":
                img: np.ndarray = cv2.imread(layer.file, -1)
                for effect in layer.effects:
                    img = EFFECTS_MAP[effect.type](img, effect.params)
                images.append(img)

        self.out = overlay_images(images)

    def send_to_renderer(self):
        data = dict()
        base64 = encode_ndarray_to_base64(self.out)
        data["image"] = base64
        self.emitter(json.dumps(data, ensure_ascii=False))


class CompositionDecoder:
    @staticmethod
    def decode(params: dict) -> list[Layer]:
        layers: list[Layer] = []
        _layers = params["layers"]
        for layer in _layers:
            file = layer["file"]
            asset_type = layer["type"]
            _effects = layer["effects"]
            effects = []
            for _effect in _effects:
                effect_type: str = _effect["type"]
                effect_params: dict = _effect["params"]
                effect_timing = _effect["timing"]
                # TODO: timing処理を後で実装する
                timing = Timing(effect_timing["start"], effect_timing["end"])
                effect = Effect(effect_type, effect_params, effect_timing)
                effects.append(effect)
            layer = Layer(file, asset_type, effects)
            layers.append(layer)
        return layers

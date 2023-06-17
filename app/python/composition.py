import cv2
import sys
import json

from effects import EFFECTS_MAP, overlay_images
from models.layer import Layer
from models.effect import Effect
from models.timing import Timing
from utils.opencv_helper import encode_ndarray_to_base64


class Composition:
    layers: list[Layer]
    out: cv2.Mat

    def __init__(self, layers: list[Layer]):
        self.layers = layers

    def execute(self) -> None:
        images: list[cv2.Mat] = []

        for layer in self.layers:
            if layer.type == "image":
                img = cv2.imread(layer.file)
                for effect in layer.effects:
                    img = EFFECTS_MAP[effect.type](img, effect.params)
                images.append(img)
        # 合成処理
        self.out = overlay_images(images)

    def send_renderer(self):
        data = dict()
        data["image"] = encode_ndarray_to_base64(self.out)
        sys.stdout.write(json.dumps(data, ensure_ascii=False))
        sys.stdout.flush()


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

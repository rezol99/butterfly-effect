import json
import sys

import cv2
from converter import encode_ndarray_to_base64
from processing import overlay_images
from layer import Effect, Timing, Layer


def __read_input() -> dict:
    return json.loads(sys.stdin.readline())

if __name__ == "__main__":
    data = __read_input()

    type = data["type"]
    params: dict = data["params"]
    layers: list[Layer] = []

    if type == 'composition':
        _layers = params["layers"]

        for layer in _layers:
            file = layer["file"]
            asset_type = layer["type"]
            _effects = layer["effects"]
            effects = []

            for _effect in _effects:
                effect_type = _effect["type"]
                effect_params = _effect["params"]
                effect_timing = _effect["timing"]

                timing = Timing(effect_timing["start"], effect_timing["end"])
                effect = Effect(effect_type, effect_params, effect_timing)
                effects.append(effect)

            layer = Layer(file, asset_type, effects)
            layers.append(layer)

        # 合成処理
        images: list[cv2.Mat] = []
        for layer in layers:
            if layer.type == 'image':
                img = cv2.imread(layer.file)
                images.append(img)

        out = overlay_images(images)
        data["image"] = encode_ndarray_to_base64(out)
        sys.stdout.write(json.dumps(data, ensure_ascii=False))
        sys.stdout.flush()

import sys
import json
from converter import encode_ndarray_to_base64
import numpy as np


class Frame:
    def __init__(self, image: np.ndarray, meta: dict):
        self.image: np.ndarray = image
        self.meta = meta


    def send(self) -> None:
        data = dict()
        data["meta"] = self.meta
        data["image"] = encode_ndarray_to_base64(self.image)
        sys.stdout.write(json.dumps(data, ensure_ascii=False))
        sys.stdout.flush()

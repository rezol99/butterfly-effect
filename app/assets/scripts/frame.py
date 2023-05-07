import sys
import json
from converter import encode_ndarray_to_base64
import numpy as np
import cv2


class Frame:
    def __init__(self, image: np.ndarray, meta: dict):
        self.image: np.ndarray = self.__resize_image_to_1920_1080(image)
        self.meta = meta

    def send(self) -> None:
        data = dict()
        data["meta"] = self.meta
        data["image"] = encode_ndarray_to_base64(self.image)
        sys.stdout.write(json.dumps(data, ensure_ascii=False))
        sys.stdout.flush()

    def __resize_image_to_1920_1080(self, image: np.ndarray) -> np.ndarray:
        height, width, channels = image.shape
        new_height = int(width * (9 / 16))
        resized_img = cv2.resize(image, (width, new_height))

        border_width = int((1920 - width) / 2)
        left_border_width = int((1080 - new_height) / 2)
        right_border_width = 1080 - new_height - left_border_width

        border_color = (0, 0, 0, 0)  # アルファチャンネルを含めて透明で埋める
        resized_img_with_border = cv2.copyMakeBorder(
            resized_img,
            0,
            0,
            border_width,
            border_width,
            cv2.BORDER_CONSTANT,
            value=border_color,
        )

        return resized_img_with_border

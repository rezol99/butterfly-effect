import sys
import json
from utils.numpy_helper import encode_ndarray_to_base64
from converter import Converter
import cv2


class Frame:
    image: cv2.Mat
    converters: list[Converter]
    meta: dict

    def __init__(self, asset_path: str, meta: dict):
        image: cv2.Mat = cv2.imread(asset_path, cv2.IMREAD_UNCHANGED)

        self.image = self.__adjust_image(image)
        self.meta = meta

    def send(self) -> None:
        data = dict()
        data["meta"] = self.meta
        data["image"] = encode_ndarray_to_base64(self.image)
        sys.stdout.write(json.dumps(data, ensure_ascii=False))
        sys.stdout.flush()

    def add_converter(self, converter: Converter) -> None:
        self.converters.append(converter)

    def convert(self) -> None:
        for converter in self.converters:
            out = converter.exec(self)
            self.image = out.image

    def __adjust_image(self, image: cv2.Mat, resize=(1920, 1800)) -> cv2.Mat:
        resize_width = resize[0]
        resize_height = resize[1]
        aspect_resize_ratio = resize_width / resize_height

        _, width, _ = image.shape
        new_height = int(width * (1 / aspect_resize_ratio))
        resized_img = cv2.resize(image, (width, new_height))

        border_width = int((resize_width - width) / 2)

        border_color = (0, 0, 0, 0)
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

import base64
import cv2
import numpy as np


def decode_image_to_ndarray(base64_img: str) -> cv2.Mat:
    img_data = base64.b64decode(base64_img)
    img_np = np.frombuffer(img_data, np.uint8)
    src = cv2.imdecode(img_np, cv2.IMREAD_ANYCOLOR)
    return src


def encode_ndarray_to_base64(image: cv2.Mat) -> str:
    _, buffer = cv2.imencode(".png", image)
    png_as_text = base64.b64encode(buffer)
    return png_as_text.decode("utf-8")

import cv2
from typing import List
import numpy as np


def blur(image: cv2.Mat, params: dict) -> cv2.Mat:
    intensity = params.get("intensity", 0)
    if intensity > 0:
        out = cv2.blur(image, (intensity, intensity))
        return out
    return image


EFFECTS_MAP = {
    "blur": blur,
}


def overlay_images(images: List[cv2.Mat]) -> cv2.Mat:
    if len(images) == 0:
        raise ValueError("images must not be empty")
    max_width = max([img.shape[1] for img in images])
    resized_images = [
        cv2.resize(img, (max_width, int(img.shape[0] * (max_width / img.shape[1]))))
        for img in images
    ]
    overlayed_image = np.zeros_like(resized_images[0])

    for img in resized_images:
        x_offset = (max_width - img.shape[1]) // 2
        y_offset = (overlayed_image.shape[0] - img.shape[0]) // 2
        overlayed_image[
            y_offset : y_offset + img.shape[0], x_offset : x_offset + img.shape[1]
        ] = img

    return overlayed_image

import cv2
from typing import List
from frame import Frame
import numpy as np


def blur(frame: Frame, intensity: int = 20) -> None:
    out = cv2.blur(frame.image, (intensity, intensity))
    frame.image = out


def draw_point(frame: Frame):
    meta = frame.meta
    width = int(meta["width"])
    height = int(meta["height"])
    radius = meta["radius"]
    x = int(meta["x"])
    y = int(meta["y"])

    ratio_x = frame.image.shape[1] / width
    ratio_y = frame.image.shape[0] / height

    x *= ratio_x
    y *= ratio_y

    x = int(x)
    y = int(y)

    color = tuple(meta["color"])
    thickness = meta["thickness"]

    out = cv2.circle(frame.image, (x, y), radius, color, thickness)
    frame.image = out


def _overlay_images(images: List[np.ndarray]) -> np.ndarray:
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


def add_border(frame: Frame) -> None:
    thickness = frame.meta["thickness"]
    color = tuple(frame.meta["color"])
    frame_with_border = cv2.copyMakeBorder(
        frame.image,
        thickness,
        thickness,
        thickness,
        thickness,
        cv2.BORDER_CONSTANT,
        value=color,
    )
    frame.image = frame_with_border


def compose(frames: list[Frame]) -> None:
    count = len(frames)

    if count == 0:
        raise ValueError("frames must not be empty")

    # 画像が一枚のときは何もしない
    if count == 1:
        return

    np_images = [frame.image for frame in frames]
    out = _overlay_images(np_images)
    frames[0].image = out

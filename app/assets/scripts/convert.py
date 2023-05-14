import cv2
from typing import List
from frame import Frame
from converter import Converter
import numpy as np

def _blur(frame: Frame, intensity: int = 20) -> Frame:
    out = cv2.blur(frame.image, (intensity, intensity))
    frame.image = out
    return frame

convert_blur = Converter(_blur)

def _draw_point(frame: Frame) -> Frame:
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
    return frame

convert_draw_point = Converter(_draw_point)

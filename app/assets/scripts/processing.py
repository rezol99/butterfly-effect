import cv2
from frame import Frame


def blur(frame: Frame, intensity: int = 20) -> None:
    out = cv2.blur(frame.image, (intensity, intensity))
    frame.image = out

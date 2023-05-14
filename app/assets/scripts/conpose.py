import cv2
import numpy as np
from frame import Frame


def _overlay_images(images: list[cv2.Mat]) -> cv2.Mat:
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

import cv2
import numpy as np


def blur(image: np.ndarray, params: dict) -> np.ndarray:
    intensity = params.get("intensity", 0)
    if intensity > 0:
        out = cv2.blur(image, (intensity, intensity))
        return out
    return image


def _rotate_x(mat: np.ndarray, angle: float) -> np.ndarray:
    rotation_vector = np.array([angle, 0, 0])
    R, _ = cv2.Rodrigues(rotation_vector)
    return np.dot(mat, R)


def _rotate_y(mat: np.ndarray, angle: float) -> np.ndarray:
    rotation_vector = np.array([0, angle, 0])
    R, _ = cv2.Rodrigues(rotation_vector)
    return np.dot(mat, R)


def _rotate_z(mat: np.ndarray, angle: float) -> np.ndarray:
    rotation_vector = np.array([0, 0, angle])
    R, _ = cv2.Rodrigues(rotation_vector)
    return np.dot(mat, R)


def rotate(image: np.ndarray, params: dict) -> np.ndarray:
    angle_x = params.get("x", 0)
    angle_y = params.get("y", 0)
    angle_z = params.get("z", 0)

    # ラジアンに変換
    angle_x = np.deg2rad(angle_x)
    angle_y = np.deg2rad(angle_y)
    angle_z = np.deg2rad(angle_z)

    # 回転行列を計算
    mat = np.eye(3)
    mat = _rotate_x(mat, angle_x)
    mat = _rotate_y(mat, angle_y)
    mat = _rotate_z(mat, angle_z)

    height, width = image.shape[:2]
    center_x = width / 2
    center_y = height / 2

    mat[0, 2] = center_x - center_x * mat[0, 0] - center_y * mat[0, 1]
    mat[1, 2] = center_y - center_x * mat[1, 0] - center_y * mat[1, 1]
    mat = mat[:2, :]

    out = cv2.warpAffine(image, mat, image.shape[:2][::-1])
    return out


def overlay_images(images: list[np.ndarray]) -> np.ndarray:
    assert len(images) > 0
    max_width = max([img.shape[1] for img in images])

    resized_images = []
    for img in images:
        h, w = img.shape[:2]
        resized = cv2.resize(img, (max_width, int(h * (max_width / w))))
        resized_images.append(resized)

    overlayed_image = np.zeros_like(resized_images[0])
    overlayed_height = overlayed_image.shape[0]

    for img in resized_images:
        h, w = img.shape[:2]
        x_offset = (max_width - w) // 2
        y_offset = (overlayed_height - h) // 2
        overlayed_image[
            y_offset : y_offset + h,
            x_offset : x_offset + w,
        ] = img

    return overlayed_image

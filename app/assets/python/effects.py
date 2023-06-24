import cv2
import numpy as np
from scipy.spatial.transform import Rotation


def blur(image: np.ndarray, params: dict) -> np.ndarray:
    intensity = params.get("intensity", 0)
    if intensity > 0:
        out = cv2.blur(image, (intensity, intensity))
        return out
    return image


def rotate(image: np.ndarray, params: dict) -> np.ndarray:
    angle_x = params.get("x", 0)
    angle_y = params.get("y", 0)
    angle_z = params.get("z", 0)

    h, w = image.shape[:2]
    center_x, center_y = w // 2, h // 2
    center = np.array([center_x, center_y, 0])

    # 回転行列を計算
    r = Rotation.from_euler("xyz", [angle_x, angle_y, angle_z], degrees=True)
    rot_mat = r.as_matrix()

    # 画像の頂点を取得
    corners = np.array([[0, 0, 0], [w, 0, 0], [w, h, 0], [0, h, 0]])

    # 頂点を回転
    rotated_corners = np.dot(corners - center, rot_mat) + center
    rotated_corners = rotated_corners[:, :2].astype(int)

    # 変換後の座標で矩形を算出
    min_x, min_y = np.min(rotated_corners, axis=0)
    max_x, max_y = np.max(rotated_corners, axis=0)

    # 変換後の画像サイズ
    new_w, new_h = max_x - min_x, max_y - min_y

    # 平行移動行列
    transl_mat = np.eye(3, dtype=np.float32)
    transl_mat[:2, 2] = -center[:2]
    transl_mat[0, 2] += new_w // 2
    transl_mat[1, 2] += new_h // 2

    # 回転行列を OpenCV 平面用に変換
    rot_mat_cv = np.eye(3, dtype=np.float32)
    rot_mat_cv[:2, :2] = r.as_matrix()[:2, :2]

    # 平行移動および回転を適用
    transform_mat = np.dot(transl_mat, rot_mat_cv)
    rotated_image = cv2.warpPerspective(image, transform_mat, (new_w, new_h))

    return rotated_image


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

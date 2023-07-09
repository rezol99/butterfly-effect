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

    if image.shape[2] < 4:  # RGB画像の場合
        out_img = cv2.warpAffine(image, mat, (width, height))
    else:  # アルファチャンネルを含む画像の場合
        img = image
        alpha_channel = img[:, :, 3]
        rgb_channels = img[:, :, :3]

        # RGBチャンネルだけで変換を計算
        planar_img = cv2.merge(
            [rgb_channels[:, :, 0], rgb_channels[:, :, 1], rgb_channels[:, :, 2]]
        )
        rotated_img = cv2.warpAffine(planar_img, mat, (width, height))

        # アルファチャンネルだけで変換を計算
        alpha_img = cv2.merge([alpha_channel, alpha_channel, alpha_channel])
        rotated_alpha = cv2.warpAffine(alpha_img, mat, (width, height))

        # RGBチャンネルとアルファチャネルをマージ
        out_img = cv2.merge(
            [
                rotated_img[:, :, 0],
                rotated_img[:, :, 1],
                rotated_img[:, :, 2],
                rotated_alpha[:, :, 0],
            ]
        )

    return out_img


def overlay_images(images: list[np.ndarray]) -> np.ndarray:
    max_height = max(image.shape[0] for image in images)

    # 画像の高さを一番大きなものに揃える
    resized_images = []
    for image in images:
        scale = max_height / image.shape[0]
        width = int(image.shape[1] * scale)
        dim = (width, max_height)
        resized = cv2.resize(image, dim, interpolation=cv2.INTER_AREA)
        resized_images.append(resized)

    # 画像をアルファブレンドする
    alpha = 1.0 / len(resized_images)
    blended = np.zeros_like(resized_images[0])
    for image in resized_images:
        cv2.addWeighted(image, alpha, blended, 1.0, 0, blended)

    return blended


def rotate_as_3d_images(images, params_list):
    # 3D空間の各画像の位置と奥行きを計算する
    positions = []
    depths = []
    for params in params_list:
        angle_x = np.deg2rad(params.get("x", 0))
        angle_y = np.deg2rad(params.get("y", 0))
        angle_z = np.deg2rad(params.get("z", 0))
        position = np.array(
            [
                np.sin(angle_y),
                -np.sin(angle_x) * np.cos(angle_y),
                np.cos(angle_x) * np.cos(angle_y),
            ]
        )
        depth = np.cos(angle_x) * np.cos(angle_y)
        positions.append(position)
        depths.append(depth)

    # 奥行きを基準に位置と画像をソートする
    sorted_images = [
        image
        for _, image in sorted(zip(depths, images), key=lambda x: x[0], reverse=True)
    ]
    sorted_positions = [
        pos
        for _, pos in sorted(zip(depths, positions), key=lambda x: x[0], reverse=True)
    ]

    # 各画像を投影して合成する
    merged_image = np.zeros_like(sorted_images[0], dtype=np.float32)
    for image, position in zip(sorted_images, sorted_positions):
        # 画像の中心座標を計算
        center_x = image.shape[1] // 2
        center_y = image.shape[0] // 2

        # 回転行列を計算
        rotation_matrix = calculate_rotation_matrix(position)

        # 画像の回転
        rotated_image = cv2.warpAffine(
            image, rotation_matrix[:2, :], (image.shape[1], image.shape[0])
        )

        # 合成
        alpha = rotated_image[:, :, 3] / 255.0
        merged_image[:, :, :3] = (
            merged_image[:, :, :3] * (1 - alpha[:, :, np.newaxis])
            + rotated_image[:, :, :3] * alpha[:, :, np.newaxis]
        )
        merged_image[:, :, 3] = np.maximum(
            merged_image[:, :, 3], rotated_image[:, :, 3]
        )

    merged_image = merged_image.astype(np.uint8)

    return merged_image


def calculate_rotation_matrix(position):
    # 3D空間の回転行列を計算
    x, y, z = position

    rotation_x = np.array(
        [[1, 0, 0], [0, np.cos(x), -np.sin(x)], [0, np.sin(x), np.cos(x)]]
    )

    rotation_y = np.array(
        [[np.cos(y), 0, np.sin(y)], [0, 1, 0], [-np.sin(y), 0, np.cos(y)]]
    )

    rotation_z = np.array(
        [[np.cos(z), -np.sin(z), 0], [np.sin(z), np.cos(z), 0], [0, 0, 1]]
    )

    rotation_matrix = np.dot(rotation_z, np.dot(rotation_y, rotation_x))
    return rotation_matrix

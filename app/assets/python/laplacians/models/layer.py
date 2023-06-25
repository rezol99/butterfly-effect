from laplacians.models.asset_type import AssetType
from laplacians.models.effect import Effect
import cv2


class Layer:
    file: str
    type: AssetType
    effects: list[Effect]
    out: cv2.Mat

    def __init__(self, file: str, type: AssetType, effects: list[Effect]):
        self.file = file
        self.type = type
        self.effects = effects

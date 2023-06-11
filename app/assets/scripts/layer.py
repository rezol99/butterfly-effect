from enum import Enum
import cv2


class AssetType(Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"


class Timing:
    start: float
    end: float

    def __init__(self, start: float, end: float):
        self.start = start
        self.end = end


class Effect:
    type: str
    params: dict
    timing: Timing

    def __init__(self, type: str, params: dict, timing: Timing):
        self.type = type
        self.params = params
        self.timing = timing


class Layer:
    file: str
    type: AssetType
    effects: list[Effect]
    out: cv2.Mat

    def __init__(self, file: str, type: AssetType, effects: list[Effect]):
        self.file = file
        self.type = type
        self.effects = effects

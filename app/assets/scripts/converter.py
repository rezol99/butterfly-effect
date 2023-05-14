from typing import Callable
from frame import Frame


class Converter:
    def __init__(self, convert: Callable[[Frame], Frame]) -> None:
        self.convert = convert

    def exec(self, frame: Frame) -> Frame:
        return self.convert(frame)

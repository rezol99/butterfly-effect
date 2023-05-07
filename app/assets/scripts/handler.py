from typing import List
import processing
from frame import Frame


HANDLE_MAP = {
    "blur": processing.blur,
    "compose": processing.compose,
    "add-border": processing.add_border,
    "draw-point": processing.draw_point,
}


class Handler:
    def __init__(self, command: str, frames: List[Frame]):
        self.command = command
        self.frames = frames

    def __is_multi_image_processing(self) -> bool:
        return len(self.frames) >= 2

    def send(self) -> None:
        self.frames[0].send()  # 出力状態は、self.frames[0]に格納されている

    def run(self) -> None:
        if self.command not in HANDLE_MAP:
            raise Exception(f"Unknown command: {self.command}")

        if self.__is_multi_image_processing():
            HANDLE_MAP[self.command](self.frames)
        else:
            frame = self.frames[0]
            HANDLE_MAP[self.command](frame)

        self.send()

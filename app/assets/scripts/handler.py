import json
import sys
import numpy as np
from typing import List

from frame import Frame
import processing
from converter import decode_image_to_ndarray


class Handler:
    command = ""
    map = {"blur": processing.blur, "compose": processing.compose}
    frames: List[Frame]

    def __init__(self, command: str, frames: List[Frame]):
        self.command = command
        self.frames = frames

    def __is_multi_image_processing(self) -> bool:
        if len(self.frames) <= 1:
            return False
        else:
            return True

    def send(self) -> None:
        self.frames[0].send() # 出力状態は、self.frames[0]に格納されている

    def run(self):
        if self.command not in self.map:
            raise Exception(f"Unknown command: {self.command}")

        if self.__is_multi_image_processing():
            self.map[self.command](self.frames)
        else:
            frame = self.frames[0]
            self.map[self.command](frame)

        self.send()


def __read_input() -> None:
    return json.loads(sys.stdin.readline())


def __parse_input(data) -> tuple[str, List[np.ndarray]]:
    if "command" not in data:
        raise Exception("command is not found")

    command = data["command"]
    meta = data.get("meta")
    frames = [Frame(decode_image_to_ndarray(image), meta) for image in data["images"]]

    return command, frames


if __name__ == "__main__":
    received_data = __read_input()
    command, frames = __parse_input(received_data)

    h = Handler(command, frames)
    h.run()

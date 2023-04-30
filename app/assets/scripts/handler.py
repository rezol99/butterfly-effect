import json
import sys
from typing import List, Any

from frame import Frame
import processing
from converter import decode_image_to_ndarray

HANDLE_MAP = {"blur": processing.blur, "compose": processing.compose, "add-border": processing.add_border}

class Handler:
    command = ""
    frames: List[Frame]

    def __init__(self, command: str, frames: List[Frame]):
        self.command = command
        self.frames = frames

    def __is_multi_image_processing(self) -> bool:
        return not len(self.frames) <= 1

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


def __read_input() -> dict:
    return json.loads(sys.stdin.readline())


def __parse_input(data: dict) -> tuple[str, List[Frame]]:
    if "command" not in data:
        raise Exception("command is not found")

    command = data["command"]
    meta: Any = data.get("meta")
    frames = [Frame(decode_image_to_ndarray(image), meta) for image in data["images"]]

    return command, frames


if __name__ == "__main__":
    received = __read_input()
    command, frames = __parse_input(received)

    h = Handler(command, frames)
    h.run()

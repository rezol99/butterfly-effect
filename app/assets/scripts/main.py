import json
import sys
from typing import List, Optional

from converter import decode_image_to_ndarray
from frame import Frame
from handler import Handler


def __read_input() -> dict:
    return json.loads(sys.stdin.readline())


def __parse_input(data: dict) -> tuple[str, List[Frame]]:
    if "command" not in data:
        raise Exception("command is not found")

    command = data["command"]
    meta: Optional[dict] = data.get("meta")
    if meta is None:
        meta = dict()

    frames = [Frame(decode_image_to_ndarray(image), meta) for image in data["images"]]

    return command, frames


if __name__ == "__main__":
    received = __read_input()
    command, frames = __parse_input(received)

    h = Handler(command, frames)
    h.run()

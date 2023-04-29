import sys
import json
from converter import encode_ndarray_to_base64, decode_image_to_ndarray


class Frame:
    def __init__(self):
        command, meta, image = self.__parse_input()
        self.command = command
        self.image = image
        self.meta = meta

    def __read_input(self):
        return json.loads(sys.stdin.readline())

    def __parse_input(self):
        data = self.__read_input()
        command, meta, image = None, None, None
        if "command" in data:
            command = data["command"]
        if "meta" in data:
            meta = data["meta"]
        if "images" in data:
            image = decode_image_to_ndarray(data["images"][0])
        return command, meta, image

    def send(self):
        data = dict()
        data["meta"] = self.meta
        data["image"] = encode_ndarray_to_base64(self.image)
        sys.stdout.write(json.dumps(data, ensure_ascii=False))
        sys.stdout.flush()

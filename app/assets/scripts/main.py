from converter import decode_image_to_ndarray
from frame import Frame
from handler import handle

from command import CommandsDecoder
from typing import Optional



if __name__ == "__main__":
    decoder = CommandsDecoder()
    commands = decoder.run()

    prev: Optional[Frame] = None
    for cmd in commands:
        meta = cmd.meta
        frames: list[Frame] = [Frame(asset['path'], asset['meta']) for asset in meta['assets']]

        prev = handle(cmd.name, frames)



        h = Handler(command, frames)
        h.run()





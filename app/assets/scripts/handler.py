from command import Command
from frame import Frame
import image_processing

from typing import Optional

HANDLE_MAP = {
    "blur": image_processing.blur,
    "add-border": image_processing.add_border,
    "draw-point": image_processing.draw_point,

    # 複数の画像から処理するもの、[MULTI]というprefixをつける
    "[MULTI]compose": image_processing.compose,
}

def handle(command_name: str, frame: Frame) -> Optional[Frame]:
    process = HANDLE_MAP[command_name]
    frame_count = len(frames)

    # コマンド形式が正しいかassertする
    assert frame_count == 1 and not command_name.startswith("[MULTI]")

    out: Optional[Frame] = None

    if frame_count == 1:
        out = process(frames)

    assert frame_count > 1 and command_name.startswith("[MULTI]")
    if frame_count > 1:
        out = process(frames)

    return out

import processing
from frame import Frame


class Handler:
    map = {"blur": processing.blur}

    def __init__(self, frame: Frame):
        self.frame = frame

    def run(self):
        frame = self.frame
        if frame.command not in self.map:
            raise Exception(f"Unknown command: {frame.command}")

        self.map[frame.command](frame)
        frame.send()


if __name__ == "__main__":
    frame = Frame()
    h = Handler(frame)
    h.run()

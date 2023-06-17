from .timing import Timing


class Effect:
    type: str
    params: dict
    timing: Timing

    def __init__(self, type: str, params: dict, timing: Timing):
        self.type = type
        self.params = params
        self.timing = timing

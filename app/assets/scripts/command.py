from typing import Any
import json
import sys

class Command:
    name: str
    meta: dict


class CommandsDecoder:
    commands: list[Command]

    def run(self) -> list[Command]:
        data = self.__read()
        commands = self.__decode(data)
        return commands

    def __read(self) -> dict:
        return json.loads(sys.stdin.readline())

    def __decode(self, data: dict) -> list[Command]:
        if "commands" not in data:
            raise Exception("commands is not found")

        commands = data["commands"]
        return commands


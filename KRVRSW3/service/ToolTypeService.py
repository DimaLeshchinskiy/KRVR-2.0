import json
import sys

sys.path.append("..")

from util import Util
from model import ToolType


class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class ToolTypeService(metaclass=SingletonMeta):
    def findAll(self):
        toolTypes = []

        with open(Util.getDataFilePath("toolTypes.json"), 'r') as file:
            for toolTypeJSON in json.load(file):
                toolType = self.create(toolTypeJSON)
                toolTypes.append(toolType)
        return toolTypes

    def create(self, json):
        toolType = ToolType()

        if json:
            toolType.id = json["id"]
            toolType.type = json["type"]
            toolType.title = json["title"]
            toolType.fields = json["fields"]

        return toolType

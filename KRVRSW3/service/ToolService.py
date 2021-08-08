import json
import sys

sys.path.append("..")

from util import Util
from model import Tool


class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class ToolService(metaclass=SingletonMeta):
    def findById(self, toolId):
        for tool in self.findAll():
            if tool.id is toolId:
                return tool
        return None

    def findAll(self):
        tools = []

        with open(Util.getDataFilePath("tools.json"), 'r') as file:
            for toolJSON in json.load(file):
                tool = self.create(toolJSON)
                tools.append(tool)
        return tools

    def create(self, json):
        tool = Tool()

        if json:
            tool.id = json["id"]
            tool.typeId = json["typeId"]
            tool.title = json["title"]
            tool.fields = json["fields"]

        return tool

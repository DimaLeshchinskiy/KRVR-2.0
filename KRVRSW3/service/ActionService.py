import json
import sys

sys.path.append("..")

from util import Util
from model import Action


class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class ActionService(metaclass=SingletonMeta):
    def findById(self, actionId):
        for action in self.findAll():
            if action.id is actionId:
                return action
        return None

    def findAll(self):
        actions = []

        with open(Util.getDataFilePath("actions.json"), 'r') as file:
            for actionJSON in json.load(file):
                action = self.create(actionJSON)
                actions.append(action)
        return actions

    def create(self, json):
        action = Action()

        if json:
            action.id = json["id"]
            action.typeId = json["typeId"]
            action.toolId = json["toolId"]
            action.title = json["title"]
            action.fields = json["fields"]

        return action

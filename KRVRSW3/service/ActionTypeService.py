import json
import sys

sys.path.append("..")

from util import Util
from model import ActionType


class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class ActionTypeService(metaclass=SingletonMeta):
    def findAll(self):
        actionTypes = []

        with open(Util.getDataFilePath("actionTypes.json"), 'r') as file:
            for actionTypeJSON in json.load(file):
                actionType = self.create(actionTypeJSON)
                actionTypes.append(actionType)
        return actionTypes

    def findById(self, id):
        actionTypes = self.findAll()

        for actionType in actionTypes:
            if actionType.id == id:
                return actionType
        return None

    def create(self, json):
        actionType = ActionType()

        if json:
            actionType.id = json["id"]
            actionType.type = json["type"]
            actionType.title = json["title"]
            actionType.fields = json["fields"]

        return actionType

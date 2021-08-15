import json


class Action:
    def __init__(self):
        self.id = None
        self.typeId = None
        self.toolId = None
        self.title = None
        self.fields = []

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__)


class ActionEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Action):
            return obj.__dict__
        return json.JSONEncoder.default(self, obj)

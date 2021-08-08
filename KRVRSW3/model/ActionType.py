import json


class ActionType:
    def __init__(self):
        self.id = None
        self.type = None
        self.title = None
        self.fields = []

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__)


class ActionTypeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ActionType):
            return obj.__dict__
        return json.JSONEncoder.default(self, obj)

import json


class ToolType:
    def __init__(self):
        self.id = None
        self.type = None
        self.title = None
        self.fields = []

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__)


class ToolTypeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ToolType):
            return obj.__dict__
        return json.JSONEncoder.default(self, obj)

import json

class Tool:
    def __init__(self):
        self.id = None
        self.typeId = None
        self.title = None
        self.fields = []
    
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class ToolEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Tool):
            return obj.__dict__
        return json.JSONEncoder.default(self, obj)

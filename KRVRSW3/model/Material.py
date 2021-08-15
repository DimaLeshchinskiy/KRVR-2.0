import json

class Material:
    def __init__(self):
        self.x = 0
        self.y = 0
        self.z = 0
        self.width = 0
        self.height = 0
        self.depth = 0

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class MaterialEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Material):
            return obj.__dict__
        return json.JSONEncoder.default(self, obj)

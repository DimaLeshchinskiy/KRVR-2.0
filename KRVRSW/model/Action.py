import json


class Action:
    def __init__(self):
        self.id = None
        self.typeId = None
        self.toolId = None
        self.title = None
        self.fields = []

    def getFieldValue(self, fieldName):
        for field in self.fields:
            if field["inputName"] == fieldName:
                return field["value"]
        return None
    
    def getSelectedFace(self):
        fieldValue = self.getFieldValue("pocket_face")
        if fieldValue:
            return fieldValue["data"]["attributes"]
        return None

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__)


class ActionEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Action):
            return obj.__dict__
        return json.JSONEncoder.default(self, obj)

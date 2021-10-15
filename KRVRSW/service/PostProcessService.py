import sys

sys.path.append("..")

from service import ActionTypeService, ToolService, ActionService, MaterialService
from core import FaceActionProcess, PocketActionProcess, ExtPerimeterActionProcess, IntPerimeterActionProcess, GrblGcodeBuilder


class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class PostProcessService(metaclass=SingletonMeta):

    def process(self, json):
        
        mainGcodeBuilder = GrblGcodeBuilder()
        actionTypeService = ActionTypeService()
        actionService = ActionService()
        toolService = ToolService()
        materialService = MaterialService()

        toolModelLastUsed = None

        options = json["options"]

        #set feedRate and power
        mainGcodeBuilder.setFeedRate(options["feedRate"]).setPower(options["power"])
        mainGcodeBuilder.g28()

        #files process
        for file in json["files"]:

            materialModel = materialService.create(file["material"])

            for action in file["millingActions"]:
                actionType = actionTypeService.findById(action["typeId"])
                actionStrategy = None
                if actionType.type == "face":
                    actionStrategy = FaceActionProcess()
                elif actionType.type == "2d_pocket":
                    actionStrategy = PocketActionProcess()
                elif actionType.type == "ext_perimeter":
                    actionStrategy = ExtPerimeterActionProcess()
                elif actionType.type == "int_perimeter":
                    actionStrategy = IntPerimeterActionProcess()
                else:
                    continue
                
                actionModel = actionService.create(action)
                toolModel = toolService.findById(action["toolId"])

                if toolModelLastUsed and toolModel.id != toolModelLastUsed.id:
                    mainGcodeBuilder.changeTool()

                gcodeBuilder = actionStrategy.makeGcode(
                    action=actionModel, 
                    tool=toolModel, 
                    material=materialModel,
                    objectOptions=file["objectOptions"]
                )
                mainGcodeBuilder.appendBuilder(gcodeBuilder, comment="Process action " + str(action["title"]))

        mainGcodeBuilder.g28()
        return mainGcodeBuilder.make()
        

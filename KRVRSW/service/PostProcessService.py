import sys

sys.path.append("..")

from service import ActionTypeService, ToolService, ActionService, MaterialService
from core import FaceActionProcess, PocketActionProcess, GrblGcodeBuilder


class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class PostProcessService(metaclass=SingletonMeta):
    # def test():
    #     self.SerialComunicationInstance.getAvailablePorts()
    #     self.SerialComunicationInstance.connect(port="COM3")
    #     self.SerialComunicationInstance.send(gcode=["string", "string"])
    #     self.SerialComunicationInstance.disconnect()

    def process(self, json):
        
        mainGcodeBuilder = GrblGcodeBuilder()
        actionTypeService = ActionTypeService()
        actionService = ActionService()
        toolService = ToolService()
        materialService = MaterialService()

        options = json["options"]

        #set feedRate and power
        mainGcodeBuilder.setFeedRate(options["feedRate"]).setPower(options["power"])

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
                else:
                    continue
                
                actionModel = actionService.create(action)
                toolModel = toolService.findById(action["toolId"])

                gcodeBuilder = actionStrategy.makeGcode(
                    action=actionModel, 
                    tool=toolModel, 
                    material=materialModel,
                    objectOptions=file["objectOptions"]
                )
                mainGcodeBuilder.appendBuilder(gcodeBuilder, comment="Process action " + str(action["title"]))

        return mainGcodeBuilder.make()
        

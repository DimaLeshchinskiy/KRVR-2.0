from flask import Flask, send_from_directory, request
import json

from model import ToolEncoder, ToolTypeEncoder, ActionEncoder, ActionTypeEncoder
from service import ToolService, ToolTypeService, ActionService, ActionTypeService, ConvertService, PostProcessService
from core import GrblGcodeBuilder, SerialCommunication

serialCommunication = SerialCommunication()


app = Flask(__name__, static_url_path='', static_folder='public')


# Home page
@app.route("/", defaults={'path': ''})
def home(path):
    return send_from_directory(app.static_folder, 'index.html')


# Tools
@app.route('/tool/<toolId>', methods=['GET'])
def tool(toolId):
    service = ToolService()
    return json.dumps(service.findById(toolId), cls=ToolEncoder)


@app.route('/tools', methods=['GET'])
def tools():
    service = ToolService()
    return json.dumps(service.findAll(), cls=ToolEncoder)


@app.route('/toolTypes', methods=['GET'])
def toolTypes():
    service = ToolTypeService()
    return json.dumps(service.findAll(), cls=ToolTypeEncoder)


# Actions
@app.route('/action/<actionId>', methods=['GET'])
def action(actionId):
    service = ActionService()
    return json.dumps(service.findById(actionId), cls=ActionEncoder)


@app.route('/actions', methods=['GET'])
def actions():
    service = ActionService()
    return json.dumps(service.findAll(), cls=ActionEncoder)


@app.route('/actionTypes', methods=['GET'])
def actionTypes():
    service = ActionTypeService()
    return json.dumps(service.findAll(), cls=ActionTypeEncoder)


# Convert STEP to STL
@app.route('/convert/step', methods=['POST'])
def convertSTEP():
    service = ConvertService()
    if request.data is not None:
        # get file data
        fileData = request.data.decode()
        # convert step to stl
        return service.convert(fileData)
    return "Error, step file is empty"


# Postprocess
@app.route('/postProcess', methods=['POST'])
def postProcess():
    json = request.get_json()
    # builder1 = GrblGcodeBuilder(f=100, s=255)
    # builder1.g0(x=10, z=10).g0(x=10, z=20).g1(y=10, z=20, s=100)
    # builder2 = GrblGcodeBuilder()
    # builder2.g1(x=10, z=10).g1(x=10, z=20).g0(y=10, z=20, s=100)

    # builder1.appendBuilder(builder2, "comment1").g0(x=0, y=0, z=0)
    # builder1.appendBuilder(builder2, "comment2").g0(x=0, y=0, z=0)

    # return builder1.make()
    service = PostProcessService()
    gcode = service.process(json)
    return gcode


if __name__ == '__main__':
    app.run()

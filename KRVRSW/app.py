from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit
import json

from model import ToolEncoder, ToolTypeEncoder, ActionEncoder, ActionTypeEncoder
from service import ToolService, ToolTypeService, ActionService, ActionTypeService, ConvertService, PostProcessService
from core import SerialCommunication, GrblGcodeBuilder

app = Flask(__name__, static_url_path='', static_folder='public')
socketio = SocketIO(app)

serialCommunication = SerialCommunication(socketio)

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

    service = PostProcessService()
    gcode = service.process(json)
    gcodeList = gcode.split("\n")

    serialCommunication.send(gcode=gcodeList)
    return gcode

# Connect to port
@app.route('/serial/connect', methods=['POST'])
def connect():
    json = request.get_json()
    port = json["port"]
    print(json)
    print(port)

    serialCommunication.connect(port=port)
    return "OK"

# Disconnect port
@app.route('/serial/disconnect', methods=['POST'])
def disconnect():
    serialCommunication.disconnect()
    return "OK"

# Return list of available ports
@app.route('/serial/ports', methods=['GET'])
def listPorts():
    return { "ports": serialCommunication.getAvailablePorts()}

# Jog async
@app.route('/serial/jog', methods=['POST'])
def jog():
    json = request.get_json()["data"]
    x = json["x"]
    y = json["y"]
    z = json["z"]
    feed = json["feed"]

    jogBuilder = GrblGcodeBuilder()
    cmd = jogBuilder.jog(x=x, y=y, z=z, f=feed).make()

    serialCommunication.sendAsync(cmd)
    return "OK"

# Send async command
@app.route('/serial/asyncCommand', methods=['POST'])
def asyncCommand():
    json = request.get_json()
    cmd = json["command"]
    serialCommunication.sendAsync(cmd)
    return "OK"

# Stop serial communication
@app.route('/serial/stop', methods=['POST'])
def stop():
    serialCommunication.stop()
    return "OK"

# Pause serial communication
@app.route('/serial/pause', methods=['POST'])
def pause():
    serialCommunication.pause()
    return "OK"

# Resume serial communication
@app.route('/serial/resume', methods=['POST'])
def resume():
    serialCommunication.resume()
    return "OK"

# Unlock serial communication
@app.route('/serial/unlock', methods=['POST'])
def unlock():
    serialCommunication.unlock()
    return "OK"

# For test
@app.route('/test', methods=['POST'])
def test():
    serialCommunication.unlock()
    serialCommunication.send(["G0 X1 F100", "G1 X3 F100", "G1 X2 F100"])
    return "OK"


if __name__ == '__main__':
    # app.run()
    socketio.run(app,host='0.0.0.0')



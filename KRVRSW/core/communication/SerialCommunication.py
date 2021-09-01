import serial
import serial.tools.list_ports
import threading
import time

class MyThread(threading.Thread):
    def __init__(self, connection, gcode=[], onSendCallback=None, onPauseCallback=None, onStopCallback=None, onResumeCallback=None, onResponseCallback=None):
        super(MyThread, self).__init__()
        self.connection = connection
        self.gcode = gcode
        self.paused = False
        self.stoped = False
        self.onSendCallback = onSendCallback
        self.onPauseCallback = onPauseCallback
        self.onStopCallback = onStopCallback
        self.onResumeCallback = onResumeCallback
        self.onResponseCallback = onResponseCallback

    def run(self):
        while len(self.gcode) > 0:
            if self.stoped:
                return

            while self.paused:
                time.sleep(0.1)
            cmd = self.gcode.pop(0)

            # send
            self.connection.write("{}\n".format(cmd).encode())
            self.onSendCallback(cmd)
            print("send: " + cmd)

            # pause if M0 is command pushed to GRBL
            if cmd == "M0":
                self.pause()

            # wait for response "ok"
            while True:
                response =  self.connection.readline().decode()
                self.onResponseCallback(response)
                print("response: " + response)
                if "ok" in response:
                    break
                else:
                    time.sleep(0.1)


    def pause(self):
        self.paused = True  
        self.onPauseCallback()

    def resume(self):
        self.paused = False   
        self.onResumeCallback()

    def stop(self):
        self.stoped = True   
        self.onStopCallback()      
 

class SerialCommunication:
    def __init__(self, socketio):
        self.thread = None
        self.connection = None
        self.socketio = socketio
    
    def connect(self, port, baudrate=115200):
        self.connection = serial.Serial(port, baudrate=baudrate)

        while True:
            line =  self.connection.readline().decode()
            self.responseCallback(line)
            if "Grbl" in line:
                return
            else:
                time.sleep(0.1)

    def disconnect(self):
        self.connection.close()
        self.connection = None
    
    def getAvailablePorts(self):
        ports = []
        for port in serial.tools.list_ports.comports():
            print(port.name)
            ports.append(port.name)
        return ports

    def isConnected(self):
        return self.connection

    def send(self, gcode=[]):
        if self.isConnected() and len(gcode) > 0:
            self.thread = MyThread(self.connection, gcode=gcode, \
                onSendCallback=self.sendCallback, \
                onPauseCallback=self.pauseCallback, \
                onResumeCallback=self.resumeCallback, \
                onStopCallback=self.stopCallback, \
                onResponseCallback=self.responseCallback)
            self.thread.start()
            

    def sendAsync(self, gcode):
        if self.isConnected():
            self.connection.write("{}\n".format(gcode).encode())
            self.sendCallback(gcode)
            while True:
                line =  self.connection.readline().decode()
                self.responseCallback(line)
                if "ok" in line:
                    return
                else:
                    time.sleep(0.1)

    def unlock(self):
        if self.isConnected():
            self.connection.write("$X\n".encode())

            while True:
                line =  self.connection.readline().decode()
                self.responseCallback(line)
                if "ok" in line:
                    return
                else:
                    time.sleep(0.1)
    
    def pause(self):
        if self.isConnected():
            self.thread.pause()
    
    def stop(self):
        if self.isConnected():
            self.thread.stop()
    
    def resume(self):
        if self.isConnected():
            self.thread.resume()

    def pauseCallback(self):
        self.socketio.emit("onPause", "")
    
    def stopCallback(self):
        self.socketio.emit("onStop", "")
    
    def resumeCallback(self):
        self.socketio.emit("onResume", "")
    
    def sendCallback(self, cmd):
        self.socketio.emit("addConsoleLine", cmd)
    
    def responseCallback(self, cmd):
        if cmd.strip():
            self.socketio.emit("addConsoleLine", cmd)

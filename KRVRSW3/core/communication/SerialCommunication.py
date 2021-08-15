import serial
import serial.tools.list_ports
import threading
import time

class MyThread(threading.Thread):
    def __init__(self, connection, gcode=[]):
        super(MyThread, self).__init__()
        self.connection = connection
        self.gcode = gcode
        self.paused = False

    def run(self):
        while len(self.gcode) > 0:
            while self.paused:
                time.sleep(0.1)
            cmd = self.gcode.pop(0)
            self.connection.write("{}\n".format(cmd).encode())
            response =  self.connection.readline()
            print(response)

    def pause(self):
        self.paused = True  

    def resume(self):
        self.paused = False         

class MyThreadAsync(threading.Thread):
    def __init__(self, connection, gcode=[]):
        self.connection = connection
        self.gcode = gcode

    def run(self):
        while len(self.gcode) > 0:
            cmd = self.gcode.pop(0)
            self.connection.write(cmd + "\n")
            response =  self.connection.readline()
       

class SerialCommunication:
    def __init__(self):
        self.thread = None
        self.connection = None
    
    def connect(self, port, baudrate=115200):
        self.connection = serial.Serial(port, baudrate)
        # self.connection.open()

    def disconnect(self):
        self.connection.close()
        self.connection = None
    
    def getAvailablePorts(self):
        ports = serial.tools.list_ports.comports()
        print([port.name for port in ports])
        return ports

    def isConnected(self):
        return self.connection

    def send(self, gcode=[]):
        if self.isConnected() and len(gcode) > 0:
            self.thread = MyThread(self.connection, gcode)
            self.thread.start()
            

    # def sendAsync(self, gcode=[]):
    #     if self.isConnected() and len(gcode) > 0:
    #         self.thread.pause()
    #         threadAsync = MyThreadAsync(self.connection, gcode)
    #         threadAsync.start()
    #         self.thread.resume()
            

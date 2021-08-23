from .GcodeCommand import GcodeCommand

'''

Y and Z axis are swapped

'''

class GrblGcodeBuilder:
    def __init__(self, f=None, s=None):
        self.gcode = []
        self.s = s
        self.f = f

    def make(self) -> str:
        string = ""

        for gcode in self.gcode:

            if type(gcode) == GrblGcodeBuilder:
                gcode.tryChangeGlobalParametr(f=self.f, s=self.s)
                string += gcode.make()
            elif type(gcode) == GcodeCommand:
                gcode.tryChangeGlobalParametr("F", self.f)
                gcode.tryChangeGlobalParametr("S", self.s)
                string += gcode.make()

        return string

    def append(self, gcode):
        self.gcode.append(gcode)
        return self

    def appendBuilder(self, builder, comment=None):
        if comment:
            self.comment(comment)

        self.gcode.append(builder)
        return self

    def setFeedRate(self, f):
        self.f = f
        return self

    def setPower(self, s):
        self.s = s
        return self

    def tryChangeGlobalParametr(self, f=None, s=None):
        if f and self.f == None:
            self.setFeedRate(f)
        if s and self.s == None:
            self.setPower(s)
        
        return self

    def comment(self, comment):
        command = GcodeCommand(comment=str(comment))
        self.append(command)
        return self
    
    def changeTool(self, plateY=1):
        
        self.m5().g0(y=-1).g0(x=0, z=0).m0() # go up and pause
        self.g0(y=plateY + 5).g91().g38_2(z=-5, f=1).g10_l20(y=plateY, p=1) # probe and set new coordinate system
        self.g90().g0(y=-1).m0() # go up and wait for cleanup by user
        self.m3() # go on

        return self


    def g0(self, x=None, y=None, z=None, f=None, s=None):
        command = GcodeCommand(command="G0")

        if x or x == 0:
            command.addParametr("X", str(x))
        if z or z == 0:
            command.addParametr("Y", str(z))
        if y or y == 0:
            command.addParametr("Z", str(y))
        if f or f == 0:
            command.addParametr("F", str(f))
        if s or s == 0:
            command.addParametr("S", str(s))

        self.append(command)
        return self

    def g1(self, x=None, y=None, z=None, f=None, s=None):
        command = GcodeCommand(command="G1")

        if x or x == 0:
            command.addParametr("X", str(x))
        if z or z == 0:
            command.addParametr("Y", str(z))
        if y or y == 0:
            command.addParametr("Z", str(y))
        if f or f == 0:
            command.addParametr("F", str(f))
        if s or s == 0:
            command.addParametr("S", str(s))

        self.append(command)
        return self

    def g2(self, x=None, y=None, z=None, i=None, j=None, f=None, s=None):
        command = GcodeCommand(command="G2")

        if x or x == 0:
            command.addParametr("X", str(x))
        if z or z == 0:
            command.addParametr("Y", str(z))
        if y or y == 0:
            command.addParametr("Z", str(y))
        if i or i == 0:
            command.addParametr("I", str(i))
        if j or j == 0:
            command.addParametr("J", str(j))
        if f or f == 0:
            command.addParametr("F", str(f))
        if s or s == 0:
            command.addParametr("S", str(s))

        self.append(command)
        return self

    def g3(self, x=None, y=None, z=None, i=None, j=None, f=None, s=None):
        command = GcodeCommand(command="G3")

        if x or x == 0:
            command.addParametr("X", str(x))
        if z or z == 0:
            command.addParametr("Y", str(z))
        if y or y == 0:
            command.addParametr("Z", str(y))
        if i or i == 0:
            command.addParametr("I", str(i))
        if j or j == 0:
            command.addParametr("J", str(j))
        if f or f == 0:
            command.addParametr("F", str(f))
        if s or s == 0:
            command.addParametr("S", str(s))

        self.append(command)
        return self
    
    def g10_l20(self, x=None, y=None, z=None, p=None):
        command = GcodeCommand(command="G10 L20", comment="Set coordinate system", globalParameters=[])

        if x or x == 0:
            command.addParametr("X", str(x))
        if z or z == 0:
            command.addParametr("Y", str(z))
        if y or y == 0:
            command.addParametr("Z", str(y))
        if p or p == 0:
            command.addParametr("P", str(p))

        self.append(command)
        return self

    def g20(self):
        command = GcodeCommand(command="G20", comment="Set units to Inches", globalParameters=[])
        self.append(command)
        return self

    def g21(self):
        command = GcodeCommand(command="G21", comment="Set units to Millimeters", globalParameters=[])
        self.append(command)
        return self

    def g28(self):
        command = GcodeCommand(command="G28", comment="Home", globalParameters=[])
        self.append(command)
        return self
    
    def g38_2(self, z=None, f=None):
        command = GcodeCommand(command="G38.2", comment="Probe down", globalParameters=["F"])

        if z or z == 0:
            command.addParametr("Y", str(z))
        if f or f == 0:
            command.addParametr("F", str(f))

        self.append(command)
        return self

    def g90(self):
        command = GcodeCommand(command="G90", comment="Absolute mode enable", globalParameters=[])
        self.append(command)
        return self

    def g91(self):
        command = GcodeCommand(command="G91", comment="Incremental mode enable", globalParameters=[])
        self.append(command)
        return self

    def m0(self):
        command = GcodeCommand(command="M0", comment="Pause", globalParameters=[])
        self.append(command)
        return self
    
    def m3(self, s=None):
        command = GcodeCommand(command="M3", comment="Start spindle", globalParameters=["S"])

        if s or s == 0:
            command.addParametr("S", str(s))

        self.append(command)
        return self
    
    def m5(self):
        command = GcodeCommand(command="M5", comment="Stop spindle", globalParameters=[])
        self.append(command)
        return self
    
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

    def g20(self):
        command = GcodeCommand(command="G20", comment="Set units to Inches")
        self.append(command)
        return self

    def g21(self):
        command = GcodeCommand(command="G21", comment="Set units to Millimeters")
        self.append(command)
        return self

    def g28(self):
        command = GcodeCommand(command="G28", comment="Home")
        self.append(command)
        return self
    
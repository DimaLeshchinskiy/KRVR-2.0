from core import GrblGcodeBuilder
from svgelements import *
import numpy
import re
from enum import Enum

class SvgActionProcess:

    def __init__(self):
        self.toolWidth = None
        self.toolLength = None
        self.materialHeight = None
        self.millingDepth = None
        self.curveSmothness = 1000
        self.xOffset = 0
        self.zOffset = 0

    def offsetg0(self, gcodeBuilder, x, z, y):
        gcodeBuilder.g0(x = x + self.xOffset, z = z + self.zOffset, y = y)

    def offsetg1(self, gcodeBuilder, x, z, y):
        gcodeBuilder.g1(x = x + self.xOffset, z = z + self.zOffset, y = y)

    def startMilling(self, gcodeBuilder, x, z):
        self.offsetg0(gcodeBuilder, x, z, self.materialHeight + 1)
        self.offsetg1(gcodeBuilder, x, z, self.materialHeight - self.millingDepth)

    def stopMilling(self, gcodeBuilder, x, z):
        self.offsetg0(gcodeBuilder, x, z, self.materialHeight + 1)
    
    def makeLine(self, line):
        gcodeBuilder = GrblGcodeBuilder()

        xStart = line.values["x1"]
        zStart = line.values["y1"]
        xEnd = line.values["x2"]
        zEnd = line.values["y2"]

        self.startMilling(gcodeBuilder, xStart, zStart)
        self.millLine(gcodeBuilder, xEnd, zEnd)
        self.stopMilling(gcodeBuilder, xEnd, zEnd)

        return gcodeBuilder
    
    def millLine(self, gcodeBuilder, xEnd, zEnd, y = None):
        if y is None:
            y = self.materialHeight - self.millingDepth

        self.offsetg1(gcodeBuilder, xEnd, zEnd, y)

    def makePolyline(self, polyline):
        gcodeBuilder = GrblGcodeBuilder()

        # 2 possible formats 1: "x0 y0 x1 y1..." 2: "x0,y0 x1,y1..."
        points = re.split(r"\s|,", polyline.values["points"])
        xStart = points[0]
        zStart = points[1]

        self.startMilling(gcodeBuilder, xStart, zStart)

        for i in range(2, len(points), 2):
            xEnd = points[i]
            zEnd = points[i + 1]

            self.millLine(gcodeBuilder, xEnd, zEnd)

        xEnd, zEnd = points[-1].split(",")
        self.stopMilling(gcodeBuilder, xEnd, zEnd)

        return gcodeBuilder

    # not the best idea dosn't improve readability that much
    class PathSymbol(Enum):
        MOVE_TO = "M"
        HORZ_LINE = "H"
        VERT_LINE = "V"
        LINE_TO = "L"
        CLOSE_PATH = "Z"
        QUAD_BEZIER = "Q"
        CUBIC_BEZIER = "C"
        # all of these have lower case versions (excep M, Z) which are relative to previous point
        # TODO

    # uses numpy for performance
    def comb(self, n, k):
        return numpy.math.factorial(n) / (numpy.math.factorial(n - k) * numpy.math.factorial(k))

    def bezierCurve(self, points, t):
        if t < 0 or t > 1:
            raise ValueError(f"t must be in range 0 <= t <= 1! (t = {t})")

        resultPoint = 0
        n = len(points) - 1
        for i in range(len(points)):
            resultPoint += self.comb(n, i) * numpy.power(1 - t, n - i) * numpy.power(t, i) * points[i]

        return resultPoint

    # path action generator
    def parseDString(self, dString):
        pass

    def makePath(self, path):
        gcodeBuilder = GrblGcodeBuilder()

        hasMoveTo = False
        for action, points in self.parseDString(path.values["d"]):
            
            # probably make function for each action
            if action == self.PathSymbol.MOVE_TO:
                xStart, zStart = points[0]
                self.startMilling(gcodeBuilder, xStart, zStart)
                hasMoveTo = True

            elif action == self.PathSymbol.VERT_LINE:
                pass

            # path isn't valid if it doesn't start with M
            if not hasMoveTo:
                raise ValueError("Path has to have M at start")

        return gcodeBuilder

    def makeRect(self, rect):
        pass

    def makePolygon(self, polygon):
        pass

    def makeCircle(self, circle):
        pass

    def makeEllipse(self, ellipse):
        pass

    # makes gcode for outline of svg elments (ignores fill)
    # data must be path to .svg file
    def makeGcode(self, data=None, action=None, tool=None, material=None, objectOptions=None) -> GrblGcodeBuilder:
        self.toolWidth = tool.getFieldValue("width")
        self.toolLength = tool.getFieldValue("length")
        self.materialHeight = material.height
        # self.millingDepth = ?
        # self.curveSmoothness = ?
        # self.xOffset = ?
        # self.zOffset = ?
        
        mainGcodeBuilder = GrblGcodeBuilder()

        # reify = True applies all transforms
        # width, height, viewBox can be changed but at your own risk
        parsedSvg = SVG.parse(data, reify=True)

        for element in parsedSvg.elements():

            gcodeBuilder = None
            if isinstance(element, Line):
                gcodeBuilder = self.makeLine(element)

            elif isinstance(element, Polyline):
                gcodeBuilder = self.makePolyline(element)

            elif isinstance(element, Path):
                gcodeBuilder = self.makePath(element)

            elif isinstance(element, Rect):
                gcodeBuilder = self.makeRect(element)

            elif isinstance(element, Polygon):
                gcodeBuilder = self.makePolygon(element)

            elif isinstance(element, Circle):
                gcodeBuilder = self.makeCircle(element)

            elif isinstance(element, Ellipse):
                gcodeBuilder = self.makeEllipse(element)

            if gcodeBuilder is not None:
                mainGcodeBuilder.appendBuilder(gcodeBuilder)
            

        return mainGcodeBuilder
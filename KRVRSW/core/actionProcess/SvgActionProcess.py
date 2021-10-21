from core import GrblGcodeBuilder
from svgelements import *
import svgpathtools
import numpy
import re
from enum import Enum

class SvgActionProcess:

    def __init__(self):
        self.toolWidth = None
        self.toolLength = None
        self.materialHeight = None
        self.millingDepth = None
        self.curveSmothness = 10
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
        coords = re.split(r"\s|,", polyline.values["points"])
        xStart = coords[0]
        zStart = coords[1]

        self.startMilling(gcodeBuilder, xStart, zStart)

        # valid polyline has to have even number of coords
        for i in range(2, len(coords), 2):
            xEnd = coords[i]
            zEnd = coords[i + 1]

            self.millLine(gcodeBuilder, xEnd, zEnd)

        xEnd = coords[-2]
        zEnd = coords[-1]
        self.stopMilling(gcodeBuilder, xEnd, zEnd)

        return gcodeBuilder

    # svgpathtools should convert all commands to these types
    class PathCommand(Enum):
        LINE = svgpathtools.path.Line
        QUAD_BEZIER = svgpathtools.path.QuadraticBezier
        CUBIC_BEZIER = svgpathtools.path.CubicBezier
        ARC = svgpathtools.path.Arc

    # bezier calculations use numpy for performance
    def comb(self, n, k):
        return numpy.math.factorial(n) / (numpy.math.factorial(n - k) * numpy.math.factorial(k))

    def bezierCurveFunc(self, points, t):
        if t < 0 or t > 1:
            raise ValueError(f"t must be in range 0 <= t <= 1! (t = {t})")

        resultPoint = numpy.array([0, 0])
        n = len(points) - 1
        for i in range(len(points)):
            resultPoint += self.comb(n, i) * numpy.power(1 - t, n - i) * numpy.power(t, i) * points[i]

        return resultPoint

    def makePathLine(self, gcodeBuilder, line):
        xEnd = line.end.real
        zEnd = line.end.imag
        self.millLine(gcodeBuilder, xEnd, zEnd)

    def pointDistance(self, point1, point2):
        x1, z1 = point1
        x2, z2 = point2
        return numpy.sqrt(numpy.power(x1 - x2, 2) + numpy.power(z1 - z2, 2))

    #doesn't mill to the start point (probably chnage for disconected paths)
    def makeBezier(self, gcodeBuilder, points):

        t = 0
        # smaller step (more detail) for longer curves
        # TODO calc for all curve points not just line from start point to end point
        step = (self.pointDistance(points[0], points[-1]) / 100) *  self.curveSmothness
        while t <= 1:
            xEnd, zEnd = self.bezierCurveFunc(points, t)
            self.millLine(gcodeBuilder, xEnd, zEnd)

            t += step

        # t often != 1 beacause of float arithmetic
        # so hard code line to end point
        xEnd, zEnd = self.bezierCurveFunc(points, 1)
        self.millLine(gcodeBuilder, xEnd, zEnd)


    def makeQuadBezier(self, gcodeBuilder, quadBezier):
        startPoint = numpy.array([quadBezier.start.real, quadBezier.start.imag], dtype=float)
        controlPoint = numpy.array([quadBezier.control.real, quadBezier.control.imag], dtype=float)
        endPoint = numpy.array([quadBezier.end.real, quadBezier.end.imag], dtype=float)

        self.makeBezier(gcodeBuilder, [startPoint, controlPoint, endPoint])

    def makeCubicBezier(self, gcodeBuilder, cubicBezier):
        startPoint = numpy.array([cubicBezier.start.real, cubicBezier.start.imag], dtype=float)
        controlPoint1 = numpy.array([cubicBezier.control1.real, cubicBezier.control1.imag], dtype=float)
        controlPoint2 = numpy.array([cubicBezier.control2.real, cubicBezier.control2.imag], dtype=float)
        endPoint = numpy.array([cubicBezier.end.real, cubicBezier.end.imag], dtype=float)

        self.makeBezier(gcodeBuilder, [startPoint, controlPoint1, controlPoint2, endPoint])

    def makeArc(self, gcodeBuilder, arc):
        pass

    #doesn't handle disconected path
    def makePath(self, path):
        gcodeBuilder = GrblGcodeBuilder()
        parsedDString = svgpathtools.parse_path(path.values["d"])

        xStart = parsedDString[0].start.real
        zStart = parsedDString[0].start.imag
        self.startMilling(gcodeBuilder, xStart, zStart)

        for command in parsedDString:
            
            if isinstance(command, self.PathCommand.LINE):
                self.makePathLine(gcodeBuilder, command)

            elif isinstance(command, self.PathCommand.QUAD_BEZIER):
                self.makeQuadBezier(gcodeBuilder, command)

            elif isinstance(command, self.PathCommand.CUBIC_BEZIER):
                self.makeCubicBezier(gcodeBuilder, command)

            elif isinstance(command, self.PathCommand.ARC):
                # TODO
                self.makeArc(gcodeBuilder, command)

        xEnd = parsedDString[-1].end.real
        zEnd = parsedDString[-1].end.imag
        self.stopMilling(gcodeBuilder, xEnd, zEnd)

        return gcodeBuilder

    # dosn't handle rounded corners
    def makeRect(self, rect):
        gcodeBuilder = GrblGcodeBuilder()

        xStart = rect.values["x"]
        zStart = rect.values["y"]
        width = xStart + rect.values["width"]
        height = zStart + rect.values["height"]

        self.startMilling(gcodeBuilder, xStart, zStart)

        self.millLine(gcodeBuilder, xStart + width, zStart)
        self.millLine(gcodeBuilder, xStart + width, zStart + height)
        self.millLine(gcodeBuilder, xStart, zStart + height)
        self.millLine(gcodeBuilder, xStart, zStart)

        self.stopMilling(gcodeBuilder, xStart, zStart)

        return gcodeBuilder

    def makePolygon(self, polygon):
        gcodeBuilder = GrblGcodeBuilder()

        # 2 possible formats 1: "x0 y0 x1 y1..." 2: "x0,y0 x1,y1..."
        coords = re.split(r"\s|,", polygon.values["points"])
        xStart = coords[0]
        zStart = coords[1]

        self.startMilling(gcodeBuilder, xStart, zStart)

        # valid polygon has to have even number of coords
        for i in range(2, len(coords), 2):
            xEnd = coords[i]
            zEnd = coords[i + 1]

            self.millLine(gcodeBuilder, xEnd, zEnd)

        xEnd = coords[-2]
        zEnd = coords[-1]
        self.stopMilling(gcodeBuilder, xEnd, zEnd)

        return gcodeBuilder

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
        self.millingDepth = objectOptions["size"]["max"]["y"] * 2
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

            # Polyline and Polygon makers are identical for now
            elif isinstance(element, Polyline):
                gcodeBuilder = self.makePolyline(element)

            elif isinstance(element, Path):
                gcodeBuilder = self.makePath(element)

            elif isinstance(element, Rect):
                gcodeBuilder = self.makeRect(element)

            elif isinstance(element, Polygon):
                gcodeBuilder = self.makePolygon(element)

            elif isinstance(element, Circle):
                # TODO
                gcodeBuilder = self.makeCircle(element)

            elif isinstance(element, Ellipse):
                # TODO
                gcodeBuilder = self.makeEllipse(element)

            if gcodeBuilder is not None:
                mainGcodeBuilder.appendBuilder(gcodeBuilder)
            

        return mainGcodeBuilder
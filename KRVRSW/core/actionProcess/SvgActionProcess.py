from core import GrblGcodeBuilder
from svgelements import *
import svgpathtools
import numpy
import re
from enum import Enum

import sys
sys.path.append("../..")
from util import Util

class SvgActionProcess:

    def __init__(self):
        self.toolWidth = None
        self.toolLength = None
        self.materialHeight = None
        self.millingDepth = None
        self.curveSmothness = 1000
        self.xOffset = 0
        self.zOffset = 0
        self.usedG1Points = {}
        self.coordDecimalPoints = 1

    def offsetg0(self, gcodeBuilder, x, z, y):
        gcodeBuilder.g0(x = x + self.xOffset, z = z + self.zOffset, y = y)

    def offsetg1(self, gcodeBuilder, x, z, y):
        x = round(x, self.coordDecimalPoints)
        z = round(z, self.coordDecimalPoints)
        if f"{x}-{z}" in self.usedG1Points:
            return

        self.usedG1Points[f"{x}-{z}"] = True
        gcodeBuilder.g1(x = x + self.xOffset, z = z + self.zOffset, y = y)

    def offsetg2(self, gcodeBuilder, x, z, y, i, j):
        gcodeBuilder.g2(x = x + self.xOffset, z = z + self.zOffset, y = y, i = i, j = j)

    def startMilling(self, gcodeBuilder, x, z):
        self.offsetg0(gcodeBuilder, x, z, self.materialHeight + 1)
        self.offsetg1(gcodeBuilder, x, z, self.materialHeight - self.millingDepth)

    def stopMilling(self, gcodeBuilder, x, z):
        self.offsetg0(gcodeBuilder, x, z, self.materialHeight + 1)
    
    def makeLine(self, line):
        gcodeBuilder = GrblGcodeBuilder()

        xStart = float(line.values["x1"])
        zStart = float(line.values["y1"])
        xEnd = float(line.values["x2"])
        zEnd = float(line.values["y2"])

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

        resultPoint = numpy.array([0.0, 0.0])
        n = len(points) - 1
        for i in range(len(points)):
            resultPoint += points[i] * self.comb(n, i) * numpy.power(1 - t, n - i) * numpy.power(t, i)

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
            
            if isinstance(command, self.PathCommand.LINE.value):
                self.makePathLine(gcodeBuilder, command)

            elif isinstance(command, self.PathCommand.QUAD_BEZIER.value):
                self.makeQuadBezier(gcodeBuilder, command)

            elif isinstance(command, self.PathCommand.CUBIC_BEZIER.value):
                self.makeCubicBezier(gcodeBuilder, command)

            elif isinstance(command, self.PathCommand.ARC.value):
                # TODO
                self.makeArc(gcodeBuilder, command)

        xEnd = parsedDString[-1].end.real
        zEnd = parsedDString[-1].end.imag
        self.stopMilling(gcodeBuilder, xEnd, zEnd)

        return gcodeBuilder

    # dosn't handle rounded corners
    def makeRect(self, rect):
        gcodeBuilder = GrblGcodeBuilder()

        xStart = float(rect.implicit_x)
        zStart = float(rect.implicit_y)
        width = float(rect.values["width"])
        height = float(rect.values["height"])
        print(xStart, zStart, width, height)

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
        gcodeBuilder = GrblGcodeBuilder()

        xCenter = circle.values["cx"]
        zCenter = circle.values["xy"]
        radius = circle.values["r"]

        xStart = xCenter * (radius * numpy.cos(numpy.pi))
        zStart = zCenter * (radius * numpy.sin(numpy.pi))

        xEnd = xCenter * (radius * numpy.cos(0))
        zEnd = zCenter * (radius * numpy.sin(0))

        iStart = (xCenter - (radius * numpy.cos(numpy.pi))) - xCenter
        jStart = (zCenter - (radius * numpy.sin(numpy.pi))) - zCenter

        iEnd = (xCenter - (radius * numpy.cos(0))) - xCenter
        jEnd = (zCenter - (radius * numpy.sin(0))) - zCenter

        
        y = self.materialHeight - self.millingDepth

        self.startMilling(gcodeBuilder, xStart, zStart)

        self.offsetg2(gcodeBuilder, xEnd, zEnd, y, iStart, jStart)
        self.offsetg2(gcodeBuilder, xStart, zStart, y, iEnd, jEnd)

        self.stopMilling(gcodeBuilder, xStart, zStart)

        return gcodeBuilder
    
    def getPointOnEllipse(self, rx, ry, angle):
        return (
            rx * numpy.cos(angle),
            ry * numpy.sin(angle)
        )

    def makeEllipse(self, ellipse):
        gcodeBuilder = GrblGcodeBuilder()

        center = ellipse.implicit_center

        xCenter = float(center[0])
        zCenter = float(center[1])
        rx = float(ellipse.values["rx"])
        ry = float(ellipse.values["ry"])

        points = []
        i = 0
        while i < 2 * numpy.pi:
            point = self.getPointOnEllipse(rx, ry, i)
            points.append((point[0] + xCenter, point[1] + zCenter))
            i += numpy.pi / 180
        
        self.startMilling(gcodeBuilder, points[0][0], points[0][1])
        
        for i in range(1, len(points)):
            self.millLine(gcodeBuilder, points[i][0], points[i][1])
        
        self.stopMilling(gcodeBuilder, points[-1][0], points[-1][1])

        return gcodeBuilder


    def saveToTmp(self, data):
        svgPath = str(Util.getDataFilePath("tmp.svg"))
        with open(svgPath, 'w') as file:
            file.write(data)
        return svgPath

    # makes gcode for outline of svg elments (ignores fill)
    # data must be path to .svg file
    def makeGcode(self, data=None, action=None, tool=None, material=None, objectOptions=None) -> GrblGcodeBuilder:
        self.toolWidth = int(tool.getFieldValue("width"))
        self.toolLength = int(tool.getFieldValue("length"))
        self.materialHeight = int(material.height)

        desiredDepth = int(action.getFieldValue("depth"))
        self.millingDepth = min(int(tool.getFieldValue("length")), desiredDepth)#int(action.getFieldValue("depth"))
        # self.curveSmoothness = ?

        self.xOffset = int(objectOptions["position"]["x"])
        self.zOffset = int(objectOptions["position"]["z"])
        
        mainGcodeBuilder = GrblGcodeBuilder()

        # reify = True applies all transforms
        # width, height, viewBox can be changed but at your own risk
        parsedSvg = SVG.parse(self.saveToTmp(data), reify=True)

        while True:

            for element in parsedSvg.elements():
                print(element)
                gcodeBuilder = None
                if isinstance(element, Line) or isinstance(element, SimpleLine):
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

                # temp solution change later!!!!
                mainGcodeBuilder.g0(x = 0, z = 0, y = self.materialHeight + 1)

            self.usedG1Points = {}

            if self.millingDepth >= desiredDepth:
                break

            self.millingDepth = min(self.millingDepth + self.toolLength, desiredDepth)
            

        return mainGcodeBuilder
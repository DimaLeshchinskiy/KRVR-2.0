from core import GrblGcodeBuilder
from svgelements import *
import numpy

class SvgActionProcess:

    def __init__(self):
        self.toolWidth = None
        self.toolLength = None
        self.materialHeight = None
        self.millingDepth = None
        self.xOffset = 0
        self.zOffset = 0

    def offsetg0(self, gcodeBuilder, x, z, y):
        gcodeBuilder.g0(x = x + self.xOffset, z = z + self.zOffset, y = y)

    def offsetg1(self, gcodeBuilder, x, z, y):
        gcodeBuilder.g1(x = x + self.xOffset, z = z + self.zOffset, y = y)
    
    def makeLine(self, line):
        gcodeBuilder = GrblGcodeBuilder()

        xStart = line.values["x1"]
        zStart = line.values["y1"]
        xEnd = line.values["x2"]
        zEnd = line.values["y2"]

        self.offsetg0(gcodeBuilder, xStart, zStart, self.materialHeight + 1)

        self.millLine(gcodeBuilder, xStart, zStart, xEnd, zEnd)

        return gcodeBuilder
    
    def millLine(self, gcodeBuilder, xStart, zStart, xEnd, zEnd, y = None):
        if y is None:
            y = self.materialHeight - self.millingDepth

        self.offsetg1(gcodeBuilder, xStart, zStart, y)
        self.offsetg1(gcodeBuilder, xEnd, zEnd, y)

    def makePolyline(self, polyline):
        gcodeBuilder = GrblGcodeBuilder()

        points = polyline.values["points"].split(" ")
        xStart, zStart = points[0].split(",")

        self.offsetg0(gcodeBuilder, xStart, zStart, self.materialHeight + 1)

        for i in range(len(points) - 1):
            xStart, zStart = points[i].split(",")
            xEnd, zEnd = points[i + 1].split(",")

            self.millLine(gcodeBuilder, xStart, zStart, xEnd, zEnd)

        return gcodeBuilder

    def makePath(self, path):
        pass

    def makeRect(self, rect):
        pass

    def makePolygon(self, polygon):
        pass

    def makeCircle(self, circle):
        pass

    def makeEllipse(self, ellipse):
        pass

    # data must be path to .svg file
    def makeGcode(self, data=None, action=None, tool=None, material=None, objectOptions=None) -> GrblGcodeBuilder:
        self.toolWidth = tool.getFieldValue("width")
        self.toolLength = tool.getFieldValue("length")
        self.materialHeight = material.height
        # self.millingDepth = ?
        # self.xOffset = ?
        # self.zOffset = ?
        
        mainGcodeBuilder = GrblGcodeBuilder()

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
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
    
    def makeLine(line):
        pass
    
    def makePolyline(polyline):
        pass

    def makePath(path):
        pass

    def makeRect(rect):
        pass

    def makePolygon(polygon):
        pass

    def makeCircle(circle):
        pass

    def makeEllipse(ellipse):
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
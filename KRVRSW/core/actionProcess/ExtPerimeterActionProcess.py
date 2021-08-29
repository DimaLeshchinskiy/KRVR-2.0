from core import GrblGcodeBuilder
from util import ShapelyUtil
from shapely.geometry import Polygon, LineString, MultiLineString

class ExtPerimeterActionProcess:
    def __init__(self):
        self.toolWidth = 0
        self.toolLength = 0
        self.wallOffset = 0

        self.objectX = 0
        self.objectY = 0
        self.objectZ = 0

    def getLines(self, polygon):
        lines = []

        exterior = polygon.exterior

        minOffset = self.toolWidth / 2
        currentOffset = self.wallOffset - self.toolWidth / 2
        currentOffset += self.toolWidth
        while currentOffset >= self.toolWidth / 2:
            currentOffset -= self.toolWidth
            if currentOffset < minOffset:
                lines.append(exterior.parallel_offset(minOffset, side="left", join_style=2).coords)
                break
            else:
                lines.append(exterior.parallel_offset(currentOffset, side="left", join_style=2).coords)
        return lines

    def milling(self, y, lines):
        mainGcodeBuilder = GrblGcodeBuilder()

        firstPoint = lines[0][0]
        oneLayerUpY = y + self.toolLength
        mainGcodeBuilder.g0(x=self.objectX + firstPoint[0], y=oneLayerUpY, z=self.objectZ + firstPoint[1]).g1(y=y)

        for line in lines:
            for point in line:
                mainGcodeBuilder.g1(x=self.objectX + point[0], z=self.objectZ + point[1])

        return mainGcodeBuilder

    def makeGcode(self, action=None, tool=None, material=None, objectOptions=None) -> GrblGcodeBuilder:
        mainGcodeBuilder = GrblGcodeBuilder()

        self.toolWidth = tool.getFieldValue("width")
        self.toolLength = tool.getFieldValue("length")
        self.wallOffset = int(action.getFieldValue("offset"))

        self.objectX = objectOptions["position"]["x"]
        self.objectY = objectOptions["position"]["y"]
        self.objectZ = objectOptions["position"]["z"]

        face = action.getSelectedFace("pocket_face")
        minY = int(action.getFieldValue("minY"))

        polygon = ShapelyUtil.getUnionPolygon(face)
        lines = self.getLines(polygon)

        currentHeight = int(action.getFieldValue("maxY"))
        while currentHeight > minY:
            currentHeight -= self.toolLength
            if currentHeight > minY:
                mainGcodeBuilder.appendBuilder(self.milling(currentHeight, lines), comment="Exterior perimeter on y=" + str(currentHeight))
            else:
                mainGcodeBuilder.appendBuilder(self.milling(minY, lines), comment="Exterior perimeter on y=" + str(minY))
            
        return mainGcodeBuilder
from core import GrblGcodeBuilder
from util import ShapelyUtil
from shapely.geometry import Polygon, LineString, MultiLineString, MultiPolygon

class PocketActionProcess:
    def __init__(self):
        self.toolWidth = 0
        self.toolLength = 0
        self.wallOffset = 0

        self.objectX = 0
        self.objectY = 0
        self.objectZ = 0

    def applyOffset(self, polygon):
        exterior = polygon.exterior
        interiors = polygon.interiors

        exteriorOffset = exterior.parallel_offset(self.wallOffset, side="right", join_style=2)
        newPolygon = Polygon(exteriorOffset.coords)

        for interior in interiors:
            interiorsOffset = interior.buffer(self.wallOffset, join_style=2).exterior
            if interiorsOffset.coords:
                interiorPolygon = Polygon(interiorsOffset.coords)
                newPolygon = newPolygon.difference(interiorPolygon)

        return ShapelyUtil.mergePolygons(newPolygon)

    def sortPointsByZ(self, points):
        sortFunc = lambda el: el[1] 
        points.sort(key=sortFunc)

    def getLines(self, multiPolygon):
        x0 = multiPolygon.bounds[0]
        z0 = multiPolygon.bounds[1]
        x1 = multiPolygon.bounds[2]
        z1 = multiPolygon.bounds[3]

        lineCoords = []
        currentX = x0 + self.toolWidth / 2
        currentX -= self.toolWidth # just for first iteration

        while currentX < x1:
            currentX += self.toolWidth
            line = LineString([(currentX, z0), (currentX, z1)])
            if currentX > x1:
                line = LineString([(x1, z0), (x1, z1)])

            coords = []
            for polygon in multiPolygon:
                intersection = polygon.intersection(line)
                if type(intersection) == LineString:
                    coords += intersection.coords
                elif type(intersection) == MultiLineString:
                    for lineString in intersection:
                        coords += lineString.coords

            self.sortPointsByZ(coords)
            lineCoords.append(coords)

        return lineCoords

    def milling(self, y, lines):
        mainGcodeBuilder = GrblGcodeBuilder()

        oneLayerUpY = y + self.toolLength

        for line in lines:
            startPoint = line[0]
            mainGcodeBuilder.g0(x=startPoint[0] + self.objectX, y=oneLayerUpY, z=startPoint[1] + self.objectZ).g1(y=y)

            for pointer in range(0, len(line)):
                if pointer + 1 == len(line):
                    break
                
                pointA = line[pointer + 0]
                pointB = line[pointer + 1]

                if pointer % 2 == 0:
                    mainGcodeBuilder.g0(x=pointB[0] + self.objectX, y=oneLayerUpY, z=pointB[1] + self.objectZ).g1(y=y)
                else:
                    mainGcodeBuilder.g1(x=pointB[0] + self.objectX, y=y, z=pointB[1] + self.objectZ).g0(y=oneLayerUpY)

        return mainGcodeBuilder

    def makeGcode(self, action=None, tool=None, material=None, objectOptions=None) -> GrblGcodeBuilder:
        mainGcodeBuilder = GrblGcodeBuilder()

        self.toolWidth = int(tool.getFieldValue("width"))
        self.toolLength = int(tool.getFieldValue("length"))
        self.wallOffset = int(action.getFieldValue("offset"))

        self.objectX = objectOptions["position"]["x"]
        self.objectY = objectOptions["position"]["y"]
        self.objectZ = objectOptions["position"]["z"]

        faces = action.getSelectedFace("pocket_face")
        minLayerY = ShapelyUtil.getHeightOfFace(faces)
        polygon = ShapelyUtil.getUnionPolygon(faces)

        multiPolygon = self.applyOffset(polygon)
        if type(multiPolygon) == Polygon:
            multiPolygon = MultiPolygon([multiPolygon])
        # ShapelyUtil.view(polygon, multiPolygon)

        lines = self.getLines(multiPolygon)

        currentHeight = int(action.getFieldValue("heightFrom"))
        while currentHeight > minLayerY:
            currentHeight -= self.toolLength
            if currentHeight > minLayerY:
                mainGcodeBuilder.appendBuilder(self.milling(currentHeight, lines), comment="2D pocket on y=" + str(currentHeight))
            else:
                mainGcodeBuilder.appendBuilder(self.milling(minLayerY, lines), comment="2D Pocket on y=" + str(minLayerY))
            
        return mainGcodeBuilder
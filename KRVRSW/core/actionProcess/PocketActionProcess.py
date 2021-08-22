from core import GrblGcodeBuilder
from shapely.geometry import Polygon, LineString, MultiLineString
from shapely.ops import unary_union
import matplotlib.pyplot as plt

class PocketActionProcess:
    def __init__(self):
        self.toolWidth = 0
        self.toolLength = 0
        self.wallOffset = 0

    def getHeightOfFace(self, face):
        positionPoints = face["position"]["array"]
        return positionPoints[1]

    def getUnionPolygon(self, face):
        positionPoints = face["position"]["array"]
        polygons = []
        points = []

        for pointer in range(0, len(positionPoints), 3):
            x = positionPoints[pointer + 0]
            y = positionPoints[pointer + 1] # y is same in each pocket; unused
            z = positionPoints[pointer + 2]
            points.append((x, z))
        
        for pointer in range(0, len(points), 3):
            a = points[pointer + 0]
            b = points[pointer + 1]
            c = points[pointer + 2]
            polygons.append(Polygon([a, b, c]))
            
        return self.mergePolygons(polygons)

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

        return self.mergePolygons(newPolygon)

    def mergePolygons(self, polygons):
        return unary_union(polygons)

    # def view(self, polygon, multipolygon):
    #     x, y = polygon.exterior.xy
    #     plt.plot(x, y, c="red")
    #     interiors = polygon.interiors

    #     for interior in interiors:
    #         x, y = interior.xy
    #         plt.plot(x, y, c="red")

    #     for polygonOffset in multipolygon:
    #         x, y = polygonOffset.exterior.xy
    #         plt.plot(x, y, c="green")
    #         interiors = polygonOffset.interiors

    #         for interior in interiors:
    #             x, y = interior.xy
    #             plt.plot(x, y, c="green")

    #     plt.show()

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
            mainGcodeBuilder.g0(x=startPoint[0], y=oneLayerUpY, z=startPoint[1]).g1(y=y)

            for pointer in range(0, len(line)):
                if pointer + 1 == len(line):
                    break
                
                pointA = line[pointer + 0]
                pointB = line[pointer + 1]

                if pointer % 2 == 0:
                    mainGcodeBuilder.g0(x=pointB[0], y=oneLayerUpY, z=pointB[1]).g1(y=y)
                else:
                    mainGcodeBuilder.g1(x=pointB[0], y=y, z=pointB[1]).g0(y=oneLayerUpY)

        return mainGcodeBuilder

    def makeGcode(self, action=None, tool=None, material=None, objectOptions=None) -> GrblGcodeBuilder:
        mainGcodeBuilder = GrblGcodeBuilder()

        self.toolWidth = tool.getFieldValue("width")
        self.toolLength = tool.getFieldValue("length")
        self.wallOffset = action.getFieldValue("offset")

        face = action.getSelectedFace()
        minLayerY = self.getHeightOfFace(face)
        polygon = self.getUnionPolygon(face)

        multiPolygon = self.applyOffset(polygon)
        # self.view(polygon, multiPolygon)

        lines = self.getLines(multiPolygon)

        currentHeight = action.getFieldValue("heightFrom")
        while currentHeight > minLayerY:
            currentHeight -= self.toolLength
            if currentHeight > minLayerY:
                mainGcodeBuilder.appendBuilder(self.milling(currentHeight, lines), comment="2D pocket on y=" + str(currentHeight))
            else:
                mainGcodeBuilder.appendBuilder(self.milling(minLayerY, lines), comment="2D Pocket on y=" + str(minLayerY))
            
        return mainGcodeBuilder
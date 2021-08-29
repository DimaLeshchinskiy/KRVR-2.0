from shapely.geometry import Polygon
from shapely.ops import unary_union
import matplotlib.pyplot as plt

def getHeightOfFace(faces):
    positionPoints = faces[0]["position"]["array"]
    return positionPoints[1]

def getUnionPolygon(faces):
    polygons = []

    for face in faces:
        points = []
        positionPoints = face["position"]["array"]

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
        
    return mergePolygons(polygons)

def mergePolygons(polygons):
    return unary_union(polygons)

def view(polygon, multipolygon):
    x, y = polygon.exterior.xy
    plt.plot(x, y, c="red")
    interiors = polygon.interiors

    for interior in interiors:
        x, y = interior.xy
        plt.plot(x, y, c="red")

    for polygonOffset in multipolygon:
        x, y = polygonOffset.exterior.xy
        plt.plot(x, y, c="green")
        interiors = polygonOffset.interiors

        for interior in interiors:
            x, y = interior.xy
            plt.plot(x, y, c="green")

    plt.show()
from core import GrblGcodeBuilder

class FaceActionProcess:

    def __init__(self):
        self.toolWidth = 0

        self.x0 = 0
        self.z0 = 0
        self.x1 = 0
        self.z1 = 0

    def milling(self, y):
        mainGcodeBuilder = GrblGcodeBuilder()

        #go down to start point
        mainGcodeBuilder.g1(x=self.x0, z=self.z0, y=y)

        currentX = self.x0
        while currentX < self.x1:
            mainGcodeBuilder.g1(x=currentX, z=self.z1).g1(x=currentX, z=self.z0)
            currentX += self.toolWidth
            if currentX < self.x1:
                mainGcodeBuilder.g1(x=currentX, z=self.z0)
            else:
                mainGcodeBuilder.g1(x=self.x1, z=self.z0).g1(x=self.x1, z=self.z1)

        mainGcodeBuilder.g0(x=self.x0, z=self.z0)
        return mainGcodeBuilder

    def makeGcode(self, action=None, tool=None, material=None, objectOptions=None) -> GrblGcodeBuilder:
        mainGcodeBuilder = GrblGcodeBuilder()

        self.toolWidth = tool.getFieldValue("width")
        self.x0 = objectOptions["position"]["x"] + objectOptions["size"]["min"]["x"]
        self.z0 = objectOptions["position"]["z"] + objectOptions["size"]["min"]["z"]
        self.x1 = objectOptions["position"]["x"] + objectOptions["size"]["max"]["x"]
        self.z1 = objectOptions["position"]["z"] + objectOptions["size"]["max"]["z"]

        upLayerY = objectOptions["size"]["max"]["y"] * 2
        print(upLayerY)
        print(self.x0)
        print(self.z0)
        print(self.x1)
        print(self.z1)

        currentHeight = material.height
        mainGcodeBuilder.g0(x=self.x0, z=self.z0, y=currentHeight + 1)
        while currentHeight > upLayerY:
            currentHeight -= tool.getFieldValue("length")
            if currentHeight > upLayerY:
                mainGcodeBuilder.appendBuilder(self.milling(currentHeight), comment="Face on y=" + str(currentHeight))
            else:
                mainGcodeBuilder.appendBuilder(self.milling(upLayerY), comment="Face on y=" + str(upLayerY))
            
        return mainGcodeBuilder
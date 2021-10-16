from core import GrblGcodeBuilder

class SvgPathActionProcess:

    def __init__(self):
        pass

    def makeGcode(self, data=None, action=None, tool=None, material=None, objectOptions=None) -> GrblGcodeBuilder:
        mainGcodeBuilder = GrblGcodeBuilder()

        # TODO

        return mainGcodeBuilder
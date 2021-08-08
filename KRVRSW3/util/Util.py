import pathlib


def getDataFolderPath():
    workingDir = pathlib.Path(__file__).parent.resolve()
    dataDir = pathlib.Path(workingDir).parent.joinpath('data').resolve()
    return dataDir


def getDataFilePath(fileName):
    dataFolder = getDataFolderPath()
    dataFile = pathlib.Path(dataFolder).joinpath(fileName).resolve()
    return dataFile
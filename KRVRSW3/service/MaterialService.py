import sys

sys.path.append("..")

from model import Material

class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class MaterialService(metaclass=SingletonMeta):
    def create(self, json):
        material = Material()

        if json:
            material.x = json["x"]
            material.y = json["y"]
            material.z = json["z"]
            material.width = json["width"]
            material.height = json["height"]
            material.depth = json["depth"]

        return material
        

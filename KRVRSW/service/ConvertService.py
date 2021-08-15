from OCC.Core.STEPCAFControl import STEPCAFControl_Reader
from OCC.Core.IFSelect import IFSelect_RetDone, IFSelect_ItemsByEntity
from OCC.Core.STEPControl import STEPControl_Reader, STEPControl_Writer, STEPControl_AsIs
from OCC.Core.STEPCAFControl import STEPCAFControl_Reader
from OCC.Core.StlAPI import stlapi_Read, StlAPI_Writer
from OCC.Core.BRepMesh import BRepMesh_IncrementalMesh

import os, sys

sys.path.append("..")

from util import Util


class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class ConvertService(metaclass=SingletonMeta):
    def read_step_file(self, filename, as_compound=True, verbosity=True):
        """ read the STEP file and returns a compound
        filename: the file path
        verbosity: optional, False by default.
        as_compound: True by default. If there are more than one shape at root,
        gather all shapes into one compound. Otherwise returns a list of shapes.
        """
        if not os.path.isfile(filename):
            raise FileNotFoundError("%s not found." % filename)

        step_reader = STEPControl_Reader()
        status = step_reader.ReadFile(filename)

        if status == IFSelect_RetDone:  # check status
            if verbosity:
                failsonly = False
                step_reader.PrintCheckLoad(failsonly, IFSelect_ItemsByEntity)
                step_reader.PrintCheckTransfer(failsonly,
                                               IFSelect_ItemsByEntity)
            transfer_result = step_reader.TransferRoots()
            if not transfer_result:
                raise AssertionError("Transfer failed.")
            _nbs = step_reader.NbShapes()
            if _nbs == 0:
                raise AssertionError("No shape to transfer.")
            elif _nbs == 1:  # most cases
                return step_reader.Shape(1)
            elif _nbs > 1:
                print("Number of shapes:", _nbs)
                shps = []
                # loop over root shapes
                for k in range(1, _nbs + 1):
                    new_shp = step_reader.Shape(k)
                    if not new_shp.IsNull():
                        shps.append(new_shp)
                if as_compound:
                    compound, result = list_of_shapes_to_compound(shps)
                    if not result:
                        print(
                            "Warning: all shapes were not added to the compound"
                        )
                    return compound
                else:
                    print("Warning, returns a list of shapes.")
                    return shps
        else:
            raise AssertionError("Error: can't read file.")
        return None

    def write_stl_file(self,
                       a_shape,
                       filename,
                       mode="ascii",
                       linear_deflection=0.9,
                       angular_deflection=0.5):
        """ export the shape to a STL file
        Be careful, the shape first need to be explicitely meshed using BRepMesh_IncrementalMesh
        a_shape: the topods_shape to export
        filename: the filename
        mode: optional, "ascii" by default. Can either be "binary"
        linear_deflection: optional, default to 0.001. Lower, more occurate mesh
        angular_deflection: optional, default to 0.5. Lower, more accurate_mesh
        """
        if a_shape.IsNull():
            raise AssertionError("Shape is null.")
        if mode not in ["ascii", "binary"]:
            raise AssertionError("mode should be either ascii or binary")
        if os.path.isfile(filename):
            print("Warning: %s file already exists and will be replaced" %
                  filename)
        # first mesh the shape
        mesh = BRepMesh_IncrementalMesh(a_shape, linear_deflection, False,
                                        angular_deflection, True)
        # mesh.SetDeflection(0.05)
        mesh.Perform()
        if not mesh.IsDone():
            raise AssertionError("Mesh is not done.")

        stl_exporter = StlAPI_Writer()
        if mode == "ascii":
            stl_exporter.SetASCIIMode(True)
        else:  # binary, just set the ASCII flag to False
            stl_exporter.SetASCIIMode(False)
        stl_exporter.Write(a_shape, filename)

        if not os.path.isfile(filename):
            raise IOError("File not written to disk.")

    def convert(self, stepData):
        stepPath = str(Util.getDataFilePath("tmp.step"))
        stlPath = str(Util.getDataFilePath("tmp.stl"))
        with open(stepPath, 'w') as file:
            file.write(stepData)
        step = self.read_step_file(stepPath)
        self.write_stl_file(step, stlPath)

        stlData = None
        with open(stlPath, 'r') as file:
            stlData = file.read()

        return stlData

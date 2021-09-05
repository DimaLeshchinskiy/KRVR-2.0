import "./FileDrop.css";

import React, { useContext, useEffect } from "react";

import FileManager from "@managers/fileManager";
import { FileContext } from "@context/file";

function FileDrop(props) {
  const element = document.body;
  const { files, setFiles } = useContext(FileContext);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadFiles([...e.dataTransfer.files]);
      e.dataTransfer.clearData();
    }
  };

  const loadFiles = (list) => {
    const newFiles = [...files];
    list.forEach((file) => {
      let newFile = FileManager.load(file);
      if (newFile) newFiles.push(newFile);
    });
    setFiles(newFiles);
  };

  useEffect(() => {
    element.addEventListener("dragenter", handleDragIn);
    element.addEventListener("dragleave", handleDragOut);
    element.addEventListener("dragover", handleDrag);
    element.addEventListener("drop", handleDrop);
    return () => {
      element.removeEventListener("dragenter", handleDragIn);
      element.removeEventListener("dragleave", handleDragOut);
      element.removeEventListener("dragover", handleDrag);
      element.removeEventListener("drop", handleDrop);
    };
  });

  return <>{props.children}</>;
}

export default FileDrop;

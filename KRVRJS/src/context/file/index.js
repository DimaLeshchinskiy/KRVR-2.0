import React, { useState } from "react";

export const FileContext = React.createContext();

export const FileContextProvider = (props) => {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");

  const getSelectedFile = () => {
    return files.find((file) => file.id === selectedFileId);
  };

  return (
    <FileContext.Provider
      value={{
        files: files,
        setFiles: setFiles,
        selectedFileId: selectedFileId,
        setSelectedFileId: setSelectedFileId,
        getSelectedFile: getSelectedFile,
      }}
    >
      {props.children}
    </FileContext.Provider>
  );
};

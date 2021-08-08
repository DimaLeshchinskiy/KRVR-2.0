import React, { useState } from "react";

export const FileContext = React.createContext();

export const FileContextProvider = (props) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});

  return (
    <FileContext.Provider
      value={{
        files: files,
        setFiles: setFiles,
        selectedFile: selectedFile,
        setSelectedFile: setSelectedFile,
      }}
    >
      {props.children}
    </FileContext.Provider>
  );
};

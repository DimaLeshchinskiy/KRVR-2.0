import './App.css';

import LeftBar from "./components/LeftBar/LeftBar.js";
import RightBar from "./components/RightBar/RightBar.js";
import MainSpace from "./components/MainSpace/MainSpace.js";
import FileDrop from "./components/FileDrop/FileDrop.js";

import React from 'react';

import {FileContextProvider} from "./context/file";

import useDebounce from "./hooks/useDebounce.js";

function App() {

/*
  const callAPI = async (value) => {
    console.log("HARD API");
  };

  const debouncedAPICall = useDebounce(callAPI, 500);

  const handleInputChange = async (e) => {
    debouncedAPICall(e.target.value);
  };
*/
  return (
    <FileContextProvider>
      <FileDrop>
          <LeftBar / >
          <MainSpace / >
          <RightBar / >
      </FileDrop>
    </FileContextProvider>
  );
}

export default App;

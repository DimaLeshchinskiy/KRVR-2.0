import "./App.css";

import LeftBar from "@components/LeftBar/LeftBar.js";
import RightBar from "@components/RightBar/RightBar.js";
import MainSpace from "@components/MainSpace/MainSpace.js";
import FileDrop from "@components/FileDrop/FileDrop.js";

import React from "react";

import { FileContextProvider } from "@context/file";
import { PortContextProvider } from "@context/port";
import { SocketContextProvider } from "@context/socket";

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
    <SocketContextProvider>
      <FileContextProvider>
        <PortContextProvider>
          <FileDrop>
            <LeftBar />
            <MainSpace />
            <RightBar />
          </FileDrop>
        </PortContextProvider>
      </FileContextProvider>
    </SocketContextProvider>
  );
}

export default App;

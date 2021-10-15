import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("/");

export const programStates = {
  RUN: 0,
  STOP: 1,
  PAUSE: 2,
};

export const SocketContext = React.createContext();

export const SocketContextProvider = (props) => {
  const [lines, setLines] = useState([]);
  const [programState, setProgramState] = useState(programStates.RUN);

  useEffect(() => {
    socket.off("addConsoleLine");
    socket.on("addConsoleLine", (line) => {
      setLines([...lines, line]);
    });
  });

  useEffect(() => {
    socket.off("onPause");
    socket.on("onPause", () => {
      console.log("onPause");
      setProgramState(programStates.PAUSE);
    });
  });

  useEffect(() => {
    socket.off("onStop");
    socket.on("onStop", () => {
      setProgramState(programStates.STOP);
    });
  });

  useEffect(() => {
    socket.off("onResume");
    socket.on("onResume", () => {
      setProgramState(programStates.RESUME);
    });
  });

  return (
    <SocketContext.Provider
      value={{
        lines: lines,
        setLines: setLines,
        programState: programState,
        setProgramState: setProgramState,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

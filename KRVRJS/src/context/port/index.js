import React, { useState } from "react";

export const PortContext = React.createContext();

export const PortContextProvider = (props) => {
  const [port, setPort] = useState(null);
  const [isConnected, setConnected] = useState(false);

  return (
    <PortContext.Provider
      value={{
        port: port,
        setPort: setPort,
        isConnected: isConnected,
        setConnected: setConnected,
      }}
    >
      {props.children}
    </PortContext.Provider>
  );
};

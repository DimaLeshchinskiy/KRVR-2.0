import "./ConsoleContainer.css";
import Accordion from "react-bootstrap/Accordion";
import React, { useState, useContext } from "react";

import { SocketContext } from "@context/socket";
import { PortContext } from "@context/port";

import { sendCommand } from "@managers/consoleManager";

function ConsoleContainer() {
  const { lines, setLines } = useContext(SocketContext);
  const { isConnected } = useContext(PortContext);

  const [cmd, setCmd] = useState("");
  const [show, setShow] = useState(false);

  const handleToogle = () => setShow(!show);

  const handleCmd = (e) => {
    setCmd(e.target.value);
  };

  const handleSend = () => {
    if (isConnected) sendCommand(cmd);
  };

  const handleClear = () => {
    setLines([]);
  };

  const getLines = () => {
    if (!isConnected)
      return <li class="list-group-item">Serial port is not selected</li>;

    if (lines.length === 0)
      return <li class="list-group-item">Console is empty</li>;

    return lines.map((line) => {
      return <li class="list-group-item">{line}</li>;
    });
  };

  return (
    <div class="console-container">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Console</Accordion.Header>
          <Accordion.Body>
            <ul class="list-group consoleLines">{getLines()}</ul>
            <div class="row justify-content-between mt-1">
              <div class="col-12 mt-2">
                <div class="input-group">
                  <div class="input-group-text">>_</div>
                  <input
                    type="text"
                    class="form-control"
                    id="inlineFormInputGroupUsername"
                    placeholder="Command"
                    value={cmd}
                    onChange={handleCmd}
                  />
                  <button
                    type="btn"
                    class="btn btn-primary"
                    onClick={handleSend}
                  >
                    Send
                  </button>
                  <button
                    type="btn"
                    class="btn btn-danger"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
    // <div class="console-container">
    //   <div>
    //     <h4>
    //       Console<button onClick={handleToogle}>BBB</button>
    //     </h4>
    //   </div>

    //   {show && (
    //     <>
    //       <hr /> <ul class="list-group consoleLines">{getLines()}</ul>
    //       <div class="row justify-content-between mt-1">
    //         <div class="col-12 mt-2">
    //           <div class="input-group">
    //             <div class="input-group-text">>_</div>
    //             <input
    //               type="text"
    //               class="form-control"
    //               id="inlineFormInputGroupUsername"
    //               placeholder="Command"
    //               value={cmd}
    //               onChange={handleCmd}
    //             />
    //             <button type="btn" class="btn btn-primary" onClick={handleSend}>
    //               Send
    //             </button>
    //             <button type="btn" class="btn btn-danger" onClick={handleClear}>
    //               Clear
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </>
    //   )}
    // </div>
  );
}

export default ConsoleContainer;

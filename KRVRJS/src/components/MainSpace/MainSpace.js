import "./MainSpace.css";
import ThreeRender from "../ThreeRender/view.js";
import GhostButtonsUp from "../GhostButtonsUp/GhostButtonsUp.js";
import GhostButtonsDown from "../GhostButtonsDown/GhostButtonsDown.js";

import React, { useState } from "react";

function MainSpace() {
  const [is2D, setIs2D] = useState(false);
  const [editTool, setEditTool] = useState("translate");

  return (
    <div>
      <GhostButtonsUp
        is2D={is2D}
        editTool={editTool}
        setIs2D={setIs2D}
        setEditTool={setEditTool}
      />

      <GhostButtonsDown
        position={[0.0, 0.0, 0.0]}
        rotation={[0.0, 0.0, 0.0]}
        scale={[0.0, 0.0, 0.0]}
      />

      <ThreeRender
        is2D={is2D}
        editTool={editTool}
        setIs2D={setIs2D}
        setEditTool={setEditTool}
      />
    </div>
  );
}

export default MainSpace;

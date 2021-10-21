import "./RightBar.css";

import FileExplorer from "@components/FileExplorer/FileExplorer.js";
import JogControl from "@components/JogControl/JogControl.js";
import ToastContainer from "@components/ToastContainer/ToastContainer.js";
import ConsoleContainer from "@components/ConsoleContainer/ConsoleContainer.js";

function RightBar() {
  return (
    <div class="navigationPanel">
      <ToastContainer />
      <ConsoleContainer />
      <div class="rightBar">
        <FileExplorer />
        <JogControl />
      </div>
    </div>
  );
}

export default RightBar;

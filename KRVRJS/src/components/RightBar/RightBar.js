import "./RightBar.css";

import FileExplorer from "@components/FileExplorer/FileExplorer.js";
import JogControl from "@components/JogControl/JogControl.js";
import ToastContainer from "@components/ToastContainer/ToastContainer.js";

function RightBar() {
  return (
    <div class="navigationPanel">
      <ToastContainer />
      <div class="rightBar">
        <FileExplorer />
        <JogControl />
      </div>
    </div>
  );
}

export default RightBar;

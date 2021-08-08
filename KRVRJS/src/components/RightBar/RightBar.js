import "./RightBar.css";

import FileExplorer from "../FileExplorer/FileExplorer.js";
import JogControl from "../JogControl/JogControl.js";

function RightBar() {
  return (
    <div class="rightBar">
      <FileExplorer />
      <JogControl />
    </div>
  );
}

export default RightBar;

import './GhostButtonsDown.css';

function GhostButtonsDown(props) {
  return (
    <div class="ghostButtonsDown">
      <button type="button" class="btn btn-dark btn-sm">
        Postion: {props.position.join(" | ") + " "}
        Rotation: {props.rotation.join(" | ") + " "}
        Scale: {props.scale.join(" | ")}
      </button>
    </div>
  );
}

export default GhostButtonsDown;

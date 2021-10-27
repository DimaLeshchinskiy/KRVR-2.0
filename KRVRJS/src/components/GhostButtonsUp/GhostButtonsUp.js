import "./GhostButtonsUp.css";

function GhostButtonsUp({
  is2D,
  setIs2D,
  editTool,
  setEditTool,
  unit,
  setUnit,
}) {
  const handleUnitChange = (value) => {
    value = parseInt(value);
    if (isNaN(value) || value == 0) value = 1;
    else if (value < 0) value = Math.abs(value);
    else if (value > 1000) value = 1000;
    setUnit(value);
  };

  return (
    <div className="ghostButtonsUp">
      <div className="btn-group" role="group" aria-label="Basic example">
        <input
          type="radio"
          className="btn-check"
          name="btnradio1"
          id="btnradio11"
          autoComplete="off"
          checked={is2D}
        />
        <label
          onClick={() => setIs2D(true)}
          className="btn btn-secondary btn-sm"
        >
          2D
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio1"
          id="btnradio12"
          autoComplete="off"
          checked={!is2D}
        />
        <label
          onClick={() => setIs2D(false)}
          className="btn btn-secondary btn-sm"
        >
          3D
        </label>
      </div>

      <div className="btn-group" role="group" aria-label="Basic example">
        <input
          type="radio"
          className="btn-check"
          name="btnradio3"
          id="btnradio31"
          autoComplete="off"
          checked={editTool === "translate"}
        />
        <label
          onClick={() => setEditTool("translate")}
          className="btn btn-secondary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrows-move"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"
            />
          </svg>
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio3"
          id="btnradio32"
          autoComplete="off"
          checked={editTool === "rotate"}
        />
        <label
          onClick={() => setEditTool("rotate")}
          className="btn btn-secondary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-repeat"
            viewBox="0 0 16 16"
          >
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
            <path
              fillRule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
            />
          </svg>
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio3"
          id="btnradio33"
          autoComplete="off"
          checked={editTool === "scale"}
        />
        <label
          onClick={() => setEditTool("scale")}
          className="btn btn-secondary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrows-fullscreen"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"
            />
          </svg>
        </label>
      </div>

      <div className="btn-group unitScale">
        <div class="input-group input-group-sm">
          <span class="input-group-text btn-secondary" id="basic-addon1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-rulers"
              viewBox="0 0 16 16"
            >
              <path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-1H2v-1h4v-1H4v-1h2v-1H2v-1h4V9H4V8h2V7H2V6h4V2h1v4h1V4h1v2h1V2h1v4h1V4h1v2h1V2h1v4h1V1a1 1 0 0 0-1-1H1z" />
            </svg>
            &nbsp; 1:
          </span>
          <input
            class="form-control"
            list="datalistOptions"
            id="exampleDataList"
            type="number"
            value={unit}
            onChange={(e) => handleUnitChange(e.target.value)}
            min="1"
            max="1000"
            step="1"
          />
          <datalist id="datalistOptions">
            <option value="1">Millimeters</option>
            <option value="10">Centimeters</option>
            <option value="100">Decimeters</option>
            <option value="1000">Meters</option>
          </datalist>
        </div>
      </div>
    </div>
  );
}

export default GhostButtonsUp;

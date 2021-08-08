import "./JogControl.css";

import { useState } from "react";

export default function JogControl(props) {
  const [feed, setFeed] = useState(0);
  const [step, setStep] = useState(0);
  const [intensity, setIntensity] = useState(0);

  const jogMove = (object) => {
    const moveObject = {
      x: object.x || 0,
      y: object.y || 0,
      z: object.z || 0,
    };
    console.log(moveObject);
  };

  const handleFeedChange = (e) => {
    let data = e.target.value;
    setFeed(Number.parseFloat(data));
  };

  const handleStepChange = (e) => {
    console.log(e);
    const data = e.target.value;
    setStep(Number.parseFloat(data));
  };

  const handleIntensityChange = (e) => {
    console.log(e);
    const data = e.target.value;
    setIntensity(Number.parseFloat(data));
  };

  return (
    <div class="tab controls">
      <div
        class="btn-group col-11 mx-auto"
        role="group"
        aria-label="Basic example"
      >
        <button class="btn btn-primary btn-sm" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-lock-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          </svg>
          Unlock
        </button>
        <button type="button" class="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-house-fill"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 3.293l6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
            />
            <path
              fill-rule="evenodd"
              d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
            />
          </svg>
          Home
        </button>
        <button type="button" class="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-bullseye"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
            <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
          Origin
        </button>
      </div>

      <div
        class="btn-group col-8 mx-auto"
        role="group"
        aria-label="Basic outlined example"
      >
        <button
          onClick={() => {
            jogMove({
              x: -1,
              y: 1,
            });
          }}
          type="button"
          class="btn btn-outline-primary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-up-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M2 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H3.707l10.147 10.146a.5.5 0 0 1-.708.708L3 3.707V8.5a.5.5 0 0 1-1 0v-6z"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            jogMove({
              y: 1,
            });
          }}
          type="button"
          class="btn btn-outline-primary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-up"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            jogMove({
              x: 1,
              y: 1,
            });
          }}
          type="button"
          class="btn btn-outline-primary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-up-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
            />
          </svg>
        </button>
      </div>

      <div
        class="btn-group col-8 mx-auto"
        role="group"
        aria-label="Basic outlined example"
      >
        <button
          onClick={() => {
            jogMove({
              x: -1,
            });
          }}
          type="button"
          class="btn btn-outline-primary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
        </button>
        <button type="button" class="btn btn-outline-primary btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-power"
            viewBox="0 0 16 16"
          >
            <path d="M7.5 1v7h1V1h-1z" />
            <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z" />
          </svg>
        </button>
        <button
          onClick={() => {
            jogMove({
              x: 1,
            });
          }}
          type="button"
          class="btn btn-outline-primary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
            />
          </svg>
        </button>
      </div>

      <div
        class="btn-group col-8 mx-auto"
        role="group"
        aria-label="Basic outlined example"
      >
        <button
          onClick={() => {
            jogMove({
              x: -1,
              y: -1,
            });
          }}
          type="button"
          class="btn btn-outline-primary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-down-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            jogMove({
              y: -1,
            });
          }}
          type="button"
          class="btn btn-outline-primary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-down"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            jogMove({
              x: 1,
              y: -1,
            });
          }}
          type="button"
          class="btn btn-outline-primary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-down-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M14 13.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1 0-1h4.793L2.146 2.854a.5.5 0 1 1 .708-.708L13 12.293V7.5a.5.5 0 0 1 1 0v6z"
            />
          </svg>
        </button>
      </div>

      <div
        class="btn-group col-8 mx-auto"
        role="group"
        aria-label="Basic outlined example"
      >
        <button
          onClick={() => {
            jogMove({
              z: -1,
            });
          }}
          type="button"
          class="btn btn-outline-primary btn-sm"
        >
          Z-
        </button>
        <button
          onClick={() => {
            jogMove({
              z: 1,
            });
          }}
          type="button"
          class="btn btn-outline-primary btn-sm"
        >
          Z+
        </button>
      </div>

      <div class="row g-2 mx-auto">
        <div class="col-md">
          <div class="form-floating">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              class="form-control"
              id="floatingInputGrid"
              placeholder="f"
              value={feed}
              onChange={handleFeedChange}
            />
            <label for="floatingInputGrid">Feed</label>
          </div>
        </div>

        <div class="col-md">
          <div class="form-floating">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              class="form-control"
              id="floatingInputGrid"
              placeholder="f"
              value={step}
              onChange={handleStepChange}
            />
            <label for="floatingInputGrid">Step</label>
          </div>
        </div>

        <div class="col-md">
          <div class="form-floating">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              class="form-control"
              id="floatingInputGrid"
              placeholder="f"
              value={intensity}
              onChange={handleIntensityChange}
            />
            <label for="floatingInputGrid">Intensity</label>
          </div>
        </div>
      </div>
    </div>
  );
}

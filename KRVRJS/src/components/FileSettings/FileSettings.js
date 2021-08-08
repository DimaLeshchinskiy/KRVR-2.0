import config from "./config.js";
import { useState } from "react";
import React from "react";

export default function FileSettings(props) {
  const [settingId, setSettingId] = useState(config[0].id);
  const selectedFile = props.selectedFile;

  const onButtonClick = function (id) {
    if (settingId === id) return;
    setSettingId(id);
  };

  if (!selectedFile.id)
    return (
      <>
        <div class="tab emptyExplorer">
          <div>
            <p class="fw-light">Select one of imported files first</p>
          </div>
        </div>
        <hr />
      </>
    );

  return (
    <>
      <div class="fileInfo d-flex justify-content-around">
        <div
          class="nav flex-column nav-pills"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          {config.map((el, index) => {
            let clases = ["nav-link"];
            if (settingId === el.id) clases.push("active");

            return (
              <button
                class={clases.join(" ")}
                key={index}
                data-bs-toggle="pill"
                data-bs-target="#v-pills-home"
                type="button"
                role="tab"
                aria-controls="v-pills-home"
                aria-selected="true"
                data-panel-id={el.id}
                onClick={() => onButtonClick(el.id)}
              >
                {el.svg}
              </button>
            );
          })}
        </div>

        <div class="vertical_hr"></div>

        <div class="tab-content" id="v-pills-tabContent">
          {config.map((el, index) => {
            let clases = ["tab-pane", "fade"];
            if (settingId === el.id) clases.push("show", "active");
            return (
              <div
                class={clases.join(" ")}
                key={index}
                id={el.id}
                role="tabpanel"
                aria-labelledby="v-pills-home-tab"
              >
                {React.createElement(el.content, {
                  selectedFile: selectedFile,
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

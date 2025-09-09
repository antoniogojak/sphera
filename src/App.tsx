import React, { useRef } from "react";
import * as Cesium from "cesium";
import {
  FluentProvider,
  webLightTheme,
  createDarkTheme,
} from "@fluentui/react-components";
import Layers from "./Layers";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

const customTheme = {
  10: "#030303",
  20: "#171717",
  30: "#252525",
  40: "#313131",
  50: "#3D3D3D",
  60: "#494949",
  70: "#565656",
  80: "#636363",
  90: "#717171",
  100: "#7F7F7F",
  110: "#8D8D8D",
  120: "#9B9B9B",
  130: "#AAAAAA",
  140: "#B9B9B9",
  150: "#C8C8C8",
  160: "#D7D7D7",
};

const darkTheme = {
  ...createDarkTheme(customTheme),
};

darkTheme.colorBrandForeground1 = customTheme[110];
darkTheme.colorBrandForeground2 = customTheme[120];

const App: React.FC = () => {
  const viewerRef = useRef<any>(null);

  return (
    <FluentProvider
      theme={webLightTheme}
      style={{ height: "100vh", width: "100vw" }}
    >
      <div style={{ height: "100%", width: "100%" }}>
        <Layers
          viewerRef={viewerRef}
          manifestUrl="/assets/datasets/manifest.json"
        />
      </div>
    </FluentProvider>
  );
};

export default App;

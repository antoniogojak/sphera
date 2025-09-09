import React, { useEffect, useCallback, useRef } from "react";
import {
  Viewer as ResiumViewer,
  SkyAtmosphere,
  SkyBox,
  Scene,
  Sun,
  Moon,
  ScreenSpaceCameraController,
} from "resium";
import * as Cesium from "cesium";
import { resolveFluentTokenValue } from "../utils/resolveFluentTokenValue";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

type ViewerProps = {
  viewerRef: React.RefObject<any>;
  onViewerReady?: () => void;
};

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const CesiumViewer: React.FC<ViewerProps> = ({ viewerRef, onViewerReady }) => {
  // Set Cesium camera defaults
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    -180,
    -90,
    180,
    90
  );
  Cesium.Camera.DEFAULT_VIEW_FACTOR = 0.6;

  // Track initialization state (no re-render needed)
  const initializedRef = useRef(false);

  // Cesium initialization logic
  const applyCesiumSettings = useCallback(
    (viewer: any) => {
      if (!viewer || !viewer.scene) return;

      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString(
        resolveFluentTokenValue("colorNeutralBackground2")
      );
      viewer.scene.globe.showGroundAtmosphere = false;
      viewer.camera.moveDown(1500000);

      if (onViewerReady) onViewerReady();
      console.log("Cesium Viewer initialized");
    },
    [onViewerReady]
  );

  // Timer-based initialization: checks every 100ms until viewer is ready
  useEffect(() => {
    initializedRef.current = false;
    const interval = setInterval(() => {
      const viewer = viewerRef.current?.cesiumElement || viewerRef.current;
      if (viewer && viewer.scene && !initializedRef.current) {
        applyCesiumSettings(viewer);
        initializedRef.current = true;
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Determine controls based on device type
  const cameraControllerProps = isTouchDevice()
    ? {
        enableRotate: true,
        enableTilt: false,
        enableLook: false,
        enableTranslate: true,
        enableZoom: true,
      }
    : {
        enableRotate: true,
        enableTilt: true,
        enableLook: true,
        enableTranslate: true,
        enableZoom: true,
      };

  return (
    <div id="resium-container" style={{ position: "relative", height: "100%" }}>
      <ResiumViewer
        ref={viewerRef}
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        fullscreenButton={false}
        geocoder={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        navigationInstructionsInitiallyVisible={false}
        resolutionScale={1}
        useBrowserRecommendedResolution={true}
        // @ts-ignore
        imageryProvider={false}
      >
        <ScreenSpaceCameraController
          {...cameraControllerProps}
          minimumZoomDistance={800000}
          maximumZoomDistance={40000000}
        />
        <Sun show={false} />
        <Moon show={false} />
        <SkyBox show={false} />
        <Scene
          backgroundColor={Cesium.Color.fromCssColorString(
            resolveFluentTokenValue("colorNeutralBackground1")
          )}
        />
        <SkyAtmosphere
          show={true}
          atmosphereRayleighCoefficient={
            new Cesium.Cartesian3(100e-6, 100e-6, 0)
          }
          atmosphereMieAnisotropy={0.6}
          saturationShift={-1.0}
        />
      </ResiumViewer>
    </div>
  );
};

export default CesiumViewer;

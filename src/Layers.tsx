import React, { useEffect, useState, useRef, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import {
  Clock,
  JulianDate,
  ClockStep,
  ClockRange,
  SceneMode,
  ImageryLayer,
  Entity,
  GeoJsonDataSource,
} from "cesium";
import * as Cesium from "cesium";
import { makeStyles, tokens } from "@fluentui/react-components";
import { micaStyle } from "./components/Style";
import Header from "./components/Header";
import { parseHtmlOrString } from "./utils/parseHtmlOrString";
import { loadLayer } from "./layers/loadLayer";
import { applyClockSettings } from "./layers/applyClockSettings";
import CesiumViewer from "./components/CesiumViewer";
import Timeline from "./components/Timeline";
import Legend from "./components/Legend";
import { updateVideoSynchronizer } from "./utils/updateVideoSynchronizer";

const useStyles = makeStyles({
  root: {
    display: "grid",
    gridTemplateRows: "auto 1fr",
    gridTemplateColumns: "1.6fr 1fr",
    height: "100dvh",
    width: "100dvw",
    position: "relative",
  },
  header: {
    gridRow: "1 / 2",
    gridColumn: "1 / -1",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: tokens.spacingHorizontalS,
  },
  headerLeft: { display: "flex", gap: tokens.spacingHorizontalSNudge },
  headerRight: { display: "flex", gap: tokens.spacingHorizontalSNudge },
  viewer: {
    gridRow: "2 / 3",
    gridColumn: "1 / 2",
    position: "relative",
    overflow: "hidden",
    ...micaStyle,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    gridTemplateRows: "1fr auto",
    pointerEvents: "none",
    zIndex: 10,
  },
  legendArea: {
    gridColumn: "1 / 2",
    gridRow: "1 / 2",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    pointerEvents: "auto",
  },
  timelineArea: {
    gridColumn: "2 / 3",
    gridRow: "2 / 3",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    pointerEvents: "auto",
    height: "100%",
  },
  rightArea: {
    gridColumn: "3 / 4",
    gridRow: "2 / 3",
  },
});

export const createCesiumClock = (clockConfig: any) =>
  clockConfig
    ? new Clock({
        startTime: JulianDate.fromIso8601(clockConfig.startTime),
        stopTime: JulianDate.fromIso8601(clockConfig.stopTime),
        currentTime: JulianDate.fromIso8601(clockConfig.currentTime),
        multiplier: clockConfig.multiplier || 1,
        clockStep: typeof clockConfig.clockStep === "string"
          ? ClockStep[clockConfig.clockStep as keyof typeof ClockStep]
          : ClockStep.SYSTEM_CLOCK_MULTIPLIER,
        clockRange: typeof clockConfig.clockRange === "string"
          ? ClockRange[clockConfig.clockRange as keyof typeof ClockRange]
          : ClockRange.UNBOUNDED,
        canAnimate: clockConfig.canAnimate ?? true,
        shouldAnimate: clockConfig.shouldAnimate ?? true,
      })
    : null;

type Manifest = {
  default: string[];
  startup: string[];
  layers: string[];
};

type LayersProps = {
  viewerRef: React.RefObject<any>;
  manifestUrl: string;
};

type LayerProps = {
  key: string;
  type: string;
  title?: string;
  subtitle?: string;
  description?: string;
  credits?: { credit: string; showOnScreen: boolean } | undefined;
  releaseDate?: string;
  updateDate?: string;
  copyrightLicense?: string;
  category?: string;
  legend?: string;
  default?: boolean;
  clock?: any;
  timelineSync?: boolean;
};

const Layers: React.FC<LayersProps> = ({ viewerRef, manifestUrl }) => {
  const [layers, setLayers] = useState<LayerProps[]>([]);
  const [, setActiveLayer] = useState<LayerProps | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLayers, setActiveLayers] = useState<{
    [title: string]: boolean;
  }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [openTab, setOpenTab] = useState<string | null>(null);
  const [rotate, setRotate] = useState(false);
  const animationRef = useRef<number | null>(null);
  const [loadedLayers, setLoadedLayers] = useState<{ [key: string]: any }>({});
  const [sceneMode, setSceneMode] = useState(SceneMode.SCENE3D);
  const [showInfo, setShowInfo] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [activeLegendUrl, setActiveLegendUrl] = useState<string | null>(null);

  // Fetch manifest and layers
  useEffect(() => {
    if (!viewerReady) return;
    const fetchData = async () => {
      try {
        const manifest: Manifest = await fetch(manifestUrl).then((r) =>
          r.json()
        );
        const allLayers = await Promise.all(
          manifest.layers.map(async (folderName) => {
            try {
              const basePath = `/assets/datasets/${folderName}`;
              const propertiesUrl = `${basePath}/properties.json`;
              const properties = await fetch(propertiesUrl).then((r) =>
                r.json()
              );

              // Resolve URLs
              properties.url = new URL(
                properties.url,
                `${window.location.origin}${basePath}/`
              ).href;
              if (properties.czml)
                properties.czml = new URL(
                  properties.czml,
                  `${window.location.origin}${basePath}/`
                ).href;
              if (properties.legend) {
                if (typeof properties.legend === "string") {
                  properties.legend = new URL(
                    properties.legend,
                    `${window.location.origin}${basePath}/`
                  ).href;
                } else if (
                  typeof properties.legend === "object" &&
                  properties.legend.path
                ) {
                  properties.legend = {
                    ...properties.legend,
                    path: new URL(
                      properties.legend.path,
                      `${window.location.origin}${basePath}/`
                    ).href,
                  };
                }
              }
              if (properties.credits) {
                properties.credits = {
                  credit: parseHtmlOrString(
                    properties.credits.credit,
                    basePath
                  ),
                  showOnScreen: properties.credits.showOnScreen,
                };
              }
              ["title", "subtitle", "copyrightLicense", "description"].forEach(
                (field) => {
                  if (properties[field])
                    properties[field] = parseHtmlOrString(
                      properties[field],
                      basePath
                    );
                }
              );
              return { ...properties, key: folderName, type: properties.type ?? "default" };
            } catch (err) {
              console.error(
                `Failed to fetch properties.json for ${folderName}:`,
                err
              );
              return null;
            }
          })
        );
        // Mark default layers
        const validLayers = allLayers
          .filter(Boolean)
          .map((layer) =>
            manifest.default.includes(layer.key)
              ? { ...layer, default: true }
              : layer
          ) as LayerProps[];
        const viewer = viewerRef.current?.cesiumElement;
        if (viewer) {
          // Activate default layers (like startup layers)
          for (const layerKey of manifest.default) {
            const layer = validLayers.find((l) => l.key === layerKey);
            if (layer) {
              const loadedLayer = await loadLayer(viewer, { ...layer, type: (layer.type as any) });
              if (loadedLayer) {
                setLoadedLayers((prev) => ({
                  ...prev,
                  [layer.key]: loadedLayer,
                }));
                setActiveLayers((prev) => ({ ...prev, [layer.key]: true }));
                if (layer.legend) setActiveLegendUrl(layer.legend);
              }
            }
          }
          // Activate startup layers
          manifest.startup.forEach(async (layerKey) => {
            const layer = validLayers.find((l) => l.key === layerKey);
            if (layer) {
              const loadedLayer = await loadLayer(viewer, { ...layer, type: layer.type as any });
              if (loadedLayer) {
                setLoadedLayers((prev) => ({
                  ...prev,
                  [layer.key]: loadedLayer,
                }));
                setActiveLayers((prev) => ({ ...prev, [layer.key]: true }));
                if (layer.legend) setActiveLegendUrl(layer.legend);
              }
            }
          });
        }
        // Show all layers (including default) in sidebar and switcher
        setLayers(validLayers);
      } catch (err) {
        console.error("Error loading layers:", err);
      }
    };
    fetchData();
  }, [manifestUrl, viewerRef, viewerReady]);

  // Extract unique categories
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(layers.map((layer) => layer.category || "Default"))
    );
    setCategories(uniqueCategories);
    setOpenTab(uniqueCategories[0] || null);
  }, [layers]);

  // Toggle layer visibility and loading
  const toggleLayer = useCallback(
    async (layer: LayerProps) => {
      const viewer = viewerRef.current?.cesiumElement;
      if (!viewer) return;
      if (layer.default) return;

      let loadedLayer = loadedLayers[layer.key];
      if (!loadedLayer) {
        if (layer.clock && layer.timelineSync)
          applyClockSettings(viewer, layer.clock);
        loadedLayer = await loadLayer(viewer, { ...layer, type: (layer.type as any) });
        if (loadedLayer) {
          setLoadedLayers((prev) => ({ ...prev, [layer.key]: loadedLayer }));
          setActiveLayers((prev) => ({ ...prev, [layer.key]: true }));
          setActiveLayer(layer);
          if (layer.legend) setActiveLegendUrl(layer.legend);
          updateVideoSynchronizer({ layer, loadedLayer, viewer, enable: true });
        }
        return;
      }

      let newVisibility = false;
      if (loadedLayer instanceof ImageryLayer) {
        loadedLayer.show = !loadedLayer.show;
        newVisibility = loadedLayer.show;
        if (newVisibility) viewer.scene.imageryLayers.raiseToTop(loadedLayer);
      } else if (loadedLayer instanceof Entity) {
        loadedLayer.show = !loadedLayer.show;
        newVisibility = loadedLayer.show;
      } else if (loadedLayer instanceof GeoJsonDataSource) {
        const entities = loadedLayer.entities.values;
        newVisibility = !entities[0]?.show;
        entities.forEach((entity: any) => (entity.show = newVisibility));
      }
      if (loadedLayer.czmlDataSource) {
        const entities = loadedLayer.czmlDataSource.entities.values;
        if (entities.length > 0) {
          newVisibility = !entities[0]?.show;
          entities.forEach((entity: any) => (entity.show = newVisibility));
        }
      }

      if (newVisibility && layer.clock && layer.timelineSync) {
        applyClockSettings(viewer, layer.clock);
      }
      setActiveLayers((prev) => ({ ...prev, [layer.key]: newVisibility }));
      setActiveLayer(newVisibility ? layer : null);
      if (newVisibility && layer.legend) {
        setActiveLegendUrl(layer.legend);
      } else if (!newVisibility && activeLegendUrl === layer.legend) {
        const visibleWithLegend = layers
          .filter((l) => activeLayers[l.key] && l.legend && l.key !== layer.key)
          .pop();
          setActiveLegendUrl(visibleWithLegend && visibleWithLegend.legend != null ? visibleWithLegend.legend : null);

      }
      updateVideoSynchronizer({
        layer,
        loadedLayer,
        viewer,
        enable: newVisibility,
      });
    },
    [viewerRef, loadedLayers, layers, activeLayers, activeLegendUrl]
  );

  // Rotation logic
  useEffect(() => {
    if (!rotate) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer) return;
    let lastTime = performance.now();
    function animate(now: number) {
      if (!rotate) return;
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      if (sceneMode === SceneMode.SCENE3D) {
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, 0.2 * delta);
      } else if (sceneMode === SceneMode.SCENE2D) {
        viewer.scene.camera.moveRight(-1000000 * delta);
      }
      animationRef.current = requestAnimationFrame(animate);
    }
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [rotate, sceneMode, viewerRef]);

  const gridTemplateColumns = isSidebarOpen ? "1.6fr 1fr" : "1fr";
  const styles = useStyles();

  return (
    <div>
      <div
        className={styles.root}
        style={{
          gridTemplateColumns,
          backgroundColor: tokens.colorNeutralBackground3,
        }}
      >
        <div
          className={styles.viewer}
          style={{
            borderTopRightRadius: isSidebarOpen ? "10px" : "0",
            transition: "border-radius 0.3s",
          }}
        >
          <CesiumViewer
            viewerRef={viewerRef}
            onViewerReady={() => setViewerReady(true)}
          />
          <div className={styles.overlay}>
            <div className={styles.legendArea}>
              {showTimeline && activeLegendUrl && (
                // @ts-ignore
                <Legend legend={activeLegendUrl} />
              )}
            </div>
            <div className={styles.timelineArea}>
              {showTimeline && <Timeline viewerRef={viewerRef} />}
            </div>
            <div className={styles.rightArea}></div>
          </div>
        </div>
        {isSidebarOpen && (
          <Sidebar
            isOpen={isSidebarOpen}
            activeLayers={activeLayers}
            layers={layers}
            setIsOpen={setIsSidebarOpen}
            showInfo={showInfo}
          />
        )}
        <Header
          categories={categories}
          openTab={openTab}
          setOpenTab={setOpenTab}
          layers={layers}
          activeLayers={activeLayers}
          toggleLayer={toggleLayer}
          rotate={rotate}
          setRotate={setRotate}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          viewerRef={viewerRef}
          sceneMode={sceneMode}
          setSceneMode={setSceneMode}
          styles={{
            header: styles.header,
            headerLeft: styles.headerLeft,
            headerRight: styles.headerRight,
          }}
          showTimeline={showTimeline}
          setShowTimeline={setShowTimeline}
        />
      </div>
    </div>
  );
};

export default Layers;

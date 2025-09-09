import React from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import {
  MenuButton,
  Menu,
  MenuTrigger,
  MenuPopover,
  TabList,
  Tab,
  ToggleButton,
  Button,
  Tooltip,
} from "@fluentui/react-components";
import { tokens } from "@fluentui/react-theme";
import {
  LayerRegular,
  BezierCurveSquareRegular,
  ImageRegular,
  VideoClipRegular,
  SquareRegular,
  ArrowRotateCounterclockwiseRegular,
  HomeRegular,
  GlobeRegular,
  MapRegular,
  BookInformationRegular,
  NavigationRegular,
  DismissRegular,
  EyeRegular,
  EyeOffRegular,
} from "@fluentui/react-icons";

type HeaderProps = {
  categories: string[];
  openTab: string | null;
  setOpenTab: (tab: string) => void;
  layers: any[];
  activeLayers: { [key: string]: boolean };
  toggleLayer: (layer: any) => void;
  rotate: boolean;
  setRotate: React.Dispatch<React.SetStateAction<boolean>>;
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  viewerRef: React.RefObject<any>;
  sceneMode: number;
  setSceneMode: (mode: number) => void;
  showTimeline: boolean;
  setShowTimeline: React.Dispatch<React.SetStateAction<boolean>>;
  styles: { header: string; headerLeft: string; headerRight: string };
};

// Icon mapping for layer types
const layerTypeIcons: Record<string, JSX.Element> = {
  GeoJsonDataSource: <BezierCurveSquareRegular />,
  ImageMaterialProperty: <VideoClipRegular />,
  SingleTileImageryProvider: <ImageRegular />,
  TileMapServiceImageryProvider: <ImageRegular />,
  UrlTemplateImageryProvider: <ImageRegular />,
  WebMapTileServiceImageryProvider: <ImageRegular />,
};

function getLayerIcon(type: string) {
  return layerTypeIcons[type] || <SquareRegular />;
}

// Layers menu
const LayersMenu: React.FC<{
  categories: string[];
  openTab: string | null;
  setOpenTab: (tab: string) => void;
  layers: any[];
  activeLayers: { [key: string]: boolean };
  toggleLayer: (layer: any) => void;
  t: (key: string) => string;
}> = ({
  categories,
  openTab,
  setOpenTab,
  layers,
  activeLayers,
  toggleLayer,
  t,
}) => (
  <Menu>
    <Tooltip content={t("layers")} relationship="label">
      <MenuTrigger>
        <MenuButton icon={<LayerRegular />} appearance="primary" />
      </MenuTrigger>
    </Tooltip>
    <MenuPopover style={{ minWidth: "280px", maxWidth: "400px" }}>
      <div>
        <TabList
          selectedValue={openTab}
          onTabSelect={(_, data) => setOpenTab(data.value as string)}
        >
          {categories.map((category) => (
            <Tab key={category} value={category}>
              {category}
            </Tab>
          ))}
        </TabList>
        <div
          style={{
            marginTop: tokens.spacingHorizontalS,
            marginLeft: tokens.spacingHorizontalM,
            marginRight: tokens.spacingHorizontalM,
          }}
        >
          {layers
            .filter((layer) => layer.category === openTab)
            .map((layer) => (
              <div
                key={layer.key}
                style={{ marginBottom: tokens.spacingHorizontalS }}
              >
                <Button
                  appearance={activeLayers[layer.key] ? "primary" : "outline"}
                  icon={getLayerIcon(layer.type)}
                  onClick={() => toggleLayer(layer)}
                  style={{
                    justifyContent: "flex-start",
                    width: "100%",
                  }}
                  disabledFocusable={layer.default}
                >
                  {layer.title}
                </Button>
              </div>
            ))}
        </div>
      </div>
    </MenuPopover>
  </Menu>
);

// Scene mode button logic
const SceneModeButton: React.FC<{
  viewerRef: React.RefObject<any>;
  setSceneMode: (mode: number) => void;
  t: (key: string) => string;
}> = ({ viewerRef, setSceneMode, t }) => (
  <Tooltip content={t("sceneMode")} relationship="label">
    <Button
      icon={
        viewerRef.current?.cesiumElement?.scene.mode === 2 ? (
          <MapRegular />
        ) : (
          <GlobeRegular />
        )
      }
      onClick={() => {
        const viewer = viewerRef.current?.cesiumElement;
        if (viewer) {
          const currentMode = viewer.scene.mode;
          const newMode = currentMode === 2 ? 3 : 2;
          viewer.scene.mode = newMode;
          setSceneMode(newMode);
        }
      }}
    />
  </Tooltip>
);

const Header: React.FC<HeaderProps> = ({
  categories,
  openTab,
  setOpenTab,
  layers,
  activeLayers,
  toggleLayer,
  rotate,
  setRotate,
  showInfo,
  setShowInfo,
  isSidebarOpen,
  setIsSidebarOpen,
  viewerRef,
  setSceneMode,
  styles,
  showTimeline,
  setShowTimeline,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        {/* Layers Menu Button */}
        <LayersMenu
          categories={categories}
          openTab={openTab}
          setOpenTab={setOpenTab}
          layers={layers}
          activeLayers={activeLayers}
          toggleLayer={toggleLayer}
          t={t}
        />

        {/* Rotation Toggle */}
        <Tooltip content={t("rotation")} relationship="label">
          <ToggleButton
            icon={<ArrowRotateCounterclockwiseRegular />}
            checked={rotate}
            onClick={() => setRotate((prev) => !prev)}
          />
        </Tooltip>

        {/* Cesium Home Button */}
        <Tooltip content={t("home")} relationship="label">
          <Button
            icon={<HomeRegular />}
            onClick={() => {
              const viewer = viewerRef.current?.cesiumElement;
              if (viewer) {
                viewer.camera.flyHome();
              }
            }}
          />
        </Tooltip>

        {/* Scene Mode Picker */}
        <SceneModeButton
          viewerRef={viewerRef}
          setSceneMode={setSceneMode}
          t={t}
        />
      </div>

      <div className={styles.headerRight}>
        {/* Show Timeline Toggle */}
        <Tooltip content={t("timeline")} relationship="label">
          <ToggleButton
            icon={showTimeline ? <EyeRegular /> : <EyeOffRegular />}
            checked={!showTimeline}
            onClick={() => setShowTimeline((prev) => !prev)}
          />
        </Tooltip>

        {/* Show Info Toggle */}
        <Tooltip content={t("info")} relationship="label">
          <ToggleButton
            icon={<BookInformationRegular />}
            checked={showInfo}
            onClick={() => {
              setShowInfo((prev) => !prev);
              setIsSidebarOpen(true);
            }}
          />
        </Tooltip>

        {/* Toggle Drawer Button */}
        <Tooltip content={t("sidebar")} relationship="label">
          <Button
            icon={isSidebarOpen ? <DismissRegular /> : <NavigationRegular />}
            appearance="primary"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Header;

import React from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import {
  InlineDrawer,
  DrawerBody,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Link,
} from "@fluentui/react-components";
import { tokens } from "@fluentui/react-theme";
import {
  Body1,
  Body1Strong,
  Subtitle1,
  Subtitle2,
  Caption1,
} from "@fluentui/react-components";
import { formatDate } from "../utils/dateFormat";

import MouseLeftIcon from "../assets/NavigationHelp/MouseLeft.svg?react";
import MouseRightIcon from "../assets/NavigationHelp/MouseRight.svg?react";
import MouseMiddleIcon from "../assets/NavigationHelp/MouseMiddle.svg?react";
import TouchDragIcon from "../assets/NavigationHelp/TouchDrag.svg?react";
import TouchZoomIcon from "../assets/NavigationHelp/TouchZoom.svg?react";
import TouchRotateIcon from "../assets/NavigationHelp/TouchRotate.svg?react";
import TouchTiltIcon from "../assets/NavigationHelp/TouchTilt.svg?react";

type LayerProps = {
  key: string;
  title?: string;
  subtitle?: string;
  description?: string;
  credits?: {
    credit: string;
    showOnScreen: boolean;
  };
  releaseDate?: string;
  updateDate?: string;
  copyrightLicense?: string;
};

type SidebarProps = {
  isOpen: boolean;
  activeLayers: { [key: string]: boolean };
  layers: LayerProps[];
  setIsOpen: (open: boolean) => void;
  showInfo?: boolean;
};

type ControlDef = {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  alt: string;
  label: string;
  instruction: string;
  width?: number;
  height?: number;
};

const mouseControls: ControlDef[] = [
  {
    Icon: MouseLeftIcon,
    alt: "leftMouse",
    label: "pan",
    instruction: "panInstruction",
    width: 42,
    height: 42,
  },
  {
    Icon: MouseRightIcon,
    alt: "rightMouse",
    label: "zoom",
    instruction: "zoomInstruction",
    width: 42,
    height: 42,
  },
  {
    Icon: MouseMiddleIcon,
    alt: "middleMouse",
    label: "rotate",
    instruction: "rotateInstruction",
    width: 42,
    height: 42,
  },
];

const touchControls: ControlDef[] = [
  {
    Icon: TouchDragIcon,
    alt: "touchDrag",
    label: "pan",
    instruction: "panInstructionTouch",
    width: 40,
    height: 40,
  },
  {
    Icon: TouchZoomIcon,
    alt: "touchZoom",
    label: "zoom",
    instruction: "zoomInstructionTouch",
    width: 40,
    height: 40,
  },
  {
    Icon: TouchRotateIcon,
    alt: "touchRotate",
    label: "rotate",
    instruction: "rotateInstructionTouch",
    width: 36,
    height: 36,
  },
  {
    Icon: TouchTiltIcon,
    alt: "touchTilt",
    label: "tilt",
    instruction: "tiltInstructionTouch",
    width: 40,
    height: 40,
  },
];

// Generic Control Table
const ControlTable: React.FC<{
  controls: ControlDef[];
  t: (key: string) => string;
}> = ({ controls, t }) => (
  <Table style={{ marginBottom: tokens.spacingVerticalL }}>
    <TableBody>
      {controls.map((ctrl) => (
        <TableRow key={ctrl.alt}>
          <TableCell
            style={{
              width: "25%",
              textAlign: "center",
              verticalAlign: "middle",
              paddingTop: tokens.spacingVerticalS,
              paddingBottom: tokens.spacingVerticalS,
            }}
          >
            <ctrl.Icon
              aria-label={t(ctrl.alt)}
              style={{
                color: tokens.colorNeutralBackgroundInverted,
                width: ctrl.width,
                height: ctrl.height,
                display: "block",
                margin: "0 auto",
              }}
            />
          </TableCell>
          <TableCell>
            <Body1Strong>{t(ctrl.label)}</Body1Strong>
            <div>
              <Body1>{t(ctrl.instruction)}</Body1>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

// Project Info Block
const ProjectInfo: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <div>
    <Subtitle1
      block
      style={{
        marginTop: tokens.spacingVerticalXS,
        marginBottom: tokens.spacingVerticalS,
      }}
    >
      {t("projectInfo")}
    </Subtitle1>
    <Body1
      block
      style={{
        marginTop: tokens.spacingVerticalXS,
        marginBottom: tokens.spacingVerticalS,
      }}
    >
      {t("projectInfoText")}
    </Body1>
    <Body1
      block
      style={{
        marginTop: tokens.spacingVerticalXS,
        marginBottom: tokens.spacingVerticalS,
      }}
    >
      {t("author")}: Antonio Gojak. {t("date")}: {t("september")} 2025.{" "}
      {t("version")}: 1.0. {t("license")}: CC BY. {t("madeWith")}{" "}
      <Link href="https://cesium.com/" target="_blank" inline>
        Cesium
      </Link>
      .
    </Body1>
  </div>
);

// Layer Info Block
const LayerInfo: React.FC<{
  layers: LayerProps[];
  t: (key: string) => string;
}> = ({ layers, t }) => (
  <div>
    {layers.map((layer, index) => (
      <div
        key={layer.key}
        style={{ wordWrap: "break-word", overflowX: "hidden" }}
      >
        <Subtitle2
          block
          style={{
            marginTop: tokens.spacingVerticalXS,
            marginBottom: tokens.spacingVerticalS,
          }}
        >
          {layer.title}
        </Subtitle2>
        {layer.subtitle && (
          <Body1
            italic
            block
            style={{
              marginTop: tokens.spacingVerticalXS,
              marginBottom: tokens.spacingVerticalS,
            }}
          >
            {layer.subtitle}
          </Body1>
        )}
        {layer.description && (
          <Body1
            block
            style={{
              marginTop: tokens.spacingVerticalM,
              marginBottom: tokens.spacingVerticalS,
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: layer.description }} />
          </Body1>
        )}
        {(layer.credits?.credit ||
          layer.releaseDate ||
          layer.updateDate ||
          layer.copyrightLicense) && (
          <Caption1
            block
            style={{
              marginTop: tokens.spacingVerticalXS,
              marginBottom: tokens.spacingVerticalS,
            }}
          >
            {t("credit")}:{" "}
            {layer.credits?.credit && (
              <span
                dangerouslySetInnerHTML={{ __html: layer.credits.credit }}
              />
            )}
            {layer.releaseDate && (
              <>
                {layer.credits?.credit && ". "}
                <span>
                  {t("releaseDate")}: {formatDate(layer.releaseDate)}
                </span>
              </>
            )}
            {layer.updateDate && (
              <>
                {(layer.credits?.credit || layer.releaseDate) && " "}
                <span>
                  {t("updateDate")}: {formatDate(layer.updateDate)}
                </span>
              </>
            )}
            {layer.copyrightLicense && (
              <>
                {(layer.credits?.credit ||
                  layer.releaseDate ||
                  layer.updateDate) &&
                  " "}
                <span>
                  {t("copyright")}: {layer.copyrightLicense}.
                </span>
              </>
            )}
          </Caption1>
        )}
        {index < layers.length - 1 && (
          <Divider
            style={{
              marginTop: tokens.spacingVerticalXL,
              marginBottom: tokens.spacingVerticalM,
            }}
          />
        )}
      </div>
    ))}
  </div>
);

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeLayers,
  layers,
  showInfo,
}) => {
  const { t } = useTranslation();

  const activeLayerDescriptions = layers.filter(
    (layer) => activeLayers[layer.key]
  );

  // Only show pan, zoom, and rotate for touch, and only pan/zoom/rotate for mouse if not touch
  const filteredTouchControls = touchControls.filter(
    (ctrl) => ctrl.label === "pan" || ctrl.label === "zoom"
  );

  return (
    <InlineDrawer
      open={isOpen}
      position="end"
      style={{
      // @ts-ignore
      "--fui-Drawer--size": "100%",
      backgroundColor: tokens.colorNeutralBackground3,
      }}
      className="sidebar-inline-drawer"
    >
      <DrawerBody
      style={{
        paddingTop: tokens.spacingVerticalXXS,
        paddingLeft: tokens.spacingVerticalL,
      }}
      >
      {showInfo && (
        <>
        <div>
          <Subtitle1
          block
          style={{ marginBottom: tokens.spacingVerticalS }}
          >
          {t("instructions")}
          </Subtitle1>
          {!isTouchDevice() && (
          <>
            <Subtitle2
            block
            style={{
              marginTop: tokens.spacingVerticalXS,
              marginBottom: tokens.spacingVerticalS,
            }}
            >
            {t("mouse")}
            </Subtitle2>
            <ControlTable controls={mouseControls} t={t} />
          </>
          )}
          {isTouchDevice() && (
          <>
            <Subtitle2
            block
            style={{
              marginTop: tokens.spacingVerticalXS,
              marginBottom: tokens.spacingVerticalS,
            }}
            >
            {t("touch")}
            </Subtitle2>
            <ControlTable controls={filteredTouchControls} t={t} />
          </>
          )}
        </div>
        <ProjectInfo t={t} />
        <Divider
          style={{
          marginTop: tokens.spacingVerticalXL,
          marginBottom: tokens.spacingVerticalM,
          }}
        />
        </>
      )}

      {/* Always show layer info below */}
      <div>
        {showInfo && (
        <Subtitle1 block style={{ marginBottom: tokens.spacingVerticalS }}>
          {t("layerInfo")}
        </Subtitle1>
        )}
        <LayerInfo layers={activeLayerDescriptions} t={t} />
      </div>
      </DrawerBody>
    </InlineDrawer>
  );
};

export default Sidebar;

import React, { useEffect, useState } from "react";
import { Body1 } from "@fluentui/react-components";
import { micaStyle } from "./Style";
import { tokens } from "@fluentui/react-theme";
import { useTranslation } from "react-i18next";
import "../i18n";

const outerFlexCenterStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
};

type FluentLegendLabel = {
  value: string;
  position: number;
  style?: React.CSSProperties;
};

type FluentLegendProps = {
  gradient: string;
  title?: string;
  labels: FluentLegendLabel[];
  style?: React.CSSProperties;
};

type LegendSource = {
  path: string;
  width?: string | number;
  height?: string | number;
  background?: boolean;
};

type LegendProps = {
  legend: LegendSource | FluentLegendProps | null;
};

// Helper: get legend container style
function getContainerStyle({
  width,
  height,
  background,
}: {
  width?: string | number;
  height?: string | number;
  background?: boolean;
}) {
  const base: React.CSSProperties = {
    width: width ?? "100%",
    height: height ?? "auto",
    margin: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalXS,
    marginRight: tokens.spacingVerticalXS,
    display: "block",
  };
  if (background) {
    return {
      ...base,
      background: tokens.colorNeutralBackground2,
      paddingTop: tokens.spacingVerticalS,
      paddingBottom: tokens.spacingVerticalS,
      paddingLeft: tokens.spacingHorizontalM,
      paddingRight: tokens.spacingHorizontalM,
      ...micaStyle,
      borderRadius: tokens.borderRadiusMedium,
    };
  }
  return base;
}

// Helper: check file extension
function getLegendType(path: string) {
  if (typeof path !== "string") return "unknown";
  const ext = path.split(".").pop()?.toLowerCase() || "";
  if (
    ["png", "jpg", "jpeg", "webp", "gif", "svg", "bmp", "tif", "tiff"].includes(
      ext
    )
  )
    return "image";
  if (ext === "html") return "iframe";
  if (ext === "json") return "json";
  return "unknown";
}

// FluentLegend component
const FluentLegend: React.FC<FluentLegendProps> = ({
  gradient,
  title,
  labels,
  style,
}) => (
  <div style={{ boxSizing: "border-box", ...style }}>
    <div
      style={{
        display: "grid",
        gridTemplateRows: title ? "auto 1fr" : "1fr",
        height: "100%",
      }}
    >
      {title && (
        <Body1
          style={{
            textAlign: "center",
            marginBottom: tokens.spacingVerticalS,
          }}
        >
          {title}
        </Body1>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: title ? "1fr 1fr" : "auto 1fr",
          alignItems: "stretch",
          columnGap: tokens.spacingHorizontalS,
        }}
      >
        <div
          style={
            {
              width: tokens.borderRadiusXLarge,
              borderRadius: tokens.borderRadiusXLarge,
              background: gradient,
              ...(micaStyle as React.CSSProperties),
              justifySelf: "end",
            } as React.CSSProperties
          }
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            minWidth: 24,
            justifySelf: "start",
          }}
        >
          {labels.map((label, i) => {
            let pos = label.position;
            if (pos >= 99) pos = 99;
            if (pos <= 1.5) pos = 1.5;
            return (
              <Body1
                key={i}
                style={{
                  position: "absolute",
                  top: `${100 - pos}%`,
                  transform: "translateY(-50%)",
                  ...label.style,
                }}
              >
                {label.value}
              </Body1>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

// Legend renderers
const LegendImage: React.FC<LegendSource> = ({
  path,
  width,
  height,
  background,
}) => (
  <div style={outerFlexCenterStyle}>
    <div
      style={{
        ...(getContainerStyle({
          width,
          height,
          background,
        }) as React.CSSProperties),
      }}
    >
      <img
        src={path}
        alt="Legend"
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  </div>
);

const LegendIframe: React.FC<LegendSource> = ({
  path,
  width,
  height,
  background,
}) => {
  const { t } = useTranslation();
  return (
    <div style={outerFlexCenterStyle}>
      <div
        style={
          getContainerStyle({
            width,
            height,
            background,
          }) as React.CSSProperties
        }
      >
        <iframe
          src={path}
          title={t("legend")}
          style={{
            width: width ?? "100%",
            height: height ?? "100%",
            border: "none",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};

const LegendJson: React.FC<LegendSource> = ({
  path,
  width,
  height,
  background,
}) => {
  const [fluentData, setFluentData] = useState<FluentLegendProps | null>(null);

  useEffect(() => {
    setFluentData(null);
    fetch(path)
      .then((res) => res.json())
      .then(setFluentData)
      .catch(() => setFluentData(null));
  }, [path]);

  if (!fluentData) return null;
  return (
    <div style={outerFlexCenterStyle}>
      <div
        style={
          getContainerStyle({
            width,
            height,
            background,
          }) as React.CSSProperties
        }
      >
        <FluentLegend
          style={{
            width: "100%",
            height: "100%",
          }}
          {...fluentData}
        />
      </div>
    </div>
  );
};

// Main Legend component
const Legend: React.FC<LegendProps> = ({ legend }) => {
  if (!legend) return null;

  // FluentLegendProps direct
  if (typeof legend === "object" && "gradient" in legend) {
    return <FluentLegend {...(legend as FluentLegendProps)} />;
  }

  // LegendSource with path
  if (typeof legend === "object" && "path" in legend) {
    const { path, width, height, background = true } = legend;
    const type = getLegendType(path);

    if (type === "image")
      return (
        <LegendImage
          path={path}
          width={width}
          height={height}
          background={background}
        />
      );
    if (type === "iframe")
      return (
        <LegendIframe
          path={path}
          width={width}
          height={height}
          background={background}
        />
      );
    if (type === "json")
      return (
        <LegendJson
          path={path}
          width={width}
          height={height}
          background={background}
        />
      );
  }

  return null;
};

export default Legend;

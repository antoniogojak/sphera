import { GeoJsonDataSource, Credit, Color } from "cesium";

type LayerOptions = {
  url: string;
  sourceUri?: string;
  describe?: string;
  markerSize?: number;
  markerSymbol?: string;
  markerColor?: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  clampToGround?: boolean;
  credits?: { credit: string; showOnScreen: boolean };
};

const parseColor = (color?: string): Color | undefined => {
  if (!color) return undefined;
  if (color.startsWith("#")) {
    return Color.fromCssColorString(color);
  }
  return (Color as any)[color.toUpperCase()] || Color.WHITE;
};

export const createGeoJsonDataSourceLayer = async (layer: LayerOptions) => {
  if (!layer?.url) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("GeoJSON layer missing URL:", layer);
    }
    return undefined;
  }

  const options = {
    sourceUri: layer.sourceUri,
    markerSize: layer.markerSize,
    markerSymbol: layer.markerSymbol,
    markerColor: parseColor(layer.markerColor),
    stroke: parseColor(layer.stroke),
    strokeWidth: layer.strokeWidth,
    fill: parseColor(layer.fill),
    clampToGround: layer.clampToGround ?? false,
    credit: layer.credits
      ? new Credit(layer.credits.credit, layer.credits.showOnScreen)
      : undefined,
  };

  const dataSource = await GeoJsonDataSource.load(layer.url, options);

  if (process.env.NODE_ENV !== "production") {
    console.log("Created GeoJsonDataSource:", dataSource);
  }
  return dataSource;
};
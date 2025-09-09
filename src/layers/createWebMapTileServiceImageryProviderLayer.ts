import { WebMapTileServiceImageryProvider, Rectangle, Credit } from "cesium";
import { createTimeIntervalCollection } from "./createTimeIntervalCollection";

export interface WebMapTileServiceLayerOptions {
  url: string;
  format?: string;
  layer: string;
  style?: string;
  tileMatrixSetID?: string;
  tileMatrixLabels?: string[];
  clock?: any;
  times?: any;
  dimensions?: any;
  tileWidth?: number;
  tileHeight?: number;
  tilingScheme?: any;
  rectangle?: [number, number, number, number];
  minimumLevel?: number;
  maximumLevel?: number;
  ellipsoid?: any;
  credits?: { credit: string; showOnScreen: boolean };
  subdomains?: string[] | string;
}

export const createWebMapTileServiceImageryProviderLayer = async (
  layer: WebMapTileServiceLayerOptions,
  viewerClock?: any
) => {
  if (!layer?.url || !layer?.layer) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("WMTS layer missing required fields:", layer);
    }
    return undefined;
  }

  const timeIntervalCollection = layer.times
    ? createTimeIntervalCollection(layer.times) || undefined
    : undefined;

  const options = {
    url: layer.url,
    format: layer.format ?? "image/png",
    layer: layer.layer,
    style: layer.style ?? "default",
    tileMatrixSetID: layer.tileMatrixSetID ?? "default028mm",
    tileMatrixLabels: layer.tileMatrixLabels,
    clock: viewerClock ?? layer.clock,
    times: timeIntervalCollection === null ? undefined : timeIntervalCollection,
    dimensions: layer.dimensions,
    tileWidth: layer.tileWidth ?? 256,
    tileHeight: layer.tileHeight ?? 256,
    tilingScheme: layer.tilingScheme,
    rectangle: layer.rectangle
      ? Rectangle.fromDegrees(...layer.rectangle)
      : undefined,
    minimumLevel: layer.minimumLevel ?? 0,
    maximumLevel: layer.maximumLevel,
    ellipsoid: layer.ellipsoid,
    credit: layer.credits
      ? new Credit(layer.credits.credit, layer.credits.showOnScreen)
      : undefined,
    subdomains: layer.subdomains,
  };

  const provider = new WebMapTileServiceImageryProvider(options);

  if (process.env.NODE_ENV !== "production") {
    console.log("Created WebMapTileServiceImageryProvider:", provider);
  }
  return provider;
};
import { SingleTileImageryProvider, Rectangle, Credit, Ellipsoid } from "cesium";

export interface SingleTileLayerOptions {
  url: string;
  rectangle?: [number, number, number, number];
  tileWidth?: number;
  tileHeight?: number;
  credits?: { credit: string; showOnScreen: boolean };
  ellipsoid?: Ellipsoid;
}

export const createSingleTileImageryProviderLayer = (layer: SingleTileLayerOptions) => {
  if (!layer?.url) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SingleTileImageryProvider layer missing URL:", layer);
    }
    return undefined;
  }

  return new SingleTileImageryProvider({
    url: layer.url,
    rectangle: layer.rectangle ? Rectangle.fromDegrees(...layer.rectangle) : undefined,
    tileWidth: layer.tileWidth,
    tileHeight: layer.tileHeight,
    credit: layer.credits
      ? new Credit(layer.credits.credit, layer.credits.showOnScreen)
      : undefined,
    ellipsoid: layer.ellipsoid,
  });
};
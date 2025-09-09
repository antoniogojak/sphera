import { TileMapServiceImageryProvider, Rectangle, Credit } from "cesium";

export interface TileMapServiceLayerOptions {
  url: string;
  fileExtension?: string;
  credits?: { credit: string; showOnScreen: boolean };
  minimumLevel?: number;
  maximumLevel?: number;
  rectangle?: [number, number, number, number];
  tilingScheme?: any;
  ellipsoid?: any;
  tileWidth?: number;
  tileHeight?: number;
  flipXY?: boolean;
  tileDiscardPolicy?: any;
}

export const createTileMapServiceImageryProviderLayer = async (
  layer: TileMapServiceLayerOptions
) => {
  if (!layer?.url) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("TileMapServiceImageryProvider layer missing URL:", layer);
    }
    return undefined;
  }

  const options = {
    fileExtension: layer.fileExtension ?? "png",
    credit: layer.credits
      ? new Credit(layer.credits.credit, layer.credits.showOnScreen)
      : undefined,
    minimumLevel: layer.minimumLevel ?? 0,
    maximumLevel: layer.maximumLevel,
    rectangle: layer.rectangle
      ? Rectangle.fromDegrees(...layer.rectangle)
      : undefined,
    tilingScheme: layer.tilingScheme,
    ellipsoid: layer.ellipsoid,
    tileWidth: layer.tileWidth ?? 256,
    tileHeight: layer.tileHeight ?? 256,
    flipXY: layer.flipXY ?? false,
    tileDiscardPolicy: layer.tileDiscardPolicy,
  };

  const provider = await TileMapServiceImageryProvider.fromUrl(layer.url, options);

  if (process.env.NODE_ENV !== "production") {
    console.log("Created TileMapServiceImageryProvider:", provider);
  }
  return provider;
};
import { UrlTemplateImageryProvider, Rectangle, Credit } from "cesium";

export interface UrlTemplateLayerOptions {
  url: string;
  pickFeaturesUrl?: string;
  urlSchemeZeroPadding?: any;
  subdomains?: string[] | string;
  credits?: { credit: string; showOnScreen: boolean };
  minimumLevel?: number;
  maximumLevel?: number;
  rectangle?: [number, number, number, number];
  tilingScheme?: any;
  ellipsoid?: any;
  tileWidth?: number;
  tileHeight?: number;
  hasAlphaChannel?: boolean;
  getFeatureInfoFormats?: any;
  enablePickFeatures?: boolean;
  tileDiscardPolicy?: any;
  customTags?: any;
}

export const createUrlTemplateImageryProviderLayer = async (
  layer: UrlTemplateLayerOptions
) => {
  if (!layer?.url) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("UrlTemplateImageryProvider layer missing URL:", layer);
    }
    return undefined;
  }

  const options = {
    url: layer.url,
    credit: layer.credits
      ? new Credit(layer.credits.credit, layer.credits.showOnScreen)
      : undefined,
    minimumLevel: layer.minimumLevel || 0,
    maximumLevel: layer.maximumLevel || undefined,
    rectangle: layer.rectangle
      ? Rectangle.fromDegrees(...layer.rectangle)
      : undefined,
    tileWidth: layer.tileWidth ?? 256,
    tileHeight: layer.tileHeight ?? 256,
    subdomains: layer.subdomains,
    pickFeaturesUrl: layer.pickFeaturesUrl,
    urlSchemeZeroPadding: layer.urlSchemeZeroPadding,
    tilingScheme: layer.tilingScheme,
    ellipsoid: layer.ellipsoid,
    hasAlphaChannel: layer.hasAlphaChannel ?? false,
    getFeatureInfoFormats: layer.getFeatureInfoFormats,
    enablePickFeatures: layer.enablePickFeatures ?? false,
    tileDiscardPolicy: layer.tileDiscardPolicy,
    customTags: layer.customTags,
  };

  if (process.env.NODE_ENV !== "production") {
    console.log("UrlTemplateImageryProvider options:", options);
  }

  return new UrlTemplateImageryProvider(options);
};
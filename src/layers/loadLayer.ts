import * as Cesium from "cesium";
import { createSingleTileImageryProviderLayer } from "./createSingleTileImageryProviderLayer";
import { createTileMapServiceImageryProviderLayer } from "./createTileMapServiceImageryProviderLayer";
import { createWebMapTileServiceImageryProviderLayer } from "./createWebMapTileServiceImageryProviderLayer";
import { createUrlTemplateImageryProviderLayer } from "./createUrlTemplateImageryProviderLayer";
import { createGeoJsonDataSourceLayer } from "./createGeoJsonDataSourceLayer";
import { createImageMaterialPropertyLayer } from "./createImageMaterialPropertyLayer";
import { applyColorProperties } from "./applyColorProperties";

type LayerType =
  | "ImageMaterialProperty"
  | "GeoJsonDataSource"
  | "SingleTileImageryProvider"
  | "TileMapServiceImageryProvider"
  | "UrlTemplateImageryProvider"
  | "WebMapTileServiceImageryProvider";

interface Layer {
  type: LayerType;
  key?: string;
  czml?: any;
  colorProperties?: any;
  [key: string]: any;
}

const imageryProviderLoaders: Record<
  LayerType,
  (layer: Layer, viewer?: any) => Promise<any> | any
> = {
  ImageMaterialProperty: async (layer) =>
    createImageMaterialPropertyLayer({
      url: layer.url,
      ...layer
    }),
  GeoJsonDataSource: async (layer) =>
    createGeoJsonDataSourceLayer({
      url: layer.url,
      ...layer
    }),
  SingleTileImageryProvider: (layer) =>
    createSingleTileImageryProviderLayer({
      url: layer.url,
      ...layer
    }),
  TileMapServiceImageryProvider: async (layer) =>
    createTileMapServiceImageryProviderLayer({
      url: layer.url,
      ...layer
    }),
  UrlTemplateImageryProvider: async (layer) =>
    createUrlTemplateImageryProviderLayer({
      url: layer.url,
      ...layer
    }),
  WebMapTileServiceImageryProvider: async (layer, viewer) =>
    createWebMapTileServiceImageryProviderLayer(
      {
        url: layer.url,
        layer: layer.layer,
        ...layer
      },
      viewer?.clock
    ),
};

const addLayerToViewer = (viewer: any, layerType: LayerType, loadedLayer: any) => {
  if (layerType === "ImageMaterialProperty" && loadedLayer) {
    viewer.entities.add(loadedLayer);
  } else if (layerType === "GeoJsonDataSource" && loadedLayer) {
    viewer.dataSources.add(loadedLayer);
  } else if (
    [
      "SingleTileImageryProvider",
      "TileMapServiceImageryProvider",
      "UrlTemplateImageryProvider",
      "WebMapTileServiceImageryProvider",
    ].includes(layerType) &&
    loadedLayer
  ) {
    const imageryLayer = viewer.scene.imageryLayers.addImageryProvider(loadedLayer);
    viewer.scene.imageryLayers.raiseToTop(imageryLayer);
    return imageryLayer;
  }
  return loadedLayer;
};

export const loadLayer = async (viewer: any, layer: Layer) => {
  let loadedLayer;

  try {
    const loader = imageryProviderLoaders[layer.type];
    if (!loader) {
      throw new Error(`Unsupported layer type: ${layer.type}`);
    }
    loadedLayer = await loader(layer, viewer);

    loadedLayer = addLayerToViewer(viewer, layer.type, loadedLayer);

    // Load CZML if present
    if (layer.czml) {
      const czmlDataSource = await Cesium.CzmlDataSource.load(layer.czml);
      viewer.dataSources.add(czmlDataSource);
      if (!loadedLayer) loadedLayer = {};
      loadedLayer.czmlDataSource = czmlDataSource;
      if (process.env.NODE_ENV !== "production") {
        console.log(`CZML DataSource loaded for layer: ${layer.key}`);
      }
    }

    // Apply color properties if applicable
    if (layer.colorProperties && loadedLayer instanceof Cesium.ImageryLayer) {
      applyColorProperties(loadedLayer, layer.colorProperties);
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`Loaded layer: ${layer.key}`);
    }
    return loadedLayer;
  } catch (error) {
    console.error(`Failed to load layer: ${layer.key}`, error);
    return null;
  }
};
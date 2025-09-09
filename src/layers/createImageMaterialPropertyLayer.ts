import { ImageMaterialProperty, Cartesian2, Entity, Rectangle } from "cesium";

export interface ImageMaterialLayerOptions {
  url: string;
  title?: string;
  rectangle?: [number, number, number, number];
  repeat?: [number, number];
  loopContent?: boolean;
  muted?: boolean;
  playbackRate?: number;
}

export const createImageMaterialPropertyLayer = async (
  layer: ImageMaterialLayerOptions
) => {
  if (!layer?.url) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("ImageMaterialProperty layer missing URL:", layer);
    }
    return null;
  }

  try {
    const videoPath = new URL(layer.url, window.location.href).href;
    const videoElement = document.createElement("video");
    videoElement.src = videoPath;
    videoElement.loop = layer.loopContent ?? true;
    videoElement.muted = layer.muted ?? true;
    videoElement.playbackRate = layer.playbackRate ?? 1.0;

    const material = new ImageMaterialProperty({
      image: videoElement,
      repeat: layer.repeat
        ? new Cartesian2(...layer.repeat)
        : new Cartesian2(1, 1),
    });

    const entity = new Entity({
      name: layer.title ?? "ImageMaterialProperty",
      rectangle: {
        coordinates: layer.rectangle
          ? Rectangle.fromDegrees(...layer.rectangle)
          : Rectangle.fromDegrees(-180, -90, 180, 90),
        material,
      },
    });

    // Attach the video element for later access if needed
    (entity as any).videoElement = videoElement;

    if (process.env.NODE_ENV !== "production") {
      console.log("Created ImageMaterialProperty entity:", entity);
    }
    return entity;
  } catch (error) {
    console.error("Failed to create ImageMaterialProperty:", error);
    return null;
  }
};
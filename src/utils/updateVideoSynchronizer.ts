import * as Cesium from "cesium";

type VideoSyncParams = {
  layer: { type: string; key: string; timelineSync?: boolean };
  loadedLayer: { videoElement?: HTMLVideoElement };
  viewer: { clock: Cesium.Clock };
  enable: boolean;
};

const videoSynchronizers: Record<string, Cesium.VideoSynchronizer> = {};

export function updateVideoSynchronizer({
  layer,
  loadedLayer,
  viewer,
  enable,
}: VideoSyncParams) {
  if (
    layer.type !== "ImageMaterialProperty" ||
    !layer.timelineSync ||
    !loadedLayer.videoElement ||
    !viewer.clock
  ) {
    return;
  }

  const videoElement = loadedLayer.videoElement;
  const clock = viewer.clock;
  const key = layer.key;

  if (enable) {
    // Set stopTime if not set
    if (!clock.stopTime) {
      clock.stopTime = Cesium.JulianDate.addSeconds(
        clock.startTime,
        videoElement.duration,
        new Cesium.JulianDate()
      );
    }
    clock.currentTime = clock.startTime;
    videoElement.pause();
    videoElement.currentTime = 0;

    // Destroy previous synchronizer if exists
    videoSynchronizers[key]?.destroy();

    // Create new synchronizer
    videoSynchronizers[key] = new Cesium.VideoSynchronizer({
      clock,
      element: videoElement,
      epoch: clock.startTime,
    });

    videoElement.play();
  } else {
    videoElement.pause();
    videoSynchronizers[key]?.destroy();
    delete videoSynchronizers[key];
  }
}
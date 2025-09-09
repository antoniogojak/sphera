import * as Cesium from "cesium";

export interface ClockConfig {
  startTime?: string;
  stopTime?: string;
  currentTime?: string;
  clockRange?: keyof typeof Cesium.ClockRange;
  multiplier?: number;
  clockStep?: keyof typeof Cesium.ClockStep;
  canAnimate?: boolean;
  shouldAnimate?: boolean;
}

export function applyClockSettings(viewer: any, config: ClockConfig) {
  if (!viewer?.clock) return;

  try {
    const startTime = config.startTime
      ? Cesium.JulianDate.fromIso8601(config.startTime)
      : Cesium.JulianDate.now();
    const stopTime = config.stopTime
      ? Cesium.JulianDate.fromIso8601(config.stopTime)
      : Cesium.JulianDate.addDays(startTime, 1, new Cesium.JulianDate());
    const currentTime = config.currentTime
      ? Cesium.JulianDate.fromIso8601(config.currentTime)
      : startTime;

    const clock = viewer.clock;
    clock.startTime = startTime;
    clock.stopTime = stopTime;
    clock.currentTime = currentTime;
    clock.clockRange =
      config.clockRange && Cesium.ClockRange[config.clockRange]
        ? Cesium.ClockRange[config.clockRange]
        : Cesium.ClockRange.UNBOUNDED;
    clock.multiplier = config.multiplier ?? 1;
    clock.clockStep =
      config.clockStep && Cesium.ClockStep[config.clockStep]
        ? Cesium.ClockStep[config.clockStep]
        : Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
    clock.canAnimate = config.canAnimate ?? true;
    clock.shouldAnimate = config.shouldAnimate ?? true;

    viewer.timeline?.zoomTo(startTime, stopTime);

    if (process.env.NODE_ENV !== "production") {
      console.log("Applied clock settings:", config);
    }
  } catch (error) {
    console.error("Failed to apply clock settings:", error);
  }
}
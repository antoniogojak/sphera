import { JulianDate, TimeInterval } from "cesium";

export type DataCallback = (interval: TimeInterval, index: number) => any;

export interface DataCallbackRegistry {
  [key: string]: DataCallback;
}

export const dataCallbackRegistry: DataCallbackRegistry = {
  // Returns stop time for first interval, start time for others
  dataCallback: (interval, index) => ({
    Time: JulianDate.toIso8601(index === 0 ? interval.stop : interval.start),
  }),

  // Example dummy callback for testing
  dummyCallback: (_interval, index) => ({
    Info: `Dummy callback for interval ${index}`,
  }),
};
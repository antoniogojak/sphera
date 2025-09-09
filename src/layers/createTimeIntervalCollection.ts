import * as Cesium from "cesium";
import { dataCallbackRegistry } from "./dataCallbackRegistry";

export interface TimeIntervalOptions {
  method: "fromIso8601";
  iso8601: string;
  leadingInterval?: boolean;
  trailingInterval?: boolean;
  isStopIncluded?: boolean;
  dataCallback?: string;
}

export const createTimeIntervalCollection = (options: TimeIntervalOptions) => {
  if (!options?.method) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("No method provided for TimeIntervalCollection.", options);
    }
    return null;
  }

  let dataCallback: ((interval: Cesium.TimeInterval, index: number) => any) | undefined;
  if (options.dataCallback) {
    dataCallback = dataCallbackRegistry[options.dataCallback];
    if (!dataCallback && process.env.NODE_ENV !== "production") {
      console.error(`Data callback "${options.dataCallback}" not found in registry.`);
    }
  }

  switch (options.method) {
    case "fromIso8601":
      return Cesium.TimeIntervalCollection.fromIso8601({
        iso8601: options.iso8601,
        leadingInterval: options.leadingInterval ?? true,
        trailingInterval: options.trailingInterval ?? true,
        isStopIncluded: options.isStopIncluded ?? false,
        dataCallback,
      });
    default:
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Unsupported TimeIntervalCollection method: ${options.method}`);
      }
      return null;
  }
};
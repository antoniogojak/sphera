import React, { useState, useEffect, useCallback } from "react";
import {
  Slider,
  Button,
  makeStyles,
} from "@fluentui/react-components";
import {
  Play24Regular,
  Pause24Regular,
  ArrowLeftRegular,
  ArrowRightRegular,
} from "@fluentui/react-icons";
import * as Cesium from "cesium";
import { formatDate, formatTime } from "../utils/dateFormat";
import { micaStyle } from "./Style";
import { tokens } from "@fluentui/react-theme";
import { Body1, Caption1 } from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    marginLeft: tokens.spacingVerticalXS,
    marginRight: tokens.spacingVerticalXS,
    marginTop: tokens.spacingVerticalXS,
    marginBottom: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    ...micaStyle,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: tokens.borderRadiusMedium,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
  },
  sliderRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalXS,
  },
  buttonRow: {
    display: "flex",
    gap: tokens.spacingHorizontalSNudge,
  },
});

interface TimelineProps {
  viewerRef: React.RefObject<any>;
}

type TimelineState = {
  sliderValue: number;
  playing: boolean;
  mode: "forward" | "backward";
  currentTime: Date | null;
  startTime: Date | null;
  endTime: Date | null;
};

function useCesiumTimeline(viewerRef: React.RefObject<any>) {
  const [state, setState] = useState<TimelineState>({
    sliderValue: 0,
    playing: false,
    mode: "forward",
    currentTime: null,
    startTime: null,
    endTime: null,
  });

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let interval: NodeJS.Timeout | undefined;

    function trySetup() {
      const cesiumElement =
        viewerRef.current?.cesiumElement || viewerRef.current;
      if (!cesiumElement || !cesiumElement.clock) return false;

      const clock = cesiumElement.clock;

      const update = () => {
        const start = Cesium.JulianDate.toDate(clock.startTime);
        const end = Cesium.JulianDate.toDate(clock.stopTime);
        const now = Cesium.JulianDate.toDate(clock.currentTime);
        const percent =
          ((now.getTime() - start.getTime()) /
            (end.getTime() - start.getTime())) *
          100;
        setState({
          sliderValue: percent,
          playing: clock.shouldAnimate,
          mode: clock.multiplier >= 0 ? "forward" : "backward",
          currentTime: now,
          startTime: start,
          endTime: end,
        });
      };

      const removeListener = clock.onTick.addEventListener(update);
      update();

      cleanup = () => {
        removeListener();
      };
      return true;
    }

    if (!trySetup()) {
      interval = setInterval(() => {
        if (trySetup()) {
          clearInterval(interval);
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (cleanup) cleanup();
    };
  }, [viewerRef]);

  return state;
}

const Timeline: React.FC<TimelineProps> = ({ viewerRef }) => {
  const styles = useStyles();
  const {
    sliderValue,
    playing,
    mode,
    currentTime,
    startTime,
    endTime,
  } = useCesiumTimeline(viewerRef);

  // Handlers
  const handleSliderChange = useCallback((_: any, d: any) => {
    const cesiumElement = viewerRef.current?.cesiumElement || viewerRef.current;
    if (!cesiumElement || !startTime || !endTime) return;
    const percent = Number(d.value);
    const newTime = new Date(
      startTime.getTime() +
        ((endTime.getTime() - startTime.getTime()) * percent) / 100
    );
    cesiumElement.clock.currentTime = Cesium.JulianDate.fromDate(newTime);
  }, [viewerRef, startTime, endTime]);

  const handlePlayPause = useCallback(() => {
    const cesiumElement = viewerRef.current?.cesiumElement || viewerRef.current;
    if (!cesiumElement) return;
    cesiumElement.clock.shouldAnimate = !playing;
  }, [viewerRef, playing]);

  const handleModeChange = useCallback(() => {
    const cesiumElement = viewerRef.current?.cesiumElement || viewerRef.current;
    if (!cesiumElement) return;
    cesiumElement.clock.multiplier =
      Math.abs(cesiumElement.clock.multiplier) * (mode === "forward" ? -1 : 1);
  }, [viewerRef, mode]);

  if (!startTime || !endTime || !currentTime) return null;

  return (
    <div className={styles.container}>
      <Body1>{formatDate(currentTime)}</Body1>
      <Caption1>{formatTime(currentTime)} UTC</Caption1>
      <div className={styles.sliderRow}>
        <TimelineDateBlock date={startTime} />
        <Slider
          min={0}
          max={100}
          value={sliderValue}
          onChange={handleSliderChange}
          style={{ flex: 1 }}
        />
        <TimelineDateBlock date={endTime} />
      </div>
      <div className={styles.buttonRow}>
        <Button
          icon={playing ? <Pause24Regular /> : <Play24Regular />}
          onClick={handlePlayPause}
        />
        <Button
          icon={
            mode === "forward" ? <ArrowRightRegular /> : <ArrowLeftRegular />
          }
          onClick={handleModeChange}
        />
      </div>
    </div>
  );
};

const TimelineDateBlock: React.FC<{ date: Date }> = ({ date }) => (
  <div>
    <Caption1 block>{formatDate(date)}</Caption1>
    <Caption1 block style={{ textAlign: "center" }}>
      {formatTime(date)}
    </Caption1>
  </div>
);

export default Timeline;
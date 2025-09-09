export interface ColorProperties {
  brightness?: number;
  contrast?: number;
  gamma?: number;
  hue?: number;
  alpha?: number;
  saturation?: number;
}

export const applyColorProperties = (
  imageryLayer: any,
  colorProps: ColorProperties
) => {
  if (!imageryLayer || !colorProps) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Imagery layer or color properties missing.");
    }
    return;
  }

  Object.entries(colorProps).forEach(([key, value]) => {
    if (value !== undefined && key in imageryLayer) {
      imageryLayer[key] = value;
    }
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Applied color properties:", colorProps);
  }
};
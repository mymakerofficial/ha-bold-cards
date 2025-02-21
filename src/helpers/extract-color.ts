import { Vibrant } from "node-vibrant/browser";

export function extractColors(url: string, downsampleColors = 16) {
  return new Vibrant(url, {
    colorCount: downsampleColors,
  }).getPalette();
}

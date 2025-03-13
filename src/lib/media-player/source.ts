import { MediaPlayerEntity } from "../../types/ha/entity";

const appChecks: [RegExp, string][] = [
  [/home assistant/i, "mdi:home-assistant"],
  [/spotify/i, "mdi:spotify"],
  [/youtube/i, "mdi:youtube"],
  [/netflix/i, "mdi:netflix"],
];

const inputChecks: [RegExp, string][] = [
  [/hdmi/i, "mdi:hdmi-port"],
  [/ext|analogue|comp/i, "mdi:composite"],
  [/bluetooth/i, "mdi:bluetooth"],
  [/line|aux/i, "mdi:audio-input-rca"],
  [/wifi|wireless|cast/i, "mdi:wifi"],
  [/optical|toslink/i, "mdi:toslink"],
  [/cd|dvd|disc/i, "mdi:disc-player"],
  [/phono|vinyl/i, "mdi:album"],
  [/usb/i, "mdi:usb"],
  [/airplay/i, "mdi:airplay"],
  [/cast/i, "mdi:cast"],
];

const deviceChecks: [RegExp, string][] = [
  [/tv|television|fehrnsehr/i, "mdi:television"],
  [/speaker?s/i, "mdi:speaker"],
  [/stereo|audio|wiim/i, "mdi:audio-video"],
  [/linux/i, "mdi:linux"],
  [/macbook|dell|hp|lenovo/i, "mdi:laptop"],
  [/desktop|mac|hub|display|monitor/i, "mdi:monitor"],
  [/pixel|samsung|i?phone/i, "mdi:cellphone"],
  [/home/i, "mdi:home-outline"],
  [/group|all|room|zimmer|haus/i, "mdi:speaker-multiple"],
  [/off/i, "mdi:power"],
];

const checks = [...appChecks, ...inputChecks, ...deviceChecks];

export function getMediaPlayerSourceIcon(source?: string): string {
  if (!source) {
    return "mdi:import";
  }

  return checks.find(([regex]) => regex.test(source))?.[1] ?? "mdi:import";
}

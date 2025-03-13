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
  [/line|aux/i, "mdi:rca"],
  [/wifi|wireless|cast/i, "mdi:wifi"],
  [/optical|toslink/i, "mdi:optical-audio"],
  [/cd|dvd|disc/i, "mdi:disc-player"],
  [/airplay/i, "mdi:airplay"],
];

const deviceChecks: [RegExp, string][] = [
  [/tv|fehrnsehr|display/i, "mdi:tv"],
  [/speaker?s/i, "mdi:speaker"],
  [/stereo|audio|wiim/i, "mdi:audio-video"],
  [/linux/i, "mdi:linux"],
  [/desktop/i, "mdi:desktop-classic"],
  [/macbook|dell|hp|lenovo/i, "mdi:laptop"],
  [/pixel|samsung|i?phone/i, "mdi:cellphone"],
  [/home/i, "mdi:home-outline"],
  [/group|all|room|zimmer|haus/i, "mdi:speaker-multiple"],
  [/off/i, "mdi:power"],
];

const checks = [...appChecks, ...inputChecks, ...deviceChecks];

export function getMediaPlayerSourceIcon(stateObj: MediaPlayerEntity): string {
  const source = stateObj.attributes.source;

  if (!source) {
    return "mdi:import";
  }

  return checks.find(([regex]) => regex.test(source))?.[1] ?? "mdi:import";
}

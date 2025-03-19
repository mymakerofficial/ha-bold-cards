import { matchRegex, pair } from "../helpers";
import { Pair } from "../types";

const appChecks: Pair<RegExp, string>[] = [
  pair(/home assistant/i, "mdi:home-assistant"),
  pair(/spotify/i, "mdi:spotify"),
  pair(/youtube/i, "mdi:youtube"),
  pair(/netflix/i, "mdi:netflix"),
];

const inputChecks: Pair<RegExp, string>[] = [
  pair(/hdmi/i, "mdi:hdmi-port"),
  pair(/ext|analogue|comp/i, "mdi:composite"),
  pair(/bluetooth/i, "mdi:bluetooth"),
  pair(/line|aux/i, "mdi:audio-input-rca"),
  pair(/wifi|wireless|cast/i, "mdi:wifi"),
  pair(/optical|toslink/i, "mdi:toslink"),
  pair(/cd|dvd|disc/i, "mdi:disc-player"),
  pair(/phono|vinyl/i, "mdi:album"),
  pair(/usb/i, "mdi:usb"),
  pair(/airplay/i, "mdi:airplay"),
  pair(/cast/i, "mdi:cast"),
];

const deviceChecks: Pair<RegExp, string>[] = [
  pair(/tv|television|fehrnsehr/i, "mdi:television"),
  pair(/speaker?s/i, "mdi:speaker"),
  pair(/stereo|audio|wiim/i, "mdi:audio-video"),
  pair(/linux/i, "mdi:linux"),
  pair(/macbook|dell|hp|lenovo/i, "mdi:laptop"),
  pair(/desktop|mac|hub|display|monitor/i, "mdi:monitor"),
  pair(/pixel|samsung|i?phone/i, "mdi:cellphone"),
  pair(/home/i, "mdi:home-outline"),
  pair(/group|all|room|zimmer|haus/i, "mdi:speaker-multiple"),
  pair(/off/i, "mdi:power"),
];

const checks = [...appChecks, ...inputChecks, ...deviceChecks];

export function getMediaPlayerSourceIcon(source?: string): string {
  return matchRegex(source, checks, "mdi:import");
}

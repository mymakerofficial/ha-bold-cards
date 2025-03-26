import { HomeAssistant } from "../types/ha/lovelace";

export function computeIsDarkMode(hass?: HomeAssistant) {
  return (
    hass?.themes.darkMode ??
    hass?.selectedTheme?.dark ??
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

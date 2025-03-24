import {
  TemplatedConfigListRenderer,
  TemplatedConfigRenderer,
} from "../templates/templated-config-renderer";
import {
  CustomGlanceItemConfig,
  CustomGlancePageConfig,
  GlancePageConfig,
  GlancePageType,
  WeatherGlancePageConfig,
} from "./types";
import { HomeAssistant } from "../../types/ha/lovelace";
import { parseYamlBoolean } from "../helpers";

export function getGlancePagesRenderer(hass?: HomeAssistant) {
  return new TemplatedConfigListRenderer<GlancePageConfig>(hass, (value) => {
    if (value.type === GlancePageType.CUSTOM) {
      return new TemplatedConfigRenderer<CustomGlancePageConfig>(hass, [
        {
          templateKey: "title_template",
          resultKey: "title",
        },
        {
          templateKey: "visibility_template",
          resultKey: "visibility",
          transform: parseYamlBoolean,
        },
      ]) as TemplatedConfigRenderer<GlancePageConfig>;
    }
    if (value.type === GlancePageType.WEATHER) {
      return new TemplatedConfigRenderer<WeatherGlancePageConfig>(hass, [
        {
          templateKey: "entity_template",
          resultKey: "entity",
        },
      ]) as TemplatedConfigRenderer<GlancePageConfig>;
    }
    throw new Error("Unsupported glance page type");
  });
}

export function getCustomGlanceItemsRenderer(hass?: HomeAssistant) {
  return new TemplatedConfigListRenderer<CustomGlanceItemConfig>(
    hass,
    () =>
      new TemplatedConfigRenderer<CustomGlanceItemConfig>(hass, [
        {
          templateKey: "icon_template",
          resultKey: "icon",
        },
        {
          templateKey: "content_template",
          resultKey: "content",
        },
      ]),
  );
}

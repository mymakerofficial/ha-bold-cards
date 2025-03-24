import {
  TemplatedConfigListRenderer,
  TemplatedConfigRenderer,
  TemplatedConfigRendererKey,
} from "../templates/templated-config-renderer";
import {
  CustomGlanceItemConfig,
  CustomGlancePageConfig,
  GlancePageConfig,
  GlancePageType,
  DateTimeGlancePageConfig,
  GlanceItemConfig,
  GlanceItemType,
  WeatherGlanceItemConfig,
} from "./types";
import { HomeAssistant } from "../../types/ha/lovelace";
import { parseYamlBoolean } from "../helpers";

export function getCustomGlancePageRenderer(
  hass?: HomeAssistant,
  partial: boolean = false,
) {
  const keys: TemplatedConfigRendererKey<CustomGlancePageConfig>[] = [
    {
      templateKey: "title_template",
      resultKey: "title",
    },
  ];

  return new TemplatedConfigRenderer<CustomGlancePageConfig>(hass, [
    ...(!partial ? keys : []),
    {
      templateKey: "visibility_template",
      resultKey: "visibility",
      transform: parseYamlBoolean,
    },
  ]);
}

export function getDateTimeGlancePageRenderer(hass?: HomeAssistant) {
  return new TemplatedConfigRenderer<DateTimeGlancePageConfig>(hass, []);
}

export function getGlancePageRenderer(
  hass: HomeAssistant | undefined,
  type: GlancePageType,
  partial: boolean = false,
) {
  switch (type) {
    case GlancePageType.CUSTOM:
      return getCustomGlancePageRenderer(
        hass,
        partial,
      ) as TemplatedConfigRenderer<GlancePageConfig>;
    case GlancePageType.DATE_TIME:
      return getDateTimeGlancePageRenderer(
        hass,
      ) as TemplatedConfigRenderer<GlancePageConfig>;
    default:
      throw new Error(`Unsupported glance page type: "${type ?? "undefined"}"`);
  }
}

export function getGlancePagesRenderer(
  hass?: HomeAssistant,
  partial: boolean = false,
) {
  return new TemplatedConfigListRenderer<GlancePageConfig>(hass, (value) => {
    return getGlancePageRenderer(hass, value.type, partial);
  });
}

export function getCustomGlanceItemRenderer(
  hass?: HomeAssistant,
  partial: boolean = false,
) {
  const keys: TemplatedConfigRendererKey<CustomGlanceItemConfig>[] = [
    {
      templateKey: "icon_template",
      resultKey: "icon",
    },
    {
      templateKey: "content_template",
      resultKey: "content",
    },
  ];

  return new TemplatedConfigRenderer<CustomGlanceItemConfig>(hass, [
    ...(!partial ? keys : []),
    {
      templateKey: "visibility_template",
      resultKey: "visibility",
      transform: parseYamlBoolean,
    },
  ]);
}

export function getWeatherGlanceItemRenderer(
  hass?: HomeAssistant,
  partial: boolean = false,
) {
  const keys: TemplatedConfigRendererKey<WeatherGlanceItemConfig>[] = [
    {
      templateKey: "icon_template",
      resultKey: "icon",
    },
    {
      templateKey: "content_template",
      resultKey: "content",
    },
  ];

  return new TemplatedConfigRenderer<WeatherGlanceItemConfig>(hass, [
    ...(!partial ? keys : []),
    {
      templateKey: "visibility_template",
      resultKey: "visibility",
      transform: parseYamlBoolean,
    },
  ]);
}

export function getGlanceItemRenderer(
  hass: HomeAssistant | undefined,
  type: GlanceItemType,
  partial: boolean = false,
) {
  switch (type) {
    case GlanceItemType.CUSTOM:
      return getCustomGlanceItemRenderer(
        hass,
        partial,
      ) as TemplatedConfigRenderer<GlanceItemConfig>;
    case GlanceItemType.WEATHER:
      return getWeatherGlanceItemRenderer(
        hass,
        partial,
      ) as TemplatedConfigRenderer<GlanceItemConfig>;
    default:
      throw new Error(`Unsupported glance item type: "${type ?? "undefined"}"`);
  }
}

export function getGlanceItemsRenderer(
  hass?: HomeAssistant,
  partial: boolean = false,
) {
  return new TemplatedConfigListRenderer<GlanceItemConfig>(hass, (value) => {
    return getGlanceItemRenderer(hass, value.type, partial);
  });
}

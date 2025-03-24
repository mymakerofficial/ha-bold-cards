import {
  TemplatedConfigListRenderer,
  TemplatedConfigRendererKey,
} from "../templates/templated-config-renderer";
import {
  ConcreteCustomGlanceItem,
  ConcreteGlancePage,
  CustomGlanceItemConfig,
  GlancePageConfig,
  GlancePageType,
} from "./types";
import { HomeAssistant } from "../../types/ha/lovelace";
import { parseYamlBoolean } from "../helpers";

export function getGlancePagesRenderer(
  hass?: HomeAssistant,
): TemplatedConfigListRenderer<GlancePageConfig, ConcreteGlancePage> {
  return new TemplatedConfigListRenderer<GlancePageConfig, ConcreteGlancePage>(
    hass,
    (value) => {
      if (value.type === GlancePageType.CUSTOM) {
        return [
          {
            templateKey: "title_template",
            resultKey: "title",
          },
          {
            templateKey: "visibility_template",
            resultKey: "visibility",
            transform: parseYamlBoolean,
          },
        ] as unknown as TemplatedConfigRendererKey<
          GlancePageConfig,
          ConcreteGlancePage
        >[];
      }
      return [];
    },
    (value) => {
      if (value.type === GlancePageType.CUSTOM) {
        return {
          type: value.type,
          title: value.title ?? "",
          visibility: value.visibility ?? true,
          items: value.items ?? [],
        };
      }
      if (value.type === GlancePageType.WEATHER) {
        return {
          type: value.type,
          entity: value.entity ?? "",
        };
      }
      throw new Error("Unsupported glance page type");
    },
  );
}

export function getCustomGlanceItemsRenderer(
  hass?: HomeAssistant,
): TemplatedConfigListRenderer<
  CustomGlanceItemConfig,
  ConcreteCustomGlanceItem
> {
  return new TemplatedConfigListRenderer<
    CustomGlanceItemConfig,
    ConcreteCustomGlanceItem
  >(
    hass,
    () =>
      [
        {
          templateKey: "icon_template",
          resultKey: "icon",
        },
        {
          templateKey: "content_template",
          resultKey: "content",
        },
      ] as unknown as TemplatedConfigRendererKey<
        CustomGlanceItemConfig,
        ConcreteCustomGlanceItem
      >[],
    (value) => ({
      icon: value.icon,
      content: value.content,
    }),
  );
}

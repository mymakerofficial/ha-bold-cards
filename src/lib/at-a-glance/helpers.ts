import {
  TemplatedConfigListRenderer,
  TemplatedConfigRendererKey,
} from "../templates/templated-config-renderer";
import { ConcreteGlancePage, GlancePageConfig, GlancePageType } from "./types";
import { HomeAssistant } from "../../types/ha/lovelace";

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
            resultKey: "visible",
            transform: (result) => Boolean(result) || result === "on",
          },
        ] as unknown as TemplatedConfigRendererKey<
          GlancePageConfig,
          ConcreteGlancePage
        >[];
      }
      return [];
    },
    undefined,
    (value) => {
      if (value.type === GlancePageType.CUSTOM) {
        return {
          type: value.type,
          title: value.title,
          visible: value.visible,
          items: value.items,
        };
      }
      return value;
    },
  );
}

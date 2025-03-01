import { I18n } from "i18n-js";

const i18n = new I18n(
  {
    en: {
      common: {
        presets: "Presets",
      },
      editor: {
        common: {
          features: "Features",
          wip_section_text:
            "This section isn't ready yet. In the meantime, you can use the YAML editor to customize your card.",
        },
        controls: {
          add: "Add element",
        },
        card: {
          media_player: {
            label: {
              entity: "Entity",
              appearance: "Appearance",
              color_mode: "Color Mode",
              color: "Fallback Color",
              content_layout: "Layout",
              title_bar: "Title Bar",
              show_title_bar: "Show Title Bar",
              media_info: "Media Info",
              controls: "Inline Controls",
            },
            helper_text: {
              color:
                'Only applicable when "Color Mode" is set to "Fixed Color", or no artwork is available.',
              show_title_bar: "Show the media player's name.",
            },
          },
        },
      },
    },
  },
  {},
);

export function t(
  scope: Readonly<string | string[]>,
  options?: {
    defaultValue?: any;
    count?: number;
    scope?: Readonly<string | string[]>;
    defaults?: {
      [key: string]: any;
    }[];
    missingBehavior?: "message" | "guess" | "error" | string;
    [key: string]: any;
  },
): string {
  i18n.locale = (localStorage.getItem("selectedLanguage") || "en").replace(
    /['"]+/g,
    "",
  );
  return i18n.t(scope, {
    ...options,
  });
}

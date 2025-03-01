import { I18n } from "i18n-js";

import { MediaButtonAction } from "../lib/controls/types";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../components/bc-button";

const i18n = new I18n(
  {
    en: {
      common: {
        label: {
          presets: "Presets",
        },
        media_control_action: {
          [MediaButtonAction.TURN_ON]: "Turn On",
          [MediaButtonAction.TURN_OFF]: "Turn Off",
          [MediaButtonAction.SHUFFLE_SET]: "Set Shuffle",
          [MediaButtonAction.MEDIA_PREVIOUS_TRACK]: "Previous Track",
          [MediaButtonAction.MEDIA_PLAY]: "Play",
          [MediaButtonAction.MEDIA_PAUSE]: "Pause",
          [MediaButtonAction.MEDIA_NEXT_TRACK]: "Next Track",
          [MediaButtonAction.REPEAT_SET]: "Set Repeat",
        },
        button: {
          size: {
            [ButtonSize.SM]: "Small",
            [ButtonSize.MD]: "Medium",
            [ButtonSize.LG]: "Large",
            [ButtonSize.XL]: "Extra Large",
          },
          variant: {
            [ButtonVariant.FILLED]: "Filled",
            [ButtonVariant.TONAL]: "Tonal",
            [ButtonVariant.PLAIN]: "Plain",
          },
          shape: {
            [ButtonShape.ROUNDED]: "Rounded",
            [ButtonShape.SQUARE]: "Square",
            [ButtonShape.WIDE]: "Wide",
          },
        },
      },
      editor: {
        common: {
          label: {
            features: "Features",
          },
          wip_section_text:
            "This section isn't ready yet. In the meantime, you can use the YAML editor to customize your card.",
        },
        controls: {
          add: "Add element",
          media_button_control: {
            label: {
              size: "Size",
              variant: "Variant",
              shape: "Shape",
            },
          },
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
              controls: "Controls",
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

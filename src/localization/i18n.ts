import { I18n } from "i18n-js";
import {
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
  MediaToggleKind,
} from "../lib/controls/types";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../components/bc-button";
import { MediaPositionTimestampPosition } from "../components/bc-media-position-control";
import {
  MediaPlayerCardAlignment,
  MediaPlayerCardColorMode,
  MediaPlayerCardPicturePosition,
} from "../cards/media-player-card/types";
import { CardFeaturePosition } from "../cards/types";

type EnumTranslations<T extends string> = {
  [key in T]: string;
};

const i18n = new I18n(
  {
    en: {
      common: {
        card_feature_position: {
          [CardFeaturePosition.BOTTOM]: "Bottom",
          [CardFeaturePosition.INLINE]: "Inline",
        } satisfies EnumTranslations<CardFeaturePosition>,
        control_type: {
          [ControlType.MEDIA_BUTTON]: "Media Button",
          [ControlType.MEDIA_POSITION]: "Media Position",
          [ControlType.MEDIA_TOGGLE]: "Media Toggle Button",
          [ControlType.CUSTOM]: "Custom",
        } satisfies EnumTranslations<ControlType>,
        media_button_action: {
          [MediaButtonAction.TURN_ON]: "Turn On",
          [MediaButtonAction.TURN_OFF]: "Turn Off",
          [MediaButtonAction.SHUFFLE_SET]: "Set Shuffle",
          [MediaButtonAction.MEDIA_PREVIOUS_TRACK]: "Previous Track",
          [MediaButtonAction.MEDIA_PLAY]: "Play",
          [MediaButtonAction.MEDIA_PAUSE]: "Pause",
          [MediaButtonAction.MEDIA_NEXT_TRACK]: "Next Track",
          [MediaButtonAction.REPEAT_SET]: "Set Repeat",
        } satisfies EnumTranslations<MediaButtonAction>,
        media_toggle_kind: {
          [MediaToggleKind.ON_OFF]: "On/Off",
          [MediaToggleKind.PLAY_PAUSE]: "Play/Pause",
        } satisfies EnumTranslations<MediaToggleKind>,
        element_when_unavailable: {
          [ElementWhenUnavailable.HIDE]: "Hide",
          [ElementWhenUnavailable.DISABLE]: "Disable",
        } satisfies EnumTranslations<ElementWhenUnavailable>,
        timestamp_position: {
          [MediaPositionTimestampPosition.HIDDEN]: "Hidden",
          [MediaPositionTimestampPosition.INLINE]: "Inline",
          [MediaPositionTimestampPosition.BOTTOM]: "Bottom",
          [MediaPositionTimestampPosition.BOTTOM_LEFT]: "Bottom Left",
          [MediaPositionTimestampPosition.BOTTOM_RIGHT]: "Bottom Right",
        } satisfies EnumTranslations<MediaPositionTimestampPosition>,
        media_player_card_picture_position: {
          [MediaPlayerCardPicturePosition.INLINE]: "Inline",
          [MediaPlayerCardPicturePosition.TOP_CENTER]: "Top Center",
          [MediaPlayerCardPicturePosition.BACKGROUND]: "Background",
          [MediaPlayerCardPicturePosition.HIDE]: "Hide",
        } satisfies EnumTranslations<MediaPlayerCardPicturePosition>,
        media_player_card_alignment: {
          [MediaPlayerCardAlignment.LEFT]: "Left",
          [MediaPlayerCardAlignment.CENTER]: "Center",
          [MediaPlayerCardAlignment.RIGHT]: "Right",
        } satisfies EnumTranslations<MediaPlayerCardAlignment>,
        media_player_card_color_mode: {
          [MediaPlayerCardColorMode.AMBIENT]: "Ambient",
          [MediaPlayerCardColorMode.AMBIENT_VIBRANT]: "Ambient Vibrant",
          [MediaPlayerCardColorMode.AMBIENT_SOLID]: "Ambient Solid",
          [MediaPlayerCardColorMode.MANUAL]: "Manual",
        } satisfies EnumTranslations<MediaPlayerCardColorMode>,
        button: {
          size: {
            [ButtonSize.SM]: "Small",
            [ButtonSize.MD]: "Medium",
            [ButtonSize.LG]: "Large",
            [ButtonSize.XL]: "Extra Large",
          } satisfies EnumTranslations<ButtonSize>,
          variant: {
            [ButtonVariant.FILLED]: "Filled",
            [ButtonVariant.TONAL]: "Tonal",
            [ButtonVariant.PLAIN]: "Plain",
          } satisfies EnumTranslations<ButtonVariant>,
          shape: {
            [ButtonShape.ROUND]: "Round",
            [ButtonShape.ROUND_WIDE]: "Pill",
            [ButtonShape.ROUND_FILL]: "Pill Fill",
            [ButtonShape.SQUARE]: "Square",
            [ButtonShape.SQUARE_WIDE]: "Square Wide",
            [ButtonShape.SQUARE_FILL]: "Square Fill",
          } satisfies EnumTranslations<ButtonShape>,
        },
      },
      card: {
        air_quality: {
          label: {
            air_quality: "Air Quality",
          },
        },
      },
      editor: {
        common: {
          default_with_value: "Default (%{value})",
          label: {
            presets: "Presets",
            features: "Features",
          },
          wip_section_text:
            "This section isn't ready yet. In the meantime, you can use the YAML editor to customize your card.",
        },
        controls: {
          add: "Add control",
          no_controls: "Looks like you want to add some controls.",
          no_settings: "No settings available for this control.",
          media_button_control: {
            label: {
              icon: "Icon",
              size: "Size",
              variant: "Variant",
              shape: "Shape",
              when_unavailable: "When Unavailable",
              always_show: "Always Show",
            },
            helper: {
              when_unavailable:
                "What to do when this feature is not supported by the entity.",
              always_show:
                "Show this control even when it might not make sense (e.g. play button when already playing). The control might still be hidden or disabled depending on the 'When Unavailable' setting.",
            },
          },
          media_position_control: {
            label: {
              timestamp_position: "Timestamp Position",
              when_unavailable: "When Unavailable",
            },
            helper: {
              when_unavailable:
                "What to do when this feature is not supported by the entity.",
            },
          },
        },
        card: {
          media_player: {
            label: {
              entity: "Entity",
              content: "Content",
              color_mode: "Color Mode",
              color: "Fallback Color",
              picture_position: "Artwork Position",
              info_alignment: "Info Alignment",
              feature_position: "First Feature Position",
              show_title_bar: "Show Title Bar",
              additional_controls: `Controls (%{count})`,
            },
            helper_text: {
              color:
                'Only applicable when "Color Mode" is set to "Manual", or no artwork is available.',
              show_title_bar: "Show the media player's name.",
            },
          },
        },
      },
    },
  },
  {
    enableFallback: true,
    defaultLocale: "en",
  },
);

export type TranslateOptions = {
  defaultValue?: any;
  count?: number;
  scope?: Readonly<string | string[]>;
  defaults?: {
    [key: string]: any;
  }[];
  missingBehavior?: "message" | "guess" | "error" | string;
  [key: string]: any;
};

export function t(
  scope: Readonly<string | string[]>,
  options?: TranslateOptions,
): string {
  i18n.locale = (localStorage.getItem("selectedLanguage") || "en").replace(
    /['"]+/g,
    "",
  );
  return i18n.t(scope, {
    ...options,
  });
}

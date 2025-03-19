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
  MediaPlayerCardHorizontalAlignment,
  MediaPlayerCardColorMode,
  MediaPlayerCardPicturePosition,
  MediaPlayerCardVerticalAlignment,
} from "../cards/media-player-card/types";
import { CardFeaturePosition } from "../cards/types";
import { MediaPlayerState } from "../types/ha/entity";

type EnumTranslations<T extends string> = {
  [key in T]: string;
};

const i18n = new I18n(
  {
    en: {
      common: {
        entity_state: {
          [MediaPlayerState.IDLE]: "Idle",
          [MediaPlayerState.OFF]: "Off",
          [MediaPlayerState.ON]: "On",
          [MediaPlayerState.PLAYING]: "Playing",
          [MediaPlayerState.PAUSED]: "Paused",
          [MediaPlayerState.BUFFERING]: "Buffering",
          [MediaPlayerState.UNAVAILABLE]: "Unavailable",
          [MediaPlayerState.UNKNOWN]: "Unknown",
          [MediaPlayerState.STANDBY]: "Standby",
        } satisfies EnumTranslations<MediaPlayerState>,
        card_feature_position: {
          [CardFeaturePosition.BOTTOM]: "Bottom",
          [CardFeaturePosition.INLINE]: "Inline",
        } satisfies EnumTranslations<CardFeaturePosition>,
        control_type: {
          [ControlType.MEDIA_BUTTON]: "Media Button",
          [ControlType.MEDIA_POSITION]: "Media Position",
          [ControlType.MEDIA_TOGGLE]: "Media Toggle Button",
          [ControlType.SPACER]: "Spacer",
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
          [MediaPlayerCardPicturePosition.BACKGROUND]: "Background",
          [MediaPlayerCardPicturePosition.INLINE_LEFT]: "Inline Left",
          [MediaPlayerCardPicturePosition.INLINE_RIGHT]: "Inline Right",
          [MediaPlayerCardPicturePosition.TOP_LEFT]: "Top Left",
          [MediaPlayerCardPicturePosition.TOP_CENTER]: "Top Center",
          [MediaPlayerCardPicturePosition.TOP_RIGHT]: "Top Right",
          [MediaPlayerCardPicturePosition.HIDE]: "Hide",
        } satisfies EnumTranslations<MediaPlayerCardPicturePosition>,
        media_player_card_horizontal_alignment: {
          [MediaPlayerCardHorizontalAlignment.LEFT]: "Left",
          [MediaPlayerCardHorizontalAlignment.CENTER]: "Center",
          [MediaPlayerCardHorizontalAlignment.RIGHT]: "Right",
        } satisfies EnumTranslations<MediaPlayerCardHorizontalAlignment>,
        media_player_card_vertical_alignment: {
          [MediaPlayerCardVerticalAlignment.TOP]: "Top",
          [MediaPlayerCardVerticalAlignment.CENTER]: "Center",
          [MediaPlayerCardVerticalAlignment.BOTTOM]: "Bottom",
        } satisfies EnumTranslations<MediaPlayerCardVerticalAlignment>,
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
        media_player: {
          label: {
            no_media: "%{entity} is currently %{state}.",
          },
        },
        air_quality: {
          label: {
            air_quality: "Air Quality",
          },
        },
      },
      feature: {
        media_player_source_select: {
          label: {
            source: {
              generic: "Source",
              spotify: "Playing Spotify on",
            },
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
        features: {
          add: "Add feature",
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
              unavailable_when_off: "Unavailable When Off",
            },
            helper: {
              when_unavailable:
                "What to do when this feature is not supported by the entity.",
              always_show:
                "Show this control even when it might not make sense (e.g. play button when already playing). The control might still be hidden or disabled depending on the 'When Unavailable' setting.",
              unavailable_when_off:
                "Make this control behave as if it were unsupported (unavailable) when the entity is off, idle, unavailable or in standby.",
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
              layout: "Layout",
              appearance: "Appearance",
              content: "Content",
              color_mode: "Color Mode",
              color: "Fallback Color",
              picture_position: "Artwork Position",
              horizontal_alignment: "Horizontal Alignment",
              vertical_alignment: "Vertical Alignment",
              feature_position: "First Feature Position",
              show_title_bar: "Show Title Bar",
              hide_media_info: "Hide Media Info",
              placeholder_when_off: "Replace with Placeholder When Off",
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

import {
  ControlConfig,
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
  MediaToggleKind,
} from "../../../lib/controls/types";
import { ButtonSize } from "../../../components/bc-button";
import {
  MediaPlayerCardAlignment,
  MediaPlayerCardColorMode,
  MediaPlayerCardPicturePosition,
  MediaPlayerTileConfig,
} from "../../../cards/media-player-card/types";
import { BoldMediaPlayerControlRowFeature } from "../../../features/media-player-control-row-feature/bold-media-player-control-row-feature";
import { MediaPositionTimestampPosition } from "../../../components/bc-media-position-control";
import { LovelaceCardFeatureConfig } from "../../../types/ha/feature";
import { CardFeaturePosition } from "../../../cards/types";

function controlsRow(controls: ControlConfig[]): LovelaceCardFeatureConfig {
  return {
    ...BoldMediaPlayerControlRowFeature.getStubConfig(),
    controls,
  };
}

const positionOnly = {
  ...BoldMediaPlayerControlRowFeature.getStubConfig(),
  controls: [
    {
      type: ControlType.MEDIA_POSITION,
      timestamp_position: MediaPositionTimestampPosition.BOTTOM,
    },
  ],
  when_unavailable: ElementWhenUnavailable.HIDE,
};

const positionPlusButtons = {
  ...BoldMediaPlayerControlRowFeature.getStubConfig(),
  controls: [
    {
      type: ControlType.MEDIA_BUTTON,
      action: MediaButtonAction.SHUFFLE_SET,
      size: ButtonSize.SM,
    },
    {
      type: ControlType.MEDIA_BUTTON,
      action: MediaButtonAction.MEDIA_PREVIOUS_TRACK,
      size: ButtonSize.SM,
    },
    {
      type: ControlType.MEDIA_POSITION,
    },
    {
      type: ControlType.MEDIA_BUTTON,
      action: MediaButtonAction.MEDIA_NEXT_TRACK,
      size: ButtonSize.SM,
    },
    {
      type: ControlType.MEDIA_BUTTON,
      action: MediaButtonAction.REPEAT_SET,
      size: ButtonSize.SM,
    },
  ],
  when_unavailable: ElementWhenUnavailable.HIDE,
};

export const presets: {
  name: string;
  config: Partial<MediaPlayerTileConfig>;
}[] = [
  {
    name: "Default",
    config: {
      picture_position: MediaPlayerCardPicturePosition.BACKGROUND,
      info_alignment: MediaPlayerCardAlignment.LEFT,
      feature_position: CardFeaturePosition.INLINE,
      color_mode: MediaPlayerCardColorMode.AMBIENT_SOLID,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 3,
        columns: 12,
      },
      features: [
        controlsRow([
          {
            type: ControlType.MEDIA_TOGGLE,
            kind: MediaToggleKind.ON_OFF,
          },
          {
            type: ControlType.MEDIA_TOGGLE,
            kind: MediaToggleKind.PLAY_PAUSE,
          },
        ]),
        positionPlusButtons,
      ],
    },
  },
  {
    name: "Horizontal Vibrant",
    config: {
      picture_position: MediaPlayerCardPicturePosition.INLINE,
      info_alignment: MediaPlayerCardAlignment.LEFT,
      feature_position: CardFeaturePosition.INLINE,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 3,
        columns: 12,
      },
      features: [
        controlsRow([
          {
            type: ControlType.MEDIA_TOGGLE,
            kind: MediaToggleKind.ON_OFF,
          },
          {
            type: ControlType.MEDIA_TOGGLE,
            kind: MediaToggleKind.PLAY_PAUSE,
          },
        ]),
        positionPlusButtons,
      ],
    },
  },
  {
    name: "Horizontal Artwork Background Space",
    config: {
      picture_position: MediaPlayerCardPicturePosition.BACKGROUND,
      info_alignment: MediaPlayerCardAlignment.LEFT,
      feature_position: CardFeaturePosition.INLINE,
      color_mode: MediaPlayerCardColorMode.AMBIENT_SOLID,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 4,
        columns: 12,
      },
      features: [
        controlsRow([
          {
            type: ControlType.MEDIA_TOGGLE,
            kind: MediaToggleKind.ON_OFF,
          },
          {
            type: ControlType.MEDIA_TOGGLE,
            kind: MediaToggleKind.PLAY_PAUSE,
          },
        ]),
        positionPlusButtons,
      ],
    },
  },
  {
    name: "Artwork Square",
    config: {
      picture_position: MediaPlayerCardPicturePosition.BACKGROUND,
      info_alignment: MediaPlayerCardAlignment.LEFT,
      feature_position: CardFeaturePosition.INLINE,
      color_mode: MediaPlayerCardColorMode.AMBIENT_SOLID,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 4,
        columns: 6,
      },
      features: [
        controlsRow([
          {
            type: ControlType.MEDIA_TOGGLE,
            kind: MediaToggleKind.PLAY_PAUSE,
            when_unavailable: ElementWhenUnavailable.HIDE,
          },
        ]),
      ],
    },
  },
  {
    name: "Artwork Square Large",
    config: {
      picture_position: MediaPlayerCardPicturePosition.BACKGROUND,
      info_alignment: MediaPlayerCardAlignment.LEFT,
      feature_position: CardFeaturePosition.INLINE,
      color_mode: MediaPlayerCardColorMode.AMBIENT_SOLID,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 7,
        columns: 12,
      },
      features: [
        controlsRow([
          {
            type: ControlType.MEDIA_TOGGLE,
            kind: MediaToggleKind.ON_OFF,
          },
          {
            type: ControlType.MEDIA_TOGGLE,
            kind: MediaToggleKind.PLAY_PAUSE,
          },
        ]),
        positionPlusButtons,
      ],
    },
  },
  {
    name: "Vertical Full",
    config: {
      picture_position: MediaPlayerCardPicturePosition.TOP_CENTER,
      info_alignment: MediaPlayerCardAlignment.CENTER,
      feature_position: CardFeaturePosition.BOTTOM,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        columns: 12,
      },
      features: [
        positionOnly,
        BoldMediaPlayerControlRowFeature.getStubConfig(),
        {
          type: "media-player-volume-slider",
        },
      ],
    },
  },
  {
    name: "Vertical Full Artwork Background",
    config: {
      picture_position: MediaPlayerCardPicturePosition.BACKGROUND,
      info_alignment: MediaPlayerCardAlignment.CENTER,
      feature_position: CardFeaturePosition.BOTTOM,
      color_mode: MediaPlayerCardColorMode.AMBIENT_SOLID,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        columns: 12,
      },
      features: [
        positionOnly,
        BoldMediaPlayerControlRowFeature.getStubConfig(),
        {
          type: "media-player-volume-slider",
        },
      ],
    },
  },
  {
    name: "Simple Play/Pause",
    config: {
      picture_position: MediaPlayerCardPicturePosition.INLINE,
      info_alignment: MediaPlayerCardAlignment.LEFT,
      feature_position: CardFeaturePosition.INLINE,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        columns: 12,
      },
      features: [
        controlsRow([
          {
            type: ControlType.MEDIA_TOGGLE,
            kind: MediaToggleKind.PLAY_PAUSE,
          },
        ]),
      ],
    },
  },
];

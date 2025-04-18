import {
  ControlConfig,
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
  MediaToggleKind,
} from "../../../lib/controls/types";
import { ButtonSize } from "../../../components/bc-button";
import {
  BoldMediaPlayerCardConfig,
  MediaPlayerCardBackgroundPictureStyle,
  MediaPlayerCardColorMode,
} from "../../../cards/media-player-card/types";
import { BoldMediaPlayerControlRowFeature } from "../../../features/media-player-control-row-feature/bold-media-player-control-row-feature";
import { MediaPositionTimestampPosition } from "../../../components/bc-media-position-control";
import { LovelaceCardFeatureConfig } from "../../../types/ha/feature";
import { CardFeaturePosition } from "../../../cards/types";

import { InlinePosition, Position } from "../../../lib/layout/position";

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
      unavailable_when_off: true,
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
      unavailable_when_off: true,
    },
    {
      type: ControlType.MEDIA_BUTTON,
      action: MediaButtonAction.MEDIA_PREVIOUS_TRACK,
      size: ButtonSize.SM,
      unavailable_when_off: true,
    },
    {
      type: ControlType.MEDIA_POSITION,
      unavailable_when_off: true,
    },
    {
      type: ControlType.MEDIA_BUTTON,
      action: MediaButtonAction.MEDIA_NEXT_TRACK,
      size: ButtonSize.SM,
      unavailable_when_off: true,
    },
    {
      type: ControlType.MEDIA_BUTTON,
      action: MediaButtonAction.REPEAT_SET,
      size: ButtonSize.SM,
      unavailable_when_off: true,
    },
  ],
  when_unavailable: ElementWhenUnavailable.HIDE,
};

export const presets: {
  name: string;
  config: Partial<BoldMediaPlayerCardConfig>;
}[] = [
  {
    name: "Default",
    config: {
      picture_position: InlinePosition.INLINE_LEFT,
      show_picture: false,
      background_picture: MediaPlayerCardBackgroundPictureStyle.COVER,
      text_position: Position.MIDDLE_LEFT,
      feature_position: InlinePosition.INLINE_RIGHT,
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
      picture_position: InlinePosition.INLINE_LEFT,
      show_picture: true,
      background_picture: MediaPlayerCardBackgroundPictureStyle.HIDE,
      text_position: Position.MIDDLE_LEFT,
      feature_position: InlinePosition.INLINE_RIGHT,
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
      picture_position: InlinePosition.INLINE_LEFT,
      show_picture: false,
      background_picture: MediaPlayerCardBackgroundPictureStyle.COVER,
      text_position: Position.BOTTOM_LEFT,
      feature_position: InlinePosition.INLINE_RIGHT,
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
      picture_position: InlinePosition.INLINE_LEFT,
      show_picture: false,
      background_picture: MediaPlayerCardBackgroundPictureStyle.COVER,
      text_position: Position.BOTTOM_LEFT,
      feature_position: InlinePosition.INLINE_RIGHT,
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
      picture_position: InlinePosition.INLINE_LEFT,
      show_picture: false,
      background_picture: MediaPlayerCardBackgroundPictureStyle.COVER,
      text_position: Position.BOTTOM_LEFT,
      feature_position: InlinePosition.INLINE_RIGHT,
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
      picture_position: Position.TOP_CENTER,
      show_picture: true,
      background_picture: MediaPlayerCardBackgroundPictureStyle.HIDE,
      text_position: Position.BOTTOM_CENTER,
      feature_position: CardFeaturePosition.BOTTOM,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 10,
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
      picture_position: InlinePosition.INLINE_LEFT,
      show_picture: false,
      background_picture: MediaPlayerCardBackgroundPictureStyle.COVER,
      text_position: Position.BOTTOM_CENTER,
      feature_position: CardFeaturePosition.BOTTOM,
      color_mode: MediaPlayerCardColorMode.AMBIENT_SOLID,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 9,
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
      picture_position: InlinePosition.INLINE_LEFT,
      show_picture: true,
      background_picture: MediaPlayerCardBackgroundPictureStyle.HIDE,
      text_position: Position.BOTTOM_LEFT,
      feature_position: InlinePosition.INLINE_RIGHT,
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
  {
    name: "Info Only",
    config: {
      picture_position: InlinePosition.INLINE_LEFT,
      show_picture: true,
      background_picture: MediaPlayerCardBackgroundPictureStyle.HIDE,
      text_position: Position.MIDDLE_CENTER,
      feature_position: InlinePosition.INLINE_RIGHT,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: false,
      grid_options: {
        columns: 12,
      },
      features: [],
    },
  },
  {
    name: "Large Centered",
    config: {
      picture_position: Position.TOP_CENTER,
      show_picture: true,
      background_picture: MediaPlayerCardBackgroundPictureStyle.HIDE,
      text_position: Position.BOTTOM_CENTER,
      feature_position: InlinePosition.INLINE_RIGHT,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: false,
      grid_options: {
        rows: 6,
        columns: 12,
      },
      features: [],
    },
  },
];

import {
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
  MediaToggleKind,
} from "../../../lib/controls/types";
import { ButtonShape, ButtonSize } from "../../../components/bc-button";
import {
  MediaPlayerCardColorMode,
  MediaPlayerCardContentLayout,
  MediaPlayerTileConfig,
} from "../../../cards/media-player-card/types";
import { BoldMediaPlayerControlRowFeature } from "../../../features/media-player-control-row-feature/bold-media-player-control-row-feature";
import { MediaPositionTimestampPosition } from "../../../components/bc-media-position-control";

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
      controls: [
        {
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.ON_OFF,
        },
        {
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.PLAY_PAUSE,
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 3,
        columns: 12,
      },
      features: [positionPlusButtons],
    },
  },
  {
    name: "Horizontal Vibrant",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.ON_OFF,
        },
        {
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.PLAY_PAUSE,
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 3,
        columns: 12,
      },
      features: [positionPlusButtons],
    },
  },
  {
    name: "Horizontal Artwork Background Space",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.ON_OFF,
        },
        {
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.PLAY_PAUSE,
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 4,
        columns: 12,
      },
      features: [positionPlusButtons],
    },
  },
  {
    name: "Artwork Square",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.PLAY_PAUSE,
          [MediaButtonAction.MEDIA_PLAY]: {
            size: ButtonSize.MD,
            shape: ButtonShape.ROUNDED,
          },
          [MediaButtonAction.MEDIA_PAUSE]: {
            size: ButtonSize.MD,
            shape: ButtonShape.ROUNDED,
          },
          when_unavailable: ElementWhenUnavailable.HIDE,
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 4,
        columns: 6,
      },
      features: [],
    },
  },
  {
    name: "Artwork Square Large",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.ON_OFF,
          [MediaButtonAction.TURN_OFF]: {
            size: ButtonSize.MD,
            shape: ButtonShape.ROUNDED,
          },
          [MediaButtonAction.TURN_ON]: {
            size: ButtonSize.MD,
            shape: ButtonShape.ROUNDED,
          },
        },
        {
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.PLAY_PAUSE,
          [MediaButtonAction.MEDIA_PLAY]: {
            size: ButtonSize.MD,
            shape: ButtonShape.ROUNDED,
          },
          [MediaButtonAction.MEDIA_PAUSE]: {
            size: ButtonSize.MD,
            shape: ButtonShape.ROUNDED,
          },
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 7,
        columns: 12,
      },
      features: [positionPlusButtons],
    },
  },
  {
    name: "Vertical Full",
    config: {
      controls: [],
      content_layout: MediaPlayerCardContentLayout.VERTICAL,
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
      controls: [],
      content_layout: MediaPlayerCardContentLayout.VERTICAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
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
    name: "Horizontal Full Artwork Background",
    config: {
      controls: [],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
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
      controls: [
        {
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.ON_OFF,
        },
        {
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.PLAY_PAUSE,
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        columns: 12,
      },
      features: [],
    },
  },
];

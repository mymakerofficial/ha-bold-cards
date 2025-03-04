import {
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
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
};

export const presets = [
  {
    name: "Horizontal Default",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_ON,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_OFF,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
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
    name: "Horizontal Artwork Background",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_ON,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_OFF,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
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
    name: "Horizontal Artwork Background Space",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_ON,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_OFF,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
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
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
          when_unavailable: ElementWhenUnavailable.HIDE,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
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
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_ON,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_OFF,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
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
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
          when_unavailable: ElementWhenUnavailable.HIDE,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
          when_unavailable: ElementWhenUnavailable.HIDE,
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
] satisfies {
  name: string;
  config: Partial<MediaPlayerTileConfig>;
}[];

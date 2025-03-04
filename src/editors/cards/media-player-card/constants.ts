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
import { MediaPlayerProgressControlFeature } from "../../../features/media-player-progress-control/media-player-progress-control";
import { MediaPlayerControlButtonRowFeature } from "../../../features/media-player-control-button-row/media-player-control-button-row";

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
      features: [MediaPlayerProgressControlFeature.getStubConfig()],
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
      features: [MediaPlayerProgressControlFeature.getStubConfig()],
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
      features: [MediaPlayerProgressControlFeature.getStubConfig()],
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
      features: [MediaPlayerProgressControlFeature.getStubConfig()],
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
        {
          ...MediaPlayerProgressControlFeature.getStubConfig(),
          full_width: false,
          show_timestamps: true,
          controls: [],
        },
        MediaPlayerControlButtonRowFeature.getStubConfig(),
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
        {
          ...MediaPlayerProgressControlFeature.getStubConfig(),
          full_width: false,
          show_timestamps: true,
          controls: [],
        },
        MediaPlayerControlButtonRowFeature.getStubConfig(),
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
        {
          ...MediaPlayerProgressControlFeature.getStubConfig(),
          full_width: true,
          show_timestamps: true,
          controls: [],
        },
        MediaPlayerControlButtonRowFeature.getStubConfig(),
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

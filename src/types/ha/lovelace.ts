import {
  ActionConfig,
  HomeAssistant as HomeAssistantBase,
  LovelaceConfig,
} from "custom-card-helpers";
import { LovelaceCardFeatureConfig } from "./feature";

export interface ThemeSettings {
  theme: string;
  dark?: boolean;
  primaryColor?: string;
  accentColor?: string;
}

export interface HomeAssistant
  extends Omit<HomeAssistantBase, "selectedTheme"> {
  hassUrl(path?): string;
  selectedTheme: ThemeSettings | null;
}

export interface LovelaceCardConfig {
  index?: number;
  view_index?: number;
  view_layout?: any;
  /** @deprecated Use `grid_options` instead */
  layout_options?: LovelaceLayoutOptions;
  grid_options?: LovelaceGridOptions;
  type: string;
  [key: string]: any;
  visibility?: {
    condition: string;
  }[];
}

export interface TileCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  hide_state?: boolean;
  state_content?: string | string[];
  icon?: string;
  color?: string;
  show_entity_picture?: boolean;
  vertical?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  icon_tap_action?: ActionConfig;
  icon_hold_action?: ActionConfig;
  icon_double_tap_action?: ActionConfig;
  features?: LovelaceCardFeatureConfig[];
  features_position?: "bottom" | "inline";
}

export interface LovelaceLayoutOptions {
  grid_columns?: number | "full";
  grid_rows?: number | "auto";
  grid_max_columns?: number;
  grid_min_columns?: number;
  grid_min_rows?: number;
  grid_max_rows?: number;
}

export interface LovelaceGridOptions {
  columns?: number | "full";
  rows?: number | "auto";
  max_columns?: number;
  min_columns?: number;
  min_rows?: number;
  max_rows?: number;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  preview?: boolean;
  layout?: string;
  getCardSize(): number | Promise<number>;
  /** @deprecated Use `getGridOptions` instead */
  getLayoutOptions?(): LovelaceLayoutOptions;
  getGridOptions?(): LovelaceGridOptions;
  setConfig(config: LovelaceCardConfig): void;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  lovelace?: LovelaceConfig;
  context?: any;
  setConfig(config: any): void;
  focusYamlEditor?: () => void;
}

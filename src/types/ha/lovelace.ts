import {
  HomeAssistant as HomeAssistantBase,
  LovelaceConfig,
} from "custom-card-helpers";
import { FeatureInternals, LovelaceCardFeatureConfig } from "./feature";

type EntityCategory = "config" | "diagnostic";

export interface EntityRegistryDisplayEntry {
  entity_id: string;
  name?: string;
  icon?: string;
  device_id?: string;
  area_id?: string;
  labels: string[];
  hidden?: boolean;
  entity_category?: EntityCategory;
  translation_key?: string;
  platform?: string;
  display_precision?: number;
}

export interface RegistryEntry {
  created_at: number;
  modified_at: number;
}

export interface DeviceRegistryEntry extends RegistryEntry {
  id: string;
  config_entries: string[];
  config_entries_subentries: Record<string, (string | null)[]>;
  connections: [string, string][];
  identifiers: [string, string][];
  manufacturer: string | null;
  model: string | null;
  model_id: string | null;
  name: string | null;
  labels: string[];
  sw_version: string | null;
  hw_version: string | null;
  serial_number: string | null;
  via_device_id: string | null;
  area_id: string | null;
  name_by_user: string | null;
  entry_type: "service" | null;
  disabled_by: "user" | "integration" | "config_entry" | null;
  configuration_url: string | null;
  primary_config_entry: string | null;
}

export interface ThemeSettings {
  theme: string;
  dark?: boolean;
  primaryColor?: string;
  accentColor?: string;
}

export interface HomeAssistant
  extends Omit<HomeAssistantBase, "selectedTheme"> {
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryEntry>;
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

export interface LovelaceCard<TConfig = LovelaceCardConfig>
  extends HTMLElement {
  hass?: HomeAssistant;
  preview?: boolean;
  layout?: string;
  getCardSize(): number | Promise<number>;
  /** @deprecated Use `getGridOptions` instead */
  getLayoutOptions?(): LovelaceLayoutOptions;
  getGridOptions?(): LovelaceGridOptions;
  setConfig(config: TConfig): void;
}

export interface LovelaceGenericElementEditor<
  TConfig = any,
  TContext = LovelaceCardFeatureEditorContext,
> extends HTMLElement {
  hass?: HomeAssistant;
  lovelace?: LovelaceConfig;
  context?: TContext;
  setConfig(config: TConfig): void;
  focusYamlEditor?: () => void;
}

export interface LovelaceCardEditor<
  TConfig = LovelaceCardConfig,
  TContext = any,
> extends LovelaceGenericElementEditor<TConfig, TContext> {}

export interface LovelaceCardFeatureEditor<
  TConfig = LovelaceCardFeatureConfig,
  TContext = LovelaceCardFeatureEditorContext,
> extends LovelaceGenericElementEditor<TConfig, TContext> {}

export interface LovelaceCardFeatureEditorContext {
  // TODO what if we want to pass more than just the entity?
  entity_id?: string;
  internals?: FeatureInternals;
}

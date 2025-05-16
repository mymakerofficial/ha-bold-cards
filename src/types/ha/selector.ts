export interface SelectBoxOptionImage {
  src: string;
  src_dark?: string;
  flip_rtl?: boolean;
}

export interface SelectOption {
  value: any;
  label: string;
  description?: string;
  image?: string | SelectBoxOptionImage;
  disabled?: boolean;
  // not supported by home assistant elements
  icon?: string;
  // not supported by home assistant elements
  hideLabel?: boolean;
}

export interface SelectSelector {
  select: {
    multiple?: boolean;
    custom_value?: boolean;
    mode?: "list" | "dropdown";
    options: readonly string[] | readonly SelectOption[];
    translation_key?: string;
    sort?: boolean;
    reorder?: boolean;
  } | null;
}

interface EntitySelectorFilter {
  integration?: string;
  domain?: string | string[];
  device_class?: string | string[];
  supported_features?: number | [number];
}

export interface EntitySelectorInner {
  multiple?: boolean;
  include_entities?: string[];
  exclude_entities?: string[];
  filter?: EntitySelectorFilter | EntitySelectorFilter[];
}

export interface EntitySelector {
  entity: EntitySelectorInner | null;
}

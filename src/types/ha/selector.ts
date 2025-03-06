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

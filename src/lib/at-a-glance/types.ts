const _GlancePageType = {
  CUSTOM: "custom",
  DATE_TIME: "date-time",
} as const;
export const GlancePageType = _GlancePageType;
export type GlancePageType =
  (typeof _GlancePageType)[keyof typeof _GlancePageType];
export type GlancePageTypes = typeof _GlancePageType;

const _GlanceItemType = {
  CUSTOM: "custom",
  WEATHER: "weather",
} as const;
export const GlanceItemType = _GlanceItemType;
export type GlanceItemType =
  (typeof _GlanceItemType)[keyof typeof _GlanceItemType];
export type GlanceItemTypes = typeof _GlanceItemType;

export interface CustomGlanceItemConfig {
  type: GlanceItemTypes["CUSTOM"];
  icon?: string;
  icon_template?: string;
  content?: string;
  content_template?: string;
  visibility?: boolean;
  visibility_template?: string;
}

export interface WeatherGlanceItemConfig {
  type: GlanceItemTypes["WEATHER"];
  entity?: string;
  entity_template?: string;
  icon?: string;
  icon_template?: string;
  content?: string;
  content_template?: string;
  visibility?: boolean;
  visibility_template?: string;
}

export type GlanceItemConfig = CustomGlanceItemConfig | WeatherGlanceItemConfig;

export interface BaseGlancePageConfig {
  items?: GlanceItemConfig[];
}

export interface CustomGlancePageConfig extends BaseGlancePageConfig {
  type: GlancePageTypes["CUSTOM"];
  visibility?: boolean;
  visibility_template?: string;
  title?: string;
  title_template?: string;
}

export interface DateTimeGlancePageConfig extends BaseGlancePageConfig {
  type: GlancePageTypes["DATE_TIME"];
}

export type GlancePageConfig =
  | CustomGlancePageConfig
  | DateTimeGlancePageConfig;

export interface ConcreteCustomGlanceItem {
  type: GlanceItemTypes["CUSTOM"];
  icon?: string;
  content?: string;
}

export interface ConcreteWeatherGlanceItem {
  type: GlanceItemTypes["WEATHER"];
  icon: string;
  content: string;
}

export type ConcreteGlanceItem =
  | ConcreteCustomGlanceItem
  | ConcreteWeatherGlanceItem;

export interface ConcreteBaseGlancePage {
  items: ConcreteGlanceItem[];
}

export interface ConcreteCustomGlancePage extends ConcreteBaseGlancePage {
  type: GlancePageTypes["CUSTOM"];
  title?: string;
  visibility: boolean;
}

export interface ConcreteDateTimeGlancePage extends ConcreteBaseGlancePage {
  type: GlancePageTypes["DATE_TIME"];
}

export type ConcreteGlancePage =
  | ConcreteCustomGlancePage
  | ConcreteDateTimeGlancePage;

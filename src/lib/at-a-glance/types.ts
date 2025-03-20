const _GlancePageType = {
  CUSTOM: "custom",
  WEATHER: "weather",
} as const;
export const GlancePageType = _GlancePageType;
export type GlancePageType =
  (typeof _GlancePageType)[keyof typeof _GlancePageType];
export type GlancePageTypes = typeof _GlancePageType;

export interface CustomGlanceItemConfig {
  icon_template: string;
  content_template: string;
}

export interface CustomGlancePageConfig {
  type: GlancePageTypes["CUSTOM"];
  visibility_template: string;
  title_template: string;
  items?: CustomGlanceItemConfig[];
}

export interface WeatherGlancePageConfig {
  type: GlancePageTypes["WEATHER"];
  entity?: string;
}

export type GlancePageConfig = CustomGlancePageConfig | WeatherGlancePageConfig;

export interface ConcreteCustomGlanceItem {
  icon: string;
  content: string;
}

export interface ConcreteCustomGlancePage {
  type: GlancePageTypes["CUSTOM"];
  title: string;
  visible: boolean;
  items: CustomGlanceItemConfig[];
}

export interface ConcreteWeatherGlancePage {
  type: GlancePageTypes["WEATHER"];
  entity: string;
}

export type ConcreteGlancePage =
  | ConcreteCustomGlancePage
  | ConcreteWeatherGlancePage;

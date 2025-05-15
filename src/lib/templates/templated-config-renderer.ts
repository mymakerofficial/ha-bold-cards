import { HomeAssistant } from "../../types/ha/lovelace";
import { isTemplateError } from "./helpers";
import { isDefined, isUndefined } from "../helpers";
import { BasicHassObject } from "../basic-hass-object";
import { Maybe } from "../types";

export const TemplateRendererState = {
  PENDING: "pending",
  ERROR: "error",
  SUCCESS: "success",
} as const;
export type TemplateRendererState =
  (typeof TemplateRendererState)[keyof typeof TemplateRendererState];

export interface TemplatedConfigRendererKey<TObj extends object> {
  templateKey: keyof TObj;
  resultKey: keyof TObj;
  transform?: (result: string) => TObj[keyof TObj];
}

export interface ConfigRenderer<TObj extends object> {
  get value(): Maybe<TObj>;
  get state(): Map<keyof TObj, TemplateRendererState>;
  setValue(value: Maybe<TObj>): void;
  subscribe(listener: (value: Maybe<TObj>) => void): void;
  unsubscribe(listener: (value: Maybe<TObj>) => void): void;
  destroy(): void;
}

export class TemplatedConfigRenderer<TObj extends object>
  extends BasicHassObject
  implements ConfigRenderer<TObj>
{
  protected _value?: TObj;
  protected _keyMap: TemplatedConfigRendererKey<TObj>[] = [];
  protected _getVariables: () => Record<string, unknown>;

  protected _stateMap: Map<keyof TObj, TemplateRendererState> = new Map();

  private _unsubFuncs: Array<() => void> = [];
  private _listeners: Array<(value?: TObj) => void> = [];

  constructor(
    hass: HomeAssistant | undefined,
    keyMap: TemplatedConfigRendererKey<TObj>[],
    getVariables?: () => Record<string, unknown>,
  ) {
    super(hass);
    this._keyMap = keyMap ?? [];
    this._getVariables =
      getVariables ??
      (() => ({
        user: this.hass?.user?.name,
      }));
  }

  public get value(): TObj | undefined {
    if (!this._value) {
      return undefined;
    }
    return this._value;
  }

  public get state(): Map<keyof TObj, TemplateRendererState> {
    return this._stateMap;
  }

  protected _notify() {
    this._listeners.forEach((listener) => listener(this.value));
  }

  protected _unsubscribeRenderTemplates() {
    this._stateMap.clear();
    this._unsubFuncs.forEach((unsubFunc) => unsubFunc());
    this._unsubFuncs = [];
  }

  public setValue(value?: TObj): void {
    this._unsubscribeRenderTemplates();

    this._value = value;

    if (!value) {
      return;
    }

    const promises = this._keyMap
      .filter(({ templateKey }) => isDefined(value[templateKey]))
      .map(({ templateKey, resultKey, transform }) => {
        this._stateMap.set(resultKey, TemplateRendererState.PENDING);
        return this.subscribeToRenderTemplate({
          template: value[templateKey] as string,
          variables: this._getVariables(),
          onChange: (res) => {
            if (isTemplateError(res) || !this._value) {
              console.error(res);
              this._stateMap.set(resultKey, TemplateRendererState.ERROR);
              return;
            }

            this._value = {
              ...this._value,
              [resultKey]: (transform
                ? transform(res.result)
                : res.result) as TObj[keyof TObj],
            };
            this._stateMap.set(resultKey, TemplateRendererState.SUCCESS);
            this._notify();
          },
        });
      });

    Promise.all(promises).then((unsubFuncs) => {
      this._unsubFuncs.push(...unsubFuncs);
    });
  }

  public subscribe(listener: (value?: TObj) => void): void {
    this._listeners.push(listener);
  }

  public unsubscribe(listener: (value?: TObj) => void): void {
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
    if (this._listeners.length === 0) {
      this._unsubscribeRenderTemplates();
    }
  }

  public destroy() {
    this._unsubscribeRenderTemplates();
  }
}

export class TemplatedConfigDynamicRenderer<TObj extends object>
  extends BasicHassObject
  implements ConfigRenderer<TObj>
{
  protected _getRenderer: (value: TObj) => Maybe<ConfigRenderer<TObj>>;
  protected _dependencies: string[] = [];

  private _renderer: Maybe<ConfigRenderer<TObj>> = undefined;
  private _listeners: Array<(value: Maybe<TObj>) => void> = [];

  constructor(
    hass: HomeAssistant | undefined,
    getRenderer: (value: TObj) => Maybe<ConfigRenderer<TObj>>,
    deps?: string[],
  ) {
    super(hass);
    this._getRenderer = getRenderer;
    this._dependencies = deps ?? [];
  }

  public get value(): Maybe<TObj> {
    return this._renderer?.value;
  }

  public get state(): Map<keyof TObj, TemplateRendererState> {
    return this._renderer?.state ?? new Map();
  }

  protected _notify() {
    this._listeners.forEach((listener) => listener(this.value));
  }

  // returns true if any of the dependencies changed
  protected _compareDeps(value: TObj): boolean {
    return this._dependencies.some((dep) => {
      return value[dep] !== this.value?.[dep];
    });
  }

  public setValue(value: Maybe<TObj>): void {
    if (isDefined(value) && !this._compareDeps(value)) {
      return;
    }

    this.destroy();

    if (isUndefined(value)) {
      return;
    }

    this._renderer = this._getRenderer(value);

    if (isUndefined(this._renderer)) {
      return;
    }

    this._renderer.setValue(value);
    this._renderer.subscribe(() => this._notify());
  }

  public subscribe(listener: (value: Maybe<TObj>) => void): void {
    this._listeners.push(listener);
  }

  public unsubscribe(listener: (value: Maybe<TObj>) => void): void {
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
    if (this._listeners.length === 0) {
      this.destroy();
    }
  }

  public destroy() {
    this._renderer?.destroy();
    this._renderer = undefined;
  }
}

export class TemplatedConfigListRenderer<
  TObj extends object,
> extends BasicHassObject {
  protected _getRenderer: (value: TObj) => Maybe<ConfigRenderer<TObj>>;

  private _renderers: ConfigRenderer<TObj>[] = [];
  private _listeners: Array<(value: TObj[]) => void> = [];

  constructor(
    hass: HomeAssistant | undefined,
    getRenderer: (value: TObj) => Maybe<ConfigRenderer<TObj>>,
  ) {
    super(hass);
    this._getRenderer = getRenderer;
  }

  public get list(): TObj[] {
    return this._renderers.map((r) => r.value).filter(isDefined);
  }

  protected _notify() {
    const list = this.list;
    this._listeners.forEach((listener) => listener(list));
  }

  public setList(list?: TObj[]): void {
    this.destroy();

    if (!list) {
      return;
    }

    this._renderers = list
      .map((value) => {
        const renderer = this._getRenderer(value);
        if (isUndefined(renderer)) {
          return undefined;
        }
        renderer.setValue(value);
        renderer.subscribe(() => this._notify());
        return renderer;
      })
      .filter(isDefined);
  }

  public subscribe(listener: (value: TObj[]) => void): void {
    this._listeners.push(listener);
  }

  public unsubscribe(listener: () => void): void {
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
    if (this._listeners.length === 0) {
      this.destroy();
    }
  }

  public destroy() {
    this._renderers.forEach((renderer) => renderer.destroy());
    this._renderers = [];
  }
}

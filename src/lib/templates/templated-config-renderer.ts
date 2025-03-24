import { HomeAssistant } from "../../types/ha/lovelace";
import { isTemplateError } from "./helpers";
import { isDefined, isUndefined } from "../helpers";
import { BasicHassObject } from "../basic-hass-object";
import { Optional } from "../types";

export interface TemplatedConfigRendererKey<TObj extends object> {
  templateKey: keyof TObj;
  resultKey: keyof TObj;
  transform?: (result: string) => TObj[keyof TObj];
}

export class TemplatedConfigRenderer<
  TObj extends object,
> extends BasicHassObject {
  protected _value?: TObj;
  protected _keyMap: TemplatedConfigRendererKey<TObj>[] = [];
  protected _getVariables: () => Record<string, unknown>;

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

  protected _notify() {
    this._listeners.forEach((listener) => listener(this.value));
  }

  protected _unsubscribeRenderTemplates() {
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
      .map(({ templateKey, resultKey, transform }) =>
        this.subscribeToRenderTemplate({
          template: value[templateKey] as string,
          variables: this._getVariables(),
          onChange: (res) => {
            if (isTemplateError(res) || !this._value) {
              console.error(res);
              return;
            }

            this._value = {
              ...this._value,
              [resultKey]: (transform
                ? transform(res.result)
                : res.result) as TObj[keyof TObj],
            };
            this._notify();
          },
        }),
      );

    Promise.all(promises).then((unsubFuncs) => {
      this._unsubFuncs.push(...unsubFuncs);
    });
  }

  public subscribe(listener: (value?: TObj) => void): void {
    this._listeners.push(listener);
  }

  public unsubscribe(listener: () => void): void {
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

export class TemplatedConfigListRenderer<
  TObj extends object,
> extends BasicHassObject {
  protected _getRenderer: (
    value: TObj,
  ) => Optional<TemplatedConfigRenderer<TObj>>;

  private _renderers: TemplatedConfigRenderer<TObj>[] = [];
  private _listeners: Array<(value: TObj[]) => void> = [];

  constructor(
    hass: HomeAssistant | undefined,
    getRenderer: (value: TObj) => Optional<TemplatedConfigRenderer<TObj>>,
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

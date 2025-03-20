import { HassObject } from "../hass-object";
import { HomeAssistant } from "../../types/ha/lovelace";
import { isTemplateError } from "./helpers";
import { isDefined } from "../helpers";

export interface TemplatedConfigRendererKey {
  templateKey: string;
  resultKey: string;
  transform?: (result: string) => unknown;
}

export class TemplatedConfigRenderer<
  TObj extends object,
  TResObj extends TObj = TObj & { [key: string]: unknown },
> extends HassObject {
  protected _value?: TObj & TResObj;
  protected _keyMap: TemplatedConfigRendererKey[] = [];

  private _unsubFuncs: Array<() => void> = [];
  private _listeners: Array<(value?: TObj & TResObj) => void> = [];

  constructor(keyMap: TemplatedConfigRendererKey[], hass?: HomeAssistant) {
    super(hass);
    this._keyMap = keyMap ?? [];
  }

  public get value(): (TObj & TResObj) | undefined {
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

    this._value = value as TObj & TResObj;

    if (!value) {
      return;
    }

    const promises = this._keyMap
      .filter(({ templateKey }) => isDefined(value[templateKey]))
      .map(({ templateKey, resultKey, transform }) =>
        this.subscribeToRenderTemplate({
          template: value[templateKey] as string,
          variables: {
            user: this.hass?.user?.name,
          },
          onChange: (res) => {
            if (isTemplateError(res) || !this._value) {
              console.error(res);
              return;
            }

            this._value = {
              ...this._value,
              [resultKey]: (transform
                ? transform(res.result)
                : res.result) as TResObj[keyof TResObj],
            };
            this._notify();
          },
        }),
      );

    Promise.all(promises).then((unsubFuncs) => {
      this._unsubFuncs.push(...unsubFuncs);
    });
  }

  public subscribe(listener: (value?: TObj & TResObj) => void): void {
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
  TResObj extends TObj = TObj & { [key: string]: unknown },
> extends HassObject {
  protected _getKeyMap: (
    value: TObj,
  ) => TemplatedConfigRendererKey[] | undefined = () => [];

  private _renderers: TemplatedConfigRenderer<TObj, TResObj>[] = [];
  private _listeners: Array<(value?: (TObj & TResObj)[]) => void> = [];

  constructor(
    getKeyMap: (value: TObj) => TemplatedConfigRendererKey[] | undefined,
    hass?: HomeAssistant,
  ) {
    super(hass);
    this._getKeyMap = getKeyMap;
  }

  public get list(): (TObj & TResObj)[] {
    return this._renderers.map((r) => r.value) as (TObj & TResObj)[];
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

    this._renderers = list.map((value) => {
      const renderer = new TemplatedConfigRenderer<TObj, TResObj>(
        this._getKeyMap(value) ?? [],
        this.hass,
      );
      renderer.setValue(value);
      renderer.subscribe(() => this._notify());
      return renderer;
    });
  }

  public subscribe(listener: (value?: (TObj & TResObj)[]) => void): void {
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

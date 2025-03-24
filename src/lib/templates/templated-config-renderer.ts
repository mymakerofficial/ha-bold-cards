import { HomeAssistant } from "../../types/ha/lovelace";
import { isTemplateError } from "./helpers";
import { isDefined } from "../helpers";
import { BasicHassObject } from "../basic-hass-object";

type CombinedResult<
  TObj extends object,
  TResObj extends object = { [key: string]: unknown },
> = TObj & { [key: string]: unknown } & Partial<TResObj>;

export interface TemplatedConfigRendererKey<
  TObj extends object,
  TResObj extends object = { [key: string]: unknown },
> {
  templateKey: keyof TObj;
  resultKey: keyof TResObj;
  transform?: (result: string) => TResObj[keyof TResObj];
}

type TransformFunc<
  TObj extends object,
  TResObj extends object = { [key: string]: unknown },
> = (value: CombinedResult<TObj, TResObj>) => TResObj;

export class TemplatedConfigRenderer<
  TObj extends object,
  TResObj extends object = { [key: string]: unknown },
> extends BasicHassObject {
  protected _value?: CombinedResult<TObj, TResObj>;
  protected _keyMap: TemplatedConfigRendererKey<TObj, TResObj>[] = [];
  protected _getVariables: () => Record<string, unknown>;
  protected _transform: TransformFunc<TObj, TResObj>;

  private _unsubFuncs: Array<() => void> = [];
  private _listeners: Array<(value?: TResObj) => void> = [];

  constructor(
    hass: HomeAssistant | undefined,
    keyMap: TemplatedConfigRendererKey<TObj, TResObj>[],
    transform: TransformFunc<TObj, TResObj>,
    getVariables?: () => Record<string, unknown>,
  ) {
    super(hass);
    this._keyMap = keyMap ?? [];
    this._getVariables =
      getVariables ??
      (() => ({
        user: this.hass?.user?.name,
      }));
    this._transform = transform;
  }

  public get value(): TResObj | undefined {
    if (!this._value) {
      return undefined;
    }
    return this._transform(this._value);
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

    this._value = value as CombinedResult<TObj, TResObj>;

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

  public subscribe(listener: (value?: TResObj) => void): void {
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
  TResObj extends object = { [key: string]: unknown },
> extends BasicHassObject {
  protected _getKeyMap: (
    value: TObj,
  ) => TemplatedConfigRendererKey<TObj, TResObj>[] | undefined = () => [];
  protected _transform: TransformFunc<TObj, TResObj>;
  protected _getVariables?: () => Record<string, unknown>;

  private _renderers: TemplatedConfigRenderer<TObj, TResObj>[] = [];
  private _listeners: Array<(value: TResObj[]) => void> = [];

  constructor(
    hass: HomeAssistant | undefined,
    getKeyMap: (
      value: TObj,
    ) => TemplatedConfigRendererKey<TObj, TResObj>[] | undefined,
    transform: TransformFunc<TObj, TResObj>,
    getVariables?: () => Record<string, unknown>,
  ) {
    super(hass);
    this._getKeyMap = getKeyMap;
    this._transform = transform;
    this._getVariables = getVariables;
  }

  public get list(): TResObj[] {
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

    this._renderers = list.map((value) => {
      const renderer = new TemplatedConfigRenderer<TObj, TResObj>(
        this.hass,
        this._getKeyMap(value) ?? [],
        this._transform,
        this._getVariables,
      );
      renderer.setValue(value);
      renderer.subscribe(() => this._notify());
      return renderer;
    });
  }

  public subscribe(listener: (value: TResObj[]) => void): void {
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

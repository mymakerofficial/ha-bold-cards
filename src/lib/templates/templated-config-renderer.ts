import { HassObject } from "../hass-object";
import { HomeAssistant } from "../../types/ha/lovelace";
import { isTemplateError } from "./helpers";
import { isDefined } from "../helpers";

export interface TemplatedConfigRendererKey<
  TObj extends object,
  TResObj extends TObj = TObj & { [key: string]: unknown },
> {
  templateKey: keyof TObj;
  resultKey: keyof TResObj;
  transform?: (result: string) => unknown;
}

export class TemplatedConfigRenderer<
  TObj extends object,
  TResObj extends TObj = TObj & { [key: string]: unknown },
> extends HassObject {
  protected _value?: TObj & TResObj;
  protected _keyMap: TemplatedConfigRendererKey<TObj, TResObj>[] = [];

  private _unsubFuncs: Array<() => void> = [];
  private _listeners: Array<(value?: TObj & TResObj) => void> = [];

  constructor(
    keyMap: TemplatedConfigRendererKey<TObj, TResObj>[],
    hass?: HomeAssistant,
  ) {
    super(hass);
    this._keyMap = keyMap ?? [];
  }

  protected _notify() {
    this._listeners.forEach((listener) => listener(this._value));
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
}

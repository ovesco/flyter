import EditionSession from "./EditionSession";

export type anyConfigObject = { [key: string]: any };

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]> | T[P];
};

export type TypeConstructor<C extends anyConfigObject = anyConfigObject> = new (
  getSession: () => EditionSession,
  config: C
) => FlyterType<C>;
export type RendererConstructor = new (
  getSession: () => EditionSession,
  config: anyConfigObject
) => FlyterRenderer<anyConfigObject>;

export type rendererData = {
  rendererConfig: anyConfigObject;
  renderer: RendererConstructor;
};
export type typeData = { typeConfig: anyConfigObject; type: TypeConstructor };

export abstract class FlyterType<Config> {
  constructor(
    protected getSession: () => EditionSession,
    protected config: Config
  ) {}

  getTypeConfig() {
    return this.config;
  }

  abstract init(): Promise<any> | any;

  abstract show(container: HTMLElement, value: any): Promise<any> | any;

  abstract getCurrentValue(): any;

  abstract getReadableValue(val: any): Promise<string> | string;

  abstract disable(status: boolean): any;

  abstract onDestroy(): Promise<any> | any;
}

export abstract class FlyterRenderer<Config> {
  constructor(
    protected getSession: () => EditionSession,
    protected config: Config
  ) {}

  getRendererConfig() {
    return this.config;
  }

  abstract getMarkup(): HTMLElement | null;

  abstract init(): Promise<any> | any;

  abstract error(error: Error): any;

  abstract show(markup: HTMLElement): Promise<any> | any;

  abstract hide(): Promise<any> | any;

  abstract destroy(): Promise<any> | any;

  abstract setLoading(loading: boolean): any;
}

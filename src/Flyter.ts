import merge from "deepmerge";

import Merger from "./Merger";
import type Config from "./Config";
import { attrConfigResolver, baseConfig } from "./Config";
import Instance from "./Instance";
import ManyInstance from "./ManyInstance";
import {
  type RendererConstructor,
  type TypeConstructor,
  type anyConfigObject,
  type DeepPartial,
} from "./types";
import Theme, { defaultTheme } from "./Theme";

type ThemeProvider = (conf: anyConfigObject) => Theme;

type ThemeMapData = {
  order: number;
  baseThemeConfig: anyConfigObject;
  theme: ThemeProvider;
  name: string;
};
type TypeMapData = {
  baseTypeConfig: anyConfigObject;
  type: TypeConstructor<any>;
};
type RendererMapData = {
  baseRendererConfig: anyConfigObject;
  renderer: RendererConstructor;
};

class Flyter {
  private renderers: Map<string, RendererMapData> = new Map();

  private types: Map<string, TypeMapData> = new Map();

  private themes: Map<string, ThemeMapData> = new Map();

  registerRenderer(
    name: string,
    renderer: any,
    baseRendererConfig: anyConfigObject
  ) {
    this.renderers.set(name, { baseRendererConfig, renderer });
  }

  registerType<C extends anyConfigObject>(
    name: string,
    type: TypeConstructor<C>,
    baseTypeConfig: C
  ) {
    this.types.set(name, { baseTypeConfig, type });
  }

  registerTheme(name: string, theme: any, baseThemeConfig: anyConfigObject) {
    this.themes.set(name, {
      baseThemeConfig,
      theme,
      order: this.themes.size,
      name,
    });
  }

  attach(
    target: HTMLElement | string | HTMLElement[] | NodeList,
    givenConfig: DeepPartial<Config> | string = {}
  ) {
    givenConfig = (
      typeof givenConfig === "string"
        ? ({ type: { name: givenConfig } } as DeepPartial<Config>)
        : givenConfig
    ) as DeepPartial<Config>;

    if (typeof target === "string") {
      const elements = document.querySelectorAll(target);
      if (elements.length === 1) {
        return this.buildInstance(elements[0] as HTMLElement, givenConfig);
      } else {
        return this.attachMultiple(elements, givenConfig);
      }
    } else if (target instanceof Element || target instanceof HTMLElement) {
      return this.buildInstance(target, givenConfig);
    } else {
      return this.attachMultiple(target, givenConfig);
    }
  }

  private attachMultiple(
    nodeElements: HTMLElement[] | NodeList,
    config: DeepPartial<Config>
  ) {
    const elements = Array.from(nodeElements) as HTMLElement[];
    const instances = elements.map((it) => this.buildInstance(it, config));
    return new ManyInstance(instances);
  }

  private buildInstance(target: HTMLElement, config: DeepPartial<Config>) {
    /*
     Config is resolved by merging: [baseConfig, themeDerivedConfig, attributeConfig, providedConfig].
     - themeDerivedConfig might depend on attributeConfig, so we have to build it twice
     */
    const dirtyAttrConfig = attrConfigResolver(target);
    const themeConfig = new Merger<Config>([
      baseConfig,
      dirtyAttrConfig,
      config,
    ]).buildConfig().themes;
    const theme = this.resolveThemeConfig(themeConfig);
    const configMerger = new Merger<Config>([baseConfig]);
    configMerger.pushConfig(theme.config || {});
    configMerger.pushConfig(attrConfigResolver(target));
    configMerger.pushConfig(config);
    return new Instance(
      target,
      configMerger.buildConfig(),
      (name: string) => this.getType(name, theme.types || {}),
      (name: string) => this.getRenderer(name, theme.renderers || {})
    );
  }

  private getType(name: string, themeConfig: anyConfigObject) {
    if (!this.types.has(name)) throw new Error(`Unknown type ${name}`);
    const { baseTypeConfig, type } = this.types.get(name) as TypeMapData;
    const typeConfig =
      themeConfig[name] === undefined
        ? baseTypeConfig
        : merge(baseTypeConfig, themeConfig[name]);
    return { typeConfig, type };
  }

  private getRenderer(name: string, themeConfig: anyConfigObject) {
    if (!this.renderers.has(name)) throw new Error(`Unknown renderer ${name}`);
    const { baseRendererConfig, renderer } = this.renderers.get(
      name
    ) as RendererMapData;
    const rendererConfig =
      themeConfig[name] === undefined
        ? baseRendererConfig
        : merge(baseRendererConfig, themeConfig[name]);
    return { rendererConfig, renderer };
  }

  private resolveThemeConfig(themesData: {
    [key: string]: anyConfigObject;
  }): Theme {
    const themesToLoad = Array.from(this.themes.entries())
      .map(([name, data]) => ({ name, data }))
      .sort((a, b) => (a.data.order > b.data.order ? 1 : -1));
    const loadedThemes = [
      defaultTheme,
      ...themesToLoad.map(({ name, data }) =>
        data.theme(merge(data.baseThemeConfig, themesData[name] || {}))
      ),
    ];
    return new Merger<Theme>(loadedThemes).buildConfig();
  }
}

export default Flyter;

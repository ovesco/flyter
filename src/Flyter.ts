import merge from 'deepmerge';

import Merger from './Merger';
import Config, { attrConfigResolver, baseConfig } from "./Config";
import Instance from './Instance';
import ManyInstance from './ManyInstance';
import { RendererConstructor, TypeConstructor, anyConfigObject, DeepPartial, FlyterType, FlyterRenderer } from "./types";
import Theme from './Theme';

type ThemeProvider = (conf: anyConfigObject) => Theme;

const defaultTheme: Theme = {
  renderers: {},
  types: {},
  config: {},
};

type ThemeMapData = { order: number, baseThemeConfig: anyConfigObject, theme: ThemeProvider, name: string };
type TypeMapData = { baseTypeConfig: anyConfigObject, type: TypeConstructor };
type RendererMapData = { baseRendererConfig: anyConfigObject, renderer: RendererConstructor };

class Flyter {

  private renderers: Map<string, RendererMapData> = new Map();

  private types: Map<string, TypeMapData> = new Map();

  private themes: Map<string, ThemeMapData> = new Map();

  registerRenderer(name: string, renderer: any, baseRendererConfig: anyConfigObject) {
    this.renderers.set(name, { baseRendererConfig, renderer });
  }

  registerType(name: string, type: any, baseTypeConfig: anyConfigObject) {
    this.types.set(name, { baseTypeConfig, type: (type as TypeConstructor) });
  }

  registerTheme(name: string, theme: any, baseThemeConfig: anyConfigObject) {
    this.themes.set(name, { baseThemeConfig, theme, order: this.themes.size, name });
  }

  attach(target: HTMLElement | string | HTMLElement[] | NodeList, givenConfig: DeepPartial<Config> | string = {}) {

    givenConfig = (typeof givenConfig === 'string' ? ({ type: { name: givenConfig } }) as DeepPartial<Config> : givenConfig) as DeepPartial<Config>;

    if (typeof target === 'string') {
      const elements =document.querySelectorAll(target);
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

  private attachMultiple(nodeElements: HTMLElement[] | NodeList, config: DeepPartial<Config>) {
    const elements = Array.from(nodeElements) as HTMLElement[];
    const instances = elements.map((it) => this.buildInstance(it, config));
    return new ManyInstance(instances);
  }

  private buildInstance(target: HTMLElement, config: DeepPartial<Config>) {
    const attrConfig = attrConfigResolver(target);
    const themeConfig = (new Merger<Config>([ baseConfig, attrConfig, config ])).buildConfig().themes;
    const theme = this.resolveThemeConfig(themeConfig);

    console.log(theme);
    
    const configMerger = new Merger<Config>([baseConfig]);
    configMerger.pushConfig(theme.config || {});
    configMerger.pushConfig(attrConfigResolver(target));
    configMerger.pushConfig(config);
    return new Instance(target,  configMerger.buildConfig(), (name: string) => this.getType(name, theme.types || {}), (name: string) => this.getRenderer(name, theme.renderers || {}));
  }

  private getType(name: string, themeConfig: anyConfigObject) {
    if (!this.types.has(name)) throw new Error(`Unknown type ${name}`);
    const { baseTypeConfig, type } = this.types.get(name) as TypeMapData;
    const typeConfig = themeConfig[name] === undefined ? baseTypeConfig : merge(baseTypeConfig, themeConfig[name]);
    return { typeConfig, type };
  }

  private getRenderer(name: string, themeConfig: anyConfigObject) {
    if (!this.renderers.has(name)) throw new Error(`Unknown renderer ${name}`);
    const { baseRendererConfig, renderer } = this.renderers.get(name) as RendererMapData;
    const rendererConfig = themeConfig[name] === undefined ? baseRendererConfig : merge(baseRendererConfig, themeConfig[name]);
    return { rendererConfig, renderer };
  }

  private resolveThemeConfig(themesData: {[ key: string ]: anyConfigObject }): Theme {
    const givenThemeNames = Object.keys(themesData);
    const themeNames =  givenThemeNames.length === 0 ? Array.from(this.themes.keys()) : givenThemeNames;
    const themesToLoad = themeNames.map((name) => this.themes.get(name) as ThemeMapData).sort((a, b) => a.order > b.order ? 1 : -1);
    const loadedThemes = [defaultTheme, ...themesToLoad.map((it) => it.theme(merge(it.baseThemeConfig, themesData[it.name] || {})))];
    return new Merger<Theme>(loadedThemes).buildConfig();
  }
}

export default Flyter;
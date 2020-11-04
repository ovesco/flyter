import merge from 'deepmerge';
import { DeepPartial } from './types';
import Config from "./Config";
import Instance from "./Instance";
import { resolve } from "./util";

class ConfigResolver {
  constructor(private config: Config, private instance: Instance) {
  }

  update(config: DeepPartial<Config>) {
    this.config = merge(this.config, config) as Config;
  }

  getConfig() {
    return this.config;
  }

  get(key: string, isCallback: boolean = false) {
    const option: any = key.split('.').reduce((cnf: any, key) => {
      return cnf[key];
    }, this.config);

    if (isCallback) return option;
    else return resolve(option, this.instance);
  }
}

export default ConfigResolver;
import merge from 'deepmerge';

import { anyConfigObject, DeepPartial } from './types';

class Merger<T> {
  constructor(private configs: DeepPartial<T>[] = []) {}

  pushConfig(config: DeepPartial<T>) {
    this.configs.push(config);
  }

  buildConfig() {
    return this.configs.reduce((a: anyConfigObject, b: anyConfigObject) => merge(a, b), {}) as T;
  }
}

export default Merger;
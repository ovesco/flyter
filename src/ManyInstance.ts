import Config from "./Config";
import Instance from "./Instance";

import { DeepPartial } from './types';

class ManyInstance {

  constructor(private instances: Instance[]) {
  }

  getInstances() {
    return this.instances;
  }

  updateAllConfig(config: DeepPartial<Config>) {
    this.batch((i) => i.updateConfig(config));
  }

  getCurrentSessions() {
    return this.instances.map((it) => it.getCurrentSession()).filter((it) => it !== null);
  }

  async openAll() {
    return this.asyncBatch((it) => it.open());
  }

  async closeAll() {
    return this.asyncBatch((it) => it.close());
  }

  async refreshAll() {
    return this.asyncBatch((it) => it.refresh());
  }

  async destroyAll() {
    return this.asyncBatch((it) => it.destroy());
  }

  private async asyncBatch(fn: (it: Instance) => any) {
    return Promise.all(this.instances.map((it) => fn(it)));
  }

  private batch(fn: (i: Instance) => any) {
    this.instances.forEach((it) => fn(it));
  }
}

export default ManyInstance;
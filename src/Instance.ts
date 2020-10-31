import merge from 'deepmerge';

import Config, { ATTR_LOADING_CONTAINER, ATTR_READ_CONTAINER } from './Config';
import EditionSession from './EditionSession';
import { typeData, rendererData, DeepPartial } from './types';
import { promisify, deleteNodeChildren, parseTemplate, resolve } from './util';

class Instance {

  private session: EditionSession | null = null;

  public flyterElement: HTMLElement;

  private value: any;

  private loading: boolean = false;

  private listener: (e: MouseEvent) => void;

  constructor(private domTarget: HTMLElement, private config: Config, private typeGetter: (name: string) => typeData, private rendererGetter: (name: string) => rendererData) {
    this.value = resolve(config.initialValue, this);
    this.listener = () => this.open();
    this.flyterElement = this.buildFlyterTarget();
    this.refresh();
  }

  getConfig() {
    return this.config;
  }

  updateConfig(config: DeepPartial<Config>) {
    this.config = merge(this.config, config) as Config;
  }

  getCurrentSession() {
    return this.session;
  }

  getTarget() {
    return this.domTarget;
  }

  getFlyterElement() {
    return this.flyterElement;
  }

  async open() {
    this.setLoading(true);
    return new Promise(async () => {
      const session = await this.createSession();
      await (this.session as EditionSession).openEdition();
      this.setLoading(false);
      return session;
    });
  }

  async close() {
    if (this.session) {
      await this.session.closeSession();
      this.deleteSession();
    }
  }

  getValue() {
    return this.value;
  }

  async setValue(val: any) {
    this.value = val;
    this.setLoading(true);
    await this.refresh();
    this.setLoading(false);
  }

  async refresh() {
    if (resolve(this.config.emptyValue, this) === this.value) {
      this.flyterElement.innerHTML = resolve(this.config.emptyValueDisplay, this);
    }
    else {
      this.setLoading(true);
      const res = await promisify(this.config.valueFormatter(this.value, this));
      this.flyterElement.innerHTML = res;
      this.setLoading(false);
    }
  }

  deleteSession() {
    if (this.session === null) return;
    this.session = null;
  }

  async destroy() {
    await promisify(this.config.onDestroy(this));
    deleteNodeChildren(this.domTarget);
  }

  buildType() {
    const { typeConfig, type } = this.typeGetter(resolve(resolve(this.config.type.name, this), this));
    return new type(() => (this.session as EditionSession), merge(typeConfig, resolve(this.config.type.config, this)));
  }

  buildRenderer() {
    const { rendererConfig, renderer } = this.rendererGetter(resolve(this.config.renderer.name, this));
    return new renderer(() => (this.session as EditionSession), merge(rendererConfig, resolve(this.config.renderer.config, this)));
  }

  private async createSession() {
    if (this.session) return this.session;
    this.session = new EditionSession(this, this.buildType(), this.buildRenderer());

    await promisify(this.config.onOpen(this));
    await this.session.initialize();
    return this.session;
  }

  private setLoading(loading: boolean) {
    if (this.loading === loading) return;
    this.config.onLoading(loading, this);
    const loadingContainer = this.domTarget.querySelector(`[${ATTR_LOADING_CONTAINER}]`) as HTMLElement;
    if (loading) {
      loadingContainer.appendChild(parseTemplate(resolve(this.config.template.loading, this) as string));
    } else {
      deleteNodeChildren(loadingContainer as HTMLElement);
    }
    this.loading = loading;
  }

  private buildFlyterTarget() {
    const markup = parseTemplate(resolve(this.config.template.read, this));
    const element = markup.querySelector(`[${ATTR_READ_CONTAINER}]`) as HTMLElement;
    const trigger = resolve(this.config.trigger, this);
    if (trigger !== 'none') {
      const event = trigger === 'click' ? 'click' : 'mouseover';
      element.addEventListener(event, this.listener, true);
    }
    this.domTarget.append(markup);
    return element as HTMLElement;
  }
}

export default Instance;
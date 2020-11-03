import merge from 'deepmerge';

import ConfigResolver from './ConfigResolver';
import Config, {  ATTR_LOADING_CONTAINER, ATTR_READ_CONTAINER } from './Config';
import EditionSession from './EditionSession';
import { typeData, rendererData, DeepPartial } from './types';
import { promisify, deleteNodeChildren, parseTemplate, resolve } from './util';

class Instance {

  private session: EditionSession | null = null;

  public flyterElement: HTMLElement;

  private value: any;

  private loading: boolean = false;

  private listener: (e: MouseEvent) => void;

  private configResolver: ConfigResolver;

  constructor(private domTarget: HTMLElement, private config: Config, private typeGetter: (name: string) => typeData, private rendererGetter: (name: string) => rendererData) {
    this.configResolver = new ConfigResolver(config, this);
    this.value = resolve(config.initialValue, this);
    this.listener = () => this.open();
    this.flyterElement = this.buildFlyterTarget();
    this.refresh();
  }

  getDomTarget() {
    return this.domTarget;
  }

  getConfig(key: string, callback: boolean = false) {
    return this.configResolver.get(key, callback);
  }

  getRawConfig() {
    return this.configResolver.getConfig();
  }

  updateConfig(config: DeepPartial<Config>) {
    this.configResolver.update(config);
  }

  getCurrentSession() {
    return this.session;
  }

  getFlyterElement() {
    return this.flyterElement;
  }

  async open() {
    if (this.session) return;
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
    if (this.getConfig('emptyValue') === this.value) {
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
    const { typeConfig, type } = this.typeGetter(this.getConfig('type.name'));
    return new type(() => (this.session as EditionSession), merge(typeConfig, this.getConfig('type.config')));
  }

  buildRenderer() {
    const { rendererConfig, renderer } = this.rendererGetter(this.getConfig('renderer.name'));
    return new renderer(() => (this.session as EditionSession), merge(rendererConfig, this.getConfig('renderer.config')));
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
      loadingContainer.appendChild(parseTemplate(this.getConfig('template.loading') as string));
    } else {
      deleteNodeChildren(loadingContainer as HTMLElement);
    }
    this.loading = loading;
  }

  private buildFlyterTarget() {
    const markup = parseTemplate(this.getConfig('template.read'));
    const element = markup.querySelector(`[${ATTR_READ_CONTAINER}]`) as HTMLElement;
    const trigger = this.getConfig('trigger');
    if (trigger !== 'none') {
      const event = trigger === 'click' ? 'click' : 'mouseover';
      element.addEventListener(event, this.listener, true);
    }
    deleteNodeChildren(this.domTarget);
    this.domTarget.append(markup);
    return element as HTMLElement;
  }
}

export default Instance;
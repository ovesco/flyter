import Config, { ATTR_ACTION_CONTAINER, ATTR_CANCEL_BTN, ATTR_EDIT_CONTAINER, ATTR_SUBMIT_BTN } from "./Config";
import Instance from "./Instance";
import { FlyterRenderer, FlyterType } from "./types";
import { parseTemplate, promisify, resolve, resolveAsync } from "./util";

class EditionSession {

  private markup: HTMLElement;

  constructor(private instance: Instance, private type: FlyterType<any>, private renderer: FlyterRenderer<any>) {
  }

  getType() {
    return this.type;
  }

  getInstance() {
    return this.instance;
  }

  getRenderer() {
    return this.renderer;
  }

  getFlyterElement() {
    return this.instance.flyterElement;
  }

  getSessionMarkup() {
    return this.markup;
  }

  async initialize() {
    await this.type.init();
  }

  async openEdition() {
    await this.renderer.init();
    this.renderer.setLoading(true);
    const sessionMarkup = parseTemplate(resolve(this.instance.getConfig().template.edit, this.instance) as string);
    const btnMarkup = parseTemplate(resolve(this.instance.getConfig().template.buttons, this.instance) as string);

    const okButton = this.getElement(btnMarkup, ATTR_SUBMIT_BTN);
    okButton.innerHTML = resolve(this.instance.getConfig().okButton.text, this.instance);

    if (resolve(this.instance.getConfig().okButton.enabled, this.instance)) {
      okButton.addEventListener('click', () => this.submit());
    } else {
      btnMarkup.removeChild(okButton);
    }

    const cancelButton = this.getElement(btnMarkup, ATTR_CANCEL_BTN);
    cancelButton.innerHTML = resolve(this.instance.getConfig().cancelButton.text, this.instance);

    if (resolve(this.instance.getConfig().cancelButton.enabled, this.instance)) {
      cancelButton.addEventListener('click', () => this.closeSession());
    } else {
      btnMarkup.removeChild(cancelButton);
    }

    this.getElement(sessionMarkup, ATTR_ACTION_CONTAINER).appendChild(btnMarkup);

    await this.type.show(this.getElement(sessionMarkup, ATTR_EDIT_CONTAINER), this.instance.getValue());
    await this.renderer.show(sessionMarkup);
    this.renderer.setLoading(false);
    this.markup = sessionMarkup;
  }

  async closeSession() {
    this.setLoading(true);
    await promisify(this.instance.getConfig().onClose(this.instance));
    await promisify(this.type.onDestroy());
    this.setLoading(false);
    await promisify(this.renderer.destroy());
    this.instance.deleteSession();
  }

  async submit() {
    this.setLoading(true);
    const value = this.type.getCurrentValue();
    const validationResult = await promisify(this.instance.getConfig().validate(value, this.instance));
    if (validationResult instanceof Error) {
      this.setLoading(false);
      this.renderer.error(validationResult);
    } else if (validationResult === false) {
      this.setLoading(false);
      this.renderer.error(new Error('Invalid value'));
    } else {
      await new Promise(async (resolve) => {
        const onDone = async (val?: any) => {
          const finalVal = val ? val : value;
          await this.instance.setValue(finalVal);
          console.log('Done, writen');
          this.setLoading(false);
          this.closeSession();
          resolve();
        }
        const onFail = (error: Error) => {
          console.log('Submition error', error);
          this.renderer.error(error);
          this.setLoading(false);
          resolve();
        }
        await promisify(this.instance.getConfig().onSubmit(value, onDone, onFail, this.instance));
      });
    }
  }

  private setLoading(status: boolean) {
    this.instance.getConfig().onRendererLoading(status, this.instance);
    this.renderer.setLoading(status);
    this.type.disable(status);
    if (resolve(this.instance.getConfig().okButton.enabled, this.instance)) {
      (this.getElement(this.markup, ATTR_SUBMIT_BTN) as HTMLButtonElement).disabled = status;
    }
    if (resolve(this.instance.getConfig().cancelButton.enabled, this.instance)) {
      (this.getElement(this.markup, ATTR_CANCEL_BTN) as HTMLButtonElement).disabled = status;
    }
  }

  private getElement(markup: HTMLElement, attr: string) {
    return markup.querySelector(`[${attr}]`) as HTMLElement;
  }
}

export default EditionSession;
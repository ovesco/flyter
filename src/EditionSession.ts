import {
  ATTR_ACTION_CONTAINER,
  ATTR_CANCEL_BTN,
  ATTR_EDIT_CONTAINER,
  ATTR_SUBMIT_BTN,
} from "./Config";
import Instance from "./Instance";
import { FlyterRenderer, FlyterType } from "./types";
import { parseTemplate, promisify } from "./util";

class EditionSession {
  private markup: HTMLElement;

  constructor(
    private instance: Instance,
    private type: FlyterType<any>,
    private renderer: FlyterRenderer<any>
  ) {}

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
    const sessionMarkup = parseTemplate(
      this.instance.getConfig("template.edit")
    );
    const btnMarkup = parseTemplate(
      this.instance.getConfig("template.buttons")
    );

    const okButton = this.getElement(btnMarkup, ATTR_SUBMIT_BTN);
    okButton.innerHTML = this.instance.getConfig("okButton.text");

    if (this.instance.getConfig("okButton.enabled")) {
      okButton.addEventListener("click", () => this.submit());
    } else {
      btnMarkup.removeChild(okButton);
    }

    const cancelButton = this.getElement(btnMarkup, ATTR_CANCEL_BTN);
    cancelButton.innerHTML = this.instance.getConfig("cancelButton.text");

    if (this.instance.getConfig("cancelButton.enabled")) {
      cancelButton.addEventListener("click", () => this.cancel());
    } else {
      btnMarkup.removeChild(cancelButton);
    }

    this.getElement(sessionMarkup, ATTR_ACTION_CONTAINER).appendChild(
      btnMarkup
    );

    await this.type.show(
      this.getElement(sessionMarkup, ATTR_EDIT_CONTAINER),
      this.instance.getValue()
    );
    await this.renderer.show(sessionMarkup);
    this.renderer.setLoading(false);
    this.markup = sessionMarkup;
  }

  async cancel() {
    await promisify(this.instance.getRawConfig().onCancel(this.instance));
    await this.closeSession();
  }

  async closeSession() {
    this.setRendererLoading(true);
    await promisify(this.instance.getRawConfig().onClose(this.instance));
    this.setRendererLoading(false);
    await promisify(this.renderer.hide());
    this.setRendererLoading(true);
    await promisify(this.type.onDestroy());
    this.setRendererLoading(false);
    await promisify(this.renderer.destroy());
    this.instance.deleteSession();
  }

  async submit() {
    this.setRendererLoading(true);
    const value = this.type.getCurrentValue();
    let validationResult: boolean | Error = true;
    try {
      validationResult = await promisify(
        this.instance.getRawConfig().validate(value, this.instance)
      );
    } catch (e) {
      validationResult = e as Error;
    }
    if (validationResult instanceof Error) {
      this.setRendererLoading(false);
      await promisify(
        this.instance.getRawConfig().onError(validationResult, this.instance)
      );
      this.renderer.error(validationResult);
    } else {
      try {
        const val = await promisify(
          this.instance.getRawConfig().onSubmit(value, this.instance)
        );
        const finalVal = val ? val : value;
        await this.instance.setValue(finalVal);
        this.setRendererLoading(false);
        this.closeSession();
      } catch (e) {
        await promisify(
          this.instance.getRawConfig().onError(e as Error, this.instance)
        );
        this.renderer.error(e as Error);
        this.setRendererLoading(false);
      }
    }
  }

  private setRendererLoading(status: boolean) {
    this.instance.getRawConfig().onRendererLoading(status, this.instance);
    this.renderer.setLoading(status);
    this.type.disable(status);
    if (this.instance.getConfig("okButton.enabled")) {
      (
        this.getElement(this.markup, ATTR_SUBMIT_BTN) as HTMLButtonElement
      ).disabled = status;
    }
    if (this.instance.getConfig("cancelButton.enabled")) {
      (
        this.getElement(this.markup, ATTR_CANCEL_BTN) as HTMLButtonElement
      ).disabled = status;
    }
  }

  private getElement(markup: HTMLElement, attr: string) {
    return markup.querySelector(`[${attr}]`) as HTMLElement;
  }
}

export default EditionSession;

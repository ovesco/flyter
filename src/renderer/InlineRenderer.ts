import { FlyterRenderer } from "../types";
import {
  promisify,
  parseTemplate,
  deleteNodeChildren,
  resolveAsync,
} from "../util";

type valOrAsync<T> =
  | T
  | ((renderer: InlineRenderer) => T)
  | ((renderer: InlineRenderer) => Promise<T>);

export type InlineConfigType = {
  closeOnClickOutside: valOrAsync<boolean>;
  inlineTemplate: valOrAsync<string>;
  containerClass: valOrAsync<string>;
  onInit:
    | ((renderer: InlineRenderer) => any)
    | ((renderer: InlineRenderer) => Promise<any>);
  onShow:
    | ((renderer: InlineRenderer) => any)
    | ((renderer: InlineRenderer) => Promise<any>);
  onHide:
    | ((renderer: InlineRenderer) => any)
    | ((renderer: InlineRenderer) => Promise<any>);
};

const ATTR_INLINE_CONTAINER = "data-flyter-inline-container";
const ATTR_INLINE_ERROR_CONTAINER = "data-flyter-inline-error";
const ATTR_INLINE_LOADING = "data-flyter-inline-loading";

export {
  ATTR_INLINE_CONTAINER,
  ATTR_INLINE_ERROR_CONTAINER,
  ATTR_INLINE_LOADING,
};

export const InlineConfig: InlineConfigType = {
  onInit: () => null,
  onShow: () => null,
  onHide: () => null,
  closeOnClickOutside: true,
  containerClass: "",
  inlineTemplate: `
<div class="flyter-inline">
  <div class="flyter-inline-content" ${ATTR_INLINE_CONTAINER}></div>
  <div class="flyter-inline-loading" ${ATTR_INLINE_LOADING}>Loading</div>
  <div class="flyter-inline-error" ${ATTR_INLINE_ERROR_CONTAINER}></div>
</div>
  `.trim(),
};

class InlineRenderer extends FlyterRenderer<InlineConfigType> {
  private loading: boolean = false;

  private markup: HTMLElement | null = null;

  private closeOnClickOutside: boolean = true;

  private listener: (e: MouseEvent) => void | null;

  private originDisplay: string = "";

  getMarkup() {
    return this.markup;
  }

  async init() {
    this.markup = parseTemplate(
      await promisify(resolveAsync(this.config.inlineTemplate, this))
    );
    this.closeOnClickOutside = await promisify(
      resolveAsync(this.config.closeOnClickOutside, this)
    );
    const containerClass = await promisify(
      resolveAsync(this.config.containerClass, this)
    );
    if (containerClass.trim() !== "" && containerClass !== null) {
      this.markup.classList.add(...containerClass.split(" "));
    }

    this.listener = (e: MouseEvent) => {
      if (this.loading) return;
      if (this.markup === null) return;
      if (this.markup.contains(e.target as Node)) return;
      this.getSession().cancel();
    };

    if (this.closeOnClickOutside) {
      document.addEventListener("click", this.listener, true);
    }

    this.originDisplay = this.getSession().getFlyterElement().style.display;
    await promisify(this.config.onInit(this));
  }

  error(error: Error) {
    const container = this.getElement(ATTR_INLINE_ERROR_CONTAINER);
    deleteNodeChildren(container);
    container.innerHTML = error.message;
  }

  async show(markup: HTMLElement) {
    const container = this.getElement(ATTR_INLINE_CONTAINER);
    deleteNodeChildren(container);
    container.appendChild(markup);
    await promisify(this.config.onShow(this));
    this.getSession()
      .getInstance()
      .getDomTarget()
      .append(this.markup as HTMLElement);
    this.getSession().getFlyterElement().style.display = "none";
  }

  async hide() {
    // No op, no transition
  }

  async destroy() {
    if (this.closeOnClickOutside) {
      document.removeEventListener("click", this.listener, true);
    }

    await promisify(this.config.onHide(this));
    (this.markup as HTMLElement).remove();
    this.getSession().getFlyterElement().style.display = this.originDisplay;
    this.markup = null;
  }

  setLoading(loading: boolean) {
    if (this.loading === loading) return;
    const loader = this.getElement(ATTR_INLINE_LOADING);
    if (loader) loader.style.display = loading ? "" : "none";
    this.loading = loading;
  }

  private getElement(attr: string) {
    return (this.markup as HTMLElement).querySelector(
      `[${attr}]`
    ) as HTMLElement;
  }
}

export default InlineRenderer;

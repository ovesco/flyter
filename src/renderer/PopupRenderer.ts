import { type Instance as PopperInstance, createPopper } from "@popperjs/core";
import merge from "deepmerge";

import { FlyterRenderer, type anyConfigObject } from "../types";
import {
  promisify,
  parseTemplate,
  deleteNodeChildren,
  resolveAsync,
} from "../util";

type valOrAsync<T> =
  | T
  | ((renderer: PopupRenderer) => T)
  | ((renderer: PopupRenderer) => Promise<T>);

export type PopupConfigType = {
  popper: (...args: any[]) => PopperInstance | PopperInstance;
  popperConfig: valOrAsync<{ placement: string | anyConfigObject }>;
  transitionDuration: valOrAsync<number>;
  title: valOrAsync<string | null>;
  closeOnClickOutside: valOrAsync<boolean>;
  popupTemplate: valOrAsync<string>;
  popupContainer: valOrAsync<string | HTMLElement>;
  popupClass: valOrAsync<string>;
  onInit:
    | ((renderer: PopupRenderer) => any)
    | ((renderer: PopupRenderer) => Promise<any>);
  onShow:
    | ((renderer: PopupRenderer) => any)
    | ((renderer: PopupRenderer) => Promise<any>);
  onHide:
    | ((renderer: PopupRenderer) => any)
    | ((renderer: PopupRenderer) => Promise<any>);
};

const ATTR_POPUP_ARROW = "data-flyter-popup-arrow";
const ATTR_POPUP_TITLE = "data-flyter-popup-title";
const ATTR_POPUP_CONTAINER = "data-flyter-popup-container";
const ATTR_POPUP_ERROR_CONTAINER = "data-flyter-popup-error";
const ATTR_POPUP_LOADING = "data-flyter-popup-loading";

export {
  ATTR_POPUP_ARROW,
  ATTR_POPUP_TITLE,
  ATTR_POPUP_CONTAINER,
  ATTR_POPUP_ERROR_CONTAINER,
  ATTR_POPUP_LOADING,
};

export const PopupConfig: PopupConfigType = {
  popperConfig: {
    placement: "top",
  },
  onInit: () => null,
  onShow: () => null,
  onHide: () => null,
  popper:
    // @ts-ignore
    window !== undefined && window.Popper
      ? // @ts-ignore
        window.Popper.createPopper
      : createPopper,
  transitionDuration: 300,
  title: null,
  closeOnClickOutside: true,
  popupContainer: 'body',
  popupClass: "",
  popupTemplate: `
<div class="flyter-popup">
  <div class="flyter-popup-arrow" ${ATTR_POPUP_ARROW}></div>
  <div class="flyter-popup-title" ${ATTR_POPUP_TITLE}></div>
  <div class="flyter-popup-content" ${ATTR_POPUP_CONTAINER}></div>
  <div class="flyter-popup-loading" ${ATTR_POPUP_LOADING}>Loading</div>
  <div class="flyter-popup-error" ${ATTR_POPUP_ERROR_CONTAINER}></div>
</div>
  `.trim(),
};

class PopupRenderer extends FlyterRenderer<PopupConfigType> {
  private loading: boolean = false;

  private markup: HTMLElement | null = null;

  private transitionDuration: number = 0;

  private closeOnClickOutside: boolean = true;

  private listener: (e: MouseEvent) => void | null;

  private popperInstance: PopperInstance | null;

  getPopperInstance() {
    return this.popperInstance;
  }

  getMarkup() {
    return this.markup;
  }

  async init() {
    this.markup = parseTemplate(
      await promisify(resolveAsync(this.config.popupTemplate, this))
    );
    this.transitionDuration = parseInt(
      (await promisify(
        resolveAsync(this.config.transitionDuration, this)
      )) as any,
      10
    );
    this.closeOnClickOutside = await promisify(
      resolveAsync(this.config.closeOnClickOutside, this)
    );
    const popupClass = await promisify(
      resolveAsync(this.config.popupClass, this)
    );
    if (popupClass.trim() !== "" && popupClass !== null) {
      this.markup.classList.add(popupClass);
    }

    this.markup.style.opacity = "0";
    this.markup.style.transition = `opacity ${this.transitionDuration / 1000}s`;

    this.listener = (e: MouseEvent) => {
      if (this.loading) return;
      if (this.markup === null) return;
      if (this.markup.contains(e.target as Node)) return;

      if (
        this.getSession()
          .getInstance()
          .getDomTarget()
          .contains(e.target as Node)
      ) {
        e.stopPropagation();
        e.preventDefault();
      }
      this.getSession().cancel();
    };

    if (this.closeOnClickOutside) {
      document.addEventListener("click", this.listener, true);
    }

    const popupContainer = await this.getPopupContainer();
    popupContainer.append(this.markup);
    const popperConfig = merge(
      await promisify(resolveAsync(this.config.popperConfig, this)),
      {
        modifiers: [
          {
            name: "arrow",
            options: {
              element: `[${ATTR_POPUP_ARROW}]`,
            },
          },
        ],
      }
    );

    this.popperInstance = this.config.popper(
      this.getSession().getFlyterElement(),
      this.markup,
      popperConfig
    );
    await promisify(this.config.onInit(this));
  }

  error(error: Error) {
    const container = this.getElement(ATTR_POPUP_ERROR_CONTAINER);
    container.style.display = "";
    deleteNodeChildren(container);
    container.innerHTML = error.message;
  }

  async show(markup: HTMLElement) {
    const container = this.getElement(ATTR_POPUP_CONTAINER);
    const title = await promisify(resolveAsync(this.config.title, this));
    if (title !== null) {
      this.getElement(ATTR_POPUP_TITLE).innerHTML = title;
    }
    deleteNodeChildren(container);
    container.appendChild(markup);
    (this.markup as HTMLElement).style.opacity = "1";
    (this.popperInstance as PopperInstance).update();
    await promisify(this.config.onShow(this));
  }

  async hide() {
    (this.markup as HTMLElement).style.opacity = "0";
    await new Promise((resolve) => {
      setTimeout(() => {
        promisify(this.config.onHide(this)).then(resolve);
      }, this.transitionDuration);
    });
  }

  async destroy() {
    if (this.closeOnClickOutside) {
      document.removeEventListener("click", this.listener, true);
    }
    (this.markup as HTMLElement).remove();
    (this.popperInstance as PopperInstance).destroy();
    this.markup = null;
    this.popperInstance = null;
  }

  setLoading(loading: boolean) {
    if (this.loading === loading) return;
    this.getElement(ATTR_POPUP_ERROR_CONTAINER).style.display = "none";

    const loader = this.getElement(ATTR_POPUP_LOADING);
    if (loader) loader.style.display = loading ? "" : "none";
    this.loading = loading;
  }

  private getElement(attr: string) {
    return (this.markup as HTMLElement).querySelector(
      `[${attr}]`
    ) as HTMLElement;
  }

  private async getPopupContainer() {
    let popupContainer = 
      await promisify(resolveAsync(this.config.popupContainer, this));
    if (typeof popupContainer === 'string') {
      popupContainer = document.querySelector(popupContainer) as HTMLElement;
    }

    return popupContainer as HTMLElement;
  }
}

export default PopupRenderer;

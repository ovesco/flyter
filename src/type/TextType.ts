import { FlyterType } from "../types";
import { parseTemplate } from "../util";

const FLYTER_INPUT = "data-flyter-text-input";

export type TextTypeConfig = {
  class: string;
  type: string;
  attributes: string;
  treatEmptyAsNull: boolean;
};

export const baseTextConfig: TextTypeConfig = {
  class: "",
  type: "text",
  attributes: "",
  treatEmptyAsNull: true,
};

class TextType extends FlyterType<TextTypeConfig> {
  private textElement: HTMLInputElement;

  init() {
    this.textElement = parseTemplate(this.getTemplate()) as HTMLInputElement;
  }

  show(container: HTMLElement, value: any) {
    this.textElement.value = value;
    container.appendChild(this.textElement);
  }

  getCurrentValue() {
    const { value } = this.textElement;
    return value.trim() === "" && this.config.treatEmptyAsNull
      ? this.getSession().getInstance().getConfig("emptyValue")
      : value;
  }

  getReadableValue(val: any) {
    return val;
  }

  disable(status: boolean) {
    this.textElement.disabled = status;
  }

  onDestroy() {}

  private getTemplate() {
    const { type } = this.config;
    const tag = type === "textarea" ? type : "input";
    return `
      <${tag} ${this.config.attributes} type="${type}" ${FLYTER_INPUT} class="flyter-text-input ${this.config.class}" />
    `.trim();
  }
}

export default TextType;

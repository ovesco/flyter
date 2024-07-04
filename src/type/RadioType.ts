import BaseChoiceType, {
  type BaseChoiceConfig,
  ATTR_DISABLABLE,
} from "./BaseChoiceType";

export interface RadioTypeConfig extends BaseChoiceConfig {
  labelClass: string;
  radioClass: string;
  inputContainerClass: string;
}

export const baseRadioConfig: RadioTypeConfig = {
  dataSource: [],
  labelClass: "",
  radioClass: "",
  inputContainerClass: "",
  class: "",
};

class RadioType extends BaseChoiceType<RadioTypeConfig, HTMLDivElement> {
  setValue(value: any) {
    const element = this.getRadios().find((it) => `${it.value}` === `${value}`);
    if (element) {
      element.checked = true;
    }
  }

  getCurrentValue() {
    const element = this.getRadios().find((it) => it.checked);
    if (element) {
      return element.value;
    }
    return this.getSession().getInstance().getConfig("emptyValue");
  }

  getReadableValue(value: any[]) {
    const item = this.dataSource.find((it) => `${it.value}` === `${value}`);
    if (item) return item.label;
    return "Unkown value";
  }

  getTemplate() {
    const name = `flyter-radio-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;
    const inputs = this.dataSource
      .map(({ label, value }) =>
        `
      <div class="${this.config.inputContainerClass}">
        <input type="radio" class="${this.config.radioClass}" ${ATTR_DISABLABLE} name="${name}" id="${name}-${value}" value="${value}">
        <label class="${this.config.labelClass}" ${ATTR_DISABLABLE}  for="${name}-${value}">${label}</label>
      </div>
    `.trim()
      )
      .join("");
    return `<div class="${this.config.class}">${inputs}</div>`;
  }

  getRadios() {
    return Array.from(
      this.markup.querySelectorAll('input[type="radio"]')
    ) as HTMLInputElement[];
  }
}

export default RadioType;

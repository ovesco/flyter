import { resolve } from '../util';
import BaseChoiceType, { BaseChoiceConfig, ATTR_DISABLABLE } from './BaseChoiceType';

interface CheckboxConfig extends BaseChoiceConfig {
  displaySeparator: string;
  checkboxClass: string;
  labelClass: string;
}

export const baseCheckboxConfig: CheckboxConfig = {
  dataSource: [],
  displaySeparator: ',',
  checkboxClass: '',
  labelClass: '',
  class: '',
};

class CheckboxType extends BaseChoiceType<CheckboxConfig, HTMLDivElement> {

  setValue(value: any) {
    const values = (Array.isArray(value) ? value : [value]).map((it) => `${it}`);
    this.getCheckbox().filter((it) => values.includes(`${it.value}`)).forEach((it) => it.checked = true);
  }

  getCurrentValue() {
    const values = this.getCheckbox().filter((it) => it.checked).map((it) => it.value);
    return values.length > 0 ? values : resolve(this.getSession().getInstance().getConfig(), this.getSession().getInstance());
  }

  getReadableValue(value: any | any[]) {
    const values = Array.isArray(value) ? value : [value];
    const separator = this.config.displaySeparator;
    return values.map((v) => this.dataSource.find((it) => `${it.value}` === `${v}`).label).join(separator);
  }

  getTemplate() {
    return `
      <div class="${this.config.class}">
        ${this.dataSource.map(({ label, value }) => `
          <input type="checkbox" ${ATTR_DISABLABLE} id="${name}-${value}" name="${name}" class="${this.config.checkboxClass}">
          <label class="${this.config.labelClass}" for="${name}-${value}" ${ATTR_DISABLABLE}>${label}</label>
        `)}
      </div>
    `;
  }

  getCheckbox() {
    return [...this.markup.querySelectorAll('input[type="checkbox"]')] as HTMLInputElement[];
  }
}

export default CheckboxType;
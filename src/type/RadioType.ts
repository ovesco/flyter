import { resolve } from '../util';
import BaseChoiceType, { BaseChoiceConfig, ATTR_DISABLABLE } from './BaseChoiceType';

interface RadioConfig extends BaseChoiceConfig {
  labelClass: string;
  radioClass: string;
}

export const baseRadioConfig: RadioConfig = {
  dataSource: [],
  labelClass: '',
  radioClass: '',
  class: '',
};

class RadioType extends BaseChoiceType<RadioConfig, HTMLDivElement> {

  setValue(value: any) {
    (this.getRadios().find((it) => `${it.value}` === `${value}`) as HTMLInputElement).checked = true;
  }

  getCurrentValue() {
    const element = this.getRadios().find((it) => it.checked);
    if (element) return element.value;
    return resolve(this.getSession().getInstance().getConfig(), this.getSession().getInstance());
  }

  getReadableValue(value: any[]) {
    const item = this.dataSource.find((it) => `${it.value}` === `${value}`);
    if (item) return item.label;
    return 'Unkown value';
  }

  getTemplate() {
    const name = `flyter-radio-${Date.now()}-${Math.floor(Math.random()*10000)}`;
    const inputs = this.dataSource.map(({ label, value }) => `
      <input type="radio" class="${this.config.radioClass}" ${ATTR_DISABLABLE} name="${name}" id="${name}-${value}">
      <label class="${this.config.labelClass}" ${ATTR_DISABLABLE}  for="${name}-${value}">${label}</label>
    `).join('');
    return `<div class="${this.config.class}">${inputs}</div>`;
  }

  getRadios() {
    return Array.from(this.markup.querySelectorAll('input[type="radio"]')) as HTMLInputElement[];
  }
}

export default RadioType;
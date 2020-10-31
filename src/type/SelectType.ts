import { resolve } from '../util';
import BaseChoiceType, { BaseChoiceConfig, ATTR_DISABLABLE, DataSource } from './BaseChoiceType';

interface SelectConfig extends BaseChoiceConfig {
  multiple: boolean;
  displaySeparator: string;
}

export const baseSelectConfig: SelectConfig = {
  dataSource: [],
  class: '',
  multiple: false,
  displaySeparator: ',',
};

class SelectType extends BaseChoiceType<SelectConfig, HTMLSelectElement> {

  setValue(value: any) {
    const values = !Array.isArray(value) ? [value] : value;
    values.forEach((val) => {
      (Array.from(this.markup.options).find((it) => `${it.value}` === `${val}`) as HTMLOptionElement).selected = true;
    });
  }

  getCurrentValue() {
    if (!this.config.multiple) return this.markup.value;
    const values = Array.from(this.markup.options).filter((it) => it.selected).map((it) => it.value);
    return values.length > 0 ? values : resolve(this.getSession().getInstance().getConfig().emptyValue);
  }

  getReadableValue(value: any[]) {
    const separator = this.config.displaySeparator;
    return value.map((v) => (this.dataSource.find((it) => `${it.value}` === `${v}`) as DataSource[0]).label).join(separator);
  }

  getTemplate() {
    return `
      <select class="${this.config.class}" ${this.config.multiple ? 'multiple' : ''} ${ATTR_DISABLABLE}>
        ${this.dataSource.map(({ label, value }) => `<option value="${value}">${label}</option>`).join('')}
      </select>
    `;
  }
}

export default SelectType;
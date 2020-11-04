import BaseChoiceType, { BaseChoiceConfig, ATTR_DISABLABLE, DataSource } from './BaseChoiceType';

const EMPTY_VAL = '__EMPTY';

interface SelectConfig extends BaseChoiceConfig {
  multiple: boolean;
  displaySeparator: string;
  showEmptyValue: boolean;
}

export const baseSelectConfig: SelectConfig = {
  dataSource: [],
  class: '',
  multiple: false,
  displaySeparator: ',',
  showEmptyValue: false,
};

class SelectType extends BaseChoiceType<SelectConfig, HTMLSelectElement> {

  setValue(value: any) {
    const values = !Array.isArray(value) ? [value] : value;
    values.forEach((val) => {
      const option = Array.from(this.markup.options).find((it) => `${it.value}` === `${val}`);
      if (option) option.selected = true;
    });
  }

  getCurrentValue() {
    const values = Array.from(this.markup.options).filter((it) => it.selected).map((it) => it.value);
    if (values.length === 1 && values[0] === EMPTY_VAL) {
      return this.getSession().getInstance().getConfig('emptyValue');
    }
    
    if (!this.config.multiple) return values[0];
    return values.length > 0 ? values : this.getSession().getInstance().getConfig('emptyValue');
  }

  getReadableValue(value: any[]) {
    const values = !Array.isArray(value) ? [value] : value;
    const separator = this.config.displaySeparator;
    return values.map((v) => this.dataSource.find((it) => `${it.value}` === `${v}`) as DataSource[0]).filter((it) => it !== undefined).map((it) => it.label).join(separator);
  }

  getTemplate() {
    return `
      <select class="${this.config.class}" ${this.config.multiple ? 'multiple' : ''} ${ATTR_DISABLABLE}>
        ${this.config.showEmptyValue ? `<option value="${EMPTY_VAL}"></option>` : ''}
        ${this.dataSource.map(({ label, value }) => `<option value="${value}">${label}</option>`).join('')}
      </select>
    `.trim();
  }
}

export default SelectType;
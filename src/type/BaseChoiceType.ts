import { FlyterType } from "../types";
import { parseTemplate, promisify, resolveAsync } from "../util";

export type DataSource = Array<{ value: any, label: string }>;

export const ATTR_DISABLABLE = 'data-flyter-disablable';

export interface BaseChoiceConfig {
  dataSource: DataSource | (() => DataSource) | (() => Promise<DataSource>);
  class: string;
};

abstract class BaseChoiceType<T extends BaseChoiceConfig, U extends HTMLElement> extends FlyterType<T> {

  protected dataSource: DataSource;

  protected markup: U;

  async init() {
    this.dataSource = await promisify(resolveAsync(this.config.dataSource));
    this.markup = parseTemplate(this.getTemplate()) as U;
  }

  show(container: HTMLElement, value: any) {
    this.setValue(value);
    container.appendChild(this.markup);
  }

  disable(status: boolean) {
    this.markup.querySelectorAll(`[${ATTR_DISABLABLE}]`).forEach((it) => (it as HTMLInputElement).disabled = status);
  }

  onDestroy() {
  }

  abstract setValue(value: any): any;

  abstract getTemplate(): string;
}

export default BaseChoiceType;
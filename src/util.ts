import { sanitize } from 'dompurify';

export const promisify = <T>(val: Promise<T> | T): Promise<T> => Promise.resolve(val);

export const resolve = <T>(val: T | ((...args: any[]) => T), ...args: any[]): T => val instanceof Function ? val(...args) : val;

export const resolveAsync = <T>(val: T | ((...args: any[]) => T) | ((...args: any[]) => Promise<T>), ...args: any[]): T | Promise<T> => val instanceof Function ? val(...args) : val;

export const deleteNodeChildren = (node: HTMLElement) => {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export const parseTemplate = (markup: string | HTMLElement | (() => string)): HTMLElement => {
  if (markup instanceof Element) return markup;
  if (markup instanceof Function) markup = markup();
  return (new DOMParser()).parseFromString(sanitize(markup as string), 'text/html').body.firstElementChild as HTMLElement;
}

export const escape = (str: string) => sanitize(str);
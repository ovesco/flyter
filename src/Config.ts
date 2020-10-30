import Instance from "./Instance";
import { anyConfigObject } from "./types";
import { resolve } from './util';

const ATTR_EDIT_CONTAINER = 'data-flyter-edit';
const ATTR_ACTION_CONTAINER = 'data-flyter-action';
const ATTR_SUBMIT_BTN = 'data-flyter-submit';
const ATTR_CANCEL_BTN = 'data-flyter-cancel';
const ATTR_READ_CONTAINER = 'data-flyter-read';
const ATTR_LOADING_CONTAINER = 'data-flyter-loading';

export {
  ATTR_EDIT_CONTAINER,
  ATTR_ACTION_CONTAINER,
  ATTR_SUBMIT_BTN,
  ATTR_CANCEL_BTN,
  ATTR_READ_CONTAINER,
  ATTR_LOADING_CONTAINER,
};

export default interface Config {
  themes: anyConfigObject;
  trigger: 'click' | 'hover' | 'none' | ((instance: Instance) => 'click' | 'hover' | 'none');
  emptyValue: any | ((instance: Instance) => any);
  initialValue: any | ((instance: Instance) => any);
  emptyValueDisplay: string | ((instance: Instance) => string);
  valueFormatter: (value: any, instance: Instance) => string | Promise<string>;
  errorFormatter: (error: Error, instance: Instance) => string;
  onOpen: (instance: Instance) => Promise<any> | any;
  onClose: (instance: Instance) => Promise<any> | any;
  onDestroy: (instance: Instance) => Promise<any> | any;
  onSubmit: (value: any, onSuccess: (val?: any) => any, onError: (err: Error) => any, instance: Instance) => any;
  onLoading: (status: boolean, instance: Instance) => any;
  onRendererLoading: (status: boolean, instance: Instance) => any;
  onError: (instance: Instance) => Promise<any> | any;
  onCancel: (instance: Instance) => Promise<any> | any;
  validate: (value: any, instance: Instance) => Promise<Error | boolean> | Error | boolean;
  server: {
    url: string | ((instance: Instance) => string);
    queryParams: anyConfigObject | ((instance: Instance) => anyConfigObject);
    method: string | ((instance: Instance) => string);
    resultFormatter: (data: any, value: any) => any;
  };
  type: {
    name: string | ((instance: Instance) => string);
    config: any | ((instance: Instance) => any);
  };
  renderer: {
    name: string | ((instance: Instance) => string);
    config: any | ((instance: Instance) => any);
  };
  okButton: {
    enabled: boolean | ((instance: Instance) => boolean);
    text: string | ((instance: Instance) => string);
  };
  cancelButton: {
    enabled: boolean | ((instance: Instance) => boolean);
    text: string | ((instance: Instance) => string);
  };
  template: {
    edit: string | ((instance: Instance) => string);
    buttons: string | ((instance: Instance) => string);
    read: string | ((instance: Instance) => string);
    loading: string | ((instance: Instance) => string);
  };
}

export const baseConfig: Config = {
  themes: {},
  trigger: 'click',
  emptyValue: null,
  initialValue: null,
  emptyValueDisplay: 'Empty',
  valueFormatter: async (val, instance) => {
    const type = instance.buildType();
    await type.init();
    return type.getReadableValue(val);
  },
  server: {
    url: null,
    queryParams: {},
    resultFormatter: (d: any, value: any) => value,
    method: 'POST',
  },
  errorFormatter: (error) => error.message,
  onOpen: () => console.log('on open'),
  onClose: () => console.log('on close'),
  onLoading: (status) => console.log('on loading', status),
  onRendererLoading: (status) => console.log('on renderer loading', status);
  onDestroy: () => console.log('on destroy'),
  onSubmit: async (value, onSuccess, onError, instance) => {
    console.log('onSubmit');
    const { resultFormatter } = instance.getConfig().server;
    const url = resolve(instance.getConfig().server.url, instance);
    const method = resolve(instance.getConfig().server.method, instance);
    const queryParams = resolve(instance.getConfig().server.queryParams, instance);
    if (url === null) {
      onSuccess();
    } else {
      fetch(url, { method, body: JSON.stringify({ ...queryParams, value }) })
        .then((res) => res.json())
          .then((json) => onSuccess(resultFormatter(json, value)))
        .catch(onError);
    }
  },
  onError: (err) => console.log('on error', err),
  onCancel: () => console.log('on cancel'),
  validate: () => true,
  type: {
    name: 'text',
    config: {}
  },
  renderer: {
    name: 'popup',
    config: {}
  },
  okButton: {
    enabled: true,
    text: 'Ok'
  },
  cancelButton: {
    enabled: true,
    text: 'Cancel'
  },
  template: {
    edit: `
      <div class="flyter-edit-container">
        <div ${ATTR_EDIT_CONTAINER}></div>
        <div ${ATTR_ACTION_CONTAINER}></div>
      </div>
    `,
    buttons: `
      <div class="flyter-buttons-container">
        <button ${ATTR_SUBMIT_BTN}></button>
        <button ${ATTR_CANCEL_BTN}></button>
      </div>
    `,
    read: `
      <div class="flyter-read-container">
        <span ${ATTR_READ_CONTAINER}></span>
        <div ${ATTR_LOADING_CONTAINER}></div>
      </div>
    `,
    loading: `<div>Loading</div>`
  }
};

export const attrConfigResolver = (element: HTMLElement) => {
  const keyJsonParsable = [
    'server.queryParams',
    'type.config',
    'renderer.config',
    'themes',
  ];

  const keyBooleanParsable = [
    'okButton.enabled',
    'cancelButton.enabled'
  ];

  const attrs = [...element.attributes].filter((it) => it.nodeName.startsWith('data-flyter-config'));
  const config = {} as anyConfigObject;
  let correct = true;

  const findRealKey = (realConfigLevel: anyConfigObject, key: string) => {
    const baseConfigKeys = Object.keys(realConfigLevel);
    const realKey = baseConfigKeys.find((k) => k.toLowerCase() === key);
    if (realKey === undefined) {
      console.warn(`Attribute config key '${key}' is incorrect`);
      correct = false;
    }
    return realKey;
  }

  attrs.forEach((it) => {
    const configKey = it.nodeName.replace('data-flyter-config-', '').split('-');

    let current = config;
    let currentBaseConfig = baseConfig;
    let fullDotKey = '';
    for (let i = 0; i < configKey.length - 1; i++) {

      const realKey = findRealKey(currentBaseConfig, configKey[i]);

      if (realKey === undefined) {
        break;
      }

      if (!current[realKey]) {
        current[realKey] = {} as anyConfigObject;
      }

      current = current[realKey];
      currentBaseConfig = currentBaseConfig[realKey];
      fullDotKey += `${realKey}.`;
    }

    const lastKey = findRealKey(currentBaseConfig, configKey[configKey.length - 1]);
    fullDotKey += lastKey;

    let value: any = it.nodeValue;
    if (keyJsonParsable.includes(fullDotKey)) {
      value = JSON.parse(value);
    } else if (keyBooleanParsable.includes(fullDotKey)) {
      value = ['1', 'true'].includes(value.trim()) ? true : false;
    }

    if (lastKey) {
      current[lastKey] = value;
    }
  });

  return correct ? config : {};
};
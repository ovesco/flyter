import Instance from "./Instance";
import { type anyConfigObject } from "./types";

const ATTR_EDIT_CONTAINER = "data-flyter-edit";
const ATTR_ACTION_CONTAINER = "data-flyter-action";
const ATTR_SUBMIT_BTN = "data-flyter-submit";
const ATTR_CANCEL_BTN = "data-flyter-cancel";
const ATTR_READ_CONTAINER = "data-flyter-read";
const ATTR_LOADING_CONTAINER = "data-flyter-loading";
const ATTR_DISABLED = "disabled";

export {
  ATTR_EDIT_CONTAINER,
  ATTR_ACTION_CONTAINER,
  ATTR_SUBMIT_BTN,
  ATTR_CANCEL_BTN,
  ATTR_READ_CONTAINER,
  ATTR_LOADING_CONTAINER,
  ATTR_DISABLED,
};

export default interface Config {
  themes: anyConfigObject;
  trigger:
    | "click"
    | "hover"
    | "none"
    | ((instance: Instance) => "click" | "hover" | "none");
  submitOnEnter: boolean | ((instance: Instance) => boolean);
  triggerOnTarget: boolean | ((instance: Instance) => boolean);
  emptyValue: any | ((instance: Instance) => any);
  initialValue: any | ((instance: Instance) => any);
  emptyValueDisplay: string | ((instance: Instance) => string);
  valueFormatter: (value: any, instance: Instance) => string | Promise<string>;
  onOpen: (instance: Instance) => Promise<any> | any;
  onDisabled: (instance: Instance) => Promise<any> | any;
  onEnabled: (Instance: Instance) => Promise<any> | any;
  onClose: (instance: Instance) => Promise<any> | any;
  onDestroy: (instance: Instance) => Promise<any> | any;
  onSubmit: (value: any, instance: Instance) => Promise<any> | any;
  onLoading: (status: boolean, instance: Instance) => void;
  onRendererLoading: (status: boolean, instance: Instance) => any;
  onError: (error: Error, instance: Instance) => Promise<any> | any;
  onCancel: (instance: Instance) => Promise<any> | any;
  validate: (
    value: any,
    instance: Instance
  ) => Promise<Error | boolean> | Error | boolean;
  server: {
    url: string | null | ((instance: Instance) => string);
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
  trigger: "click",
  submitOnEnter: false,
  triggerOnTarget: false,
  emptyValue: null,
  initialValue: null,
  emptyValueDisplay: "Empty",
  valueFormatter: async (val, instance) =>
    instance.buildStandardReadableValue(val),
  server: {
    url: null,
    queryParams: {},
    resultFormatter: ({}, value: any) => value,
    method: "POST",
  },
  onOpen: () => null,
  onClose: () => null,
  onDisabled: () => null,
  onEnabled: () => null,
  onLoading: () => null,
  onRendererLoading: () => null,
  onDestroy: () => null,
  onSubmit: async (value, instance) => {
    const resultFormatter = instance.getConfig("server.resultFormatter", true);
    const url = instance.getConfig("server.url");
    const method = instance.getConfig("server.method");
    const queryParams = instance.getConfig("server.queryParams");
    if (url === null) {
      return;
    } else {
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ ...queryParams, value }),
      });
      const json = await res.json();
      return resultFormatter(json, value);
    }
  },
  onError: (err) => console.log("Flyter error", err),
  onCancel: () => null,
  validate: () => true,
  type: {
    name: "text",
    config: {},
  },
  renderer: {
    name: "popup",
    config: {},
  },
  okButton: {
    enabled: true,
    text: "Ok",
  },
  cancelButton: {
    enabled: true,
    text: "Cancel",
  },
  template: {
    edit: `
      <div class="flyter-edit-container">
        <div ${ATTR_EDIT_CONTAINER}></div>
        <div ${ATTR_ACTION_CONTAINER}></div>
      </div>
    `.trim(),
    buttons: `
      <div class="flyter-buttons-container">
        <button ${ATTR_SUBMIT_BTN}></button>
        <button ${ATTR_CANCEL_BTN}></button>
      </div>
    `.trim(),
    read: `
      <div class="flyter-read-container">
        <span ${ATTR_READ_CONTAINER}></span>
        <div ${ATTR_LOADING_CONTAINER}></div>
      </div>
    `.trim(),
    loading: `<div>Loading</div>`,
  },
};

export const attrConfigResolver = (element: HTMLElement) => {
  const attrs = Array.from(element.attributes).filter((it) =>
    it.nodeName.startsWith("data-fcnf")
  );
  const config = {} as anyConfigObject;

  attrs.forEach((it) => {
    const [key, type] = it.nodeName.replace("data-fcnf-", "").split(":");
    const configKey = key
      .split("-")
      .map((str) =>
        str.replace(/([-_][a-z])/g, (group) =>
          group.toUpperCase().replace("_", "")
        )
      );

    let current = config;
    for (let i = 0; i < configKey.length - 1; i++) {
      const keyElement = configKey[i];
      if (!current[keyElement]) {
        current[keyElement] = {} as anyConfigObject;
      }

      current = current[keyElement];
    }

    const lastKey = configKey[configKey.length - 1];

    let value: any = it.nodeValue;
    switch (type) {
      case "json":
        value = JSON.parse(value);
        break;
      case "bool":
      case "boolean":
        value = ["1", "true"].includes(value.trim()) ? true : false;
        break;
      case "int":
        value = parseInt(value, 10);
        break;
      case "float":
        value = parseFloat(value);
        break;
      default:
        break;
    }

    current[lastKey] = value;
  });

  return config as Config;
};

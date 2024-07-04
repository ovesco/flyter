import FlyterBuilder from "./Flyter";

import BootstrapTheme, {
  BootstrapThemeBaseConfig,
  type BootstrapThemeConfig,
} from "./theme/BootstrapTheme";
import Instance from "./Instance";
import ManyInstance from "./ManyInstance";
import { parseTemplate } from "./util";

import PopupRenderer, {
  PopupConfig,
  type PopupConfigType,
} from "./renderer/PopupRenderer";
import InlineRenderer, {
  InlineConfig,
  type InlineConfigType,
} from "./renderer/InlineRenderer";
import TextType, { baseTextConfig, type TextTypeConfig } from "./type/TextType";
import SelectType, {
  baseSelectConfig,
  type SelectTypeConfig,
} from "./type/SelectType";
import RadioType, {
  baseRadioConfig,
  type RadioTypeConfig,
} from "./type/RadioType";
import CheckboxType, {
  baseCheckboxConfig,
  type CheckboxTypeConfig,
} from "./type/CheckboxType";
import type Theme from "./Theme";

import { DeepPartial, FlyterRenderer, FlyterType } from "./types";
import deepmerge from "deepmerge";

const flyter = new FlyterBuilder();

const withBootstrapTheme = (config: DeepPartial<BootstrapThemeConfig> = {}) =>
  flyter.registerTheme(
    "bootstrap",
    BootstrapTheme,
    deepmerge(BootstrapThemeBaseConfig, config || {})
  );
const withPopupRenderer = (config: DeepPartial<PopupConfigType> = {}) =>
  flyter.registerRenderer(
    "popup",
    PopupRenderer,
    deepmerge(PopupConfig, config)
  );
const withInlineRenderer = (config: DeepPartial<InlineConfigType> = {}) =>
  flyter.registerRenderer(
    "inline",
    InlineRenderer,
    deepmerge(InlineConfig, config)
  );
const withTextType = () =>
  flyter.registerType("text", TextType, baseTextConfig);
const withSelectType = () =>
  flyter.registerType("select", SelectType, baseSelectConfig);
const withCheckboxType = () =>
  flyter.registerType("checkbox", CheckboxType, baseCheckboxConfig);
const withRadioType = () =>
  flyter.registerType("radio", RadioType, baseRadioConfig);

export {
  FlyterBuilder,
  FlyterRenderer,
  FlyterType,
  Instance,
  ManyInstance,
  withBootstrapTheme,
  withPopupRenderer,
  withInlineRenderer,
  withTextType,
  withSelectType,
  withCheckboxType,
  withRadioType,
  PopupRenderer,
  InlineRenderer,
  parseTemplate,
  Theme,
  TextType,
  TextTypeConfig,
  RadioType,
  RadioTypeConfig,
  CheckboxType,
  CheckboxTypeConfig,
  SelectType,
  SelectTypeConfig,
};

export default flyter;

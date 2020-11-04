import FlyterBuilder from './Flyter';

import BootstrapTheme, { BootstrapThemeBaseConfig } from './theme/BootstrapTheme';

import PopupRenderer, { PopupConfig } from './renderer/PopupRenderer';
import InlineRenderer, { InlineConfig } from './renderer/InlineRenderer';
import TextType, { baseTextConfig } from './type/TextType';
import SelectType, { baseSelectConfig } from './type/SelectType';
import RadioType, { baseRadioConfig } from './type/RadioType';
import CheckboxType, { baseCheckboxConfig } from './type/CheckboxType';

import { FlyterRenderer, FlyterType } from './types';

const flyter = new FlyterBuilder();

const withBootstrapTheme = () => flyter.registerTheme('bootstrap', BootstrapTheme, BootstrapThemeBaseConfig);
const withPopupRenderer = () => flyter.registerRenderer('popup', PopupRenderer, PopupConfig);
const withInlineRenderer = () => flyter.registerRenderer('inline', InlineRenderer, InlineConfig);
const withTextType = () => flyter.registerType('text', TextType, baseTextConfig);
const withSelectType = () => flyter.registerType('select', SelectType, baseSelectConfig);
const withCheckboxType = () => flyter.registerType('checkbox', CheckboxType, baseCheckboxConfig);
const withRadioType = () => flyter.registerType('radio', RadioType, baseRadioConfig);

export {
  FlyterBuilder,
  FlyterRenderer,
  FlyterType,

  withBootstrapTheme,
  withPopupRenderer,
  withInlineRenderer,
  withTextType,
  withSelectType,
  withCheckboxType,
  withRadioType,
}

export default flyter;
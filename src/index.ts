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

flyter.registerType('text', TextType, baseTextConfig);
flyter.registerType('select', SelectType, baseSelectConfig);
flyter.registerType('checkbox', CheckboxType, baseCheckboxConfig);
flyter.registerType('radio', RadioType, baseRadioConfig);
flyter.registerRenderer('popup', PopupRenderer, PopupConfig);
flyter.registerRenderer('inline', InlineRenderer, InlineConfig);

export default flyter;

const loadBootstrapTheme = () => {
  flyter.registerTheme('bootstrap', BootstrapTheme, BootstrapThemeBaseConfig);
};

loadBootstrapTheme();

export {
  FlyterBuilder,
  loadBootstrapTheme,
  FlyterRenderer,
  FlyterType
}
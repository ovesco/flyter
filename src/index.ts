import Flyter from './Flyter';

import PopupRenderer, { PopupConfig } from './renderer/PopupRenderer';
import TextType, { baseTextConfig } from './type/TextType';
import SelectType, { baseSelectConfig } from './type/SelectType';
import RadioType, { baseRadioConfig } from './type/RadioType';
import CheckboxType, { baseCheckboxConfig } from './type/CheckboxType';
import BootstrapTheme, { BootstrapThemeBaseConfig } from './theme/BootstrapTheme';

const flyter = new Flyter();

flyter.registerType('text', TextType, baseTextConfig);
flyter.registerType('select', SelectType, baseSelectConfig);
flyter.registerType('checkbox', CheckboxType, baseCheckboxConfig);
flyter.registerType('radio', RadioType, baseRadioConfig);

flyter.registerRenderer('popup', PopupRenderer, PopupConfig);
flyter.registerTheme('bootstrap', BootstrapTheme, BootstrapThemeBaseConfig);

// @ts-ignore
window.flyter = flyter;
export default Flyter;
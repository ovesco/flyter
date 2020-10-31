import FlyterCtr from '../src/Flyter';
import PopupRenderer, { PopupConfig } from '../src/renderer/PopupRenderer';
import TextType, { baseTextConfig } from '../src/type/TextType';
import SelectType, { baseSelectConfig } from '../src/type/SelectType';
import RadioType, { baseRadioConfig } from '../src/type/RadioType';
import CheckboxType, { baseCheckboxConfig } from '../src/type/CheckboxType';

export const Flyter = FlyterCtr;
const flyter = new Flyter();

flyter.registerType('text', TextType, baseTextConfig);
flyter.registerType('select', SelectType, baseSelectConfig);
flyter.registerType('checkbox', CheckboxType, baseCheckboxConfig);
flyter.registerType('radio', RadioType, baseRadioConfig);
flyter.registerRenderer('popup', PopupRenderer, PopupConfig);

// @ts-ignore
window.flyter = flyter;
export default flyter;
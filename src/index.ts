import Flyter from './Flyter';

import PopupRenderer, { PopupConfig } from './renderer/PopupRenderer';
import TextType, { TextTypeConfig } from './type/TextType';
import BootstrapTheme, { BootstrapThemeBaseConfig } from './theme/BootstrapTheme';

const flyter = new Flyter();

flyter.registerType('text', TextType, TextTypeConfig);
flyter.registerRenderer('popup', PopupRenderer, PopupConfig);
flyter.registerTheme('bootstrap', BootstrapTheme, BootstrapThemeBaseConfig);

// @ts-ignore
window.flyter = flyter;
export default Flyter;
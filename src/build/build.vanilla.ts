import flyter, {
  withCheckboxType,
  withInlineRenderer,
  withPopupRenderer,
  withRadioType,
  withSelectType,
  withTextType,
  withBootstrapTheme
} from '../index';

withInlineRenderer();
withPopupRenderer();
withRadioType();
withSelectType();
withTextType();
withCheckboxType();

export {
  withBootstrapTheme
};

// @ts-ignore
window.flyter = flyter;

export default flyter;
import flyter, {
  withCheckboxType,
  withInlineRenderer,
  withPopupRenderer,
  withRadioType,
  withSelectType,
  withTextType,
} from "../index";

withInlineRenderer();
withPopupRenderer();
withRadioType();
withSelectType();
withTextType();
withCheckboxType();

// @ts-ignore
window.flyter = flyter;

export default flyter;

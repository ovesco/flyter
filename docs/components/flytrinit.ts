import flyter, {
  withPopupRenderer,
  withInlineRenderer,
  withTextType,
  withSelectType,
  withCheckboxType,
  withRadioType,
} from "../../src";
import flyterTheme from "../.vitepress/theme/flyter-theme";
withInlineRenderer();
withPopupRenderer({
  popperConfig: {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10, 0, 10],
        },
      },
    ],
  },
});
withTextType();
withSelectType();
withCheckboxType();
withRadioType();

flyter.registerTheme("flyter", flyterTheme, {});

export default flyter;

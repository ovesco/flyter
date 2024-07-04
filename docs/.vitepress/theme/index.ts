import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import HomeComponent from "../../components/HomeComponent.vue";
import flyterTheme from "./flyter-theme";
import flyter, {
  withPopupRenderer,
  withInlineRenderer,
  withTextType,
  withSelectType,
  withCheckboxType,
  withRadioType,
} from "../../../src";
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

export default {
  extends: DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "home-hero-image": () => h(HomeComponent),
    });
  },
};

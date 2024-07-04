import { createPopper } from "@popperjs/core";
import flyter from "./flyter.vanilla.min";

const popperTheme = () => ({
  renderers: {
    popup: {
      popper: createPopper,
    },
  },
});

flyter.registerTheme("popper", popperTheme, {});

export default flyter;

// @ts-ignore
if (window) {
  // @ts-ignore
  window.flyter = flyter;
}

import flyter from "./flyter.vanilla.min";
import { withBootstrapTheme } from "../index";

withBootstrapTheme();

export default flyter;

// @ts-ignore
if (window) {
  // @ts-ignore
  window.flyter = flyter;
}

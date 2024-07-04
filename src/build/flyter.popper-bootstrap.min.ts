import flyter from "./flyter.popper.min";
import { withBootstrapTheme } from "../index";

withBootstrapTheme();

// @ts-ignore
if (window) {
  // @ts-ignore
  window.flyter = flyter;
}

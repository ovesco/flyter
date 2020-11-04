import { createPopper } from '@popperjs/core';
import flyter from './build.vanilla'

const popperTheme = () => ({
  renderers: {
    popup: {
      popper: createPopper,
    }
  }
});

flyter.registerTheme('popper', popperTheme, {});

export default flyter;

// @ts-ignore
window.flyter = flyter;
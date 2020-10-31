import { createPopper } from '@popperjs/core';
import flyter from './flyter';

const popperTheme = () => ({
  renderers: {
    popup: {
      popper: createPopper,
    }
  }
});

flyter.registerTheme('popper', popperTheme, {});

export default flyter;
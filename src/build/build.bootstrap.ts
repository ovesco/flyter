import flyter, { withBootstrapTheme } from './build.vanilla';

withBootstrapTheme();

export default flyter;

// @ts-ignore
window.flyter = flyter;
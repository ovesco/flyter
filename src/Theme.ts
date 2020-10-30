import Config from './Config';
import { anyConfigObject, DeepPartial } from './types';

type Theme {
  renderers?: { [rendererName: string]: anyConfigObject };
  types?: { [typeName: string]: anyConfigObject };
  config?: DeepPartial<Config>;
};

export default Theme;
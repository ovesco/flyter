# Creating your own renderer
You can create your own renderer by creating a class that extends `FlyterRenderer` and register it.

```ts
import flyter, { FlyterRenderer } from 'flyter';

type MyRendererConfig = {
  swagLevel: number;
};

class MyRenderer extends FlyterRenderer<MyRendererConfig> {
  // your configuration is available through this.config

  async init() {
    // Here you can initialize your renderer before it is shown, for example listeners, your renderer markup and so on.
    console.log(this.config.swagLevel);

    // You also have access to the edition session (see below for API)
    this.getSession();
  }

  error(error: Error) {
    // When this method is called you must display the error somewhere in your markup
  }

  async show(markup: HTMLElement) {
    // Here you must display the given markup which contains the type and actions in your markup
  }

  async destroy() {
    // Here you must destroy all stuff you created (listeners...)
  }

  setLoading(loading: boolean) {
    // display a loader based on given loading
  }
}

// Then register it
flyter.registerRenderer('myRenderer', MyRenderer, {
  /* Some default config your renderer exposes */
  swagLevel: 10,
});

flyter.attach('div', {
  renderer: {
    name: 'myRenderer',
    config: {
      swagLevel: 99999
    }
  }
});
```

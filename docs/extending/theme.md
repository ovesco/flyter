# Global configuration using Themes
Themes are a feature to override global configurations everywhere. They simply are functions that take a config object and return a Theme object, for example:

```ts
const myTheme = (config) => {
  return {
    types: {
      text: {
        // Override text type config here
      },
      select: {
        // ...
      }
    },
    renderers: {
      popup: {
        // Override popup renderer here
      }
    },
    config: {
      // Override config here
      onOpen() {
        console.log('Flyter instance open');
      }
    }
  }
};

// You can then load it, give it a name, your theme and a default configuration object
flyter.registerTheme('myTheme', myTheme, {});
```
That's it, whenever flyter opens on an instance, it will output `Flyter instance open` in the console.
Note that you can register as many themes as you'd like, the configuration will be merged whenever the instance is created based
on the order at which they were registered. In order, configuration is merged like so:
```
(((baseConfig + themeDerivedConfig) + attributeConfig) + given config on `attach`) 
```

### Overriding theme config
You might register some third-party themes which expose a config that you want to override. That's easy to do in your configuration:
```js
flyter.attach('div', {
  themes: {
    myTheme: {
      onOpen() {
        console.log('Flyter instance overriden open');
      }
    }
  }
});
```


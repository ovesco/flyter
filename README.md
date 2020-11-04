# Flyter

Flyter is a javascript library used to perform inline editing. It is inspired by [x-editable](https://vitalets.github.io/x-editable/), but doesn't rely on jquery, offers
tons of customization options and can be easily extended to fit your needs.

## Some cool stuff about it
- Developed in Typescript
- Uses DOMPurify under the hood to clean templates and markup
- Popup renderer makes use of Popper for perfect positioning
- Ships with two renderers (popup and inline) as well as four types (text, select, checkbox and radio) to start quickly
- A bootstrap 4 theme is available if you use the well-known framework

## Installation
### Including it in your webpage
You can quickly start working with flyter by using one of the pre-built bundle. It comes in 4 flavor:
```html
<!-- vanilla version, core flyter, renderers and types -->
<script type="text/javascript" src=".../flyter.vanilla.min.js"></script>

<!-- loaded with bootstrap theme -->
<script type="text/javascript" src=".../flyter.bootstrap.min.js"></script>

<!-- bundled with Popperjs directly -->
<script type="text/javascript" src=".../flyter.popper.min.js"></script>

<!-- bundled with Popperjs and the bootstrap theme -->
<script type="text/javascript" src=".../flyter.vanilla.min.js"></script>

<script type="text/javascript">
// flyter is now available through window.flyter
flyter.attach('my-element', { /* config */ });
</script>
```

If you want to use the Popup renderer but don't use the bundle including Popper, you'll have to include
it manually in your webpage (or provide it later as explained below).
```html
<!-- include popper before flyter so that it can find it automatically -->
<script type="text/javascript" src=".../path-to-popper-v2.js"></script>
<script type="text/javascript" src=".../flyter.bootstrap.min.js"></script>
```

### Installing it through NPM
Flyter is also available on NPM. The difference with pre-built bundles is that you must manually import
what you need, this in order to keep your build size as low as possible.
```
npm install -S flyter
```

You can then import it in your project.
```js
import flyter, {
  withPopupRenderer,
  withInlineRenderer,
  withTextType,
  withSelectType,
  withCheckboxType,
  withRadioType,
} from 'flyter';

withPopupRenderer(); // Load the popup renderer
withTextType(); // Load the text type

const div = document.getElementById('myDiv');
flyter.attach(div, { type: { name: 'text' }, /* other config... */ });
```

#### Importing the bootstrap theme
If you also want to import the bootstrap theme, just run the following
```js
import flyter, { withBootstrapTheme } from 'flyter';

withBootstrapTheme(); // Call this once
```

## Usage
You can call flyter by doing the following:
```js
flyter.attach(document.querySelector('#myDiv'), { /* config */});

flyter.attach('#myDiv', 'text'); // You can directly pass the type name if you have no other config value

/* Or on multiple elements at once */
flyter.attach(document.querySelectorAll('.multipleElements'), { /* config */ });

flyter.attach('.multipleElements', {
  initialValue: 1,
  type: {
    name: 'select',
    dataSource: [
      { value: 1, label: 'first value' },
      { value: 2, label: 'second value' }
    ]
  },
  server: {
    url: 'https://potato.com/api',
    queryParams: { id: 143 }
  }
});
```

## Configuration
Flyter supports many configuration options explained here.

:star: Configuration can also be set through `data-fcnf-` attributes for all non-callback values. Note that for renderer and type configuration, if the expected value is an object or something else, it might throw an error as Flyter won't know that it has to parse it. For config within Flyter, Server and buttons it will work, for example `data-fcnf-server-query_params='{"id": 1}'` will be parsed. Also note that camelCase options can be writen using `_` (refer to previous example).

:star2: Note that some configuration options have a type set to `something`*, this * indicates that this option can either
take a value or a function of the format `(instance) => expected type`.

### Flyter configuration
|key|type|description|default value|
|---|---|---|---|
|themes|`object`|If you want to configure your themes, explained in the theme section|`{}`|
|trigger|`string`|Flyter instance trigger, can be either `click`, `hover` or `none`|`'click'`|
|emptyValue|`any`*|the empty value, which indicates to flyter that this instance has no value yet|`null`|
|initialValue|`any`*|The instance's initialization value|`null`|
|emptyValueDisplay|`string`*|What should be displayed when the instance has no value|`'Empty'`|

#### Server handler
Flyter ships with a simple server handler which performs an async request on submit. This can be easily overriden
using the `onSubmit` callback (explained below), but these options allow you to configure how the request is sent if
you keep the default handler.

|key|type|description|default value|
|---|---|---|---|
|server.url|`string`*|url to which submit data|`null`|
|server.method|`string`*|which method to use (`GET`, `POST`...)|`'POST'`|
|server.queryParams|`object`*|some additional data to pass to request body|`null`|
|server.resultFormatter|`(data: any, value: any) => any`|Called after server response, can be used to format received value before forwarding it to flyter|given `value`|

#### Type and renderer
Here you can choose which type and renderer to use as well as override their default configuration if necessary.

|key|type|description|default value|
|---|---|---|---|
|type.name|`string`*|Name of the type to use, for example `text`, `select`, `checkbox` or `radio`|`'text'`|
|type.config|`object`*|The type's config (See each type for what kind of config they accept)|`{}`|
|renderer.name|`string`*|Name of the renderer to use, for example `popup` or `inline`|`popup`|
|renderer.config|`object`*|The renderer's config (See each renderer for what kind of config they accept)|`{}`|

#### Buttons and actions
Flyter uses two buttons once triggered, the `okButton` which will trigger a submit on click, and a `cancelButton`.

|key|type|description|default value|
|---|---|---|---|
|okButton.enabled|`boolean`*|Wether or not the okButton will be displayed|`true`|
|okButton.text|`string`*|okButton text content|`'Ok'`|
|cancelButton.enabled|`boolean`*|Wether or not the cancelButton will be displayed|`true`|
|cancelButton.text|`string`*|cancelButton text content|`'Cancel'`|

#### Templates
Flyter allows you to override the templates used internally, mostly used if you define a new theme.

|key|type|description|default value|
|---|---|---|---|
|template.edit|`string`*|The edit markup which will contain the editing type and actions (buttons)|`See below`|
|template.buttons|`string`*|The buttons markup|`See below`|
|template.read|`string`*|The displayed value (when not triggered), as well as the loading container|`See below`|
|template.loading|`string`*|The loading indicator|`See below`|

Here are the vanilla templates used. Please note that they have some `data-flyter-` attributes which are **mandatory** if
you override those templates.

##### Edit
```html
<div class="flyter-edit-container">
  <div data-flyter-edit>
    <!-- will contain the type markup -->
  </div>
  <div data-flyter-action>
    <!-- will contain the two buttons if enabled -->
  </div>
</div>
```

##### Buttons
```html
<div class="flyter-buttons-container">
  <button data-flyter-submit><!-- contains okButton.text --></button>
  <button data-flyter-cancel><!-- contains cancelButton.text --></button>
</div>
```

##### Read
This template is used when flyter is not triggered, when not open in edition mode.
```html
<div class="flyter-read-container">
  <span data-flyter-read><!-- contains the displayed value --></span>
  <div data-flyter-loading><!-- contains the loader --></div>
</div>
```

##### Loading
```html
<div>Loading</div>
```

#### Callbacks and hooks
Those configuration options allow you to hook into the instance lifecycle and perform various operations.

|key|type|description|default behavior|
|---|---|---|---|
|valueFormatter|`async (value, instance) => string`|Formats the value to be displayed|Uses the type to generate a string|
|onOpen|`async (instance) => any`|Called when the instance is triggered and opens its edition session|`() => null`|
|onClose|`async (instance) => any`|Called when the instance closes its edition session|`() => null`|
|onDestroy|`async (instance) => any`|Called when the flyter instance is manually destroyed|`() => null`|
|onSubmit|`async (value, instance) => any`|Called when submitting the value, can be used to override the default server handler|Simple server handler (see server section)|
|onLoading|`(status: boolean, instance) => any`|Called when the instance (not in edition) is in loading mode|`() => null`|
|onRendererLoading|`(status: boolean, instance) => any`|Called when the renderer (instance in edition) is in loading mode|`() => null`|
|onError|`async (error, instance) => any`|Called when an error is thrown somewhere|`(e) => console.log(e)`|
|onCancel|`async (instance) => any`|Called when an edition session is canceled|`() => null`|
|validate|`async (value, instance) => boolean | Error`|Can be used to validate the submitted value, before calling the `onSubmit` callback|`() => true`|

### Types
Flyter ships with 4 types by default which have their own configuration you can override by setting `type.config`.

### TextType
You can use it by setting `type.name` = `text`

|key|type|description|default value|
|---|---|---|---|
|class|`string`|A class that will be set on the input|`''`|
|type|`string`|the input type, for example `text`, `textarea`, `number`, `date`...|`'text'`|
|attributes|`string`|Some additional attributes to set on the input|`''`|
|treatEmptyAsNull|`boolean`|Wether to treat an empty string as a null value|`true`|

### SelectType
You can use it by setting `type.name` = `select`

|key|type|description|default value|
|---|---|---|---|
|class|`string`|A class that will be set on the input|`''`|
|dataSource|`Array<{ value: string, label: string }>`|The possible values. Can also be a callback or an async callback that returns an array.|`[]`|
|multiple|`boolean`|Whether the input is in multiple mode or not|`false`|
|showEmptyValue|`boolean`|Show an empty value which maps to the `emptyValue`|`false`|
|displaySeparator|`string`|Separator when displaying multiple values|`','`|

Here is a configuration example using the select type.
```js
flyter.attach('div', {
  type: {
    name: 'select',
    config: {
      multiple: false,
      showEmptyValue: true,
      dataSource: async () => {
        return new Promise((resolve) => {
          setTimeout(() => resolve([
            { label: "isnt it cool", value: "cool" },
            { label: "Yeah no", value: "not cool" }
          ]), 1000);
        });
      }
    },
  }
});
```

### CheckboxType
You can use it by setting `type.name` = `checkbox`

|key|type|description|default value|
|---|---|---|---|
|class|`string`|A class that will be set on the input|`''`|
|dataSource|`Array<{ value: string, label: string }>`|The possible values. Can also be a callback or an async callback that returns an array.|`[]`|
|inputContainerClass|`string`|Each [checkbox, label] is wrapped in a `div`, you can add a class to it|`''`|
|checkboxClass|`string`|Add a class to each displayed checkbox|`''`|
|labelClass|`string`|Add a class to each displayed label|`''`|
|displaySeparator|`string`|Separator when displaying multiple values|`','`|

### RadioType
You can use it by setting `type.name` = `radio`

|key|type|description|default value|
|---|---|---|---|
|class|`string`|A class that will be set on the input|`''`|
|dataSource|`Array<{ value: string, label: string }>`|The possible values. Can also be a callback or an async callback that returns an array.|`[]`|
|inputContainerClass|`string`|Each [radio, label] is wrapped in a `div`, you can add a class to it|`''`|
|radioClass|`string`|Add a class to each displayed radio input|`''`|
|labelClass|`string`|Add a class to each displayed label|`''`|

### Creating your own type
You can easily create custom types by creating a class which extends `FlyterType`.
```ts
import flyter, { FlyterType } from 'flyter';

type MyTypeConfig = {
  name: string;
};

class MyType extends FlyterType<MyTypeConfig> {
  async init() {
    // Here you can initialize your type, for example plugins and stuff as well as your markup
    console.log(this.config.name);

    // You also have access to the edition session (see below for API)
    this.getSession();
  }

  async show(container: HTMLElement, value: any) {
    // Here you have to append your markup to the given container using appendChild for example,
    // And initialize your input with the given value
  }

  getCurrentValue() {
    // This method must return your input's current value
  }

  getReadableValue(val: any) {
    // This method must format the given val to a string which will be displayed
  }

  disable(status: boolean) {
    // Here you must visually reflect the disabled status provided, for example setting `disable="true"` on your <input>
  }

  async onDestroy() {
    // Here you can remove all side effects, listeners and so on...
  }
}

flyter.registerType('myType', MyType, {
  name: 'me',
});

flyter.attach('div', {
  type: {
    name: 'myType',
    config: {
      name: 'Me myself & I'
    }
  }
});
```

## Renderers
Flyter ships with 2 renderers which you can use out of the box.


:boom: Note that some configuration type are marked with *, this means that they can also take an (async) callback which returns an value of the expected type, which takes the renderer as single parameter.

### Inline renderer
You can use it by setting `renderer.name` = `inline`. This renderer will hide the field and display the edition input when editing.

|key|type|description|default value|
|---|---|---|---|
|closeOnClickOutside|`boolean`*|Close the edition session when clicked outside|`true`|
|inlineTemplate|`string`*|Template used by the renderer|`See below`|
|containerClass|`string`*|A class that will be added to the inline renderer container|`''`|
|onInit|`async (renderer) => any`|Called when the renderer is initialized|`() => null`|
|onShow|`async (renderer) => any`|Called when the renderer becomes visible|`() => null`|
|onHide|`async (renderer) => any`|Called when the renderer is removed from the DOM|`() => null`|

Default renderer markup is the following:
```html
<div class="flyter-inline">
  <div class="flyter-inline-content" data-flyter-inline-container>
    <!-- Will contain type and actions -->
  </div>
  <div class="flyter-inline-loading" data-flyter-inline-loading>Loading</div>
  <div class="flyter-inline-error" data-flyter-inline-error>
    <!-- if error, will display it here -->
  </div>
</div>
```

### Popup renderer
You can use it by setting `renderer.name` = `popup`. This renderer depends on Popperjs to work. If you include it in your webpage,
flyter will automatically find it from `window.popper`. Otherwise you have to manually provide it like so:
```js
import flyter from 'flyter';
import { createPopper } from '@popperjs/core';

flyter.attach('div', {
  renderer: {
    name: 'popup',
    config: {
      popper: createPopper,
    }
  }
});
```

|key|type|description|default value|
|---|---|---|---|
|closeOnClickOutside|`boolean`*|Close the edition session when clicked outside|`true`|
|popper|`createPopper`|The popper builder|`window.Popper.createPopper || null`|
|popperConfig|`object`*|Some additional config to pass to popper, such as placement|`{ placement: 'top' }`|
|transitionDuration|`number`*|Duration in milliseconds of the renderer fade transition|`300`|
|title|`string`*|Add a title to the popup|`null`|
|popupTemplate|`string`*|Template used by the renderer|`See below`|
|popupClass|`string`*|Add a class to the renderer container|`''`|
|onInit|`async (renderer) => any`|Called when the renderer is initialized|`() => null`|
|onShow|`async (renderer) => any`|Called when the renderer becomes visible|`() => null`|
|onHide|`async (renderer) => any`|Called when the renderer is removed from the DOM|`() => null`|

Default renderer markup is the following:
```html
<div class="flyter-popup">
  <div class="flyter-popup-arrow" data-flyter-popup-arrow>
    <!-- arrow, managed by popper -->
  </div>
  <div class="flyter-popup-title" data-flyter-popup-title>
    <!-- if there's a title to the popup, will be here -->
  </div>
  <div class="flyter-popup-content" data-flyter-popup-container>
    <!-- will contain type markup and actions -->
  </div>
  <div class="flyter-popup-loading" data-flyter-popup-loading>Loading</div>
  <div class="flyter-popup-error" data-flyter-popup-error>
    <!-- If there's an error, will be displayed here -->
  </div>
</div>
```

### Creating your own renderer
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

## Global configuration using Themes
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


## API
### Instance
When you attach flyter to an element, you can either attach it to a single element or a collection of elements.
```js
const instance = flyter.attach('#myDiv', { /* ... */}); // or document.querySelector('#myDiv');
```
You'll find the instance here as well as in almost all callbacks from the config.

```ts
/**
 * returns the HTML element this instance is attached to.
 */
instance.getDomTarget();

/**
 * returns the element automatically built by Flyter when the instance was created.
 */
instance.getFlyterElement();

/**
 * Updates the config of this instance
 */
instance.updateConfig(config: Partial<Config>);

/**
 * Returns the config value which can be found at the given key. for example server.url.
 * The second parameter must be set to true if you expect a callback.
 * This allows flyter to resolve the option if it's a value that can either be a primitive or a function returning it
 */
instance.getConfig(key: string, isCallback: boolean);

/**
 * Returns the raw config object of this instance
 */
instance.getRawConfig();

/**
 * Opens an edition session
 */
instance.open(); // ASYNC

/**
 * Closes an eventually open session
 */
instance.close(); // ASYNC

/**
 * Returns the current value of the instance
 */
instance.getValue();

/**
 * Sets the current value
 */
instance.setValue(val); // ASYNC

/**
 * Refresh the instance, refreshing its displayed value
 */
instance.refresh(); // ASYNC

/**
 * Destroys the instance, removing it from the DOM
 */
instance.destroy(); // ASYNC

/**
 * Returns the current edition session if any. See below for further information
 */
instance.getCurrentSession();
```

### Edition Session
When you trigger a flyter instance (by click or hover, or calling `instance.open()`), it will launch a new Edition
Session which is responsible to handle the edition flow. It can be accessed from the instance by calling `instance.getCurrentSession()` and from within renderers and types by doing `this.getSession()`.

```ts
/**
 * Returns the type object used in this session
 */
session.getType();

/**
 * Returns the renderer object used in this session
 */
session.getRenderer();

/**
 * Returns the instance this session is attached to
 */
session.getInstance();

/**
 * Returns this session's markup
 */
session.getMarkup();

/**
 * Initialize the session by initializing its type
 */
session.initialize(); // ASYNC

/**
 * Opens the session, initializing the renderer and markup and showing it
 */
session.openEdition(); // ASYNC

/**
 * Cancels this session and closes it
 */
session.cancel(); // ASYNC

/**
 * Close this session and notify the instance to delete it
 */
session.closeSession(); // ASYNC

/**
 * Submits the current type's value
 */
session.submit(); // ASYNC

/**
 * Tells the underlying renderer to enter in loading mode and disables
 * the types and action buttons
 */
session.setLoading(status: boolean);
```

### Initializing multiple elements at once
You might attach flyter to multiple elements in a single pass:
```js
const manyInstance = flyter.attach('.divs', { /* config */}); // or document.querySelectorAll('.divs');
```

In this case you won't receive a single instance object (as there's multiple DOM nodes concerned), but rather a `ManyInstance` which has the following API:
```js
/**
 * Returns an array of all instances concerned
 */
manyInstance.getInstances();

/**
 * Updates the config for all underlying instances
 */
manyInstance.updateAllConfig(config);

/**
 * Filters all instances that have edition sessions currently live attached and returns them
 */
manyInstance.getCurrentSessions();

/**
 * Opens all instances
 */
manyInstance.openAll(); // ASYNC

/**
 * Close all instances
 */
manyInstance.closeAll(); // ASYNC

/**
 * Refresh all instances
 */
manyInstance.refreshAll(); // ASYNC

/**
 * Destroy all instances
 */
manyInstance.destroyAll(); // ASYNC
```

## License
Code is released under the Apache 2.0 License.
- DOMPurify uses the same license
- deepmerge (used internally to merge configurations) is released under the MIT license
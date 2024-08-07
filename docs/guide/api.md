# API

## Instance
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
async instance.open();

/**
 * Closes an eventually open session
 */
async instance.close();

/**
 * Returns the current value of the instance
 */
instance.getValue();

/**
 * Sets the current value
 */
async instance.setValue(val);

/**
 * Refresh the instance, refreshing its displayed value
 */
async instance.refresh();

/**
 * Destroys the instance, removing it from the DOM
 */
async instance.destroy();

/**
 * Disables the instance.
 * This sets the attribute `disabled` on the element
 * and prevents the session creation trigger from happening
 * If an edition session was open, it is closed.
 */
async instance.disable();

/**
 * Enables the instance if it was disabled
 */
async instance.enable();

/**
 * Returns the current edition session if any. See below for further information
 */
instance.getCurrentSession();
```

## Edition Session
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
async session.initialize();

/**
 * Opens the session, initializing the renderer and markup and showing it
 */
async session.openEdition();

/**
 * Cancels this session and closes it
 */
async session.cancel();

/**
 * Close this session and notify the instance to delete it
 */
async session.closeSession();

/**
 * Submits the current type's value
 */
async session.submit();

/**
 * Tells the underlying renderer to enter in loading mode and disables
 * the types and action buttons
 */
session.setLoading(status: boolean);
```

## Initializing multiple elements at once
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
async manyInstance.openAll();

/**
 * Close all instances
 */
async manyInstance.closeAll();

/**
 * Refresh all instances
 */
async manyInstance.refreshAll();

/**
 * Destroy all instances
 */
async manyInstance.destroyAll();

/**
 * Enable all instances
 */
async manyInstance.enableAll();

/**
 * disable all instances
 */
async manyInstance.disableAll();
```

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

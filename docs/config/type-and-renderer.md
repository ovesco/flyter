# Type and renderer

Here you can choose which type and renderer to use as well as override their default configuration if necessary.

|key|type|description|default value|
|---|---|---|---|
|type.name|`string`*|Name of the type to use, for example `text`, `select`, `checkbox` or `radio`|`'text'`|
|type.config|`object`*|The type's config (See each type for what kind of config they accept)|`{}`|
|renderer.name|`string`*|Name of the renderer to use, for example `popup` or `inline`|`popup`|
|renderer.config|`object`*|The renderer's config (See each renderer for what kind of config they accept)|`{}`|


## Renderers
Flyter ships with 2 renderers which you can use out of the box.


:::info
Note that some configuration type are marked with *, this means that they can also take an (async) callback which returns an value of the expected type, which takes the renderer as single parameter.
:::

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
|popupContainer|`string \| HTMLElement`*|Specify the HTML node that will contain the popup|`'body'`|
|onInit|`async (renderer) => any`|Called when the renderer is initialized|`() => null`|
|onShow|`async (renderer) => any`|Called when the renderer becomes visible|`() => null`|
|onHide|`async (renderer) => any`|Called when the renderer is removed from the DOM|`() => null`|

## Types
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

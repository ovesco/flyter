# Configuration

Flyter supports many configuration options explained in this section.

::: info
Configuration can also be set through `data-fcnf-` attributes for all non-callback values, for example `data-fcnf-type-name="text"` to set the type's name to text.
:::

When you deal with values that should be of a specific format, such as json, you can append modifiers to your config attribute with a `:`. The following modifiers are available:

- `json` to parse value to json
- `bool` or boolean to parse to a boolean value
- `int` to parse to an integer
- `float` to parse to a float number

For example `data-fcnf-renderer-config-popper_config:json='{"placement":"bottom"}'`

Also note that camelCase options can be writen using \_ (refer to previous example).

::: info
Note that some configuration options have a type set to something*, this * indicates that this option can either take a value or a function of the format (instance) => expected type.
:::

## Flyter instance configuration

|key|type|description|default value|
|---|---|---|---|
|themes|`object`|If you want to configure your themes, explained in the theme section|`{}`|
|trigger|`string`|Flyter instance trigger, can be either `click`, `hover` or `none`|`'click'`|
|triggerOnTarget|`boolean`*|Wether the trigger will be attached to the given target element, or on the appended custom flyter element. By default trigger listener is attached to custom flyter element|`false`|
|emptyValue|`any`*|the empty value, which indicates to flyter that this instance has no value yet|`null`|
|submitOnEnter|`boolean`*|If true, will submit the current edition session if the user hits enter. Pay attention if, for example, type is a textarea, it can submit when not expected|`false`|
|initialValue|`any`*|The instance's initialization value|`null`|
|emptyValueDisplay|`string`*|What should be displayed when the instance has no value|`'Empty'`|
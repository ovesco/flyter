<script setup>
  import Flyter from '../components/Flyter.vue';

  const config = {
    emptyValueDisplay: "I'm not feeling anything today",
    type: {
      name: 'checkbox',
      config: {
        dataSource: [
          { label: '😊', value: '1' },
          { label: '❤️', value: '2' },
          { label: '🔥', value: '3' },
          { label: '🍺', value: '4' },
        ],
      }
    },
    valueFormatter: async (val, instance) => {
      // Here we ask the current instance to build the value which
      // would have been displayed if we didn't overload valueFormatter.
      // It uses the type to build a readable value, uses the one from
      // the current editing session if any or builds one on the fly otherwise
      const readableValue = await instance.buildStandardReadableValue(val);
      return `Today I'm feeling ${readableValue}`;
    }
  }
</script>

# Creating an Instance
Flyter can be attached to any DOM element either dynamically with Javascript
or using custom HTML tags.

## Javascript Configuration
Simply pass a configuration object to the instance created through `attach`.
<Flyter :config="config" />

```ts
flyter.attach('#ex-doc', {
  initialValue: ['1'],
  emptyValueDisplay: "I'm not feeling anything today",
  type: {
    name: 'checkbox',
    config: {
      dataSource: [
        { label: '😊', value: '1' },
        { label: '❤️', value: '2' },
        { label: '🔥', value: '3' },
        { label: '🍺', value: '4' },
      ],
    }
  },
  valueFormatter: async (val, instance) => {
    // Here we ask the current instance to build the value which
    // would have been displayed if we didn't overload valueFormatter.
    // It uses the type to build a readable value, uses the one from
    // the current editing session if any or builds one on the fly otherwise
    const readableValue = await instance.buildStandardReadableValue(val);
    return `Today I'm feeling ${readableValue}`;
  }
});
```

## Using HTML attributes based configuration

You can use HTML tags to configure a Flyter instance. Note that you will still need to
call `.attach()` on the element through Javascript. Any configuration value defined
in Javascript will override any HTML configuration set on the element.

Read more at [/config/configuration] the configuration page.

```html
<div class="flyter-attr" data-fcnf-initial_value="Edit me">Edit me</div>

<div class="flyter-attr"
  data-fcnf-type-name="text"
  data-fcnf-type-config-type="textarea"
  data-fcnf-initial_value="Edit me too!"
  data-fcnf-renderer-config-popper_config:json='{"placement":"bottom"}'>Edit me</div>
```

```js
flyter.attach(document.querySelectorAll('.flyter-attr'));
```
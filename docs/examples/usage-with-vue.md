# Usage with Vue

Flyter can be easily integrated into Vue. An official component might land
later if there is an interest in it, but for now you can use this simple example
and build upon it.

```vue
<script setup lang>
import flyter from "../../src";
import { ref, onMounted, onBeforeUnmount, defineProps } from "vue";

// We're exposing the component with the `v-model` directive support
const model = defineModel();
const props = defineProps(["config"]);

// Keep track of the flyter instance of this component
// No need to wrap it in ref, we do not want to make it reactive
let instance = null;

// Create a DOM ref to the attached node
const flyterNode = ref(null);

onMounted(() => {
  // Create the Flyter instance in the onMounted hook
  // This guarantees that the referenced node exists
  instance = flyter.attach(flyterNode.value, {
    ...props.config,
    initialValue: model.value || props.config.initialValue,
    onSubmit: (value, instance) => {
      // If the given config had an onSubmit hook, we call it here too
      // but we override it with our custom one to trigger `v-model`
      if (props.config?.onSubmit) {
        props.config?.onSubmit(value, instance);
      }

      model.value = value;
    },
  });
});

// Destroy the flyter instance before unmounting to free memory
onBeforeUnmount(async () => {
  await instance.destroy();
});
</script>

<template>
  <div ref="flyterNode"></div>
</template>
```
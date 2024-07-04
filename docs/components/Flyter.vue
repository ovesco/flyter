<script setup lang>
import flyter from "../../src";
import { ref, onMounted, onBeforeUnmount, defineProps } from "vue";

const props = defineProps(["config", "displayOnStart", "value"]);

let instance = null;
const flyterNode = ref(null);

onMounted(() => {
  instance = flyter.attach(flyterNode.value, {
    ...props.config,
    initialValue: props.value || props.config.initialValue,
  });

  console.log(props.config);

  if (props.displayOnStart === true) {
    setTimeout(() => {
      instance.open();
    }, 600);
  }
});

onBeforeUnmount(async () => {
  await instance.destroy();
});
</script>

<template>
  <div class="border-b-2 border-dashed cursor-pointer" ref="flyterNode"></div>
</template>

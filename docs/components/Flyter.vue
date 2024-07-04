<script setup lang>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps(["config", "displayOnStart", "value"]);

let instance = null;
const flyterNode = ref(null);

onMounted(() => {
  import("./flytrinit").then((flyter) => {
    instance = flyter.default.attach(flyterNode.value, {
      ...props.config,
      initialValue: props.value || props.config.initialValue,
    });

    if (props.displayOnStart === true) {
      setTimeout(() => {
        instance.open();
      }, 600);
    }
  });
});

onBeforeUnmount(async () => {
  if (instance) await instance.destroy();
});
</script>

<template>
  <div class="border-b-2 border-dashed cursor-pointer" ref="flyterNode"></div>
</template>

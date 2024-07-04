<script setup>
import Flyter from "./Flyter.vue";
import { onMounted } from "vue";

const typesConfig = {
  initialValue: [1, 2],
  type: {
    name: "checkbox",
    config: {
      dataSource: [
        { label: "Awesome", value: 0 },
        { label: "Integrated", value: 1 },
        { label: "types", value: 2 },
      ],
      displaySeparator: " ",
    },
  },
};

const renderers = {
  initialValue: [2],
  renderer: {
    name: "inline",
  },
  type: {
    name: "select",
    config: {
      dataSource: [
        { label: "Popup", value: 1 },
        { label: "Inline", value: 2 },
      ],
    },
  },
  onSubmit: (value, instance) => {
    const renderer = value === "1" ? "popup" : "inline";
    instance.updateConfig({
      renderer: {
        name: renderer,
      },
    });
  },
};

const configurable = {
  initialValue: [1],
  type: {
    name: "radio",
    config: {
      dataSource: [
        { label: "Configurable", value: 1 },
        { label: "Triggers an error", value: 2 },
        { label: "Takes time to validate", value: 3 },
      ],
    },
  },
  validate: (val) => {
    if (val === "1") return true;
    if (val === "2") throw new Error("BOOM error lol");
    if (val === "3")
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 10000);
      });
  },
  onCancel() {
    alert("You just clicked cancel");
  },
  onOpen: () => {
    return new Promise((resolve) => setTimeout(() => resolve(), 900));
  },
};

onMounted(() => {
  const imgBg = document.querySelector(".image-bg");
  if (imgBg) {
    imgBg.style.display = "none";
  }
});
</script>

<template>
  <div class="grid grid-cols-2 w-full h-full">
    <div
      class="col-span-2 md:col-span-1 flex flex-col items-center justify-center"
    >
      <p class="text-2xl font-semibold">Easy to Setup</p>
      <ClientOnly>
        <Flyter
          :display-on-start="true"
          :config="{
            renderer: { config: { popperConfig: { placement: 'bottom' } } },
          }"
          value="For simple text"
        />
      </ClientOnly>
    </div>
    <div
      class="col-span-2 md:col-span-1 flex flex-col items-center justify-center"
    >
      <p class="text-2xl font-semibold">Various</p>
      <ClientOnly>
        <Flyter :config="typesConfig" />
      </ClientOnly>
    </div>
    <div
      class="col-span-2 md:col-span-1 flex flex-col items-center justify-center"
    >
      <p class="text-2xl font-semibold">Two Renderers</p>
      <ClientOnly>
        <Flyter :config="renderers" />
      </ClientOnly>
    </div>
    <div
      class="col-span-2 md:col-span-1 flex flex-col items-center justify-center"
    >
      <p class="text-2xl font-semibold">Massively</p>
      <ClientOnly>
        <Flyter :config="configurable" />
      </ClientOnly>
    </div>
  </div>
</template>

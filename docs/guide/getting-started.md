# Getting Started

## With NPM

Flyter is available on NPM. The difference with pre-built bundles is that you must manually import what you need, this in order to keep your build size as low as possible.

:::info
You will need to install popperjs core library to use the popup renderer.
:::

```
npm install -S flyter @popperjs/core
```

You can then import it in your project.

```ts
import flyter, {
  withPopupRenderer,
  withInlineRenderer,
  withTextType,
  withSelectType,
  withCheckboxType,
  withRadioType,
  withBootstrapTheme, // Optional
} from "flyter";

withInlineRenderer({ /* optional inline renderer config */});
withPopupRenderer({ /* optional popup renderer config */});
withBootstrapTheme({ /* optional bootstrap theme config */ });

withTextType(); // Load the text type
// ...
// Load other types you need
```

## With CDN

You can quickly start working with flyter by using one of the pre-built bundle. It comes in 4 flavor:

```html
<!-- vanilla build, core flyter, renderers and types -->
<script
  type="text/javascript"
  src="https://unpkg.com/flyter/dist/flyter.vanilla.min.global.js"
></script>

<!-- loaded with bootstrap theme -->
<script
  type="text/javascript"
  src="https://unpkg.com/flyter/dist/flyter.bootstrap.min.global.js"
></script>

<!-- bundled with Popperjs directly -->
<script
  type="text/javascript"
  src="https://unpkg.com/flyter/dist/flyter.popper.min.global.js"
></script>

<!-- bundled with Popperjs and the bootstrap theme -->
<script
  type="text/javascript"
  src="https://unpkg.com/flyter/dist/flyter.popper-bootstrap.min.global.js"
></script>

<script type="text/javascript">
  // flyter is now available through window.flyter
  flyter.attach("my-element", {
    /* config */
  });
</script>
```

## Usage

Once ready, you can use the `attach` method to attach a flyter component to a DOM element.

```ts
flyter.attach(document.querySelector("#myDiv"), {
  /* config */
});

flyter.attach("#myDiv", "text"); // You can directly pass the type name if you have no other config value

/* Or on multiple elements at once */
flyter.attach(document.querySelectorAll(".multipleElements"), {
  /* config */
});

flyter.attach(".multipleElements", {
  initialValue: 1,
  type: {
    name: "select",
    dataSource: [
      { value: 1, label: "first value" },
      { value: 2, label: "second value" },
    ],
  },
  server: {
    url: "https://potato.com/api",
    queryParams: { id: 143 },
  },
});
```

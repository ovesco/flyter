# Usage with AlpineJS

AlpineJS is a simple but efficient framework for quick prototyping or building
lightweight dynamic interfaces without any build step. This is a simple example
of building a custom directive to use Flyter.

```html
<html>
  <head>
    <title>Alpine</title>
  </head>

  <body>
    <script
      type="text/javascript"
      src="https://unpkg.com/flyter/bundles/flyter.popper.min.js"
    ></script>
    <script src="//unpkg.com/alpinejs"></script>
    <script type="text/javascript">
      Alpine.directive(
        "flyter",
        (
          el,
          { expression, modifiers },
          { effect, cleanup, evaluateLater, evaluate }
        ) => {
          const getValue = evaluateLater(expression);
          const instance = flyter.attach(el, {
            initialValue: evaluate(expression),
            onSubmit: (value) => {
              // Little trick to set back the value in the data object
              // Alpine does not expose any way of setting it like an `evaluateSetter`
              // So we evaluate a custom expression, here evaluate is in the context
              // of the element the directive is attached to.
              // See the x-model directive for a more in-depth understanding of it
              // https://github.com/alpinejs/alpine/blob/main/packages/alpinejs/src/directives/x-model.js
              evaluate(`${expression} = __placeholder`, {
                scope: { __placeholder: value },
              });
            },
          });

          effect(() => {
            // Update the value of the flyter instance when the value of the expression changes
            getValue((value) => {
              instance.setValue(value);
            });
          });

          cleanup(() => {
            instance.destroy();
          });
        }
      );
    </script>

    <div x-data="{ message: 'Hello' }">
      <p x-flyter="message"></p>
      <p>Your message is: <span x-text="message"></span></p>
      <!-- Try to update the value from here and see how it gets
       updated in the Flyter instance too -->
      <input type="text" x-model="message" />
    </div>
  </body>
</html>
```
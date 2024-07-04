# Attaching to the target Element

Sometimes you will attach Flyter to clickable HTML elements which do not
expect any markup to be added inside. Those elements, such as `<button>`
might behave weirdly because Flyter will expect the triggering event to
happen on the dynamically added `<span>` element, not the attached one.

As such you can use `triggerOnTarget` to attach the trigger on the given
element.

```ts
flyter.attach('.flyter-btn', {
  // will attach trigger to the target given during initialization
  // in this example, our button
  triggerOnTarget: true,
  renderer: {
    config: {
      popperConfig: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [50, 70], // offset to match this big button
            }
          }
        ]
      }
    }
  }
});
```
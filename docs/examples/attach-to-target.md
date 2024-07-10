# Attaching to the target Element

Sometimes you will attach Flyter to clickable HTML elements which do not
expect any markup to be added inside. Those elements, such as `<button>`
might behave weirdly because Flyter will expect the triggering event to
happen on the dynamically added `<span>` element, not the attached one.

As such you can use `triggerOnTarget` to attach the trigger on the given
element.

```ts
// <button> is by definition clickable, so if you modify its style it might
// happen that you click on the button but not the element flyter appended to it
// so nothing happens even though the UI acted as if you clicked the button.
// Setting `triggerOnTarget` will attach the event to the button directly fixing
// the problem
flyter.attach('button', {
  triggerOnTarget: true,
  renderer: {
    config: {
      popperConfig: {
        modifiers: [
          {
            // If your button is big, you can use the offset modifier of popperjs
            // to move the popup outside your button's boundaries
            name: 'offset',
            options: {
              offset: [50, 70],
            }
          }
        ]
      }
    }
  }
});
```
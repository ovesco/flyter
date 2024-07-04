# Datepicker

This example demonstrates how you can build a custom type using the [air datepicker](https://air-datepicker.com) library.

```ts
import flyter, { FlyterType } from "flyter";
import AirDatepicker, { AirDatepickerOptions } from "air-datepicker";
import "air-datepicker/air-datepicker.css";

/**
 * Notice that we can type FlyterType with our type's configuration.
 * Here we'll pass the AirDatepicker config so that when using the DatepickerType
 * you can configure the underlying AirDatepicker instance directly
 */
export default class DatepickerType extends FlyterType<AirDatepickerOptions> {

  private element: HTMLInputElement;
  private instance: AirDatepicker | undefined;

  init() {
    // We build an input on init which will be used to manage the value
    // while the instance is displayed
    this.element = new DOMParser().parseFromString(
      '<input type="date" style="display:none" />',
      "text/html"
    ).body as HTMLInputElement;
  }

  show(container: HTMLElement, value: any) {
    // On show, display the input field
    container.appendChild(this.element);
    // And attach a new AirDatepicker instance to it
    // Note that the field is hidden and we add the datepicker
    // in inline mode to have it always displayed, Flyter takes
    // care of showing or hiding it
    this.instance = new AirDatepicker(this.element, {
      inline: true,
      selectedDates: [value],

      // Pass the airDatepicker config provided when using the
      // type if any
      ...this.config,
    });
  }

  getCurrentValue() {
    return this.instance?.selectedDates[0] || null;
  }

  getReadableValue(val: any): string | Promise<string> {
    if (!val) return "";
    return val.toLocaleDateString();
  }

  disable(status: boolean) {
    this.element.disabled = status;
  }

  onDestroy() {
    this.instance?.destroy();
  }
}

flyter.registerType(
  "datepicker", 
  DatepickerType, 
  { /* We dont have any default config to pass to AirDatepicker here */ },
);

flyter.attach("#datepicker", {
  initialValue: new Date(),
  type: {
    name: "datepicker",
    config: {
      // Pass some additional config to AirDatepicker here
      // See https://air-datepicker.com/docs
    }
  },
  renderer: {
    name: "popup",
  },
  onSubmit(value) {
    console.log(value);
  },
});

```
# Creating your own type
You can easily create custom types by creating a class which extends `FlyterType`.

```ts
import flyter, { FlyterType } from 'flyter';

type MyTypeConfig = {
  name: string;
};

class MyType extends FlyterType<MyTypeConfig> {
  async init() {
    // Here you can initialize your type, for example plugins and stuff as well as your markup
    console.log(this.config.name);

    // You also have access to the edition session (see below for API)
    this.getSession();
  }

  async show(container: HTMLElement, value: any) {
    // Here you have to append your markup to the given container using appendChild for example,
    // And initialize your input with the given value
  }

  getCurrentValue() {
    // This method must return your input's current value
  }

  getReadableValue(val: any) {
    // This method must format the given val to a string which will be displayed
  }

  disable(status: boolean) {
    // Here you must visually reflect the disabled status provided, for example setting `disable="true"` on your <input>
  }

  async onDestroy() {
    // Here you can remove all side effects, listeners and so on...
  }
}

flyter.registerType('myType', MyType, {
  name: 'me',
});

flyter.attach('div', {
  type: {
    name: 'myType',
    config: {
      name: 'Me myself & I'
    }
  }
});
```
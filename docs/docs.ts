import flyter, {
  withBootstrapTheme,
  withPopupRenderer,
  withInlineRenderer,
  withTextType,
  withSelectType,
  withCheckboxType,
  withRadioType,
  Instance,
} from '../src';

withBootstrapTheme();
withPopupRenderer();
withInlineRenderer();
withTextType();
withSelectType();
withCheckboxType();
withRadioType();

const titleInstance = flyter.attach('#title');

setTimeout(() => {
  // @ts-ignore
  titleInstance.open();
}, 600);

flyter.attach('.flyter-attr');

flyter.attach('#types', {
  initialValue: [1,2],
  type: {
    name: 'checkbox',
    config: {
      dataSource: [
        { label: 'Awesome', value: 0},
        { label: 'Integrated', value: 1 },
        { label: 'types', value: 2},
      ],
      displaySeparator: ' ',
    }
  }
});

flyter.attach('#renderers', {
  initialValue: [1],
  type: {
    name: 'select',
    config: {
      dataSource: [
        { label: 'Popup', value: 1 },
        { label: 'Inline', value: 2},
      ],
    }
  },
  onSubmit: (value, instance) => {
    const renderer = value === '1' ? 'popup' : 'inline';
    instance.updateConfig({
      renderer: {
        name: renderer
      }
    });
  },
});

flyter.attach('#config', {
  initialValue: [1],
  type: {
    name: 'radio',
    config: {
      dataSource: [
        { label: 'Configurable', value: 1 },
        { label: 'Triggers an error', value: 2},
        { label: 'Takes time to validate', value: 3},
      ],
    }
  },
  validate: (val) => {
    if(val === 'yo') return 'swag';
    if (val === '1') return true;
    if (val === '2') throw new Error('BOOM error lol');
    if (val === '3') return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  },
  onCancel() {
    alert('Did you just cancel me?!');
  },
});

flyter.attach('#async', {
  initialValue: 'Async support',
  type: {
    name: 'text',
    config: {
      type: 'textarea',
    }
  },
  validate: () => {
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  },
  onOpen: () => {
    return new Promise((resolve) => setTimeout(() => resolve(), 900));
  },
});

flyter.attach('#ex-doc', {
  initialValue: ['1'],
  emptyValueDisplay: "I'm not feeling anything today",
  type: {
    name: 'checkbox',
    config: {
      dataSource: [
        { label: '😊', value: '1' },
        { label: '❤️', value: '2' },
        { label: '🔥', value: '3' },
        { label: '🍺', value: '4' },
      ],
    }
  },
  valueFormatter: async (val, instance) => {
    // Here we ask the current instance to build the value which
    // would have been displayed if we didn't overload valueFormatter.
    // It uses the type to build a readable value, uses the one from
    // the current editing session if any or builds one on the fly otherwise
    const readableValue = await instance.buildStandardReadableValue(val);
    return `Today I'm feeling ${readableValue}`;
  }
});

flyter.attach('.flyter-btn', {
  renderer: {
    config: {
      popperConfig: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 70], // offset to match bootstrap button
            }
          }
        ]
      }
    }
  }
});
import flyter, {
  withBootstrapTheme,
  withPopupRenderer,
  withInlineRenderer,
  withTextType,
  withSelectType,
  withCheckboxType,
  withRadioType,
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
  initialValue: 10,
  type: {
    name: 'text',
    config: {
      type: 'number'
    }
  },
  valueFormatter: (val) => `Current value: ${val}`,
  renderer: {
    name: 'popup',
    config: {
      popperConfig: {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 20],
            }
          }
        ]
      }
    }
  }
});
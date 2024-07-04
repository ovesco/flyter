# Templates
Flyter allows you to override the templates used internally, mostly used if you define a new theme.

|key|type|description|default value|
|---|---|---|---|
|template.edit|`string`*|The edit markup which will contain the editing type and actions (buttons)|`See below`|
|template.buttons|`string`*|The buttons markup|`See below`|
|template.read|`string`*|The displayed value (when not triggered), as well as the loading container|`See below`|
|template.loading|`string`*|The loading indicator|`See below`|

Here are the vanilla templates used. Please note that they have some `data-flyter-` attributes which are **mandatory** if
you override those templates.

### Edit
```html
<div class="flyter-edit-container">
  <div data-flyter-edit>
    <!-- will contain the type markup -->
  </div>
  <div data-flyter-action>
    <!-- will contain the two buttons if enabled -->
  </div>
</div>
```

### Buttons
```html
<div class="flyter-buttons-container">
  <button data-flyter-submit><!-- contains okButton.text --></button>
  <button data-flyter-cancel><!-- contains cancelButton.text --></button>
</div>
```

### Read
This template is used when flyter is not triggered, when not open in edition mode.
```html
<div class="flyter-read-container">
  <span data-flyter-read><!-- contains the displayed value --></span>
  <div data-flyter-loading><!-- contains the loader --></div>
</div>
```

### Loading
```html
<div>Loading</div>
```

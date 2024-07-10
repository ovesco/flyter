# Callbacks and hooks

Those configuration options allow you to hook into the instance lifecycle and perform various operations.

|key|type|description|default behavior|
|---|---|---|---|
|valueFormatter|`async (value, instance) => string`|Formats the value to be displayed|Uses the type to generate a string|
|onOpen|`async (instance) => any`|Called when the instance is triggered and opens its edition session|`() => null`|
|onClose|`async (instance) => any`|Called when the instance closes its edition session|`() => null`|
|onDestroy|`async (instance) => any`|Called when the flyter instance is manually destroyed|`() => null`|
|onSubmit|`async (value, instance) => any`|Called when submitting the value, can be used to override the default server handler|Simple server handler (see server section)|
|onLoading|`(status: boolean, instance) => any`|Called when the instance (not in edition) is in loading mode|`() => null`|
|onRendererLoading|`(status: boolean, instance) => any`|Called when the renderer (instance in edition) is in loading mode|`() => null`|
|onError|`async (error, instance) => any`|Called when an error is thrown somewhere|`(e) => console.log(e)`|
|onCancel|`async (instance) => any`|Called when an edition session is canceled|`() => null`|
|onDisabled|`async (instance) => any`|Called when a Flyter instance is disabled|`() => null`|
|onEnabled|`async (instance) => any`|Called when a Flyter instance is enabled|`() => null`|
|validate|`async (value, instance) => boolean | Error`|Can be used to validate the submitted value, before calling the `onSubmit` callback|`() => true`|
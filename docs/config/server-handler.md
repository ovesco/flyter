# Server Handler

Flyter ships with a simple server handler which performs an async request on submit. This can be easily overriden
using the `onSubmit` callback, but these options allow you to configure how the request is sent if
you keep the default handler.

|key|type|description|default value|
|---|---|---|---|
|server.url|`string`*|url to which submit data|`null`|
|server.method|`string`*|which method to use (`GET`, `POST`...)|`'POST'`|
|server.queryParams|`object`*|some additional data to pass to request body|`null`|
|server.resultFormatter|`(data: any, value: any) => any`|Called after server response, can be used to format received value before forwarding it to flyter|given `value`|

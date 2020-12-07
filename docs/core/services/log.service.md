---
Title: Log Service
Added: v2.0.0
Status: Active
Last reviewed: 2018-06-08
---

# [Log Service](../../../lib/core/services/log.service.ts "Defined in log.service.ts")

Provides log functionality.

## Basic Usage

**app.component.ts**

```ts
import { LogService } from '@alfresco/adf-core';

@Component({...})
export class AppComponent {

    constructor(logService: LogService) {
    }
    
    myMethod(){
      this.logService.error('My error');
      this.logService.trace('My trace')
      this.logService.debug('My debug')
      this.logService.info('My info')
      this.logService.warn('My warn')
    }
    
}
```

```ts
import { LogService } from '@alfresco/adf-core';

@Component({...})
export class AppComponent {

    constructor(logService: LogService, myIntegrationService: MyIntegrationService)) {
        logService.onMessage.subscribe((message) => {
               myIntegrationService.send(message.text,message.type);
         });
    }
}
```

## Class members

### Methods

*   **assert**(test?: `boolean`, message?: `string`, optionalParams: `any[]`)<br/>
    Logs a message if a boolean test fails.
    *   *test:* `boolean`  - (Optional) Test value (typically a boolean expression)
    *   *message:* `string`  - (Optional) Message to show if test is false
    *   *optionalParams:* `any[]`  - Interpolation values for the message in "printf" format
*   **debug**(message?: `any`, optionalParams: `any[]`)<br/>
    Logs a message at the "DEBUG" level.
    *   *message:* `any`  - (Optional) Message to log
    *   *optionalParams:* `any[]`  - Interpolation values for the message in "printf" format
*   **error**(message?: `any`, optionalParams: `any[]`)<br/>
    Logs a message at the "ERROR" level.
    *   *message:* `any`  - (Optional) Message to log
    *   *optionalParams:* `any[]`  - Interpolation values for the message in "printf" format
*   **getLogLevel**(level: `string`): [`LogLevelsEnum`](../../../lib/core/models/log-levels.model.ts)<br/>
    Converts a log level name string into its numeric equivalent.
    *   *level:* `string`  - Level name
    *   **Returns** [`LogLevelsEnum`](../../../lib/core/models/log-levels.model.ts) - Numeric log level
*   **group**(groupTitle?: `string`, optionalParams: `any[]`)<br/>
    Starts an indented group of log messages.
    *   *groupTitle:* `string`  - (Optional) Title shown at the start of the group
    *   *optionalParams:* `any[]`  - Interpolation values for the title in "printf" format
*   **groupEnd**()<br/>
    Ends a indented group of log messages.
*   **info**(message?: `any`, optionalParams: `any[]`)<br/>
    Logs a message at the "INFO" level.
    *   *message:* `any`  - (Optional) Message to log
    *   *optionalParams:* `any[]`  - Interpolation values for the message in "printf" format
*   **log**(message?: `any`, optionalParams: `any[]`)<br/>
    Logs a message at any level from "TRACE" upwards.
    *   *message:* `any`  - (Optional) Message to log
    *   *optionalParams:* `any[]`  - Interpolation values for the message in "printf" format
*   **messageBus**(text: `string`, logLevel: `string`)<br/>
    Triggers notification callback for log messages.
    *   *text:* `string`  - Message text
    *   *logLevel:* `string`  - Log level for the message
*   **trace**(message?: `any`, optionalParams: `any[]`)<br/>
    Logs a message at the "TRACE" level.
    *   *message:* `any`  - (Optional) Message to log
    *   *optionalParams:* `any[]`  - Interpolation values for the message in "printf" format
*   **warn**(message?: `any`, optionalParams: `any[]`)<br/>
    Logs a message at the "WARN" level.
    *   *message:* `any`  - (Optional) Message to log
    *   *optionalParams:* `any[]`  - Interpolation values for the message in "printf" format

## Details

### Log levels

There are 6 levels of logs that you can use:

| Name   | Level |
| ------ | ----- |
| TRACE  | 5     |
| DEBUG  | 4     |
| INFO   | 3     |
| WARN   | 2     |
| ERROR  | 1     |
| SILENT | 0     |

You can set the default log level using the ***logLevel*** property in `app.config.json`.
The factory setting for this property is `TRACE`.

For example, you can set the default log level to `WARNING` as follows:

**app.config.json**

```json
{
    "logLevel": "WARN" 
}
```

### Log message bus

The [log service](log.service.md) also provides an
[`Observable`](http://reactivex.io/documentation/observable.html) called `_onMessage_`
that you can subscribe to if you want to receive all the log messages.
The message object passed as a parameter to the `onMessage` handler has the following format:

```ts
{
    text: "Message log text"
    type: "ERROR|DEBUG|INFO|LOG|TRACE|WARN|ASSERT"
}
```

### Using the log to feed analytics

You can pass the log output to an analytics system to collect error and assertion data
from apps as they run. This can help you spot which problems users are running into most
often and the situations in which they occur. See the tutorial about
[integrating the log service with analytics](https://community.alfresco.com/community/application-development-framework/blog/2018/05/01/how-to-integrate-adf-log-service-with-mixpanel-analytics-service)
on the Alfresco Community site for further information.

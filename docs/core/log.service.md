---
Added: v2.0.0
Status: Active
---

# Log Service

Provide a log functionality for your ADF application.

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

### Log levels

The [log service](../core/log.service.md) provide 6 level of logs:

| Name | Level |
| ---- | ----- |
| TRACE | 5 |
| DEBUG | 4 |
| INFO | 3 |
| WARN | 2 |
| ERROR | 1 |
| SILENT | 0 |

You can configure the log level setting the **_logLevel_** properties in the **app.config.json**. By default the level is TRACE.

If you want set for example the log to warning:

**app.config.json**

```json
{
    "logLevel": "WARN" 
}
```

### Log message bus

The logservice provide also an [`Observable`](http://reactivex.io/documentation/observable.html) **_onMessage_**  where you can subscribe and recive all the logs: 

The messagge object recived form the bus is composed:

```ts
{
    text: "Message log text"
    type: "ERROR|DEBUG|INFO|LOG|TRACE|WARN|ASSERT"
}
```

## Usage

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

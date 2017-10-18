# Log Service

Provide a log functionality for your ADF application.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Log levels](#log-levels)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

**app.component.ts**

```ts
import { LogService } from 'ng2-alfresco-core';

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

The log service provide 6 level of logs:

Name | Level
-|-
TRACE |5
DEBUG |4
INFO |3
WARN |2
ERROR |1
SILENT |0

You can configure the log level setting the ***logLevel*** properties in the **app.config.json**. By default the level is TRACE.

If you want set for example the log to warning:

**app.config.json**

```json
{
    "logLevel": "WARN" 
}
```
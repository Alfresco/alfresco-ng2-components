---
Title: Dynamic Component
Added: v3.1.0
Status: Experimental
Last reviewed: 2018-04-12
---

# [Preview Extension component](../../lib/extensions/src/lib/components/viewer/preview-extension.component.ts "Defined in preview-extension.component.ts")

Displays dynamically-loaded extension components.
If you want give a look on a real working viewer extension project you can look at [aca monaco extensio](https://github.com/eromano/aca-monaco-extension)
## Class members

### Properties

The viewer component when it recognize a new extension always pass the following two parameter as input:

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| url | `string` |  | URL Of the content in the repository |
| node | `Node` |  | Node of the content to display |


## Details

If you want create your custom extension viewer you need to create the following files in a separate project:


The Module needs to know which is the Id of your extension:

```ts
export class YourExtensionViewerModule {
  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      'your-extension.main.component': YourExtensionViewerComponent
    });
  }
}

```


Your viewer component extension business logic:

```ts
import { Node } from '@alfresco/js-api';
import { ViewerExtensionInterface } from '@alfresco/adf-extensions';

@Component({
  selector: 'your-extension-viewer',
  templateUrl: './your-extension-view.component.html',
  styleUrls: ['./your-extension-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class YourExtensionViewerComponent implements ViewerExtensionInterface {

  showToolbar = true;

  @Input()
  url: string;

  @Input()
  node: Node;
  
  
  ....YOUR CUSTOM LOGIC
}

```

Your viewer component template:

```HTML

<div> This is your custom extension viewer template</div>

```

Your viewer component extension.json:


```JSON
{
  "$version": "1.0.0",
  "$name": "my viewer extension",
  "$description": "my viewer  plugin",
  "features": {
    "viewer": {
      "content": [
        {
          "id": "dev.tools.viewer.viewer",
          "fileExtension": ["png", "jpg"],
          "component": "your-extension.main.component"
        }
      ]
    }
  }
}

```



## See also

-   [Extension service](../../lib/extensions/src/lib/services/extension.service.ts)

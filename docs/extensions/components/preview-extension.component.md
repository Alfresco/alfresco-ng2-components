---
Title: Dynamic Component
Added: v3.1.0
Status: Experimental
Last reviewed: 2018-04-12
---

# [Preview Extension component](../../../lib/extensions/src/lib/components/viewer/preview-extension.component.ts "Defined in preview-extension.component.ts")

Displays dynamically-loaded extension components.

See the [ACA monaco extension](https://github.com/eromano/aca-monaco-extension) for
an example of a real working viewer extension project.

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| extension | `string` |  |  |
| id | `string` |  |  |
| node | [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/development/src/api/content-rest-api/docs/Node.md) |  | of the content to display |
| url | `string` |  | URL Of the content in the repository |

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

Your [viewer component](../../core/components/viewer.component.md) extension business logic:

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

Your [viewer component](../../core/components/viewer.component.md) template:

```HTML
<div> This is your custom extension viewer template</div>
```

Your [viewer component](../../core/components/viewer.component.md) extension.json:

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

-   [Extension service](../services/extension.service.md)

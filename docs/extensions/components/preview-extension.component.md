---
Title: Preview Extension Component
Added: v3.1.0
Status: Experimental
Last reviewed: 2019-03-15
---

# [Preview Extension component](../../../lib/extensions/src/lib/components/viewer/preview-extension.component.ts "Defined in preview-extension.component.ts")

Supports dynamically-loaded viewer preview extensions.

See the [ACA monaco extension](https://github.com/eromano/aca-monaco-extension) for
an example of a real working viewer extension project.

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| extension | `string` |  | File extension (.jpg, .png, etc) for the viewer. |
| id | `string` |  | ID string of the component to preview. |
| url | `string` |  | URL of the content in the repository. |

## Details

To create your custom extension viewer you need to create the following files in a separate project:

The Module needs to declare the ID of your extension:

```ts
export class YourExtensionViewerModule {
  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      'your-extension.main.component': YourExtensionViewerComponent
    });
  }
}
```

Your [viewer component](../../core/components/viewer.component.md) extension contains
the business logic:

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

The [viewer component](../../core/components/viewer.component.md)
also needs an HTML template (which is referenced by the `templateUrl` property
in the `@Component` decorator of the component class above):

```HTML
<div> This is your custom extension viewer template</div>
```

You also need to provide a [viewer component](../../core/components/viewer.component.md)`extension.json` file containing its details:

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

You can also use `*` wildcard to register a single component that opens all files:

```json
{
  "$version": "1.0.0",
  "$name": "my viewer extension",
  "$description": "my viewer  plugin",
  "features": {
    "viewer": {
      "content": [
        {
          "id": "dev.tools.viewer.viewer",
          "fileExtension": "*",
          "component": "your-extension.main.component"
        }
      ]
    }
  }
}
```

> It is recommended to use wildcard replacement only when introducing your own Viewer implementation.

See the [App extensions](../../user-guide/app-extensions.md) page for
further details of how to develop extensions.

## See also

-   [Extension service](../services/extension.service.md)
-   [App extensions](../../user-guide/app-extensions.md)

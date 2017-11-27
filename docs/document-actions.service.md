# Document Actions service

Implements the document menu actions for the Document List component.

## Details

This service implements the built-in actions that can be applied to a document
shown in a [Document List component](document-list.component.md): **delete**,
**download**, **copy** and **move** (see the
[Content Action component](content-action.component.md) for further details and examples
of these menu items). However, you can also use the service to add extra actions or
replace the built-in ones with your own implementation.

### Registering an action

In the example below, a custom handler called `my-handler` is registered with the service.
This action will invoke the `myDocumentActionHandler` function each time it is selected
from the Document List menu.

```ts
import { DocumentActionsService } from 'lib/content-services/document-list/services';

export class MyView {

    constructor(documentActions: DocumentActionsService) {
        documentActions.setHandler(
            'my-handler',
            this.myDocumentActionHandler.bind(this)
        );
    }

    myDocumentActionHandler(obj: any) {
        window.alert('my custom action handler');
    }
}
```

The action can then be used from the component in the usual way:

```html
<adf-document-list ...>
    <content-actions>

        <content-action
            target="document"
            title="My action"
            handler="my-handler">
        </content-action>

    </content-actions>
</adf-document-list>
```

You can also override a built-in handler (eg, 'download') with your own function:

```ts
export class MyView {

    constructor(documentActions: DocumentActionsService) {
        documentActions.setHandler(
            'download',
            this.customDownloadBehavior.bind(this)
        );
    }

    customDownloadBehavior(obj: any) {
        window.alert('my custom download behavior');
    }
}
```

You will probably want to set up all your custom actions at the application root level or
with a custom application service.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Content action component](content-action.component.md)
- [Folder actions service](folder-actions.service.md)
<!-- seealso end -->
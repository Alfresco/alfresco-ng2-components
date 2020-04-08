---
Title: Document Actions service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-13
---

# [Document Actions service](../../../lib/content-services/src/lib/document-list/services/document-actions.service.ts "Defined in document-actions.service.ts")

Implements the document menu actions for the [Document List component](../components/document-list.component.md).

## Class members

### Methods

-   **canExecuteAction**(nodeEntry: [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)): `boolean`<br/>
    Checks if actions can be executed for an item.
    -   _nodeEntry:_ [`NodeEntry`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md)  - Item to receive an action
    -   **Returns** `boolean` - True if the action can be executed on this item, false otherwise
-   **getHandler**(key: `string`): [`ContentActionHandler`](../../../lib/content-services/src/lib/document-list/models/content-action.model.ts)<br/>
    Gets the handler for an action.
    -   _key:_ `string`  - Identifier of the action
    -   **Returns** [`ContentActionHandler`](../../../lib/content-services/src/lib/document-list/models/content-action.model.ts) - The handler for the action
-   **setHandler**(key: `string`, handler: [`ContentActionHandler`](../../../lib/content-services/src/lib/document-list/models/content-action.model.ts)): `boolean`<br/>
    Sets a new handler for an action.
    -   _key:_ `string`  - Identifier of the action
    -   _handler:_ [`ContentActionHandler`](../../../lib/content-services/src/lib/document-list/models/content-action.model.ts)  - Handler for the action
    -   **Returns** `boolean` - False if the key was an empty/null string, true otherwise

## Details

This service implements the built-in actions that can be applied to a document
shown in a [Document List component](../components/document-list.component.md): **delete**,
**download**, **copy** and **move** (see the
[Content Action component](../components/content-action.component.md) for further details and examples
of these menu items). However, you can also use the service to add extra actions or
replace the built-in ones with your own implementation.

### Registering an action

In the example below, a custom handler called `my-handler` is registered with the service.
This action will invoke the `myDocumentActionHandler` function each time it is selected
from the Document List menu.

```ts
import { DocumentActionsService } from '@alfresco/adf-content-services';

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
with a custom [application service](../../../lib/testing/src/lib/core/actions/APS/applications.service.ts).

## See also

-   [Content action component](../components/content-action.component.md)
-   [Folder actions service](folder-actions.service.md)

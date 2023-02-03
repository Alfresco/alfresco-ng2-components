---
Title: Comment list component
Added: v2.0.0
Status: Active
Last reviewed: 2023-01-10
---

# [Comment list component](../../../lib/core/src/lib/comments/comment-list/comment-list.component.ts "Defined in comment-list.component.ts")

Shows a list of comments.

![ADF Comment List](../../docassets/images/adf-comment-list.png)

## Basic Usage

Populate the comments in the component class:

```ts
import { CommentModel } from '@alfresco/adf-core';

export class SomeComponent implements OnInit {

  comments: CommentModel[] = [
    {
      id: 1,
      message: 'Comment number 1',
      created: new Date(),
      createdBy: {
        id: 1,
        email: 'john.doe@alfresco.com',
        firstName: 'John',
        lastName: 'Doe'
      },
    },
    {
      id: 2,
      message: 'Comment number 2',
      created: new Date(),
      createdBy: {
        id: 2,
        email: 'jane.doe@alfresco.com',
        firstName: 'Jane',
        lastName: 'Doe'
      },
    }
  ];

  onClickCommentRow(comment: CommentModel) {
    console.log('Clicked row: ', comment);
  }
```

In the component template use the [comment list component](comment-list.component.md):

```html
<adf-comment-list
    [comments]="comments"
    (clickRow)="onClickCommentRow($event)">
</adf-comment-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| comments | [`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`[]` |  | The comments data used to populate the list. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| clickRow | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`CommentModel`](../../../lib/core/src/lib/models/comment.model.ts)`>` | Emitted when the user clicks on one of the comment rows. |

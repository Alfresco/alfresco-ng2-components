---
Title: Rich Text Editor component
Added: v1.0.0
Status: Active
Last reviewed: 2020-07-20
---

# [Rich Text Editor component](lib/process-services-cloud/src/lib/rich-text-editor/rich-text-editor.component.ts "Defined in rich-text-editor.component.ts")

Wrap [Editor.js](https://editorjs.io/) element to show a Rich Text editor allows to add formatted text.

## Basic usage

**app.component.html**

```html
<adf-rich-text-editor [data]="data" #editor> </adf-rich-text-editor>
<button (click)="saveContent()">Save</button>
```

**app.component.ts**

```ts
@Component({...})
export class RichTextEditorDemo {

    @ViewChild('editor')
    editorRef;

    data = {
        time: 1658154611110,
        blocks: [
            {
                id: '99jwc03ETP',
                type: 'header',
                data: {
                    text: 'Header',
                    level: 2
                }
            },
            {
                id: 'ffdulIdU1E',
                type: 'paragraph',
                data: {
                    text: 'Sample paragraph',
                    alignment: 'left'
                }
            },
        ],
        version: 1
    };

    async saveContent(){
        try {
            const editorContent = await this.editorRef.getEditorContent();
            // do some stuff with editor content
        } catch (error) {
            // catch error
        }
    }

}
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| data | `OutputData` | null | EditorJs data format (follow the [official documentation](https://editorjs.io/saving-data) ) |
| readOnly | `boolean` | false | If true users won't have the ability to change the document content |

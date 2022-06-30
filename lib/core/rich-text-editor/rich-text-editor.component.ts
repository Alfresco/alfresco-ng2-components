import { AfterViewInit, Component, OnInit } from '@angular/core';

import EditorJS from '@editorjs/editorjs';

/** Plugin import */
import Header from '@editorjs/header';
import List from '@editorjs/list';

@Component({
    selector: 'adf-rich-text-editor',
    templateUrl: './rich-text-editor.component.html',
    styleUrls: ['./rich-text-editor.component.scss']
})
export class RichTextEditorComponent implements OnInit, AfterViewInit {

    editor: any;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.editor = new EditorJS({
            logLevel: 'ERROR',
            tools: {
                header: Header,
                list: {
                    class: List,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                }
            }
        } as any);
    }

}

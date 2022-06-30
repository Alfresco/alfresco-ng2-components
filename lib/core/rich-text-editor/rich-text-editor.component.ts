import { AfterViewInit, Component, OnInit } from '@angular/core';

import EditorJS from '@editorjs/editorjs';


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
            logLevel: 'ERROR'
        } as any);
    }

}

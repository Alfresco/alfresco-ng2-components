import { AfterViewInit, Component, OnInit } from '@angular/core';

import EditorJS from '@editorjs/editorjs';

/** Plugin import */
import Header from '@editorjs/header';
import List from '@editorjs/list';
import * as ColorPlugin from 'editorjs-text-color-plugin';
import * as Paragraph from 'editorjs-paragraph-with-alignment';
import * as ChangeFontSize from '@quanzo/change-font-size';
import Underline from '@editorjs/underline';
import InlineCode from '@editorjs/inline-code';

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
                underline: {
                    class: Underline,
                    shortcut: 'CMD+U'
                },
                header: {
                    class: Header,
                    inlineToolbar: true
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                },
                Color: {
                    class: ColorPlugin,
                    config: {
                        colorCollections: ['#EC7878', '#9C27B0', '#673AB7', '#3F51B5', '#0070FF', '#03A9F4', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFF'],
                        defaultColor: '#FF1300',
                        type: 'text'
                    }
                },
                Marker: {
                    class: ColorPlugin,
                    config: {
                        defaultColor: '#FFBF00',
                        type: 'marker'
                    }
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true
                },
                'Increase/Decrease font size': {
                    class: ChangeFontSize,
                    config: {
                        cssClass: 'plus20pc'
                    }
                },
                inlineCode: {
                    class: InlineCode,
                    shortcut: 'CMD+SHIFT+M'
                }
            }
        } as any);
    }

}

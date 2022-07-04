import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

import EditorJS from '@editorjs/editorjs';
import { BlockToolData } from '@editorjs/editorjs/types';

/** Plugin import */
import Header from '@editorjs/header';
import List from '@editorjs/list';
import * as ColorPlugin from 'editorjs-text-color-plugin';
import * as Paragraph from 'editorjs-paragraph-with-alignment';
import * as ChangeFontSize from '@quanzo/change-font-size';
import Underline from '@editorjs/underline';
import InlineCode from '@editorjs/inline-code';
import CodeTool from '@editorjs/code';
import Marker from '@editorjs/marker';

@Component({
    selector: 'adf-rich-text-editor',
    templateUrl: './rich-text-editor.component.html',
    styleUrls: ['./rich-text-editor.component.scss']
})
export class RichTextEditorComponent implements OnInit, AfterViewInit {

    @Input()
    data: BlockToolData<any> = {};

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
                        customPicker: true,
                        colorCollections: ['#FF1300', '#ffa500', '#9C27B0', '#673AB7', '#3F51B5', '#0070FF', '#03A9F4', '#00BCD4', '#5f9ea0', '#4CAF50', '#8BC34A', '#CDDC39', '#FFF', '#000', '#c0c0c0', '#808080', '#800000'],
                        defaultColor: '#FF1300',
                        type: 'text'
                    }
                },
                Marker: {
                    class: Marker,
                    shortcut: 'CMD+M'
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
                },
                code: CodeTool
            },
            data: this.data,
            onChange: (api, event) => {
                console.log(api);

                this.editor.save().then((outputData) => {
                    console.log('Article data: ', outputData)
                  }).catch((error) => {
                    console.log('Saving failed: ', error)
                  });console.log('Now I know that Editor\'s content changed!', event)
              }
        } as any);
    }

}

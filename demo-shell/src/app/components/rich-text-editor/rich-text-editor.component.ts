import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-rich-text-editor',
    templateUrl: './rich-text-editor.component.html',
    styleUrls: ['./rich-text-editor.component.scss']
})
export class RichTextEditorComponent implements OnInit {

    sampleData = {
        time: 1656674370891,
        blocks: [
            {
                id: '99jwc03ETP',
                type: 'header',
                data: {
                    text: 'Headet',
                    level: 2
                }
            },
            {
                id: 'ffdulIdU1E',
                type: 'paragraph',
                data: {
                    text: `is simply <mark class="cdx-marker">dummy</mark> text of the <font color="#ff1300">printing</font> and typesetting industry.
                    <b><i><span class="plus20pc">Lorem</span></i></b> Ipsum has been the industry\'s standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining essentially <font color="#0070ff"><b>unchanged</b></font>.
                    It was <u class="cdx-underline">popularised</u> in the 1960s with the release of sheets containing
                    <a href="#testlink">Lorem</a> Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem`,
                    alignment: 'left'
                }
            },
            {
                id: 'rTcF4u0pr3',
                type: 'list',
                data: {
                    style: 'unordered',
                    items: [
                        'Unordered list <b><u class="cdx-underline">example</u></b>',
                        'Unordered list example'
                    ]
                }
            },
            {
                id: 'Kg2e_K1nHU',
                type: 'list',
                data: {
                    style: 'ordered',
                    items: [
                        'Ordered list <u class="cdx-underline">example</u>',
                        '<span class="plus20pc"><a href="#"><font color="#a43eb1">Ordered</font></a></span> list example'
                    ]
                }
            },
            {
                id: 'xqqk0DEmqh',
                type: 'code',
                data: {
                    code: '// Amazing code example\n\ncatch(Exception ex){\n   // Houston, we have a problem\n}'
                }
            }
        ]
    };

    constructor() { }

    ngOnInit(): void {
    }

}

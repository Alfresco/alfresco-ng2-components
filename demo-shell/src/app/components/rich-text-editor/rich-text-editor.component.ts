/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AfterViewInit, Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { OutputData } from '@editorjs/editorjs';
import { RichTextEditorComponent as AdfRichTextEditorComponent } from '@alfresco/adf-process-services-cloud';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-rich-text-editor',
    templateUrl: './rich-text-editor.component.html',
    styleUrls: ['./rich-text-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RichTextEditorComponent implements AfterViewInit, OnDestroy {

    @ViewChild('textEditor')
    textEditor: AdfRichTextEditorComponent;

    onDestroy$ = new Subject<boolean>();

    editorOutputData: OutputData;

    sampleData = {
        time: 1656674370891,
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

    ngAfterViewInit(): void {
        this.textEditor.outputData$.pipe(
            takeUntil(this.onDestroy$)
        ).subscribe(outputData => {
            this.editorOutputData = outputData;
        });
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

}

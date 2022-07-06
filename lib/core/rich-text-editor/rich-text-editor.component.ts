/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

import EditorJS, { OutputData } from '@editorjs/editorjs';
import { BlockToolData } from '@editorjs/editorjs/types';
import { Subject } from 'rxjs';
import { editorJsConfig } from './editorjs-config';

@Component({
    selector: 'adf-rich-text-editor',
    templateUrl: './rich-text-editor.component.html',
    styleUrls: ['./rich-text-editor.component.scss']
})
export class RichTextEditorComponent implements OnInit, AfterViewInit {

    @Input()
    data: BlockToolData<any> = {};

    @Input()
    readOnly = false;

    private _outputData = new Subject<OutputData>();

    outputData$ = this._outputData.asObservable();

    editorInstance: EditorJS;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.editorInstance = new EditorJS({
            ...editorJsConfig,
            data: this.data,
            readOnly: this.readOnly,
            onChange: () => {
                this.sendEditorOutputData();
            },
            onReady: () => {
                this.sendEditorOutputData();
            }
        } as any);
    }

    private sendEditorOutputData() {
        this.editorInstance.save().then((outputData) => {
            this._outputData.next(outputData);
        }).catch((error) => {
            console.log('Saving failed: ', error);
        });
    }

    getEditorContent() {
        return this.editorInstance.save();
    }

}

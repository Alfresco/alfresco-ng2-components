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

import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import EditorJS, { OutputData } from '@editorjs/editorjs';
import { Subject } from 'rxjs';
import { editorJsConfig } from './editorjs-config';

@Component({
    selector: 'adf-cloud-rich-text-editor',
    templateUrl: './rich-text-editor.component.html',
    styleUrls: ['./rich-text-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RichTextEditorComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input()
    data: OutputData;

    @Input()
    readOnly = false;

    private _outputData = new Subject<OutputData>();

    outputData$ = this._outputData.asObservable();

    editorInstance: EditorJS;
    dynamicId: string;
    isReady = false;

    constructor() {
    }

    ngOnInit(): void {
        this.dynamicId = `editorjs-${crypto.getRandomValues(new Uint32Array(1))}`;
    }

    ngAfterViewInit(): void {
        this.editorInstance = new EditorJS({
            holder: this.dynamicId,
            ...editorJsConfig,
            data: this.data,
            readOnly: this.readOnly,
            onChange: () => {
                if (!this.readOnly) {
                    this.sendEditorOutputData();
                }
            },
            onReady: () => {
                this.isReady = true;
                if (!this.readOnly) {
                    this.sendEditorOutputData();
                }
            }
        } as any);
    }

    private sendEditorOutputData() {
        this.editorInstance.save().then((outputData) => {
            this._outputData.next(outputData);
        }).catch((error) => {
            console.error('Saving failed: ', error);
        });
    }

    getEditorContent() {
        return this.editorInstance.save();
    }

    ngOnDestroy(): void {
        if (this.isReady) {
            this.editorInstance.destroy();
        }
    }

}

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

import { Component, Inject, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface EditJsonDialogSettings {
    title?: string;
    editable?: boolean;
    value?: string;
}

@Component({
    templateUrl: 'edit-json.dialog.html',
    styleUrls: ['edit-json.dialog.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-edit-json-dialog' }
})
export class EditJsonDialogComponent implements OnInit {

    editable: boolean = false;
    title: string = 'JSON';

    @Input()
    value: string = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) private settings: EditJsonDialogSettings
    ) {}

    ngOnInit() {
        if (this.settings) {
            this.editable = this.settings.editable ? true : false;
            this.value = this.settings.value || '';
            this.title = this.settings.title || 'JSON';
        }
    }
}

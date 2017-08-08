/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

@Component({
    selector: 'adf-viwer-dialog',
    templateUrl: 'viewer-dialog.component.html',
    styleUrls: ['viewer-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ViewerDialogComponent implements OnInit {

    previewError = true;
    previewErrorIcon = 'wifi_tethering';
    previewErrorText = 'Document preview could not be loaded.';

    constructor(private dialogRef: MdDialogRef<ViewerDialogComponent>,
                @Inject(MD_DIALOG_DATA) private data: { node?: MinimalNodeEntryEntity }) {

    }

    ngOnInit() {
        console.log(this.data);
    }

    close() {
        this.dialogRef.close(false);
    }


}

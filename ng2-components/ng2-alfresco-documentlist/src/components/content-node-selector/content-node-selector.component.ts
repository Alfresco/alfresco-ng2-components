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

import { Component, Inject, Input, Optional, Output, ViewEncapsulation } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
    selector: 'adf-content-node-selector',
    styleUrls: ['./content-node-selector.component.scss'],
    templateUrl: './content-node-selector.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ContentNodeSelectorComponent {

    chosenNode: any = null;

    inDialog: boolean = false;

    @Input()
    title: string;

    @Output()
    selected: any;

    constructor(
        @Optional() @Inject(MD_DIALOG_DATA) public data?: any,
        @Optional() private containingDialog?: MdDialogRef<ContentNodeSelectorComponent>
    ) {
        if (data) {
            this.title = data.title;
        }

        if (containingDialog) {
            this.inDialog = true;
        }
    }

    close() {
        this.containingDialog.close();
    }
}

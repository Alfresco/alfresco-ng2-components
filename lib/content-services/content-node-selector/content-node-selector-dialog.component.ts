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

import { Component, Inject, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ContentNodeSelectorComponent } from './content-node-selector.component';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ContentNodeSelectorComponentData } from './content-node-selector.component-data.interface';

@Component({
    templateUrl: './content-node-selector-dialog.component.html',
    styleUrls: ['./content-node-selector-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentNodeSelectorDialogComponent {

    @Output()
    selectedNodes: EventEmitter<MinimalNodeEntryEntity[]> = new EventEmitter<MinimalNodeEntryEntity[]>();

    @ViewChild(ContentNodeSelectorComponent)
    contentNodeSelector: ContentNodeSelectorComponent

    buttonActionName: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: ContentNodeSelectorComponentData,
                private containingDialog: MatDialogRef<ContentNodeSelectorDialogComponent>) {
        this.buttonActionName = data.actionName ? `NODE_SELECTOR.${data.actionName.toUpperCase()}` : 'NODE_SELECTOR.CHOOSE';
    }

    close() {
        this.containingDialog.close();
    }

    onSelect(nodeList: MinimalNodeEntryEntity[]) {
        this.selectedNodes.next(nodeList);
    }

    onClick(): void {
        this.contentNodeSelector.choose();
    }
}

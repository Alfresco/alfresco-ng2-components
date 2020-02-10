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

import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Node } from '@alfresco/js-api';
import { ContentNodeSelectorComponentData } from './content-node-selector.component-data.interface';

@Component({
    selector: 'adf-content-node-selector',
    templateUrl: './content-node-selector.component.html',
    styleUrls: ['./content-node-selector.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentNodeSelectorComponent {

    buttonActionName: string;
    chosenNode: Node[];

    constructor(@Inject(MAT_DIALOG_DATA) public data: ContentNodeSelectorComponentData) {
        this.buttonActionName = data.actionName ? `NODE_SELECTOR.${data.actionName.toUpperCase()}` : 'NODE_SELECTOR.CHOOSE';
    }

    close() {
        this.data.select.complete();
    }

    onSelect(nodeList: Node[]) {
        this.chosenNode = nodeList;
    }

    onClick(): void {
        this.data.select.next(this.chosenNode);
        this.data.select.complete();
    }
}

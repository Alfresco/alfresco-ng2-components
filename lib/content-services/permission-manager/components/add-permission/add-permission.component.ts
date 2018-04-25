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

import { Component, ViewEncapsulation, EventEmitter, Input, Output } from '@angular/core';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NodePermissionService } from '../../services/node-permission.service';

@Component({
    selector: 'adf-add-permission',
    templateUrl: './add-permission.component.html',
    styleUrls: ['./add-permission.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddPermissionComponent {

    @Input()
    nodeId: string;

    @Output()
    success: EventEmitter<any> = new EventEmitter();

    @Output()
    error: EventEmitter<any> = new EventEmitter();

    selectedItems: MinimalNodeEntity[] = [];
    currentNode: MinimalNodeEntryEntity;
    currentNodeRoles: string[];

    constructor(private nodePermissionService: NodePermissionService) {
    }

    onSelect(selection: MinimalNodeEntity[]) {
        this.selectedItems = selection;
    }

    applySelection() {
        this.nodePermissionService.updateNodePermission(this.nodeId, this.selectedItems)
            .subscribe(
                (node) => {
                    this.success.emit(node);
                },
                (error) => {
                    this.error.emit(error);
                });
    }

}

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
import { NodesApiService, ContentService, PermissionsEnum } from '@alfresco/adf-core';

@Component({
    selector: 'adf-add-permission',
    templateUrl: './add-permission.component.html',
    styleUrls: ['./add-permission.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddPermissionComponent {

    /** ID of the target node. */
    @Input()
    nodeId: string;

    /** Emitted when the node is updated successfully. */
    @Output()
    success: EventEmitter<MinimalNodeEntryEntity> = new EventEmitter();

    /** Emitted when an error occurs during the update. */
    @Output()
    error: EventEmitter<any> = new EventEmitter();

    selectedItems: MinimalNodeEntity[] = [];
    currentNode: MinimalNodeEntryEntity;
    currentNodeRoles: string[];

    constructor(private nodePermissionService: NodePermissionService,
                private nodeApiService: NodesApiService,
                private contentService: ContentService) {
        this.nodeApiService.getNode(this.nodeId).subscribe((node) => this.currentNode = node);
    }

    onSelect(selection: MinimalNodeEntity[]) {
        this.selectedItems = selection;
    }

    isAddEnabled(): boolean {
        return this.contentService.hasPermission(this.currentNode, PermissionsEnum.UPDATEPERMISSIONS) &&
                this.selectedItems.length !== 0;
    }

    applySelection() {
        if (this.contentService.hasPermission(this.currentNode, PermissionsEnum.UPDATEPERMISSIONS)) {
            this.nodePermissionService.updateNodePermissions(this.nodeId, this.selectedItems)
                .subscribe(
                    (node) => {
                        this.success.emit(node);
                    },
                    (error) => {
                        this.error.emit(error);
                    });
        }
    }

}

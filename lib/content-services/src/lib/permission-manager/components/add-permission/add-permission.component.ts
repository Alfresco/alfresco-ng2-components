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

import { Node, NodeEntry, PermissionElement } from '@alfresco/js-api';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NodePermissionService } from '../../services/node-permission.service';
import { RoleModel } from '../../models/role.model';
import { ContentService } from '../../../common/services/content.service';
import { AllowableOperationsEnum } from '../../../common/models/allowable-operations.enum';

@Component({
    selector: 'adf-add-permission',
    templateUrl: './add-permission.component.html',
    styleUrls: ['./add-permission.component.scss'],
    encapsulation: ViewEncapsulation.None
})
/*
 * @deprecated in 4.4.0, use adf-add-permission-panel instead.
 */
export class AddPermissionComponent implements OnInit {

    /** ID of the target node. */
    @Input()
    nodeId: string;

    /** Emitted when the node is updated successfully. */
    @Output()
    success: EventEmitter<Node> = new EventEmitter();

    /** Emitted when an error occurs during the update. */
    @Output()
    error: EventEmitter<any> = new EventEmitter();

    selectedItems: NodeEntry[] = [];
    currentNode: Node;
    currentNodeRoles: RoleModel[];

    constructor(private nodePermissionService: NodePermissionService,
                private contentService: ContentService) { }

    ngOnInit(): void {
        this.nodePermissionService.getNodeWithRoles(this.nodeId).subscribe(({node, roles }) => {
            this.currentNode = node;
            this.currentNodeRoles = roles;
        });
    }

    onSelect(selection: NodeEntry[]) {
        this.selectedItems = selection;
    }

    isAddEnabled(): boolean {
        return this.contentService.hasAllowableOperations(this.currentNode, AllowableOperationsEnum.UPDATEPERMISSIONS) &&
                this.selectedItems.length !== 0;
    }

    applySelection() {
        if (this.contentService.hasAllowableOperations(this.currentNode, AllowableOperationsEnum.UPDATEPERMISSIONS)) {
            const permissions = this.transformNodeToPermissionElement(this.selectedItems, this.currentNodeRoles[0].role);
            this.nodePermissionService.updateNodePermissions(this.nodeId, permissions)
                .subscribe((node) => {
                        this.success.emit(node);
                    },
                    (error) => {
                        this.error.emit(error);
                    });
        }
    }

    private transformNodeToPermissionElement(nodes: NodeEntry[], role: string): PermissionElement[] {
        return nodes.map((node) => ({
            authorityId: node.entry.properties['cm:authorityName'] ?? node.entry.properties['cm:userName'],
            name: role,
            accessStatus: 'ALLOWED'
        }));
    }
}

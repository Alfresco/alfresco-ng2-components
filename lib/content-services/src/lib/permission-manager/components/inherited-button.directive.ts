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

/* eslint-disable @angular-eslint/no-input-rename */
import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { ContentService } from '../../common/services/content.service';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { AllowableOperationsEnum } from '../../common/models/allowable-operations.enum';

@Directive({
    selector: 'button[adf-inherit-permission], mat-button-toggle[adf-inherit-permission]',
    host: {
        role: 'button',
        '(click)': 'onInheritPermissionClicked()'
    }
})
export class InheritPermissionDirective {

    /** ID of the node to add/remove inherited permissions. */
    @Input()
    nodeId: string;

    /** Emitted when the node is updated. */
    @Output()
    updated: EventEmitter<Node> = new EventEmitter<Node>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    constructor(private nodeService: NodesApiService,
                private contentService: ContentService) {
    }

    onInheritPermissionClicked() {
        this.nodeService.getNode(this.nodeId).subscribe((node: Node) => {
            if (this.contentService.hasAllowableOperations(node, AllowableOperationsEnum.UPDATEPERMISSIONS)) {
                const nodeBody = { permissions: { isInheritanceEnabled: !node?.permissions?.isInheritanceEnabled ?? false} };
                this.nodeService.updateNode(this.nodeId, nodeBody, { include: ['permissions'] }).subscribe((nodeUpdated: Node) => {
                    this.updated.emit(nodeUpdated);
                }, (error) => this.error.emit(error));
            } else {
                this.error.emit('PERMISSION_MANAGER.ERROR.NOT-ALLOWED');
            }
        });
    }

}

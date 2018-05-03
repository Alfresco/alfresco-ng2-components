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

/* tslint:disable:no-input-rename  */
import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { NodesApiService } from '@alfresco/adf-core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

@Directive({
    selector: 'button[adf-inherit-permission], mat-button-toggle[adf-inherit-permission]',
    host: {
        'role': 'button',
        '(click)': 'onInheritPermissionClicked()'
    }
})
export class InheritPermissionDirective {

    @Input()
    nodeId: string;

    @Output()
    updated: EventEmitter<MinimalNodeEntryEntity> = new EventEmitter<MinimalNodeEntryEntity>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    constructor(private nodeService: NodesApiService) {
    }

    onInheritPermissionClicked() {
        this.nodeService.getNode(this.nodeId).subscribe((node: MinimalNodeEntryEntity) => {
            const nodeBody = { permissions: { isInheritanceEnabled: !node.permissions.isInheritanceEnabled } };
            this.nodeService.updateNode(this.nodeId, nodeBody, { include: ['permissions'] }).subscribe((nodeUpdated: MinimalNodeEntryEntity) => {
                this.updated.emit(nodeUpdated);
            }, (error) => this.error.emit(error));
        });
    }

}

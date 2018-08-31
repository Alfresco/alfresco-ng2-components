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

import { Component, Optional, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PermissionListComponent, NodePermissionDialogService } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NodesApiService, NotificationService } from '@alfresco/adf-core';

@Component({
    selector: 'app-permissions',
    templateUrl: './demo-permissions.component.html',
    styleUrls: ['./demo-permissions.component.scss']
})
export class DemoPermissionComponent implements OnInit {

    @ViewChild('permissionList')
    displayPermissionComponent: PermissionListComponent;

    nodeId: string;
    toggleStatus = false;

    constructor(@Optional() private route: ActivatedRoute,
                private nodeService: NodesApiService,
                private nodePermissionDialogService: NodePermissionDialogService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id']) {
                    this.nodeId = params['id'];
                }
            });
        }
        this.nodeService.getNode(this.nodeId, {include: ['permissions'] }).subscribe( (currentNode: MinimalNodeEntryEntity) => {
            this.toggleStatus = currentNode.permissions.isInheritanceEnabled;
        });
    }

    onUpdatedPermissions(node: MinimalNodeEntryEntity) {
        this.toggleStatus = node.permissions.isInheritanceEnabled;
        this.displayPermissionComponent.reload();
    }

    reloadList() {
        this.displayPermissionComponent.reload();
    }

    openAddPermissionDialog(event: Event) {
        this.nodePermissionDialogService.updateNodePermissionByDialog(this.nodeId).subscribe(() => {
            this.displayPermissionComponent.reload();
        },
            (error) => {
                this.showErrorMessage(error);
            });
    }

    showErrorMessage(error) {
        this.notificationService.openSnackMessage(
            error,
            4000
        );
    }

}

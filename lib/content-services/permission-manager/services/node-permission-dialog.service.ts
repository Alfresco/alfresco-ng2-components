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

import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { AddPermissionDialogComponent } from '../components/add-permission/add-permission-dialog.component';
import { AddPermissionDialogData } from '../components/add-permission/add-permission-dialog-data.interface';
import { MinimalNodeEntity, MinimalNodeEntryEntity, Node } from 'alfresco-js-api';
import { NodePermissionService } from './node-permission.service';
import { ContentService, PermissionsEnum } from '@alfresco/adf-core';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NodePermissionDialogService {

    constructor(private dialog: MatDialog,
                private nodePermissionService: NodePermissionService,
                private contentService: ContentService) {
    }

    /**
     * Opens a dialog to add permissions to a node.
     * @param node ID of the target node
     * @param title Dialog title
     * @returns Node with updated permissions
     */
    openAddPermissionDialog(node: Node, title?: string): Observable<MinimalNodeEntity[]> {
        if (this.contentService.hasPermission(node, PermissionsEnum.UPDATEPERMISSIONS)) {
            const confirm = new Subject<MinimalNodeEntity[]>();

            confirm.subscribe({
                complete: this.close.bind(this)
            });

            const data: AddPermissionDialogData = {
                nodeId: node.id,
                title: title,
                confirm: confirm
            };

            this.openDialog(data, 'adf-add-permission-dialog', '630px');
            return confirm;
        } else {
            let errors = new Error(JSON.stringify({ error: { statusCode: 403 } }));
            errors.message = 'PERMISSION_MANAGER.ERROR.NOT-ALLOWED';
            return throwError(errors);
        }
    }

    private openDialog(data: any, currentPanelClass: string, chosenWidth: string) {
        this.dialog.open(AddPermissionDialogComponent, { data, panelClass: currentPanelClass, width: chosenWidth });
    }

    /**
     * Closes the currently-open dialog.
     */
    close() {
        this.dialog.closeAll();
    }

    /**
     * Opens a dialog to update permissions for a node.
     * @param nodeId ID of the target node
     * @param title Dialog title
     * @returns Node with updated permissions
     */
    updateNodePermissionByDialog(nodeId?: string, title?: string): Observable<MinimalNodeEntryEntity> {
        return this.contentService.getNode(nodeId, { include: ['allowableOperations'] })
            .pipe(
                switchMap(node => {
                    return this.openAddPermissionDialog(node.entry, title)
                        .pipe(
                            switchMap(selection => {
                                return this.nodePermissionService.updateNodePermissions(nodeId, selection);
                            })
                        );
                })
            );
    }
}

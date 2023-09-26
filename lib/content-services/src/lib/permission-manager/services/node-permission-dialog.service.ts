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

import { Node, PermissionElement } from '@alfresco/js-api';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NodePermissionService } from './node-permission.service';
import { AddPermissionDialogComponent } from '../components/add-permission/add-permission-dialog.component';
import { AddPermissionDialogData } from '../components/add-permission/add-permission-dialog-data.interface';
import { RoleModel } from '../models/role.model';
import { ContentService } from '../../common/services/content.service';
import { AllowableOperationsEnum } from '../../common/models/allowable-operations.enum';

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
     *
     * @param node target node
     * @param roles settable roles for the node
     * @param title Dialog title
     * @returns Node with updated permissions
     */
    openAddPermissionDialog(node: Node, roles: RoleModel[], title?: string): Observable<PermissionElement[]> {
        if (this.contentService.hasAllowableOperations(node, AllowableOperationsEnum.UPDATEPERMISSIONS)) {
            const confirm = new Subject<PermissionElement[]>();

            confirm.subscribe({
                complete: this.close.bind(this)
            });

            const data: AddPermissionDialogData = {
                node,
                title,
                confirm,
                roles
            };

            this.openDialog(data, 'adf-add-permission-dialog', '800px');
            return confirm;
        } else {
            const errors = new Error(JSON.stringify({ error: { statusCode: 403 } }));
            errors.message = 'PERMISSION_MANAGER.ERROR.NOT-ALLOWED';
            return throwError(errors);
        }
    }

    private openDialog(data: any, currentPanelClass: string, chosenWidth: string) {
        this.dialog.open(AddPermissionDialogComponent, { data, panelClass: currentPanelClass, width: chosenWidth, restoreFocus: true });
    }

    /**
     * Closes the currently-open dialog.
     */
    close() {
        this.dialog.closeAll();
    }

    /**
     * Opens a dialog to update permissions for a node.
     *
     * @param nodeId ID of the target node
     * @param title Dialog title
     * @returns Node with updated permissions
     */
    updateNodePermissionByDialog(nodeId?: string, title?: string): Observable<Node> {
        return this.nodePermissionService.getNodeWithRoles(nodeId)
            .pipe(
                switchMap(({node, roles}) => this.openAddPermissionDialog(node, roles, title)
                    .pipe(
                        switchMap((selection) => this.nodePermissionService.updateNodePermissions(nodeId, selection))
                    ))
            );
    }
}

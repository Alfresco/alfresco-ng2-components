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
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AddPermissionDialogComponent } from '../components/add-permission/add-permission-dialog.component';
import { AddPermissionDialogData } from '../components/add-permission/add-permission-dialog-data.interface';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NodePermissionService } from './node-permission.service';

@Injectable()
export class NodePermissionDialogService {

    constructor(private dialog: MatDialog,
                private nodePermissionService: NodePermissionService) {
    }

    /**
     * Opens a dialog to add permissions to a node.
     * @param nodeId ID of the target node
     * @param title Dialog title
     * @returns Node with updated permissions
     */
    openAddPermissionDialog(nodeId: string, title?: string): Observable<MinimalNodeEntity[]> {
        const confirm = new Subject<MinimalNodeEntity[]>();

        confirm.subscribe({
            complete: this.close.bind(this)
        });

        const data: AddPermissionDialogData = {
            nodeId: nodeId,
            title: title,
            confirm : confirm
        };

        this.openDialog(data, 'adf-add-permission-dialog', '630px');
        return confirm;
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
        return this.openAddPermissionDialog(nodeId, title).switchMap((selection) => {
            return this.nodePermissionService.updateNodePermissions(nodeId, selection);
        });
    }
}

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
import { AddPermissionDialogComponent } from './add-permission-dialog.component';
import { AddPermissionDialogData } from './add-permission-dialog-data.interface';
import { MinimalNodeEntryEntity, MinimalNodeEntity } from 'alfresco-js-api';
import { NodePermissionService } from '../../services/node-permission.service';

@Injectable()
export class AddNodePermissionDialogService {

    constructor(private dialog: MatDialog,
                private nodePermissionService: NodePermissionService) {
    }

    openAddPermissionDialog(nodeId: string, title?: string): Observable<MinimalNodeEntryEntity> {
        const result$ = new Subject<MinimalNodeEntryEntity>();
        const confirm = new Subject<MinimalNodeEntity[]>();

        confirm.subscribe({
            next: (selection) => {
                this.nodePermissionService.updateNodePermissions(nodeId, selection).subscribe({
                    next: result$.next.bind(result$),
                    error: result$.error.bind(result$)
                });
            },
            complete: this.close.bind(this)
        });

        const data: AddPermissionDialogData = {
            nodeId: nodeId,
            title: title,
            confirm : confirm
        };

        this.openDialog(data, 'adf-add-permission-dialog', '630px');
        return result$;
    }

    private openDialog(data: any, currentPanelClass: string, chosenWidth: string) {
        this.dialog.open(AddPermissionDialogComponent, { data, panelClass: currentPanelClass, width: chosenWidth });
    }

    /** Closes the currently open dialog. */
    close() {
        this.dialog.closeAll();
    }
}

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
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AddPermissionDialogComponent } from './add-permission-dialog.component';
import { AddPermissionDialogData } from './add-permission-dialog-data.interface';

@Injectable()
export class AddNodePermissionDialogService {

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    constructor(private dialog: MatDialog) {
    }

    /** @param action Name of the action to show in the title */
    openAddPermissionDialog(nodeId: string, title?: string): Observable<any[]> {
        const success = new Subject<any[]>();
        success.subscribe({
            complete: this.close.bind(this)
        });

        const data: AddPermissionDialogData = {
            nodeId: nodeId,
            title: 'AMMACCABANANE',
            success: success,
            error: null
        };

        this.openDialog(data, 'adf-add-permission-dialog', '630px');
        return success;
    }

    private openDialog(data: any, currentPanelClass: string, chosenWidth: string) {
        this.dialog.open(AddPermissionDialogComponent, { data, panelClass: currentPanelClass, width: chosenWidth });
    }

    /** Closes the currently open dialog. */
    close() {
        this.dialog.closeAll();
    }

}

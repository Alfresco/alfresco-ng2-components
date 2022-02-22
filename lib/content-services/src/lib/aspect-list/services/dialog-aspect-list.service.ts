/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { AspectListDialogComponentData } from '../aspect-list-dialog-data.interface';
import { AspectListDialogComponent } from '../aspect-list-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class DialogAspectListService {

    constructor(private dialog: MatDialog) {
    }

    openAspectListDialog(nodeId?: string): Observable<string[]> {
        const select = new Subject<string[]>();
        select.subscribe({
            complete: this.close.bind(this)
        });

        const data: AspectListDialogComponentData = {
            title: 'ADF-ASPECT-LIST.DIALOG.TITLE',
            description: 'ADF-ASPECT-LIST.DIALOG.DESCRIPTION',
            overTableMessage: 'ADF-ASPECT-LIST.DIALOG.OVER-TABLE-MESSAGE',
            select,
            nodeId
        };

        this.openDialog(data, 'adf-aspect-list-dialog', '750px');
        return select;
    }

    private openDialog(data: AspectListDialogComponentData, panelClass: string, width: string) {
        this.dialog.open(AspectListDialogComponent, {
            data,
            panelClass,
            width,
            disableClose: true
        });
    }

    close() {
        this.dialog.closeAll();
    }
}

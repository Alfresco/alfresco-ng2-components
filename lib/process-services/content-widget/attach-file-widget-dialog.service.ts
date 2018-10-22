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
import { Subject, Observable } from 'rxjs';
import { AttachFileWidgetDialogComponentData } from './attach-file-widget-dialog-component.interface';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AttachFileWidgetDialogComponent } from './attach-file-widget-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class AttachFileWidgetDialogService {

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    constructor(private dialog: MatDialog) {
    }

    /**
     * Opens a dialog to choose a file to upload.
     * @param action Name of the action to show in the title
     * @param contentEntry Item to upload
     * @returns Information about the chosen file(s)
     */
    openLogin(ecmHost: string, actionName?: string, context?: string): Observable<MinimalNodeEntryEntity[]> {
        let titleString: string = `Please log in for ${ecmHost}`;
        const selected = new Subject<MinimalNodeEntryEntity[]>();
        selected.subscribe({
            complete: this.close.bind(this)
        });

        const data: AttachFileWidgetDialogComponentData = {
            title : titleString,
            actionName,
            selected,
            ecmHost,
            context,
            isSelectionValid: this.isNodeFile.bind(this)
        };

        this.openLoginDialog(data, 'adf-attach-file-widget-dialog', '630px');
        return selected;
    }

    private openLoginDialog(data: AttachFileWidgetDialogComponentData, currentPanelClass: string, chosenWidth: string) {
        this.dialog.open(AttachFileWidgetDialogComponent, { data, panelClass: currentPanelClass, width: chosenWidth });
    }

    /** Closes the currently open dialog. */
    close() {
        this.dialog.closeAll();
    }

    private isNodeFile(entry: MinimalNodeEntryEntity): boolean {
        return entry.isFile;
    }

}

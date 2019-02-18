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

import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { LoginDialogComponent } from '../login/components/login-dialog.component';
import { LoginDialogComponentData } from '../login/components/login-dialog-component-data.interface';

@Injectable({
    providedIn: 'root'
})
export class LoginDialogService {

    constructor(private dialog: MatDialog) {
    }

    /**
     * Opens a dialog to choose a file to upload.
     * @param actionName Name of the action to show in the title
     * @param title Title for the dialog
     * @returns Information about the chosen file(s)
     */
    openLogin(actionName: string, title: string): Observable<string> {
        const logged = new Subject<string>();
        logged.subscribe({
            complete: this.close.bind(this)
        });

        const data: LoginDialogComponentData = {
            title,
            actionName,
            logged
        };

        this.openLoginDialog(data, 'adf-login-dialog', '630px');
        return logged;
    }

    private openLoginDialog(data: LoginDialogComponentData, currentPanelClass: string, chosenWidth: string) {
        this.dialog.open(LoginDialogComponent, { data, panelClass: currentPanelClass, width: chosenWidth });
    }

    /** Closes the currently open dialog. */
    close() {
        this.dialog.closeAll();
    }

}

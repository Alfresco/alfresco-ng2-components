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

import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { LoginDialogComponent } from './login-dialog.component';
import { LoginDialogComponentData } from './login-dialog-component-data.interface';

@Component({
    selector: 'adf-login-dialog-storybook',
    template: `<button mat-raised-button (click)="openLoginDialog()">
        Open dialog
    </button>`
})
export class LoginDialogStorybookComponent {

    @Output() executeSubmit = new EventEmitter<string>();
    @Output() error = new EventEmitter<string>();
    @Output() closed = new EventEmitter<string>();

    constructor(private dialog: MatDialog) { }

    openLoginDialog() {
        const data: LoginDialogComponentData = {
            title: 'Perform a Login',
            actionName: 'LOGIN',
            logged: new Subject<any>()
        };

        this.dialog.open(
            LoginDialogComponent,
            {
                data,
                panelClass: 'adf-login-dialog',
                width: '630px'
            }
        );

        data.logged.subscribe(
            () => {
                this.executeSubmit.emit('executeSubmit');
            },
            (error) => {
                this.error.emit(error);
            },
            () => {
                this.closed.emit('closed');
                this.dialog.closeAll();
            }
        );
    }
}

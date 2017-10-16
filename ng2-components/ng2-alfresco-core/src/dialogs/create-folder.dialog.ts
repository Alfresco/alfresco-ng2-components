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

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'adf-create-folder-dialog',
    template: `
        <h1 matDialogTitle>Create a new folder</h1>
        <div mat-dialog-content>
            <mat-form-field class="create-folder--name">
                <input matInput placeholder="Folder name" [(ngModel)]="value">
            </mat-form-field>
        </div>
        <div mat-dialog-actions>
            <button mat-button matDialogClose>Cancel</button>
            <button mat-button [matDialogClose]="value">Create</button>
        </div>
    `,
    styles: [
        `
        .create-folder--name {
            width: 100%;
        }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class CreateFolderDialogComponent {
    value: string = '';
}

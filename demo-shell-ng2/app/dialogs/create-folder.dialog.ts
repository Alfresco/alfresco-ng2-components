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

import { Component } from '@angular/core';

@Component({
    selector: 'adf-create-folder-dialog',
    template: `
        <h1 md-dialog-title>Create a new folder</h1>
        <div md-dialog-content>
            <md-input-container class="create-folder--name">
                <input mdInput placeholder="Folder name" [(ngModel)]="value">
            </md-input-container>
        </div>
        <div md-dialog-actions>
            <button md-button md-dialog-close>Cancel</button>
            <button md-button [md-dialog-close]="value">Create</button>
        </div>
    `,
    styles: [
        `
        .create-folder--name {
            width: 100%;
        }
        `
    ]
})
export class CreateFolderDialogComponent {
    value: string = '';
}

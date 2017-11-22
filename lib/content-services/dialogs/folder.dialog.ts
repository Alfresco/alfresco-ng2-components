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

import { Observable } from 'rxjs/Observable';

import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NodesApiService, NotificationService, TranslationService } from '@alfresco/adf-core';

import { forbidEndingDot, forbidOnlySpaces, forbidSpecialCharacters } from './folder-name.validators';

@Component({
    selector: 'adf-folder-dialog',
    styleUrls: ['./folder.dialog.scss'],
    templateUrl: './folder.dialog.html'
})
export class FolderDialogComponent implements OnInit {
    form: FormGroup;
    folder: MinimalNodeEntryEntity = null;

    constructor(
        private formBuilder: FormBuilder,
        private dialog: MatDialogRef<FolderDialogComponent>,
        private nodesApi: NodesApiService,
        private translation: TranslationService,
        private notification: NotificationService,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {}

    get editing(): boolean {
        return !!this.data.folder;
    }

    ngOnInit() {
        const { folder } = this.data;
        let name = '';
        let description = '';

        if (folder) {
            const { properties } = folder;

            name = folder.name || '';
            description = properties ? properties['cm:description'] : '';
        }

        const validators = {
            name: [
                Validators.required,
                forbidSpecialCharacters,
                forbidEndingDot,
                forbidOnlySpaces
            ]
        };

        this.form = this.formBuilder.group({
            name: [ name, validators.name ],
            description: [ description ]
        });
    }

    get name(): string {
        let { name } = this.form.value;

        return (name || '').trim();
    }

    get description(): string {
        let { description } = this.form.value;

        return (description || '').trim();
    }

    private get properties(): any {
        const { name: title, description } = this;

        return {
            'cm:title': title,
            'cm:description': description
        };
    }

    private create(): Observable<MinimalNodeEntryEntity> {
        const { name, properties, nodesApi, data: { parentNodeId} } = this;
        return nodesApi.createFolder(parentNodeId, { name, properties });
    }

    private edit(): Observable<MinimalNodeEntryEntity> {
        const { name, properties, nodesApi, data: { folder: { id: nodeId }} } = this;
        return nodesApi.updateNode(nodeId, { name, properties });
    }

    submit() {
        const { form, dialog, editing } = this;

        if (!form.valid) { return; }

        (editing ? this.edit() : this.create())
            .subscribe(
                (folder: MinimalNodeEntryEntity) => dialog.close(folder),
                (error) => this.handleError(error)
            );
    }

    handleError(error: any): any {
        let i18nMessageString = 'CORE.MESSAGES.ERRORS.GENERIC';

        try {
            const { error: { statusCode } } = JSON.parse(error.message);

            if (statusCode === 409) {
                i18nMessageString = 'CORE.MESSAGES.ERRORS.EXISTENT_FOLDER';
            }
        } catch (err) { /* Do nothing, keep the original message */ }

        this.translation.get(i18nMessageString).subscribe(message => {
            this.notification.openSnackMessage(message, 3000);
        });

        return error;
    }
}

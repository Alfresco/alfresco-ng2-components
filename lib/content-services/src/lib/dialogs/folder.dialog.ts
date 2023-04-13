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

import { Observable } from 'rxjs';

import { Component, Inject, OnInit, Optional, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Node } from '@alfresco/js-api';
import { TranslationService } from '@alfresco/adf-core';
import { NodesApiService } from '../common/services/nodes-api.service';

import { forbidEndingDot, forbidOnlySpaces, forbidSpecialCharacters } from './folder-name.validators';

@Component({
    selector: 'adf-folder-dialog',
    templateUrl: './folder.dialog.html',
    styleUrls: ['./folder.dialog.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FolderDialogComponent implements OnInit {

    form: UntypedFormGroup;

    folder: Node = null;

    /** Emitted when the edit/create folder give error for example a folder with same name already exist
     */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the edit/create folder is successfully created/modified
     */
    @Output()
    success: EventEmitter<any> = new EventEmitter<Node>();

    editTitle = 'CORE.FOLDER_DIALOG.EDIT_FOLDER_TITLE';
    createTitle = 'CORE.FOLDER_DIALOG.CREATE_FOLDER_TITLE';
    nodeType = 'cm:folder';

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dialog: MatDialogRef<FolderDialogComponent>,
        private nodesApi: NodesApiService,
        private translation: TranslationService,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {
        if (data) {
            this.editTitle = data.editTitle || this.editTitle;
            this.createTitle = data.createTitle || this.createTitle;
            this.nodeType = data.nodeType || this.nodeType;
        }
    }

    get editing(): boolean {
        return !!this.data.folder;
    }

    ngOnInit() {
        const { folder } = this.data;
        let name = '';
        let title = '';
        let description = '';

        if (folder) {
            const { properties } = folder;

            name = folder.name || '';
            title = properties?.['cm:title'] ?? '';
            description = properties?.['cm:description'] ?? '';
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
            title: [ title ],
            description: [ description ]
        });
    }

    get name(): string {
        const { name } = this.form.value;

        return (name || '').trim();
    }

    get title(): string {
        const { title } = this.form.value;

        return (title || '').trim();
    }

    get description(): string {
        const { description } = this.form.value;

        return (description || '').trim();
    }

    private get properties(): any {
        const { title, description } = this;

        return {
            'cm:title': title,
            'cm:description': description
        };
    }

    private create(): Observable<Node> {
        const { name, properties, nodeType, nodesApi, data: { parentNodeId} } = this;
        return nodesApi.createFolder(parentNodeId, { name, properties, nodeType });
    }

    private edit(): Observable<Node> {
        const { name, properties, nodesApi, data: { folder: { id: nodeId }} } = this;
        return nodesApi.updateNode(nodeId, { name, properties });
    }

    submit() {
        const { form, dialog, editing } = this;

        if (!form.valid) {
            return;
        }

        (editing ? this.edit() : this.create())
            .subscribe(
                (folder: Node) => {
                    this.success.emit(folder);
                    dialog.close(folder);
                },
                (error) => this.handleError(error)
            );
    }

    handleError(error: any): any {
        let errorMessage = 'CORE.MESSAGES.ERRORS.GENERIC';

        try {
            const { error: { statusCode } } = JSON.parse(error.message);

            if (statusCode === 409) {
                errorMessage = 'CORE.MESSAGES.ERRORS.EXISTENT_FOLDER';
            }
        } catch (err) { /* Do nothing, keep the original message */ }

        this.error.emit(this.translation.instant(errorMessage));

        return error;
    }
}

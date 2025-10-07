/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Component, DestroyRef, EventEmitter, inject, Inject, OnInit, Optional, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Node } from '@alfresco/js-api';
import { TranslationService } from '@alfresco/adf-core';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { forbidEndingDot, forbidOnlySpaces, forbidSpecialCharacters } from './folder-name.validators';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutoFocusDirective } from '../../directives';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-folder-dialog',
    imports: [
        CommonModule,
        MatDialogModule,
        TranslatePipe,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        AutoFocusDirective,
        MatButtonModule
    ],
    templateUrl: './folder.dialog.html',
    styleUrls: ['./folder.dialog.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-folder-dialog' }
})
export class FolderDialogComponent implements OnInit {
    /**
     * Emitted when the edit/create folder give error for example a folder with same name already exist
     */
    @Output()
    error = new EventEmitter<any>();

    /**
     * Emitted when the edit/create folder is successfully created/modified
     */
    @Output()
    success = new EventEmitter<Node>();

    form: UntypedFormGroup;
    folder: Node = null;

    editTitle = 'CORE.FOLDER_DIALOG.EDIT_FOLDER_TITLE';
    createTitle = 'CORE.FOLDER_DIALOG.CREATE_FOLDER_TITLE';
    nodeType = 'cm:folder';

    disableSubmitButton = false;

    get editing(): boolean {
        return !!this.data.folder;
    }

    get name(): string {
        return this.getTrimmedValue(this.form.value.name);
    }

    get title(): string {
        return this.getTrimmedValue(this.form.value.title);
    }

    get description(): string {
        return this.getTrimmedValue(this.form.value.description);
    }

    private get properties(): { [key: string]: string } {
        return {
            'cm:title': this.title,
            'cm:description': this.description
        };
    }

    private readonly destroyRef = inject(DestroyRef);

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
            name: [Validators.required, forbidSpecialCharacters, forbidEndingDot, forbidOnlySpaces]
        };

        this.form = this.formBuilder.group({
            name: [name, validators.name],
            title: [title],
            description: [description]
        });

        this.form.controls['name'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => (this.disableSubmitButton = false));
    }

    submit() {
        this.disableSubmitButton = true;

        (this.editing ? this.edit() : this.create()).subscribe(
            (folder: Node) => {
                this.success.emit(folder);
                this.dialog.close(folder);
            },
            (error) => this.handleError(error)
        );
    }

    handleError(error: any): any {
        let errorMessage = 'CORE.MESSAGES.ERRORS.GENERIC';

        try {
            const {
                error: { statusCode }
            } = JSON.parse(error.message);

            if (statusCode === 409) {
                errorMessage = 'CORE.MESSAGES.ERRORS.EXISTENT_FOLDER';
            }
        } catch {
            /* Do nothing, keep the original message */
        }

        this.error.emit(this.translation.instant(errorMessage));

        return error;
    }

    private create(): Observable<Node> {
        const parentNodeId = this.data.parentNodeId;

        return this.nodesApi.createFolder(parentNodeId, { name: this.name, properties: this.properties, nodeType: this.nodeType });
    }

    private edit(): Observable<Node> {
        const nodeId = this.data.folder.id;

        return this.nodesApi.updateNode(nodeId, { name: this.name, properties: this.properties });
    }

    private getTrimmedValue(value: string): string {
        return (value || '').trim();
    }
}

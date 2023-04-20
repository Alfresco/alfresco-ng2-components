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

import { Observable, Subject } from 'rxjs';
import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    OnDestroy,
    ViewEncapsulation
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    UntypedFormControl,
    AbstractControl
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { QueriesApi, SiteBodyCreate, SiteEntry, SitePaging } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { debounceTime, finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { SitesService } from '../../common/services/sites.service';

@Component({
    selector: 'adf-library-dialog',
    styleUrls: ['./library.dialog.scss'],
    templateUrl: './library.dialog.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-library-dialog' }
})
export class LibraryDialogComponent implements OnInit, OnDestroy {
    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the new library is created successfully. The
     * event parameter is a SiteEntry object with the details of the
     * newly-created library.
     */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    onDestroy$: Subject<boolean> = new Subject<boolean>();

    createTitle = 'LIBRARY.DIALOG.CREATE_TITLE';
    libraryTitleExists = false;
    form: UntypedFormGroup;
    visibilityOption: any;
    visibilityOptions = [
        { value: 'PUBLIC', label: 'LIBRARY.VISIBILITY.PUBLIC', disabled: false },
        { value: 'PRIVATE', label: 'LIBRARY.VISIBILITY.PRIVATE', disabled: false },
        {
            value: 'MODERATED',
            label: 'LIBRARY.VISIBILITY.MODERATED',
            disabled: false
        }
    ];
    disableCreateButton = false;

    _queriesApi: QueriesApi;
    get queriesApi(): QueriesApi {
        this._queriesApi = this._queriesApi ?? new QueriesApi(this.alfrescoApiService.getInstance());
        return this._queriesApi;
    }

    constructor(
        private alfrescoApiService: AlfrescoApiService,
        private sitesService: SitesService,
        private formBuilder: UntypedFormBuilder,
        private dialog: MatDialogRef<LibraryDialogComponent>
    ) {
    }

    ngOnInit() {
        const validators = {
            id: [
                Validators.required,
                Validators.maxLength(72),
                this.forbidSpecialCharacters
            ],
            title: [
                Validators.required,
                this.forbidOnlySpaces,
                Validators.minLength(2),
                Validators.maxLength(256)
            ],
            description: [Validators.maxLength(512)]
        };

        this.form = this.formBuilder.group({
            title: [null, validators.title],
            id: [null, validators.id, this.createSiteIdValidator()],
            description: ['', validators.description]
        });

        this.visibilityOption = this.visibilityOptions[0].value;

        this.form.controls['title'].valueChanges
            .pipe(
                debounceTime(500),
                mergeMap(
                    (title) => this.checkLibraryNameExists(title),
                    (title) => title
                ),
                takeUntil(this.onDestroy$)
            )
            .subscribe((title: string) => {
                if (!this.form.controls['id'].dirty && this.canGenerateId(title)) {
                    this.form.patchValue({ id: this.sanitize(title.trim()) });
                    this.form.controls['id'].markAsTouched();
                }
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    get title(): string {
        const { title } = this.form.value;

        return (title || '').trim();
    }

    get id(): string {
        const { id } = this.form.value;

        return (id || '').trim();
    }

    get description(): string {
        const { description } = this.form.value;

        return (description || '').trim();
    }

    get visibility(): string {
        return this.visibilityOption || '';
    }

    submit() {
        const { form, dialog } = this;

        if (!form.valid) {
            return;
        }

        this.disableCreateButton = true;
        this.create().pipe(finalize(() => this.disableCreateButton = false)).subscribe(
            (node: SiteEntry) => {
                this.success.emit(node);
                dialog.close(node);
            },
            (error) => this.handleError(error)
        );
    }

    visibilityChangeHandler(event) {
        this.visibilityOption = event.value;
    }

    private create(): Observable<SiteEntry> {
        const { title, id, description, visibility } = this;
        const siteBody = {
            id,
            title,
            description,
            visibility
        } as SiteBodyCreate;

        return this.sitesService.createSite(siteBody);
    }

    private sanitize(input: string) {
        return input.replace(/[\s\s]+/g, '-').replace(/[^A-Za-z0-9-]/g, '');
    }

    private canGenerateId(title) {
        return Boolean(title.replace(/[^A-Za-z0-9-]/g, '').length);
    }

    private handleError(error: any): any {
        try {
            const {
                error: { statusCode }
            } = JSON.parse(error.message);

            if (statusCode === 409) {
                this.form.controls['id'].setErrors({
                    message: 'LIBRARY.ERRORS.CONFLICT'
                });
            }
        } catch {
        }

        return error;
    }

    private async checkLibraryNameExists(libraryTitle: string) {
        let entries = [];

        try {
            entries = (await this.findLibraryByTitle(libraryTitle)).list.entries;
        } catch {
            entries = [];
        }

        if (entries.length) {
            this.libraryTitleExists = entries[0].entry.title.toLowerCase() === libraryTitle.toLowerCase();
        } else {
            this.libraryTitleExists = false;
        }
    }

    private findLibraryByTitle(libraryTitle: string): Promise<SitePaging> {
        return this.queriesApi.findSites(libraryTitle, {
                maxItems: 1,
                fields: ['title']
            });
    }

    private forbidSpecialCharacters({ value }: UntypedFormControl) {
        if (value === null || value.length === 0) {
            return null;
        }

        const validCharacters: RegExp = /[^A-Za-z0-9-]/;
        const isValid: boolean = !validCharacters.test(value);

        return isValid
            ? null
            : {
                message: 'LIBRARY.ERRORS.ILLEGAL_CHARACTERS'
            };
    }

    private forbidOnlySpaces({ value }: UntypedFormControl) {
        if (value === null || value.length === 0) {
            return null;
        }

        const isValid: boolean = !!(value || '').trim();

        return isValid
            ? null
            : {
                message: 'LIBRARY.ERRORS.ONLY_SPACES'
            };
    }

    private createSiteIdValidator() {
        let timer;

        return (control: AbstractControl) => {
            if (timer) {
                clearTimeout(timer);
            }

            return new Promise((resolve) => {
                timer = setTimeout(() => this.sitesService.getSite(control.value).subscribe(
                    () => resolve({ message: 'LIBRARY.ERRORS.EXISTENT_SITE' }),
                    () => resolve(null)
                ), 300);
            });
        };
    }
}

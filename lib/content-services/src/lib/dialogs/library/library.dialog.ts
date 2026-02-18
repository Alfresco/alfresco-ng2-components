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

import { from, Observable } from 'rxjs';
import { Component, DestroyRef, EventEmitter, inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import {
    AbstractControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    ValidationErrors,
    Validators
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { QueriesApi, SiteBodyCreate, SiteEntry, SitePaging } from '@alfresco/js-api';
import { NotificationService } from '@alfresco/adf-core';
import { debounceTime, finalize, map, mergeMap, take } from 'rxjs/operators';
import { SitesService } from '../../common/services/sites.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutoFocusDirective } from '../../directives';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { AlfrescoApiService } from '../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface VisibilityOption {
    value: string;
    label: string;
    disabled: boolean;
}

@Component({
    selector: 'adf-library-dialog',
    imports: [
        CommonModule,
        MatDialogModule,
        TranslatePipe,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        AutoFocusDirective,
        MatRadioModule,
        FormsModule,
        MatButtonModule
    ],
    styleUrls: ['./library.dialog.scss'],
    templateUrl: './library.dialog.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-library-dialog' }
})
export class LibraryDialogComponent implements OnInit {
    private alfrescoApiService = inject(AlfrescoApiService);
    private sitesService = inject(SitesService);
    private formBuilder = inject(UntypedFormBuilder);
    private dialog = inject<MatDialogRef<LibraryDialogComponent>>(MatDialogRef);
    private notificationService = inject(NotificationService);

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<any>();

    /**
     * Emitted when the new library is created successfully. The
     * event parameter is a SiteEntry object with the details of the
     * newly-created library.
     */
    @Output()
    success = new EventEmitter<SiteEntry>();

    createTitle = 'LIBRARY.DIALOG.CREATE_TITLE';
    libraryTitleExists = false;
    form: UntypedFormGroup;
    visibilityOption: string;
    visibilityOptions: VisibilityOption[] = [
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

    private readonly destroyRef = inject(DestroyRef);

    ngOnInit() {
        const validators = {
            id: [Validators.required, Validators.maxLength(72), this.forbidSpecialCharacters],
            title: [Validators.required, this.forbidOnlySpaces, this.minLengthTrimmed, Validators.maxLength(256)],
            description: [Validators.maxLength(512)]
        };

        this.form = this.formBuilder.group({
            title: [null, validators.title],
            id: [null, validators.id, this.createSiteIdValidator()],
            description: ['', validators.description]
        });

        this.visibilityOption = this.visibilityOptions[0].value;

        this.form.controls['title'].valueChanges
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.form.controls['title'].markAsTouched());

        this.form.controls['title'].valueChanges
            .pipe(
                debounceTime(500),
                mergeMap((title) => from(this.checkLibraryNameExists(title)).pipe(map(() => title))),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((title: string) => {
                if (!this.form.controls['id'].dirty && this.canGenerateId(title)) {
                    this.form.patchValue({ id: this.sanitize(title.trim()) });
                    this.form.controls['id'].markAsTouched();
                }
            });
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
        this.create()
            .pipe(finalize(() => (this.disableCreateButton = false)))
            .subscribe({
                next: (node: SiteEntry) => {
                    this.success.emit(node);
                    dialog.close(node);
                },
                error: (error) => this.handleError(error)
            });
    }

    visibilityChangeHandler(event: MatRadioChange) {
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
        const errorMessage = 'CORE.MESSAGES.ERRORS.GENERIC';

        try {
            const {
                error: { statusCode }
            } = JSON.parse(error.message);

            if (statusCode === 409) {
                this.form.controls['id'].setErrors({
                    message: 'LIBRARY.ERRORS.CONFLICT'
                });
            } else {
                this.notificationService.showError(errorMessage);
            }
        } catch {
            this.notificationService.showError(errorMessage);
        }

        return error;
    }

    private async checkLibraryNameExists(libraryTitle: string) {
        const entries = (await this.findLibraryByTitle(libraryTitle)).list.entries;

        if (entries.length) {
            this.libraryTitleExists = entries[0].entry.title.toLowerCase() === libraryTitle.toLowerCase();
        } else {
            this.libraryTitleExists = false;
        }
    }

    private async findLibraryByTitle(libraryTitle: string): Promise<SitePaging> {
        try {
            return await this.queriesApi.findSites(libraryTitle, {
                maxItems: 1,
                fields: ['title']
            });
        } catch {
            return new SitePaging({ list: { entries: [], pagination: {} } });
        }
    }

    private forbidSpecialCharacters({ value }: UntypedFormControl): ValidationErrors | null {
        if (value === null || value.length === 0) {
            return null;
        }

        const validCharacters: RegExp = /[^A-Za-z0-9-]/;
        const isValid = !validCharacters.test(value);

        return isValid
            ? null
            : {
                  message: 'LIBRARY.ERRORS.ILLEGAL_CHARACTERS'
              };
    }

    private forbidOnlySpaces({ value }: UntypedFormControl): ValidationErrors | null {
        if (value === null || value.length === 0) {
            return null;
        }

        const isValid = !!value.trim();

        return isValid
            ? null
            : {
                  message: 'LIBRARY.ERRORS.ONLY_SPACES'
              };
    }

    private minLengthTrimmed({ value }: UntypedFormControl): ValidationErrors | null {
        if (value === null || value.length === 0) {
            return null;
        }

        const isValid = value.trim().length !== 1;

        return isValid
            ? null
            : {
                  message: 'LIBRARY.ERRORS.TITLE_TOO_SHORT'
              };
    }

    private createSiteIdValidator(): (control: AbstractControl) => Promise<ValidationErrors | null> {
        let timer;

        return (control: AbstractControl) => {
            if (timer) {
                clearTimeout(timer);
            }
            return new Promise((resolve) => {
                timer = setTimeout(() => {
                    this.checkSite(control.value, resolve);
                }, 300);
            });
        };
    }

    private checkSite(siteId: string, resolve: (result: ValidationErrors | null) => void): void {
        this.sitesService.getSite(siteId).subscribe({
            next: () => resolve({ message: 'LIBRARY.ERRORS.EXISTENT_SITE' }),
            error: () => resolve(null)
        });
    }
}

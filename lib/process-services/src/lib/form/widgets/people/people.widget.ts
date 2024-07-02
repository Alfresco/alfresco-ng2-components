/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* eslint-disable @angular-eslint/component-selector */

import { ErrorWidgetComponent, FormService, InitialUsernamePipe, WidgetComponent } from '@alfresco/adf-core';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { PeopleProcessService } from '../../../services/people-process.service';
import { LightUserRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
    selector: 'people-widget',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        InitialUsernamePipe,
        ErrorWidgetComponent
    ],
    templateUrl: './people.widget.html',
    styleUrls: ['./people.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class PeopleWidgetComponent extends WidgetComponent implements OnInit {
    @ViewChild('inputValue', { static: true })
    input: ElementRef;

    /** Emitted when a valid user has been highlighted */
    @Output()
    peopleSelected: EventEmitter<number> = new EventEmitter();

    groupId: number;
    value: any;

    searchTerm = new UntypedFormControl();
    searchTerms$: Observable<any> = this.searchTerm.valueChanges;

    users$ = this.searchTerms$.pipe(
        tap((searchInput) => {
            if (typeof searchInput === 'string') {
                this.onItemSelect();
            }
        }),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
            const value = searchTerm.email ? this.getDisplayName(searchTerm) : searchTerm;
            return this.peopleProcessService.getWorkflowUsers(undefined, value, this.groupId).pipe(catchError(() => of([])));
        }),
        map((list) => {
            const value = this.searchTerm.value.email ? this.getDisplayName(this.searchTerm.value) : this.searchTerm.value;
            this.checkUserAndValidateForm(list, value);
            return list;
        })
    );

    constructor(public formService: FormService, public peopleProcessService: PeopleProcessService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field) {
            if (this.field.value) {
                this.searchTerm.setValue(this.field.value);
            }
            if (this.field.readOnly) {
                this.searchTerm.disable();
            }
            const params = this.field.params;
            if (params?.restrictWithGroup) {
                const restrictWithGroup = params.restrictWithGroup;
                this.groupId = restrictWithGroup.id;
            }
        }
    }

    checkUserAndValidateForm(list: LightUserRepresentation[], value: string): void {
        const isValidUser = this.isValidUser(list, value);
        if (isValidUser || value === '') {
            this.field.validationSummary.message = '';
            this.field.validate();
            this.field.form.validateForm();
        } else {
            this.field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
            this.field.markAsInvalid();
            this.field.form.markAsInvalid();
        }
    }

    isValidUser(users: LightUserRepresentation[], name: string): boolean {
        if (users) {
            return !!users.find((user) => {
                const selectedUser = this.getDisplayName(user).toLocaleLowerCase() === name.toLocaleLowerCase();
                if (selectedUser) {
                    this.peopleSelected.emit(user?.id || undefined);
                }
                return selectedUser;
            });
        }
        return false;
    }

    getDisplayName(model: LightUserRepresentation) {
        if (model) {
            const displayName = `${model.firstName || ''} ${model.lastName || ''}`;
            return displayName.trim();
        }
        return '';
    }

    onItemSelect(item?: LightUserRepresentation) {
        if (item) {
            this.field.value = item;
        } else {
            this.field.value = null;
        }
    }
}

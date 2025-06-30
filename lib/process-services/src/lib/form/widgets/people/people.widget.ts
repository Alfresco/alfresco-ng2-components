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

/* eslint-disable @angular-eslint/component-selector */

import { ErrorWidgetComponent, FormService, InitialUsernamePipe, WidgetComponent } from '@alfresco/adf-core';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { PeopleProcessService } from '../../../services/people-process.service';
import { LightUserRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
    selector: 'people-widget',
    standalone: true,
    imports: [
        CommonModule,
        TranslatePipe,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatIconModule,
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

    selectedUsers: LightUserRepresentation[] = [];
    multiSelect = false;
    groupId: number;

    searchTerm = new UntypedFormControl();
    searchTerms$: Observable<any> = this.searchTerm.valueChanges;

    users$: Observable<LightUserRepresentation[]> = this.searchTerms$.pipe(
        distinctUntilChanged(),
        switchMap((searchTerm) => {
            if (!searchTerm) {
                return of([]);
            }
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
                Array.isArray(this.field.value) ? this.selectedUsers.push(...this.field.value) : this.selectedUsers.push(this.field.value);
            }
            const params = this.field.params;
            if (params?.restrictWithGroup) {
                const restrictWithGroup = params.restrictWithGroup;
                this.groupId = restrictWithGroup.id;
            }
            if (params?.multiple) {
                this.multiSelect = params.multiple;
                this.field.value = this.selectedUsers;
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
            return !!users.find((user) => this.getDisplayName(user).toLocaleLowerCase() === name.toLocaleLowerCase());
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

    onRemove(user: LightUserRepresentation) {
        const index = this.selectedUsers.indexOf(user);
        if (index >= 0) {
            this.selectedUsers.splice(index, 1);
            this.field.value = this.selectedUsers;
        }
    }

    onItemSelect(user: LightUserRepresentation) {
        if (this.multiSelect) {
            if (!this.isUserAlreadySelected(user)) {
                this.selectedUsers.push(user);
            }
            this.field.value = this.selectedUsers;
        } else {
            this.selectedUsers = [user];
            this.field.value = user;
        }

        this.peopleSelected.emit(user?.id || undefined);
        this.input.nativeElement.value = '';
        this.searchTerm.setValue('');
    }

    isUserAlreadySelected(user: LightUserRepresentation): boolean {
        if (this.selectedUsers?.length > 0) {
            const result = this.selectedUsers.find((selectedUser) => selectedUser.id === user.id);

            return !!result;
        }
        return false;
    }
}

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

import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ErrorWidgetComponent, FormService, GroupModel, WidgetComponent } from '@alfresco/adf-core';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { merge, of } from 'rxjs';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { PeopleProcessService } from '../../../services/people-process.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'functional-group-widget',
    imports: [
        CommonModule,
        MatFormFieldModule,
        TranslateModule,
        MatInputModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        ErrorWidgetComponent,
        MatChipsModule,
        MatIconModule
    ],
    templateUrl: './functional-group.widget.html',
    styleUrls: ['./functional-group.widget.scss'],
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
export class FunctionalGroupWidgetComponent extends WidgetComponent implements OnInit {
    minTermLength: number = 1;
    groupId: string;
    searchTerm = new UntypedFormControl();
    groups$ = merge(this.searchTerm.valueChanges).pipe(
        distinctUntilChanged(),
        tap((search: GroupModel | string) => {
            const isValid = typeof search !== 'string';
            const empty = search === '';
            this.validateGroup(isValid, empty);
        }),
        debounceTime(300),
        switchMap((searchTerm) => {
            if (typeof searchTerm !== 'string' || searchTerm.length < this.minTermLength) {
                return of([]);
            }
            return this.peopleProcessService.getWorkflowGroups(searchTerm, this.groupId).pipe(catchError(() => of([])));
        })
    );
    selectedGroups: GroupModel[] = [];
    multiSelect = false;

    @ViewChild('inputValue', { static: true })
    input: ElementRef;

    constructor(public peopleProcessService: PeopleProcessService, public formService: FormService, public elementRef: ElementRef) {
        super(formService);
    }

    ngOnInit() {
        if (this.field) {
            if (this.field.value) {
                Array.isArray(this.field.value) ? this.selectedGroups.push(...this.field.value) : this.selectedGroups.push(this.field.value);
            }
            if (this.field.readOnly) {
                this.searchTerm.disable();
            }

            const params = this.field.params;
            if (params?.restrictWithGroup) {
                const restrictWithGroup = params.restrictWithGroup;
                this.groupId = restrictWithGroup.id;
            }
            if (params?.multiple) {
                this.multiSelect = params.multiple;
                this.field.value = this.selectedGroups;
            }

            if (this.field.value?.name) {
                this.searchTerm.setValue(this.field.value.name);
            }
        }
    }

    updateOption(option?: GroupModel) {
        if (option) {
            if (this.multiSelect) {
                if (!this.isGroupAlreadySelected(option)) {
                    this.field.value = this.selectedGroups;
                } else {
                    return;
                }
            } else {
                this.field.value = option;
            }
            this.selectedGroups.push(option);
        } else {
            this.field.value = null;
        }

        this.searchTerm.setValue('');
        this.input.nativeElement.value = '';
        this.field.updateForm();
    }

    validateGroup(valid: boolean, empty: boolean) {
        const isEmpty = !this.field.required && (empty || valid);
        const hasValue = this.field.required && valid;

        if (hasValue || isEmpty) {
            this.field.validationSummary.message = '';
            this.field.validate();
            this.field.form.validateForm();
        } else {
            this.field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
            this.field.markAsInvalid();
            this.field.form.markAsInvalid();
        }
    }

    getDisplayName(model: GroupModel | string) {
        if (model) {
            return typeof model === 'string' ? model : model.name;
        }
        return '';
    }

    onRemove(group: GroupModel): void {
        const index = this.selectedGroups.indexOf(group);
        if (index >= 0) {
            this.selectedGroups.splice(index, 1);
            this.field.value = this.selectedGroups;
        }
    }

    isGroupAlreadySelected(group: GroupModel): boolean {
        return this.selectedGroups?.some((selectedGroup) => selectedGroup.id === group.id);
    }
}

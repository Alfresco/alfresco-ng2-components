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

/* eslint-disable @angular-eslint/component-selector */

import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { FormService, GroupModel, WidgetComponent } from '@alfresco/adf-core';
import { catchError, debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { merge, of } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { PeopleProcessService } from '../../../common/services/people-process.service';

@Component({
    selector: 'functional-group-widget',
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
        tap((search: GroupModel | string) => {
            const isValid = typeof search !== 'string';
            const empty = search === '';
            this.updateOption(isValid ? search as GroupModel : null);
            this.validateGroup(isValid, empty);
        }),
        filter((group: string | GroupModel) => typeof group === 'string' && group.length >= this.minTermLength),
        debounceTime(300),
        switchMap((searchTerm: string) => this.peopleProcessService.getWorkflowGroups(searchTerm, this.groupId)
            .pipe(catchError(() => of([]))))
    );

    constructor(public peopleProcessService: PeopleProcessService,
                public formService: FormService,
                public elementRef: ElementRef) {
        super(formService);
    }

    ngOnInit() {
        if (this.field) {

            if (this.field.readOnly) {
                this.searchTerm.disable();
            }

            const params = this.field.params;
            if (params && params.restrictWithGroup) {
                const restrictWithGroup = params.restrictWithGroup;
                this.groupId = restrictWithGroup.id;
            }

            if (this.field.value?.name) {
                this.searchTerm.setValue(this.field.value.name);
            }
        }
    }

    updateOption(option?: GroupModel) {
        if (option) {
            this.field.value = option;
        } else {
            this.field.value = null;
        }

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
}

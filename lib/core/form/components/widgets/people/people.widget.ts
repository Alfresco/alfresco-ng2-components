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

/* tslint:disable:component-selector  */

import { PeopleProcessService } from '../../../../services/people-process.service';
import { UserProcessModel } from '../../../../models';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { GroupModel } from '../core/group.model';
import { baseHost, WidgetComponent } from './../widget.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {
    catchError,
    distinctUntilChanged,
    map,
    switchMap,
    tap
} from 'rxjs/operators';
import 'rxjs/add/observable/empty';

@Component({
    selector: 'people-widget',
    templateUrl: './people.widget.html',
    styleUrls: ['./people.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class PeopleWidgetComponent extends WidgetComponent implements OnInit {

    @ViewChild('inputValue')
    input: ElementRef;

    @Output()
    peopleSelected: EventEmitter<number>;

    groupId: string;
    value: any;

    searchTerm = new FormControl();
    errorMsg = '';
    searchTerms$: Observable<string> = this.searchTerm.valueChanges;

    users$ = this.searchTerms$.pipe(
        tap(() => {
            this.errorMsg = '';
        }),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
            let userResponse = Observable.empty();

            if (typeof searchTerm === 'string') {
                userResponse = this.formService.getWorkflowUsers(searchTerm, this.groupId)
                    .pipe(
                        catchError(err => {
                            this.errorMsg = err.message;
                            return userResponse;
                        })
                    );
            }

            return userResponse;
        }),
        map((list: UserProcessModel[]) => {
            let value = (this.input.nativeElement as HTMLInputElement).value;

            if (value) {
                this.checkUserAndValidateForm(list, value);
            } else {
                this.field.value = null;
                list = [];
            }

            return list;
        })
    );

    constructor(public formService: FormService, public peopleProcessService: PeopleProcessService) {
        super(formService);
        this.peopleSelected = new EventEmitter();
    }

    ngOnInit() {
        if (this.field) {
            this.value = this.getDisplayName(this.field.value);
            if (this.field.readOnly) {
                this.searchTerm.disable();
            }
            let params = this.field.params;
            if (params && params.restrictWithGroup) {
                let restrictWithGroup = <GroupModel> params.restrictWithGroup;
                this.groupId = restrictWithGroup.id;
            }
        }
    }

    checkUserAndValidateForm(list, value) {
        const isValidUser = this.isValidUser(list, value);
        if (isValidUser) {
            this.field.validationSummary.message = '';
            this.field.validate();
            this.field.form.validateForm();
        } else {
            this.field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
            this.field.markAsInvalid();
            this.field.form.markAsInvalid();
        }
    }

    isValidUser(users: UserProcessModel[], name: string) {
        return users.find((user) => {
            return this.getDisplayName(user).toLocaleLowerCase() === name.toLocaleLowerCase();
        });
    }

    getDisplayName(model: UserProcessModel) {
        if (model) {
            let displayName = `${model.firstName || ''} ${model.lastName || ''}`;
            return displayName.trim();
        }
        return '';
    }

    onItemSelect(item: UserProcessModel) {
        if (item) {
            this.field.value = item;
            this.peopleSelected.emit(item && item.id || undefined);
            this.value = this.getDisplayName(item);
        }
    }
}

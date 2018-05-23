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
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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

    users: UserProcessModel[] = [];
    groupId: string;
    value: any;

    searchTerm = new FormControl();
    errorMsg = '';
    searchTerms$: Observable<string> = this.searchTerm.valueChanges;

    items$ = this.searchTerms$.pipe(
        tap(() => {
            this.errorMsg = '';
        }),
        distinctUntilChanged(),
        switchMap(searchTerm => this.formService.getWorkflowUsers(searchTerm)
            .pipe(
                catchError(err => {
                    this.errorMsg = err.message;
                    return Observable.empty<Response>();
                })
            )
        ),
        map((list) => {
            let value = (this.input.nativeElement as HTMLInputElement).value;

            if (this.isValidUser(value)) {
                this.field.validationSummary.message = '';
                this.field.validate();
                this.field.form.validateForm();
            } else if (!value) {
                this.field.value = null;
                this.users = [];
            } else {
                this.field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
                this.field.markAsInvalid();
                this.field.form.markAsInvalid();
            }

            return list;
        })
    );

    constructor(public formService: FormService, public peopleProcessService: PeopleProcessService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field) {
            let params = this.field.params;
            if (params && params.restrictWithGroup) {
                let restrictWithGroup = <GroupModel> params.restrictWithGroup;
                this.groupId = restrictWithGroup.id;
            }
        }
    }

    isValidUser(value: string): boolean {
        let isValid = false;
        if (value) {
            this.formService.getWorkflowUsers(value, this.groupId)
                .subscribe((result: UserProcessModel[]) => {
                    this.users = result || [];
                });
            let resultUser: UserProcessModel = this.users.find((user) => {
                return this.getDisplayName(user).toLocaleLowerCase() === value.toLocaleLowerCase(); });

            if (resultUser) {
                isValid = true;
            }
        }

        return isValid;
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
        }
    }
}

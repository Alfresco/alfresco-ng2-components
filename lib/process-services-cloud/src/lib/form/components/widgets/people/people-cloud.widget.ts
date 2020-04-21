/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { baseHost, WidgetComponent, IdentityUserModel } from '@alfresco/adf-core';
import { FormControl } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

/* tslint:disable:component-selector  */

@Component({
    selector: 'people-cloud-widget',
    templateUrl: './people-cloud.widget.html',
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class PeopleCloudWidgetComponent extends WidgetComponent implements OnInit {

    private onDestroy$ = new Subject<boolean>();

    typeId = 'PeopleCloudWidgetComponent';
    appName: string;
    roles: string[];
    mode: string;
    title: string;
    preSelectUsers: IdentityUserModel[];
    search: FormControl;

    ngOnInit() {
        if (this.field) {
            this.roles = this.field.roles;
            this.mode = this.field.optionType;
            this.title = this.field.placeholder;
            this.preSelectUsers = this.field.value ? this.field.value : [];
        }
        this.search =  new FormControl({value: '', disabled: this.field.readOnly}, []),

        this.search.statusChanges
            .pipe(
                filter((value: string) => {
                    return value === 'INVALID';
                }),
                takeUntil(this.onDestroy$)
            )
            .subscribe(() => {
                this.field.markAsInvalid();
                this.field.form.markAsInvalid();
            });

        this.search.statusChanges
            .pipe(
                filter((value: string) => {
                    return value === 'VALID';
                }),
                takeUntil(this.onDestroy$)
            )
            .subscribe(() => {
                this.field.validate();
                this.field.form.validateForm();
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onChangedUser(users) {
        this.field.value = [...users];
        this.onFieldChanged(this.field);
    }

    isMultipleMode(): boolean {
        return this.mode === 'multiple';
    }
}

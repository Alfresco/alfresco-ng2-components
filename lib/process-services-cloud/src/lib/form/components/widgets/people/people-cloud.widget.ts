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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { WidgetComponent, FormService } from '@alfresco/adf-core';
import { UntypedFormControl } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ComponentSelectionMode } from '../../../../types';
import { IdentityUserModel } from '../../../../people/models/identity-user.model';
import { IdentityUserService } from '../../../../people/services/identity-user.service';

/* eslint-disable @angular-eslint/component-selector */

@Component({
    selector: 'people-cloud-widget',
    templateUrl: './people-cloud.widget.html',
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
export class PeopleCloudWidgetComponent extends WidgetComponent implements OnInit, OnDestroy {

    private onDestroy$ = new Subject<boolean>();

    typeId = 'PeopleCloudWidgetComponent';
    appName: string;
    roles: string[];
    mode: ComponentSelectionMode;
    title: string;
    preSelectUsers: IdentityUserModel[];
    search: UntypedFormControl;
    groupsRestriction: string[];
    validate = false;

    constructor(formService: FormService, private identityUserService: IdentityUserService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field) {
            this.roles = this.field.roles;
            this.mode = this.field.optionType as ComponentSelectionMode;
            this.title = this.field.placeholder;
            this.preSelectUsers = this.field.value ? this.field.value : [];
            this.groupsRestriction = this.field.groupsRestriction;
            this.validate = this.field.readOnly ? false : true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.search = new UntypedFormControl({value: '', disabled: this.field.readOnly}, []),

        this.search.statusChanges
            .pipe(
                filter((value: string) => value === 'INVALID'),
                takeUntil(this.onDestroy$)
            )
            .subscribe(() => {
                this.field.markAsInvalid();
                this.field.form.markAsInvalid();
            });

        this.search.statusChanges
            .pipe(
                filter((value: string) => value === 'VALID'),
                takeUntil(this.onDestroy$)
            )
            .subscribe(() => {
                this.field.validate();
                this.field.form.validateForm();
            });

        if (this.field.selectLoggedUser && !this.field.value) {
            const userInfo = this.identityUserService.getCurrentUserInfo();
            this.preSelectUsers = [ userInfo ];
            this.onChangedUser(this.preSelectUsers);
        }
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

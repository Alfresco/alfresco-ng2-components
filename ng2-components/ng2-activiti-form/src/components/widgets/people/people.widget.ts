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

import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LightUserRepresentation, PeopleProcessService } from 'ng2-alfresco-core';
import { FormService } from '../../../services/form.service';
import { GroupModel } from '../core/group.model';
import { baseHost, WidgetComponent } from './../widget.component';

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

    minTermLength: number = 1;
    oldValue: string;
    users: LightUserRepresentation[] = [];
    groupId: string;

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

    onKeyUp(event: KeyboardEvent) {
        let value = (this.input.nativeElement as HTMLInputElement).value;
        if (value && value.length >= this.minTermLength && this.oldValue !== value) {
            if (event.keyCode !== ESCAPE && event.keyCode !== ENTER) {
                if (value.length >= this.minTermLength) {
                    this.oldValue = value;
                    this.searchUsers(value);
                }
            }
        } else {
            this.validateValue(value);
        }
    }

    searchUsers(userName: string) {
        this.formService.getWorkflowUsers(userName, this.groupId)
            .subscribe((result: LightUserRepresentation[]) => {
                this.users = result || [];
                this.validateValue(userName);
            });
    }

    validateValue(userName: string) {
        if (this.isValidUser(userName)) {
            this.field.validationSummary.message = '';
        } else if (!userName) {
            this.field.value = null;
            this.users = [];
        } else {
            this.field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
            this.field.markAsInvalid();
            this.field.form.markAsInvalid();
        }
    }

    isValidUser(value: string): boolean {
        let isValid = false;
        if (value) {
            let resultUser: LightUserRepresentation = this.users.find((user) => this.getDisplayName(user).toLocaleLowerCase() === value.toLocaleLowerCase());

            if (resultUser) {
                isValid = true;
            }
        }

        return isValid;
    }

    getDisplayName(model: LightUserRepresentation) {
        if (model) {
            let displayName = `${model.firstName || ''} ${model.lastName || ''}`;
            return displayName.trim();
        }
        return '';
    }

    onItemSelect(item: LightUserRepresentation) {
        if (item) {
            this.field.value = item;
        }
    }

    getInitialUserName(firstName: string, lastName: string) {
        firstName = (firstName !== null && firstName !== '' ? firstName[0] : '');
        lastName = (lastName !== null && lastName !== '' ? lastName[0] : '');
        return this.getDisplayUser(firstName, lastName, '');
    }

    getDisplayUser(firstName: string, lastName: string, delimiter: string = '-'): string {
        firstName = (firstName !== null ? firstName : '');
        lastName = (lastName !== null ? lastName : '');
        return firstName + delimiter + lastName;
    }
}

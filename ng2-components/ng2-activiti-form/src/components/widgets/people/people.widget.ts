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
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MdAutocompleteTrigger } from '@angular/material';
import { LightUserRepresentation, PeopleProcessService } from 'ng2-alfresco-core';
import { FormService } from '../../../services/form.service';
import { GroupModel } from '../core/group.model';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'people-widget',
    templateUrl: './people.widget.html',
    styleUrls: ['./people.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class PeopleWidgetComponent extends WidgetComponent implements OnInit {

    @ViewChild(MdAutocompleteTrigger)
    input: MdAutocompleteTrigger;

    minTermLength: number = 1;
    value: string;
    oldValue: string;
    users: LightUserRepresentation[] = [];
    groupId: string;

    constructor(public formService: FormService, public peopleProcessService: PeopleProcessService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field) {
            let user: LightUserRepresentation = this.field.value;
            if (user) {
                this.value = this.getDisplayName(user);
            }

            let params = this.field.params;
            if (params && params['restrictWithGroup']) {
                let restrictWithGroup = <GroupModel> params['restrictWithGroup'];
                this.groupId = restrictWithGroup.id;
            }
        }
    }

    onKeyUp(event: KeyboardEvent) {
        if (this.value && this.value.length >= this.minTermLength  && this.oldValue !== this.value) {
            if (event.keyCode !== ESCAPE && event.keyCode !== ENTER) {
                if (this.value.length >= this.minTermLength) {
                    this.oldValue = this.value;
                    this.searchUsers();
                }
            }
        }
        if (this.isValueDefined() && this.value.trim().length === 0) {
          this.oldValue = this.value;
          this.field.value = this.value;
          this.users = [];
        }
    }

    isValueDefined() {
        return this.value !== null && this.value !== undefined;
    }

    searchUsers() {
        this.formService.getWorkflowUsers(this.value, this.groupId)
            .subscribe((result: LightUserRepresentation[]) => {
                this.users = result || [];
                this.validateValue();
            });
    }

    validateValue() {
        let validUserName = this.getUserFromValue();
        if (validUserName) {
            this.field.validationSummary.message = '';
            this.field.value = validUserName;
            this.value = this.getDisplayName(validUserName);
        } else {
            this.field.value = '';
            this.field.validationSummary.message = 'Invalid value provided';
            this.field.markAsInvalid();
            this.field.form.markAsInvalid();
          }
    }

    getUserFromValue() {
        return this.users.find((user) => this.getDisplayName(user).toLocaleLowerCase() === this.value.toLocaleLowerCase());
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
            this.value = this.getDisplayName(item);
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

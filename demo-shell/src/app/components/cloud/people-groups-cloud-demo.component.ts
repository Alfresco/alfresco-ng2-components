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

import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentSelectionMode, IdentityUserModel, IdentityGroupModel } from '@alfresco/adf-process-services-cloud';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';

@Component({
    selector: 'app-people-groups-cloud',
    templateUrl: './people-groups-cloud-demo.component.html',
    styleUrls: ['./people-groups-cloud-demo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PeopleGroupCloudDemoComponent {

    defaultFilterMode: string = 'appName';
    defaultGroupPlaceholder: string = `[{"id": "1", "name":"activitiUserGroup"}]`;
    defaultPeoplePlaceholder: string = `[{"id": "1", email": "user@user.com", "firstName":"user", "lastName": "lastName", "username": "user"}]`;

    peopleMode: ComponentSelectionMode = 'single';
    preSelectUsers: IdentityUserModel[] = [];
    invalidUsers: IdentityUserModel[] = [];
    peopleRoles: string[] = [];
    groupsRestriction: string[] = [];
    peopleAppName: string;
    peopleFilterMode: string = this.defaultFilterMode;
    peoplePreselectValidation = false;
    groupPreselectValidation = false;
    peopleReadonly = false;
    groupReadonly = false;

    groupMode: ComponentSelectionMode = 'single';
    preSelectGroup: IdentityGroupModel[] = [];
    invalidGroups: IdentityGroupModel[] = [];
    groupRoles: string[];
    groupAppName: string;
    groupFilterMode: string = this.defaultFilterMode;

    setPeoplePreselectValue(value: string): void {
        this.preSelectUsers = this.getArrayFromString(value);
    }

    setGroupsPreselectValue(value: string): void {
        this.preSelectGroup = this.getArrayFromString(value);
    }

    setPeopleRoles(value: string): void {
        this.peopleRoles = this.getArrayFromString(value);
    }

    setGroupRoles(value: string): void {
        this.groupRoles = this.getArrayFromString(value);
    }

    setPeopleAppName(value: string): void {
        this.peopleAppName = value;
    }

    setGroupAppName(value: string): void {
        this.groupAppName = value;
    }

    setPeopleGroupsRestriction(value: string): void {
        this.groupsRestriction = this.getArrayFromString(value);
    }

    onChangePeopleMode(event: MatRadioChange): void {
       this.peopleMode = event.value;
    }

    onChangePeopleReadonly(event: MatCheckboxChange): void {
        this.peopleReadonly = event.checked;
    }

    onChangeGroupReadonly(event: MatCheckboxChange): void {
        this.groupReadonly = event.checked;
    }

    onChangeGroupsMode(event: MatRadioChange): void {
        this.groupMode = event.value;
    }

    onChangePeopleFilterMode(event: MatRadioChange): void {
        this.peopleFilterMode = event.value;
        this.resetPeopleFilter();
    }

    onChangeGroupsFilterMode(event: MatRadioChange): void {
        this.groupFilterMode = event.value;
        this.restGroupFilter();
    }

    isPeopleAppNameSelected(): boolean {
        return this.peopleFilterMode === 'appName';
    }

    isGroupAppNameSelected(): boolean {
        return this.groupFilterMode === 'appName';
    }

    resetPeopleFilter(): void {
        if (this.isPeopleAppNameSelected()) {
            this.peopleRoles = [];
        } else {
            this.peopleAppName = '';
        }
    }

    restGroupFilter(): void {
        if (this.isGroupAppNameSelected()) {
            this.groupRoles = [];
        } else {
            this.groupAppName = '';
        }
    }

    onChangePeopleValidation(event: MatCheckboxChange): void {
        this.peoplePreselectValidation = event.checked;
    }

    onChangeGroupValidation(event: MatCheckboxChange): void {
        this.groupPreselectValidation = event.checked;
    }

    onGroupsWarning(warning: any): void {
        this.invalidGroups = warning.groups;
    }

    onUsersWarning(warning: any): void {
        this.invalidUsers = warning.users;
    }

    isStringArray(str: string): boolean {
        try {
            const result = JSON.parse(str);
            return Array.isArray(result);
        } catch (e) {
            return false;
        }
    }

    private getArrayFromString<T = any>(value: string): T[] {
        if (this.isStringArray(value)) {
            return JSON.parse(value);
        } else {
            return [];
        }
    }
}

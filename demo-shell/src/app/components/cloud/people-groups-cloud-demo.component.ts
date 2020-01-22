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

import { Component, ViewEncapsulation } from '@angular/core';
import { PeopleCloudComponent, GroupCloudComponent } from '@alfresco/adf-process-services-cloud';
import { MatRadioChange, MatCheckboxChange } from '@angular/material';
import { IdentityGroupModel, IdentityUserModel } from '@alfresco/adf-core';

@Component({
    selector: 'app-people-groups-cloud',
    templateUrl: './people-groups-cloud-demo.component.html',
    styleUrls: ['./people-groups-cloud-demo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PeopleGroupCloudDemoComponent {

    DEFAULT_FILTER_MODE: string = 'appName';
    DEFAULT_GROUP_PLACEHOLDER: string = `[{"id": "1", "name":"activitiUserGroup"}]`;
    DEFAULT_PEOPLE_PLACEHOLDER: string = `[{"id": "1", email": "user@user.com", "firstName":"user", "lastName": "lastName", "username": "user"}]`;

    peopleMode: string = PeopleCloudComponent.MODE_SINGLE;
    preSelectUsers: IdentityUserModel[] = [];
    invalidUsers: IdentityUserModel[] = [];
    peopleRoles: string[] = [];
    peopleAppName: string;
    peopleFilterMode: string = this.DEFAULT_FILTER_MODE;
    peoplePreselectValidation: Boolean = false;
    groupPreselectValidation = false;
    peopleReadonly = false;
    groupReadonly = false;

    groupMode: string = GroupCloudComponent.MODE_SINGLE;
    preSelectGroup: IdentityGroupModel[] = [];
    invalidGroups: IdentityGroupModel[] = [];
    groupRoles: string[];
    groupAppName: string;
    groupFilterMode: string = this.DEFAULT_FILTER_MODE;

    setPeoplePreselectValue(event: any) {
        this.preSelectUsers = this.getArrayFromString(event.target.value);
    }

    setGroupsPreselectValue(event: any) {
        this.preSelectGroup = this.getArrayFromString(event.target.value);
    }

    setPeopleRoles(event: any) {
        this.peopleRoles = this.getArrayFromString(event.target.value);
    }

    setGroupRoles(event: any) {
        this.groupRoles = this.getArrayFromString(event.target.value);
    }

    setPeopleAppName(event: any) {
        this.peopleAppName = event.target.value;
    }

    setGroupAppName(event: any) {
        this.groupAppName = event.target.value;
    }

    onChangePeopleMode(event: MatRadioChange) {
       this.peopleMode = event.value;
    }

    onChangePeopleReadonly(event: MatCheckboxChange) {
        this.peopleReadonly = event.checked;
    }

    onChangeGroupReadonly(event: MatCheckboxChange) {
        this.groupReadonly = event.checked;
    }

    onChangeGroupsMode(event: MatRadioChange) {
        this.groupMode = event.value;
    }

    onChangePeopleFilterMode(event: MatRadioChange) {
        this.peopleFilterMode = event.value;
        this.resetPeopleFilter();
    }

    onChangeGroupsFilterMode(event: MatRadioChange) {
        this.groupFilterMode = event.value;
        this.restGroupFilter();
    }

    isPeopleAppNameSelected() {
        return this.peopleFilterMode === 'appName';
    }

    isGroupAppNameSelected() {
        return this.groupFilterMode === 'appName';
    }

    resetPeopleFilter() {
        if (this.isPeopleAppNameSelected()) {
            this.peopleRoles = [];
        } else {
            this.peopleAppName = '';
        }
    }

    restGroupFilter() {
        if (this.isGroupAppNameSelected()) {
            this.groupRoles = [];
        } else {
            this.groupAppName = '';
        }
    }

    onChangePeopleValidation(event: MatCheckboxChange) {
        this.peoplePreselectValidation = event.checked;
    }

    onChangeGroupValidation(event: MatCheckboxChange) {
        this.groupPreselectValidation = event.checked;
    }

    onGroupsWarning(warning: any) {
        this.invalidGroups = warning.groups;
    }

    onUsersWarning(warning: any) {
        this.invalidUsers = warning.users;
    }

    isStringArray(str: string) {
        try {
            const result = JSON.parse(str);
            return Array.isArray(result);
        } catch (e) {
            return false;
        }
    }

    private getArrayFromString(value: string) {

        if (this.isStringArray(value)) {
            return JSON.parse(value);
        } else {
            return [];
        }
    }

    canShowPeopleList() {
        return this.peopleMode === GroupCloudComponent.MODE_MULTIPLE;
    }

    canShowGroupList() {
        return this.groupMode === GroupCloudComponent.MODE_MULTIPLE;
    }

    get peopleSingleMode() {
        return PeopleCloudComponent.MODE_SINGLE;
    }

    get peopleMultipleMode() {
        return PeopleCloudComponent.MODE_MULTIPLE;
    }

    get groupSingleMode() {
        return GroupCloudComponent.MODE_SINGLE;
    }

    get groupMultipleMode() {
        return GroupCloudComponent.MODE_MULTIPLE;
    }
}

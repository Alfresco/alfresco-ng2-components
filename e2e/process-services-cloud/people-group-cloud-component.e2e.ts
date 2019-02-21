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

import TestConfig = require('../test.config');

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { PeopleGroupCloudComponentPage } from '../pages/adf/demo-shell/process-services/peopleGroupCloudComponentPage';
import { PeopleCloudComponent } from '../pages/adf/process-cloud/peopleCloudComponent';
import { GroupCloudComponent } from '../pages/adf/process-cloud/groupCloudComponent';
import { browser } from 'protractor';

describe('People Groups CLoud Component', () => {

    describe('People Groups CLoud Component', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const peopleGroupCloudComponentPage = new PeopleGroupCloudComponentPage();
        const peopleCloudComponent = new PeopleCloudComponent();
        const groupCloudComponent = new GroupCloudComponent();

        let silentLogin;
        let apsUser = 'User Aps Aps';
        let activitiUser = 'userActiviti Activiti';
        let noRoleUser = 'userNoRole NoRole';
        let selectedPeople = [apsUser, activitiUser, noRoleUser];
        let groupAps = 'GroupAdminAps';
        let groupActiviti = 'GroupAdminActiviti';
        let groupNoRole = 'GroupNoRole';
        let selectedGroups = [groupAps, groupActiviti, groupNoRole];

        beforeAll(async () => {
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            navigationBarPage.navigateToPeopleGroupCloudPage();
            peopleGroupCloudComponentPage.checkGroupsCloudComponentTitleIsDisplayed();
            peopleGroupCloudComponentPage.checkPeopleCloudComponentTitleIsDisplayed();
        });

        beforeEach( () => {
            browser.refresh();
            peopleGroupCloudComponentPage.checkGroupsCloudComponentTitleIsDisplayed();
            peopleGroupCloudComponentPage.checkPeopleCloudComponentTitleIsDisplayed();
        });

        it('[C297674] Add roles filtering to PeopleCloudComponent', () => {
            peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            peopleGroupCloudComponentPage.enterPeopleRoles('["APS_USER"]');
            peopleCloudComponent.searchAssignee('user');
            peopleCloudComponent.checkUserIsDisplayed(apsUser);
            peopleCloudComponent.checkUserIsNotDisplayed(activitiUser);
            peopleCloudComponent.checkUserIsNotDisplayed(noRoleUser);
            peopleCloudComponent.selectAssigneeFromList(apsUser);
            peopleGroupCloudComponentPage.enterPeopleRoles('["APS_USER","ACTIVITI_USER"]');
            peopleCloudComponent.searchAssignee('user');
            peopleCloudComponent.checkUserIsNotDisplayed(apsUser);
            peopleCloudComponent.checkUserIsDisplayed(activitiUser);
            peopleCloudComponent.checkUserIsNotDisplayed(noRoleUser);
            peopleCloudComponent.selectAssigneeFromList(activitiUser);
            peopleGroupCloudComponentPage.clearField(peopleGroupCloudComponentPage.peopleRoleInput);
            peopleCloudComponent.searchAssignee('user');
            peopleCloudComponent.checkUserIsNotDisplayed(apsUser);
            peopleCloudComponent.checkUserIsNotDisplayed(activitiUser);
            peopleCloudComponent.checkUserIsDisplayed(noRoleUser);
            peopleCloudComponent.selectAssigneeFromList(noRoleUser);
            peopleCloudComponent.checkSelectedPeople(selectedPeople);
        });

        it('[C297674] Add roles filtering to GroupCloudComponent', () => {
            peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
            peopleGroupCloudComponentPage.enterGroupRoles('["APS_ADMIN"]');
            groupCloudComponent.searchGroups('Group');
            groupCloudComponent.checkGroupIsNotDisplayed(groupAps);
            groupCloudComponent.checkGroupIsNotDisplayed(groupActiviti);
            groupCloudComponent.checkGroupIsNotDisplayed(groupNoRole);
            groupCloudComponent.selectGroupFromList(groupAps);
            peopleGroupCloudComponentPage.enterGroupRoles('["APS_ADMIN","ACTIVITI_ADMIN"]');
            groupCloudComponent.searchGroups('Group');
            groupCloudComponent.checkGroupIsNotDisplayed(groupAps);
            groupCloudComponent.checkGroupIsNotDisplayed(groupActiviti);
            groupCloudComponent.checkGroupIsNotDisplayed(groupNoRole);
            groupCloudComponent.selectGroupFromList(groupActiviti);
            peopleGroupCloudComponentPage.clearField(peopleGroupCloudComponentPage.groupRoleInput);
            groupCloudComponent.searchGroups('Group');
            groupCloudComponent.checkGroupIsNotDisplayed(groupAps);
            groupCloudComponent.checkGroupIsNotDisplayed(groupActiviti);
            groupCloudComponent.checkGroupIsDisplayed(groupNoRole);
            groupCloudComponent.selectGroupFromList(groupNoRole);
            groupCloudComponent.checkSelectedGroups(selectedGroups);
        });

    });

});

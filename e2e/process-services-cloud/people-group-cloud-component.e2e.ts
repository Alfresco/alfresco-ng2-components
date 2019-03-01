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
import { Identity } from '../actions/APS-cloud/identity';
import { GroupIdentity } from '../actions/APS-cloud/groupIdentity';
import CONSTANTS = require('../util/constants');
import { Roles } from '../actions/APS-cloud/roles';

describe('People Groups Cloud Component', () => {

    describe('People Groups Cloud Component', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const peopleGroupCloudComponentPage = new PeopleGroupCloudComponentPage();
        const peopleCloudComponent = new PeopleCloudComponent();
        const groupCloudComponent = new GroupCloudComponent();
        const identityService: Identity = new Identity();
        const groupIdentityService: GroupIdentity = new GroupIdentity();
        const rolesService: Roles = new Roles();

        let silentLogin;
        let apsUser;
        let activitiUser;
        let noRoleUser ;
        let groupAps;
        let groupActiviti;
        let groupNoRole;
        let apsUserRoleId;
        let activitiUserRoleId;
        let apsAdminRoleId;
        let activitiAdminRoleId;
        let users = new Array<string>();
        let groups = new Array<string>();

        beforeAll(async () => {
            await identityService.init(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await rolesService.init(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            apsUser = await identityService.createIdentityUser();
            apsUserRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.APS_USER);
            await identityService.assignRole(apsUser.id, apsUserRoleId, CONSTANTS.ROLES.APS_USER);
            activitiUser = await identityService.createIdentityUser();
            activitiUserRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.ACTIVITI_USER);
            await identityService.assignRole(activitiUser.id, activitiUserRoleId, CONSTANTS.ROLES.ACTIVITI_USER);
            noRoleUser = await identityService.createIdentityUser();
            await groupIdentityService.init(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            groupAps = await groupIdentityService.createIdentityGroup();
            apsAdminRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.APS_ADMIN);
            await groupIdentityService.assignRole(groupAps.id, apsAdminRoleId, CONSTANTS.ROLES.APS_ADMIN);
            groupActiviti = await groupIdentityService.createIdentityGroup();
            activitiAdminRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.ACTIVITI_ADMIN);
            await groupIdentityService.assignRole(groupActiviti.id, activitiAdminRoleId, CONSTANTS.ROLES.ACTIVITI_ADMIN);
            groupNoRole = await groupIdentityService.createIdentityGroup();
            users = [`${apsUser.id}`, `${activitiUser.id}`, `${noRoleUser.id}`];
            groups = [`${groupAps.id}`, `${groupActiviti.id}`, `${groupNoRole.id}`];
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginAPS(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            navigationBarPage.navigateToPeopleGroupCloudPage();
        });

        afterAll(async () => {
            for (let i = 0; i < users.length; i++) {
                await identityService.deleteIdentityUser(users[i]);
            }
            for (let i = 0; i < groups.length; i++) {
                await groupIdentityService.deleteIdentityGroup(groups[i]);
            }
        });

        beforeEach( () => {
            browser.refresh();
            peopleGroupCloudComponentPage.checkGroupsCloudComponentTitleIsDisplayed();
            peopleGroupCloudComponentPage.checkPeopleCloudComponentTitleIsDisplayed();
        });

        it('[C297674] Add role filtering to PeopleCloudComponent', () => {
            peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            peopleGroupCloudComponentPage.clickPeopleCloudFilterRole();
            peopleGroupCloudComponentPage.enterPeopleRoles(`["${CONSTANTS.ROLES.APS_USER}"]`);
            peopleCloudComponent.searchAssignee('LastName');
            peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);
            peopleCloudComponent.checkUserIsNotDisplayed(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            peopleCloudComponent.checkUserIsNotDisplayed(`${noRoleUser.firstName}` + ' ' + `${noRoleUser.lastName}`);
            peopleCloudComponent.selectAssigneeFromList(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);
            peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);
        });

        it('[C297674] Add more than one role filtering to PeopleCloudComponent', () => {
            peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            peopleGroupCloudComponentPage.clickPeopleCloudFilterRole();
            peopleGroupCloudComponentPage.enterPeopleRoles(`["${CONSTANTS.ROLES.APS_USER}", "${CONSTANTS.ROLES.ACTIVITI_USER}"]`);
            peopleCloudComponent.searchAssignee('LastName');
            peopleCloudComponent.checkUserIsDisplayed(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);
            peopleCloudComponent.checkUserIsNotDisplayed(`${noRoleUser.firstName}` + ' ' + `${noRoleUser.lastName}`);
            peopleCloudComponent.selectAssigneeFromList(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            peopleCloudComponent.checkSelectedPeople(`${activitiUser.lastName}`);
        });

        it('[C297674] Add no role filters to PeopleCloudComponent', () => {
            peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            peopleGroupCloudComponentPage.clickPeopleCloudFilterRole();
            peopleCloudComponent.searchAssignee('LastName');
            peopleCloudComponent.checkUserIsDisplayed(`${noRoleUser.firstName}` + ' ' + `${noRoleUser.lastName}`);
            peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);
            peopleCloudComponent.checkUserIsDisplayed(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            peopleCloudComponent.selectAssigneeFromList(`${noRoleUser.firstName}` + ' ' + `${noRoleUser.lastName}`);
            peopleCloudComponent.checkSelectedPeople(`${noRoleUser.firstName}` + ' ' + `${noRoleUser.lastName}`);
        });

        it('[C297674] Add role filtering to GroupCloudComponent', () => {
            peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
            peopleGroupCloudComponentPage.clickGroupCloudFilterRole();
            peopleGroupCloudComponentPage.enterGroupRoles(`["${CONSTANTS.ROLES.APS_ADMIN}"]`);
            groupCloudComponent.searchGroups('TestGroup');
            groupCloudComponent.checkGroupIsDisplayed(`${groupAps.name}`);
            groupCloudComponent.checkGroupIsNotDisplayed(`${groupActiviti.name}`);
            groupCloudComponent.checkGroupIsNotDisplayed(`${groupNoRole.name}`);
            groupCloudComponent.selectGroupFromList(`${groupAps.name}`);
            groupCloudComponent.checkSelectedGroup(`${groupAps.name}`);
        });

        it('[C297674] Add more than one role filtering to GroupCloudComponent', () => {
            peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
            peopleGroupCloudComponentPage.clickGroupCloudFilterRole();
            peopleGroupCloudComponentPage.enterGroupRoles(`["${CONSTANTS.ROLES.APS_ADMIN}", "${CONSTANTS.ROLES.ACTIVITI_ADMIN}"]`);
            groupCloudComponent.searchGroups('TestGroup');
            groupCloudComponent.checkGroupIsDisplayed(`${groupActiviti.name}`);
            groupCloudComponent.checkGroupIsDisplayed(`${groupAps.name}`);
            groupCloudComponent.checkGroupIsNotDisplayed(`${groupNoRole.name}`);
            groupCloudComponent.selectGroupFromList(`${groupActiviti.name}`);
            groupCloudComponent.checkSelectedGroup(`${groupActiviti.name}`);
        });

        it('[C297674] Add no role filters to GroupCloudComponent', () => {
            peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
            peopleGroupCloudComponentPage.clickGroupCloudFilterRole();
            peopleGroupCloudComponentPage.clearField(peopleGroupCloudComponentPage.groupRoleInput);
            groupCloudComponent.searchGroups('TestGroup');
            groupCloudComponent.checkGroupIsDisplayed(`${groupNoRole.name}`);
            groupCloudComponent.checkGroupIsDisplayed(`${groupActiviti.name}`);
            groupCloudComponent.checkGroupIsDisplayed(`${groupAps.name}`);
            groupCloudComponent.selectGroupFromList(`${groupNoRole.name}`);
            groupCloudComponent.checkSelectedGroup(`${groupNoRole.name}`);
        });

    });

});

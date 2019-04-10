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

import { SettingsPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { PeopleGroupCloudComponentPage } from '../pages/adf/demo-shell/process-services/peopleGroupCloudComponentPage';
import { GroupCloudComponentPage, PeopleCloudComponentPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { LoginSSOPage, IdentityService, GroupIdentityService, RolesService, ApiService } from '@alfresco/adf-testing';
import CONSTANTS = require('../util/constants');

describe('People Groups Cloud Component', () => {

    describe('People Groups Cloud Component', () => {
        const settingsPage = new SettingsPage();
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const peopleGroupCloudComponentPage = new PeopleGroupCloudComponentPage();
        const peopleCloudComponent = new PeopleCloudComponentPage();
        const groupCloudComponentPage = new GroupCloudComponentPage();
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;
        let rolesService: RolesService;

        let silentLogin;
        let apsUser;
        let activitiUser;
        let noRoleUser;
        let groupAps;
        let groupActiviti;
        let groupNoRole;
        let apsUserRoleId;
        let activitiUserRoleId;
        let apsAdminRoleId;
        let activitiAdminRoleId;
        let users = [];
        let groups = [];

        beforeAll(async () => {

            const apiService = new ApiService('activiti', TestConfig.adf.hostBPM, TestConfig.adf.hostSso, 'BPM');
            await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            identityService = new IdentityService(apiService);
            rolesService = new RolesService(apiService);

            apsUser = await identityService.createIdentityUser();
            apsUserRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.APS_USER);
            await identityService.assignRole(apsUser.idIdentityService, apsUserRoleId, CONSTANTS.ROLES.APS_USER);
            activitiUser = await identityService.createIdentityUser();
            activitiUserRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.ACTIVITI_USER);
            await identityService.assignRole(activitiUser.idIdentityService, activitiUserRoleId, CONSTANTS.ROLES.ACTIVITI_USER);
            noRoleUser = await identityService.createIdentityUser();
            groupIdentityService = new GroupIdentityService(apiService);
            groupAps = await groupIdentityService.createIdentityGroup();
            apsAdminRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.APS_ADMIN);
            await groupIdentityService.assignRole(groupAps.id, apsAdminRoleId, CONSTANTS.ROLES.APS_ADMIN);
            groupActiviti = await groupIdentityService.createIdentityGroup();
            activitiAdminRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.ACTIVITI_ADMIN);
            await groupIdentityService.assignRole(groupActiviti.id, activitiAdminRoleId, CONSTANTS.ROLES.ACTIVITI_ADMIN);
            groupNoRole = await groupIdentityService.createIdentityGroup();
            users = [`${apsUser.idIdentityService}`, `${activitiUser.idIdentityService}`, `${noRoleUser.idIdentityService}`];
            groups = [`${groupAps.id}`, `${groupActiviti.id}`, `${groupNoRole.id}`];
            silentLogin = false;
            settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
            loginSSOPage.clickOnSSOButton();
            browser.ignoreSynchronization = true;
            loginSSOPage.loginSSOIdentityService(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
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

        beforeEach(() => {
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
            groupCloudComponentPage.searchGroups('TestGroup');
            groupCloudComponentPage.checkGroupIsDisplayed(`${groupAps.name}`);
            groupCloudComponentPage.checkGroupIsNotDisplayed(`${groupActiviti.name}`);
            groupCloudComponentPage.checkGroupIsNotDisplayed(`${groupNoRole.name}`);
            groupCloudComponentPage.selectGroupFromList(`${groupAps.name}`);
            groupCloudComponentPage.checkSelectedGroup(`${groupAps.name}`);
        });

        it('[C297674] Add more than one role filtering to GroupCloudComponent', () => {
            peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
            peopleGroupCloudComponentPage.clickGroupCloudFilterRole();
            peopleGroupCloudComponentPage.enterGroupRoles(`["${CONSTANTS.ROLES.APS_ADMIN}", "${CONSTANTS.ROLES.ACTIVITI_ADMIN}"]`);
            groupCloudComponentPage.searchGroups('TestGroup');
            groupCloudComponentPage.checkGroupIsDisplayed(`${groupActiviti.name}`);
            groupCloudComponentPage.checkGroupIsDisplayed(`${groupAps.name}`);
            groupCloudComponentPage.checkGroupIsNotDisplayed(`${groupNoRole.name}`);
            groupCloudComponentPage.selectGroupFromList(`${groupActiviti.name}`);
            groupCloudComponentPage.checkSelectedGroup(`${groupActiviti.name}`);
        });

        it('[C297674] Add no role filters to GroupCloudComponent', () => {
            peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
            peopleGroupCloudComponentPage.clickGroupCloudFilterRole();
            peopleGroupCloudComponentPage.clearField(peopleGroupCloudComponentPage.groupRoleInput);
            groupCloudComponentPage.searchGroups('TestGroup');
            groupCloudComponentPage.checkGroupIsDisplayed(`${groupNoRole.name}`);
            groupCloudComponentPage.checkGroupIsDisplayed(`${groupActiviti.name}`);
            groupCloudComponentPage.checkGroupIsDisplayed(`${groupAps.name}`);
            groupCloudComponentPage.selectGroupFromList(`${groupNoRole.name}`);
            groupCloudComponentPage.checkSelectedGroup(`${groupNoRole.name}`);
        });

        it('[C305033] Should fetch the preselect users based on the Validate flag set to True or False', () => {
            peopleGroupCloudComponentPage.clickPeopleCloudSingleSelection();
            peopleGroupCloudComponentPage.clickPreselectValidation();
            peopleGroupCloudComponentPage.checkPreselectValidationIsChecked();
            peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"email":"${apsUser.email}"}]`);
            browser.sleep(100);
            expect(peopleGroupCloudComponentPage.getAssigneeFieldContent()).toBe(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);
            peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"username":"${activitiUser.username}"}]`);
            browser.sleep(100);
            expect(peopleGroupCloudComponentPage.getAssigneeFieldContent()).toBe(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);

            peopleGroupCloudComponentPage.enterPeoplePreselect('[{"username":"someUsername","email":"someEmail"}]');
            browser.sleep(100);
            expect(peopleGroupCloudComponentPage.getAssigneeFieldContent()).toBe('');

            peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            peopleGroupCloudComponentPage.checkPreselectValidationIsChecked();
            peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"email":"${apsUser.email}"},{"email":"${activitiUser.email}"},{"email":"${noRoleUser.email}"}]`);
            browser.sleep(100);
            peopleCloudComponent.checkSelectedPeople(`${apsUser.lastName}`);
            peopleCloudComponent.checkSelectedPeople(`${activitiUser.lastName}`);
            peopleCloudComponent.checkSelectedPeople(`${noRoleUser.lastName}`);

            peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"username":"${apsUser.username}"},{"username":"${activitiUser.username}"},` +
                `{"username":"${noRoleUser.username}"}]`);
            browser.sleep(100);
            peopleCloudComponent.checkSelectedPeople(`${apsUser.lastName}`);
            peopleCloudComponent.checkSelectedPeople(`${activitiUser.lastName}`);
            peopleCloudComponent.checkSelectedPeople(`${noRoleUser.lastName}`);

            peopleCloudComponent.searchAssigneeToExisting('LastName');
            peopleCloudComponent.checkUserIsNotDisplayed(`${noRoleUser.firstName}` + ' ' + `${noRoleUser.lastName}`);
            peopleCloudComponent.checkUserIsNotDisplayed(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);
            peopleCloudComponent.checkUserIsNotDisplayed(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);

            peopleCloudComponent.clearAssigneeField();
            peopleGroupCloudComponentPage.clickPreselectValidation();
            peopleGroupCloudComponentPage.checkPreselectValidationIsUnchecked();
            peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"firstName":"TestFirstName1","lastName":"TestLastName1"},` +
                `{"firstName":"TestFirstName2","lastName":"TestLastName2"},{"firstName":"TestFirstName3","lastName":"TestLastName3"}]`);
            browser.sleep(100);
            peopleCloudComponent.checkSelectedPeople('TestFirstName1 TestLastName1');
            peopleCloudComponent.checkSelectedPeople('TestFirstName2 TestLastName2');
            peopleCloudComponent.checkSelectedPeople('TestFirstName3 TestLastName3');

            peopleGroupCloudComponentPage.clickPreselectValidation();
            peopleGroupCloudComponentPage.checkPreselectValidationIsChecked();
            peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"firstName":"${apsUser.firstName}","lastName":"${apsUser.lastName},"` +
                `{"firstName":"${activitiUser.firstName}","lastName":"${activitiUser.lastName}",{"firstName":"${noRoleUser.firstName}","lastName":"${noRoleUser.lastName}"]`);
            browser.sleep(100);
            expect(peopleGroupCloudComponentPage.getAssigneeFieldContent()).toBe('');

        });

    });

});

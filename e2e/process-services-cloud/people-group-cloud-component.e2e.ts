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

import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { PeopleGroupCloudComponentPage } from '../pages/adf/demo-shell/process-services/peopleGroupCloudComponentPage';
import { GroupCloudComponentPage, PeopleCloudComponentPage, SettingsPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { LoginSSOPage, IdentityService, GroupIdentityService, RolesService, ApiService } from '@alfresco/adf-testing';
import resources = require('../util/resources');

describe('People Groups Cloud Component', () => {

    describe('People Groups Cloud Component', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const peopleGroupCloudComponentPage = new PeopleGroupCloudComponentPage();
        const peopleCloudComponent = new PeopleCloudComponentPage();
        const groupCloudComponentPage = new GroupCloudComponentPage();
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;
        let rolesService: RolesService;
        const settingsPage = new SettingsPage();
        const apiService = new ApiService(
            browser.params.config.oauth2.clientId,
            browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
        );

        let apsUser, testUser;
        let activitiUser;
        let noRoleUser;
        let groupAps;
        let groupActiviti;
        let groupNoRole;
        let apsUserRoleId;
        let apsAdminRoleId;
        let activitiAdminRoleId;
        let clientActivitiAdminRoleId, clientActivitiUserRoleId;
        let users = [];
        let groups = [];
        let clientId;

        beforeAll(async () => {

            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

            identityService = new IdentityService(apiService);
            rolesService = new RolesService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            clientId = await groupIdentityService.getClientIdByApplicationName(resources.ACTIVITI7_APPS.SIMPLE_APP.name);
            groupActiviti = await groupIdentityService.createIdentityGroup();
            clientActivitiAdminRoleId = await rolesService.getClientRoleIdByRoleName(groupActiviti.id, clientId, identityService.ROLES.ACTIVITI_ADMIN);
            clientActivitiUserRoleId = await rolesService.getClientRoleIdByRoleName(groupActiviti.id, clientId, identityService.ROLES.ACTIVITI_USER);

            testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER]);
            apsUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER]);
            activitiUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);

            noRoleUser = await identityService.createIdentityUser();
            await identityService.deleteClientRole(noRoleUser.idIdentityService, clientId, clientActivitiAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN);
            await identityService.deleteClientRole(noRoleUser.idIdentityService, clientId, clientActivitiUserRoleId, identityService.ROLES.ACTIVITI_USER);

            groupAps = await groupIdentityService.createIdentityGroup();
            apsAdminRoleId = await rolesService.getRoleIdByRoleName(identityService.ROLES.APS_ADMIN);
            apsUserRoleId = await rolesService.getRoleIdByRoleName(identityService.ROLES.APS_USER);
            await groupIdentityService.assignRole(groupAps.id, apsAdminRoleId, identityService.ROLES.APS_ADMIN);
            await groupIdentityService.assignRole(groupAps.id, apsUserRoleId, identityService.ROLES.APS_USER);
            activitiAdminRoleId = await rolesService.getRoleIdByRoleName(identityService.ROLES.ACTIVITI_ADMIN);
            await groupIdentityService.assignRole(groupActiviti.id, activitiAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN);
            groupNoRole = await groupIdentityService.createIdentityGroup();

            await groupIdentityService.addClientRole(groupAps.id, clientId, clientActivitiAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN);
            await groupIdentityService.addClientRole(groupActiviti.id, clientId, clientActivitiAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN);
            users = [`${apsUser.idIdentityService}`, `${activitiUser.idIdentityService}`, `${noRoleUser.idIdentityService}`, `${testUser.idIdentityService}`];
            groups = [`${groupAps.id}`, `${groupActiviti.id}`, `${groupNoRole.id}`];

            await settingsPage.setProviderBpmSso(
                browser.params.config.bpmHost,
                browser.params.config.oauth2.host,
                browser.params.config.identityHost);
            await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);

        });

        afterAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            for (const user of users) {
                await identityService.deleteIdentityUser(user);
            }
            for (const group of groups) {
                await groupIdentityService.deleteIdentityGroup(group);
            }

        });

        beforeEach(async () => {
            await navigationBarPage.navigateToPeopleGroupCloudPage();
            await peopleGroupCloudComponentPage.checkGroupsCloudComponentTitleIsDisplayed();
            await peopleGroupCloudComponentPage.checkPeopleCloudComponentTitleIsDisplayed();
        });

        afterEach(async () => {
            await browser.refresh();
        });

        describe('[C297674] Should be able to add filtering to People Cloud Component', () => {

            beforeEach(async () => {
                await peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
                await peopleGroupCloudComponentPage.checkPeopleCloudMultipleSelectionIsSelected();
                await peopleGroupCloudComponentPage.clickPeopleCloudFilterRole();
                await peopleGroupCloudComponentPage.checkPeopleCloudFilterRole();
            });

            it('No role filtering', async () => {
                await peopleCloudComponent.searchAssignee(noRoleUser.lastName);
                await peopleCloudComponent.checkUserIsDisplayed(`${noRoleUser.firstName} ${noRoleUser.lastName}`);
                await peopleCloudComponent.searchAssignee(apsUser.lastName);
                await peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
                await peopleCloudComponent.searchAssignee(activitiUser.lastName);
                await peopleCloudComponent.checkUserIsDisplayed(`${activitiUser.firstName} ${activitiUser.lastName}`);
            });

            it('One role filtering', async () => {
                await peopleGroupCloudComponentPage.enterPeopleRoles(`["${identityService.ROLES.APS_USER}"]`);
                await peopleCloudComponent.searchAssignee(apsUser.lastName);
                await peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
                await peopleCloudComponent.searchAssignee(activitiUser.lastName);
                await peopleCloudComponent.checkUserIsNotDisplayed(`${activitiUser.firstName} ${activitiUser.lastName}`);
                await peopleCloudComponent.searchAssignee(noRoleUser.lastName);
                await peopleCloudComponent.checkUserIsNotDisplayed(`${noRoleUser.firstName} ${noRoleUser.lastName}`);
            });

            it('Multiple roles filtering', async () => {
                await peopleGroupCloudComponentPage.enterPeopleRoles(`["${identityService.ROLES.APS_USER}", "${identityService.ROLES.ACTIVITI_USER}"]`);
                await peopleCloudComponent.searchAssignee(apsUser.lastName);
                await peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
                await peopleCloudComponent.searchAssignee(activitiUser.lastName);
                await peopleCloudComponent.checkUserIsDisplayed(`${activitiUser.firstName} ${activitiUser.lastName}`);
                await peopleCloudComponent.searchAssignee(noRoleUser.lastName);
                await peopleCloudComponent.checkUserIsNotDisplayed(`${noRoleUser.firstName} ${noRoleUser.lastName}`);
            });
        });

        describe('[C309674] Should be able to add filtering to Group Cloud Component', () => {

            beforeEach(async () => {
                await peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
                await peopleGroupCloudComponentPage.clickGroupCloudFilterRole();
            });

            it('No role filtering', async () => {
                await peopleGroupCloudComponentPage.clearField(peopleGroupCloudComponentPage.groupRoleInput);
                await groupCloudComponentPage.searchGroups(groupNoRole.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupNoRole.name);
                await groupCloudComponentPage.searchGroups(groupActiviti.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupActiviti.name);
                await groupCloudComponentPage.searchGroups(groupAps.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name);
            });

            it('One role filtering', async () => {
                await peopleGroupCloudComponentPage.enterGroupRoles(`["${identityService.ROLES.APS_ADMIN}"]`);
                await groupCloudComponentPage.searchGroups(groupAps.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name);
                await groupCloudComponentPage.searchGroups(groupActiviti.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupActiviti.name);
                await groupCloudComponentPage.searchGroups(groupNoRole.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name);
            });

            it('[C309996] Should be able to filter groups based on composite roles Activit_Admin', async () => {
                await peopleGroupCloudComponentPage.enterGroupRoles(`["${identityService.ROLES.ACTIVITI_ADMIN}"]`);
                await groupCloudComponentPage.searchGroups(groupActiviti.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupActiviti.name);
                await groupCloudComponentPage.searchGroups(groupNoRole.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name);
                await groupCloudComponentPage.searchGroups(groupAps.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name);
            });

            it('[C309996] Should be able to filter groups based on composite roles Aps_User', async () => {
                await peopleGroupCloudComponentPage.enterGroupRoles(`["${identityService.ROLES.APS_USER}"]`);
                await groupCloudComponentPage.searchGroups(groupActiviti.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupActiviti.name);
                await groupCloudComponentPage.searchGroups(groupNoRole.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name);
                await groupCloudComponentPage.searchGroups(groupAps.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name);
            });

            it('[C309996] Should be able to filter groups based on composite roles Activiti_User', async () => {
                await peopleGroupCloudComponentPage.enterGroupRoles(`["${identityService.ROLES.ACTIVITI_USER}"]`);
                await groupCloudComponentPage.searchGroups(groupActiviti.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupActiviti.name);
                await groupCloudComponentPage.searchGroups(groupNoRole.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name);
                await groupCloudComponentPage.searchGroups(groupAps.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name);
            });

            it('Multiple roles filtering', async () => {
                await peopleGroupCloudComponentPage.enterGroupRoles(`["${identityService.ROLES.APS_ADMIN}", "${identityService.ROLES.ACTIVITI_ADMIN}"]`);
                await groupCloudComponentPage.searchGroups(groupActiviti.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupActiviti.name);
                await groupCloudComponentPage.searchGroups(groupAps.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name);
                await groupCloudComponentPage.searchGroups(groupNoRole.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name);
            });
        });

        it('[C305033] Should fetch the preselect users based on the Validate flag set to True in Single mode selection', async () => {

            await peopleGroupCloudComponentPage.clickPeopleCloudSingleSelection();
            await peopleGroupCloudComponentPage.checkPeopleCloudSingleSelectionIsSelected();
            await peopleGroupCloudComponentPage.clickPreselectValidation();
            await expect(await peopleGroupCloudComponentPage.getPreselectValidationStatus()).toBe('true');

            await peopleGroupCloudComponentPage.enterPeoplePreselect('[{"id":"12345","username":"someUsername","email":"someEmail"}]');
            await expect(await peopleCloudComponent.getAssigneeFieldContent()).toBe('');

            await expect(await peopleGroupCloudComponentPage.getPreselectValidationStatus()).toBe('true');
            await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"id":"${noRoleUser.idIdentityService}"}]`);
            await expect(await peopleCloudComponent.getAssigneeFieldContent()).toBe(`${noRoleUser.firstName} ${noRoleUser.lastName}`);

            await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"email":"${apsUser.email}"}]`);
            await expect(await peopleCloudComponent.getAssigneeFieldContent()).toBe(`${apsUser.firstName} ${apsUser.lastName}`);

            await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"username":"${activitiUser.username}"}]`);
            await expect(await peopleCloudComponent.getAssigneeFieldContent()).toBe(`${activitiUser.firstName} ${activitiUser.lastName}`);
        });

        it('[C309676] Should fetch the preselect users based on the Validate flag set to True in Multiple mode selection', async () => {

            await peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            await peopleGroupCloudComponentPage.checkPeopleCloudMultipleSelectionIsSelected();
            await peopleGroupCloudComponentPage.clickPreselectValidation();
            await expect(await peopleGroupCloudComponentPage.getPreselectValidationStatus()).toBe('true');

            await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"id":"${apsUser.idIdentityService}"},{"id":"${activitiUser.idIdentityService}"},` +
                `{"id":"${noRoleUser.idIdentityService}"}]`);
            await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName} ${apsUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${activitiUser.firstName} ${activitiUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${noRoleUser.firstName} ${noRoleUser.lastName}`);

            await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"email":"${apsUser.email}"},{"email":"${activitiUser.email}"},{"email":"${noRoleUser.email}"}]`);
            await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName} ${apsUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${activitiUser.firstName} ${activitiUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${noRoleUser.firstName} ${noRoleUser.lastName}`);

            await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"username":"${apsUser.username}"},{"username":"${activitiUser.username}"},` +
                `{"username":"${noRoleUser.username}"}]`);
            await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName} ${apsUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${activitiUser.firstName} ${activitiUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${noRoleUser.firstName} ${noRoleUser.lastName}`);

            await peopleCloudComponent.searchAssigneeToExisting(noRoleUser.lastName);
            await peopleCloudComponent.checkUserIsNotDisplayed(`${noRoleUser.firstName} ${noRoleUser.lastName}`);

        });

        it('[C309677] Should populate the Users without any validation when the Preselect flag is set to false', async () => {
            await peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            await peopleGroupCloudComponentPage.checkPeopleCloudMultipleSelectionIsSelected();
            await expect(await peopleGroupCloudComponentPage.getPreselectValidationStatus()).toBe('false');

            await peopleGroupCloudComponentPage.enterPeoplePreselect(
                `[{"id":"TestId1","firstName":"TestFirstName1","lastName":"TestLastName1"},` +
                `{"id":"TestId2","firstName":"TestFirstName2","lastName":"TestLastName2"},` +
                `{"id":"TestId3","firstName":"TestFirstName3","lastName":"TestLastName3"}]`);
            await peopleCloudComponent.checkSelectedPeople('TestFirstName1 TestLastName1');
            await peopleCloudComponent.checkSelectedPeople('TestFirstName2 TestLastName2');
            await peopleCloudComponent.checkSelectedPeople('TestFirstName3 TestLastName3');

        });

        it('[C309678] Should not fetch the preselect users when mandatory parameters Id, Email and username are missing', async () => {
            await peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            await peopleGroupCloudComponentPage.checkPeopleCloudMultipleSelectionIsSelected();
            await peopleGroupCloudComponentPage.clickPreselectValidation();
            await expect(await peopleGroupCloudComponentPage.getPreselectValidationStatus()).toBe('true');

            await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"firstName":"${apsUser.firstName}","lastName":"${apsUser.lastName},"` +
                `{"firstName":"${activitiUser.firstName}","lastName":"${activitiUser.lastName}",{"firstName":"${noRoleUser.firstName}","lastName":"${noRoleUser.lastName}"]`);
            await browser.sleep(200);
            await expect(await peopleCloudComponent.getAssigneeFieldContent()).toBe('');
        });

    });

});

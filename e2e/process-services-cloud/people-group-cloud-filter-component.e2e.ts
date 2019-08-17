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
        const settingsPage = new SettingsPage();
        const apiService = new ApiService(
            browser.params.config.oauth2.clientId,
            browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
        );
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;
        let rolesService: RolesService;

        let apsUser, testUser;
        let activitiUser;
        let noRoleUser;
        let groupAps;
        let groupActiviti;
        let groupNoRole;
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
            await groupIdentityService.assignRole(groupAps.id, apsAdminRoleId, identityService.ROLES.APS_ADMIN);
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
            for (let i = 0; i < users.length; i++) {
                await identityService.deleteIdentityUser(users[i]);
            }
            for (let i = 0; i < groups.length; i++) {
                await groupIdentityService.deleteIdentityGroup(groups[i]);
            }

            await identityService.deleteIdentityUser(testUser.idIdentityService);
            await identityService.deleteIdentityUser(apsUser.idIdentityService);
            await identityService.deleteIdentityUser(activitiUser.idIdentityService);

        });

        beforeEach(async () => {
            await navigationBarPage.navigateToPeopleGroupCloudPage();
            await peopleGroupCloudComponentPage.checkGroupsCloudComponentTitleIsDisplayed();
            await peopleGroupCloudComponentPage.checkPeopleCloudComponentTitleIsDisplayed();
        });

        afterEach(async () => {
            await browser.refresh();
        });

        it('[C305041] Should filter the People Single Selection with the Application name filter', async () => {
            await peopleGroupCloudComponentPage.checkPeopleCloudSingleSelectionIsSelected();
            await peopleGroupCloudComponentPage.clickPeopleFilerByApp();
            await peopleGroupCloudComponentPage.enterPeopleAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name);
            await peopleCloudComponent.searchAssignee(`${activitiUser.firstName}`);
            await peopleCloudComponent.checkUserIsDisplayed(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            await peopleCloudComponent.selectAssigneeFromList(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            await browser.sleep(100);
            await expect(await peopleCloudComponent.getAssigneeFieldContent()).toBe(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
        });

        it('[C305041] Should filter the People Multiple Selection with the Application name filter', async () => {
            await peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            await peopleGroupCloudComponentPage.clickPeopleFilerByApp();
            await peopleGroupCloudComponentPage.enterPeopleAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name);
            await peopleCloudComponent.searchAssignee(`${apsUser.firstName}`);
            await peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);
            await peopleCloudComponent.selectAssigneeFromList(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);

            await peopleCloudComponent.searchAssigneeToExisting(`${activitiUser.firstName}`);
            await peopleCloudComponent.checkUserIsDisplayed(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            await peopleCloudComponent.selectAssigneeFromList(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);

            await peopleCloudComponent.searchAssigneeToExisting(`${noRoleUser.firstName}`);
            await peopleCloudComponent.checkUserIsNotDisplayed(`${noRoleUser.firstName}` + ' ' + `${noRoleUser.lastName}`);
        });

        it('[C305041] Should filter the Groups Single Selection with the Application name filter', async () => {
            await peopleGroupCloudComponentPage.clickGroupCloudSingleSelection();
            await peopleGroupCloudComponentPage.clickGroupFilerByApp();
            await peopleGroupCloudComponentPage.enterGroupAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name);
            await groupCloudComponentPage.searchGroups(`${groupActiviti.name}`);
            await groupCloudComponentPage.checkGroupIsDisplayed(`${groupActiviti.name}`);
            await groupCloudComponentPage.selectGroupFromList(`${groupActiviti.name}`);
            await expect(await groupCloudComponentPage.getGroupsFieldContent()).toBe(`${groupActiviti.name}`);
        });

        it('[C305041] Should filter the Groups Multiple Selection with the Application name filter', async () => {
            await peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
            await peopleGroupCloudComponentPage.clickGroupFilerByApp();
            await peopleGroupCloudComponentPage.enterGroupAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name);
            await groupCloudComponentPage.searchGroups(`${groupAps.name}`);
            await groupCloudComponentPage.checkGroupIsDisplayed(`${groupAps.name}`);
            await groupCloudComponentPage.selectGroupFromList(`${groupAps.name}`);
            await groupCloudComponentPage.checkSelectedGroup(`${groupAps.name}`);

            await groupCloudComponentPage.searchGroupsToExisting(`${groupActiviti.name}`);
            await groupCloudComponentPage.checkGroupIsDisplayed(`${groupActiviti.name}`);
            await groupCloudComponentPage.selectGroupFromList(`${groupActiviti.name}`);
            await groupCloudComponentPage.checkSelectedGroup(`${groupActiviti.name}`);

            await groupCloudComponentPage.searchGroupsToExisting(`${groupNoRole.name}`);
            await groupCloudComponentPage.checkGroupIsNotDisplayed(`${groupNoRole.name}`);
        });

    });

});

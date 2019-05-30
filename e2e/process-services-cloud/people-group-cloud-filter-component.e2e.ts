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
import CONSTANTS = require('../util/constants');
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
        let apsUserRoleId;
        let activitiUserRoleId;
        let apsAdminRoleId;
        let activitiAdminRoleId;
        let clientActivitiAdminRoleId, clientActivitiUserRoleId;
        let users = [];
        let groups = [];
        let clientId;

        beforeAll(async (done) => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

            identityService = new IdentityService(apiService);
            rolesService = new RolesService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            clientId = await groupIdentityService.getClientIdByApplicationName(resources.ACTIVITI7_APPS.SIMPLE_APP.name);
            groupActiviti = await groupIdentityService.createIdentityGroup();
            clientActivitiAdminRoleId = await rolesService.getClientRoleIdByRoleName(groupActiviti.id, clientId, CONSTANTS.ROLES.ACTIVITI_ADMIN);
            clientActivitiUserRoleId = await rolesService.getClientRoleIdByRoleName(groupActiviti.id, clientId, CONSTANTS.ROLES.ACTIVITI_USER);

            testUser = await identityService.createIdentityUser();
            apsUserRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.APS_USER);
            await identityService.assignRole(testUser.idIdentityService, apsUserRoleId, CONSTANTS.ROLES.APS_USER);
            apsUser = await identityService.createIdentityUser();
            await identityService.assignRole(apsUser.idIdentityService, apsUserRoleId, CONSTANTS.ROLES.APS_USER);
            activitiUser = await identityService.createIdentityUser();
            activitiUserRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.ACTIVITI_USER);
            await identityService.assignRole(activitiUser.idIdentityService, activitiUserRoleId, CONSTANTS.ROLES.ACTIVITI_USER);
            noRoleUser = await identityService.createIdentityUser();
            await identityService.deleteClientRole(noRoleUser.idIdentityService, clientId, clientActivitiAdminRoleId, CONSTANTS.ROLES.ACTIVITI_ADMIN);
            await identityService.deleteClientRole(noRoleUser.idIdentityService, clientId, clientActivitiUserRoleId, CONSTANTS.ROLES.ACTIVITI_USER);

            groupAps = await groupIdentityService.createIdentityGroup();
            apsAdminRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.APS_ADMIN);
            await groupIdentityService.assignRole(groupAps.id, apsAdminRoleId, CONSTANTS.ROLES.APS_ADMIN);
            activitiAdminRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.ACTIVITI_ADMIN);
            await groupIdentityService.assignRole(groupActiviti.id, activitiAdminRoleId, CONSTANTS.ROLES.ACTIVITI_ADMIN);
            groupNoRole = await groupIdentityService.createIdentityGroup();

            await groupIdentityService.addClientRole(groupAps.id, clientId, clientActivitiAdminRoleId, CONSTANTS.ROLES.ACTIVITI_ADMIN );
            await groupIdentityService.addClientRole(groupActiviti.id, clientId, clientActivitiAdminRoleId, CONSTANTS.ROLES.ACTIVITI_ADMIN );
            users = [`${apsUser.idIdentityService}`, `${activitiUser.idIdentityService}`, `${noRoleUser.idIdentityService}`, `${testUser.idIdentityService}`];
            groups = [`${groupAps.id}`, `${groupActiviti.id}`, `${groupNoRole.id}`];

            await settingsPage.setProviderBpmSso(
                browser.params.config.bpmHost,
                browser.params.config.oauth2.host,
                browser.params.config.identityHost);
            loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
            done();
        });

        afterAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            for (let i = 0; i < users.length; i++) {
                await identityService.deleteIdentityUser(users[i]);
            }
            for (let i = 0; i < groups.length; i++) {
                await groupIdentityService.deleteIdentityGroup(groups[i]);
            }
        });

        beforeEach(() => {
            navigationBarPage.navigateToPeopleGroupCloudPage();
            peopleGroupCloudComponentPage.checkGroupsCloudComponentTitleIsDisplayed();
            peopleGroupCloudComponentPage.checkPeopleCloudComponentTitleIsDisplayed();
        });

        afterEach(() => {
            browser.refresh();
        });

        it('[C305041] Should filter the People Single Selection with the Application name filter', () => {
            peopleGroupCloudComponentPage.checkPeopleCloudSingleSelectionIsSelected();
            peopleGroupCloudComponentPage.clickPeopleFilerByApp();
            peopleGroupCloudComponentPage.enterPeopleAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name);
            peopleCloudComponent.searchAssignee(`${activitiUser.firstName}`);
            peopleCloudComponent.checkUserIsDisplayed(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            peopleCloudComponent.selectAssigneeFromList(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            browser.sleep(100);
            expect(peopleCloudComponent.getAssigneeFieldContent()).toBe(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
        });

        it('[C305041] Should filter the People Multiple Selection with the Application name filter', () => {
            peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            peopleGroupCloudComponentPage.clickPeopleFilerByApp();
            peopleGroupCloudComponentPage.enterPeopleAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name);
            peopleCloudComponent.searchAssignee(`${apsUser.firstName}`);
            peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);
            peopleCloudComponent.selectAssigneeFromList(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);
            peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName}` + ' ' + `${apsUser.lastName}`);

            peopleCloudComponent.searchAssigneeToExisting(`${activitiUser.firstName}`);
            peopleCloudComponent.checkUserIsDisplayed(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            peopleCloudComponent.selectAssigneeFromList(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);
            peopleCloudComponent.checkSelectedPeople(`${activitiUser.firstName}` + ' ' + `${activitiUser.lastName}`);

            peopleCloudComponent.searchAssigneeToExisting(`${noRoleUser.firstName}`);
            peopleCloudComponent.checkUserIsNotDisplayed(`${noRoleUser.firstName}` + ' ' + `${noRoleUser.lastName}`);
        });

        it('[C305041] Should filter the Groups Single Selection with the Application name filter', () => {
            peopleGroupCloudComponentPage.clickGroupCloudSingleSelection();
            peopleGroupCloudComponentPage.clickGroupFilerByApp();
            peopleGroupCloudComponentPage.enterGroupAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name);
            groupCloudComponentPage.searchGroups(`${groupActiviti.name}`);
            groupCloudComponentPage.checkGroupIsDisplayed(`${groupActiviti.name}`);
            groupCloudComponentPage.selectGroupFromList(`${groupActiviti.name}`);
            expect(groupCloudComponentPage.getGroupsFieldContent()).toBe(`${groupActiviti.name}`);
        });

        it('[C305041] Should filter the Groups Multiple Selection with the Application name filter', () => {
            peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
            peopleGroupCloudComponentPage.clickGroupFilerByApp();
            peopleGroupCloudComponentPage.enterGroupAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name);
            groupCloudComponentPage.searchGroups(`${groupAps.name}`);
            groupCloudComponentPage.checkGroupIsDisplayed(`${groupAps.name}`);
            groupCloudComponentPage.selectGroupFromList(`${groupAps.name}`);
            groupCloudComponentPage.checkSelectedGroup(`${groupAps.name}`);

            groupCloudComponentPage.searchGroupsToExisting(`${groupActiviti.name}`);
            groupCloudComponentPage.checkGroupIsDisplayed(`${groupActiviti.name}`);
            groupCloudComponentPage.selectGroupFromList(`${groupActiviti.name}`);
            groupCloudComponentPage.checkSelectedGroup(`${groupActiviti.name}`);

            groupCloudComponentPage.searchGroupsToExisting(`${groupNoRole.name}`);
            groupCloudComponentPage.checkGroupIsNotDisplayed(`${groupNoRole.name}`);
        });

    });

});

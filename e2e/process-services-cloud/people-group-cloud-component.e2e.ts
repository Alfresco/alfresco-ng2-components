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
import { GroupCloudComponentPage, PeopleCloudComponentPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { LoginSSOPage, IdentityService, GroupIdentityService, RolesService, ApiService } from '@alfresco/adf-testing';

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
        const apiService = new ApiService(
            browser.params.config.oauth2.clientId,
            browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
        );

        let apsUser;
        let testUser;
        let activitiUser;
        let noRoleUser;
        let groupUser;
        let groupAdmin;
        let groupNoRole;
        let apsUserRoleId: string;
        let apsAdminRoleId: string;
        let users = [];
        let groups = [];

        beforeAll(async () => {

            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

            identityService = new IdentityService(apiService);
            testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
            apsUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
            activitiUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
            noRoleUser = await identityService.createIdentityUser();

            rolesService = new RolesService(apiService);
            apsAdminRoleId = await rolesService.getRoleIdByRoleName(identityService.ROLES.ACTIVITI_ADMIN);
            apsUserRoleId = await rolesService.getRoleIdByRoleName(identityService.ROLES.ACTIVITI_USER);

            groupIdentityService = new GroupIdentityService(apiService);

            groupUser = await groupIdentityService.createIdentityGroup();
            await groupIdentityService.assignRole(groupUser.id, apsUserRoleId, identityService.ROLES.ACTIVITI_USER);

            groupAdmin = await groupIdentityService.createIdentityGroup();
            await groupIdentityService.assignRole(groupAdmin.id, apsAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN);

            groupNoRole = await groupIdentityService.createIdentityGroup();

            users = [`${apsUser.idIdentityService}`, `${activitiUser.idIdentityService}`, `${noRoleUser.idIdentityService}`, `${testUser.idIdentityService}`];
            groups = [`${groupUser.id}`, `${groupAdmin.id}`, `${groupNoRole.id}`];

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
                await peopleCloudComponent.searchAssignee(testUser.lastName);
                await peopleCloudComponent.checkUserIsDisplayed(`${testUser.firstName} ${testUser.lastName}`);
            });

            it('One role filtering', async () => {
                await peopleGroupCloudComponentPage.enterPeopleRoles(`["${identityService.ROLES.ACTIVITI_USER}"]`);
                await peopleCloudComponent.searchAssignee(apsUser.lastName);
                await peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
                await peopleCloudComponent.searchAssignee(testUser.lastName);
                await peopleCloudComponent.checkUserIsNotDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
                await peopleCloudComponent.checkUserIsNotDisplayed(`${testUser.firstName} ${testUser.lastName}`);
                await peopleCloudComponent.searchAssignee(noRoleUser.lastName);
                await peopleCloudComponent.checkUserIsNotDisplayed(`${noRoleUser.firstName} ${noRoleUser.lastName}`);
            });

            it('Multiple roles filtering', async () => {
                await peopleGroupCloudComponentPage.enterPeopleRoles(`["${identityService.ROLES.ACTIVITI_USER}", "${identityService.ROLES.ACTIVITI_USER}"]`);
                await peopleCloudComponent.searchAssignee(apsUser.lastName);
                await peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
                await peopleCloudComponent.searchAssignee(testUser.lastName);
                await peopleCloudComponent.checkUserIsDisplayed(`${testUser.firstName} ${testUser.lastName}`);
                await peopleCloudComponent.searchAssignee(noRoleUser.lastName);
                await peopleCloudComponent.checkUserIsNotDisplayed(`${testUser.firstName} ${testUser.lastName}`);
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
                await groupCloudComponentPage.searchGroups(groupAdmin.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupAdmin.name);
                await groupCloudComponentPage.searchGroups(groupUser.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupUser.name);
            });

            it('One role filtering', async () => {
                await peopleGroupCloudComponentPage.enterGroupRoles(`["${identityService.ROLES.ACTIVITI_ADMIN}"]`);
                await groupCloudComponentPage.searchGroups(groupAdmin.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupAdmin.name);
                await groupCloudComponentPage.searchGroups(groupUser.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupAdmin.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupUser.name);
                await groupCloudComponentPage.searchGroups(groupNoRole.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name);
            });

            it('[C309996] Should be able to filter groups based on composite roles ACTIVITI_USER', async () => {
                await peopleGroupCloudComponentPage.enterGroupRoles(`["${identityService.ROLES.ACTIVITI_USER}"]`);
                await groupCloudComponentPage.searchGroups(groupAdmin.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupAdmin.name);
                await groupCloudComponentPage.searchGroups(groupNoRole.name);
                await groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name);
                await groupCloudComponentPage.searchGroups(groupUser.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupUser.name);
            });

            it('Multiple roles filtering', async () => {
                await peopleGroupCloudComponentPage.enterGroupRoles(`["${identityService.ROLES.ACTIVITI_ADMIN}", "${identityService.ROLES.ACTIVITI_USER}"]`);
                await groupCloudComponentPage.searchGroups(groupAdmin.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupAdmin.name);
                await groupCloudComponentPage.searchGroups(groupUser.name);
                await groupCloudComponentPage.checkGroupIsDisplayed(groupUser.name);
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

            await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"username":"${testUser.username}"}]`);
            await expect(await peopleCloudComponent.getAssigneeFieldContent()).toBe(`${testUser.firstName} ${testUser.lastName}`);
        });

        it('[C309676] Should fetch the preselect users based on the Validate flag set to True in Multiple mode selection', async () => {

            await peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            await peopleGroupCloudComponentPage.checkPeopleCloudMultipleSelectionIsSelected();
            await peopleGroupCloudComponentPage.clickPreselectValidation();
            await expect(await peopleGroupCloudComponentPage.getPreselectValidationStatus()).toBe('true');

            await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"id":"${apsUser.idIdentityService}"},{"id":"${testUser.idIdentityService}"},` +
                `{"id":"${noRoleUser.idIdentityService}"}]`);
            await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName} ${apsUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${testUser.firstName} ${testUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${noRoleUser.firstName} ${noRoleUser.lastName}`);

            await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"email":"${apsUser.email}"},{"email":"${testUser.email}"},{"email":"${noRoleUser.email}"}]`);
            await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName} ${apsUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${testUser.firstName} ${testUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${noRoleUser.firstName} ${noRoleUser.lastName}`);

            await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"username":"${apsUser.username}"},{"username":"${testUser.username}"},` +
                `{"username":"${noRoleUser.username}"}]`);
            await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName} ${apsUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${testUser.firstName} ${testUser.lastName}`);
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
                `{"firstName":"${testUser.firstName}","lastName":"${testUser.lastName}",{"firstName":"${noRoleUser.firstName}","lastName":"${noRoleUser.lastName}"]`);
            await browser.sleep(200);
            await expect(await peopleCloudComponent.getAssigneeFieldContent()).toBe('');
        });

    });

});

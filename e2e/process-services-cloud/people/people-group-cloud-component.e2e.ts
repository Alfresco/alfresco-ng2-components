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

import { createApiService,
    GroupCloudComponentPage,
    GroupIdentityService,
    IdentityService,
    LoginPage,
    PeopleCloudComponentPage,
    RolesService
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { PeopleGroupCloudComponentPage } from './../pages/people-group-cloud-component.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('People Groups Cloud Component', () => {

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const peopleGroupCloudComponentPage = new PeopleGroupCloudComponentPage();
    const peopleCloudComponent = new PeopleCloudComponentPage();
    const groupCloudComponentPage = new GroupCloudComponentPage();

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);
    const rolesService = new RolesService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);

    let apsUser;
    let testUser;
    let devopsUser;
    let activitiUser;
    let multipleRolesUser;
    let noRoleUser;
    let groupUser;
    let groupAdmin;
    let groupNoRole;
    let groupMultipleRoles;
    let apsUserRoleId: string;
    let apsAdminRoleId: string;
    let users = [];
    let groups = [];

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
        apsUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
        activitiUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
        devopsUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_DEVOPS]);
        multipleRolesUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER, identityService.ROLES.ACTIVITI_ADMIN]);
        noRoleUser = await identityService.createIdentityUser();

        apsAdminRoleId = await rolesService.getRoleIdByRoleName(identityService.ROLES.ACTIVITI_ADMIN);
        apsUserRoleId = await rolesService.getRoleIdByRoleName(identityService.ROLES.ACTIVITI_USER);

        groupUser = await groupIdentityService.createIdentityGroup();
        await groupIdentityService.assignRole(groupUser.id, apsUserRoleId, identityService.ROLES.ACTIVITI_USER);

        groupAdmin = await groupIdentityService.createIdentityGroup();
        await groupIdentityService.assignRole(groupAdmin.id, apsAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN);

        groupMultipleRoles = await groupIdentityService.createIdentityGroup();
        await groupIdentityService.assignRole(groupMultipleRoles.id, apsAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN);
        await groupIdentityService.assignRole(groupMultipleRoles.id, apsUserRoleId, identityService.ROLES.ACTIVITI_USER);

        groupNoRole = await groupIdentityService.createIdentityGroup();

        users = [`${apsUser.idIdentityService}`, `${activitiUser.idIdentityService}`, `${noRoleUser.idIdentityService}`,
            `${testUser.idIdentityService}`, `${devopsUser.idIdentityService}`, `${multipleRolesUser.idIdentityService}`];
        groups = [`${groupUser.id}`, `${groupAdmin.id}`, `${groupNoRole.id}`, `${groupMultipleRoles.id}`];

        await loginSSOPage.login(testUser.username, testUser.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
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
            await peopleCloudComponent.searchAssignee(devopsUser.lastName);
            await peopleCloudComponent.checkNoResultsFoundError();
            await peopleCloudComponent.searchAssignee(noRoleUser.lastName);
            await peopleCloudComponent.checkNoResultsFoundError();
        });

        it('Multiple roles filtering', async () => {
            await peopleGroupCloudComponentPage.enterPeopleRoles(`["${identityService.ROLES.ACTIVITI_USER}", "${identityService.ROLES.ACTIVITI_ADMIN}"]`);
            await peopleCloudComponent.searchAssignee(multipleRolesUser.lastName);
            await peopleCloudComponent.checkUserIsDisplayed(`${multipleRolesUser.firstName} ${multipleRolesUser.lastName}`);
            await peopleCloudComponent.searchAssignee(apsUser.lastName);
            await peopleCloudComponent.checkUserIsNotDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
            await peopleCloudComponent.searchAssignee(testUser.lastName);
            await peopleCloudComponent.checkUserIsNotDisplayed(`${testUser.firstName} ${testUser.lastName}`);
            await peopleCloudComponent.searchAssignee(noRoleUser.lastName);
            await peopleCloudComponent.checkNoResultsFoundError();
        });
    });

    describe('[C309674] Should be able to add filtering to Group Cloud Component', () => {
        beforeEach(async () => {
            await peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
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
            await groupCloudComponentPage.searchGroups(groupMultipleRoles.name);
            await groupCloudComponentPage.checkGroupIsDisplayed(groupMultipleRoles.name);
            await groupCloudComponentPage.searchGroups(groupAdmin.name);
            await groupCloudComponentPage.checkGroupIsNotDisplayed(groupAdmin.name);
            await groupCloudComponentPage.searchGroups(groupUser.name);
            await groupCloudComponentPage.checkGroupIsNotDisplayed(groupUser.name);
            await groupCloudComponentPage.searchGroups(groupNoRole.name);
            await groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name);
        });
    });

    it('[C305033] Should fetch the preselect users based on the Validate flag set to True in Single mode selection', async () => {
        await peopleGroupCloudComponentPage.clickPeopleCloudSingleSelection();
        await peopleGroupCloudComponentPage.checkPeopleCloudSingleSelectionIsSelected();

        await peopleGroupCloudComponentPage.enterPeoplePreselect('[{"id":"12345","username":"someUsername","email":"someEmail"}]');
        await expect(await peopleCloudComponent.checkSelectedPeople('someUsername'));

        await peopleGroupCloudComponentPage.clickPreselectValidation();
        await expect(await peopleGroupCloudComponentPage.getPreselectValidationStatus()).toBe('true');

        await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"email":"${apsUser.email}"}]`);
        await expect(await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName} ${apsUser.lastName}`));

        await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"username":"${testUser.username}"}]`);
        await expect(await peopleCloudComponent.checkSelectedPeople(`${testUser.firstName} ${testUser.lastName}`));
    });

    it('[C309676] Should fetch the preselect users based on the Validate flag set to True in Multiple mode selection', async () => {
        await peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
        await peopleGroupCloudComponentPage.checkPeopleCloudMultipleSelectionIsSelected();
        await peopleGroupCloudComponentPage.clickPreselectValidation();
        await expect(await peopleGroupCloudComponentPage.getPreselectValidationStatus()).toBe('true');

        await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"email":"${apsUser.email}"},{"email":"${testUser.email}"},{"email":"${noRoleUser.email}"}]`);
        await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName} ${apsUser.lastName}`);
        await peopleCloudComponent.checkSelectedPeople(`${testUser.firstName} ${testUser.lastName}`);
        await peopleCloudComponent.checkSelectedPeople(`${noRoleUser.firstName} ${noRoleUser.lastName}`);

        await peopleGroupCloudComponentPage.enterPeoplePreselect(`[{"username":"${apsUser.username}"},{"username":"${testUser.username}"},` +
            `{"username":"${noRoleUser.username}"}]`);
        await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName} ${apsUser.lastName}`);
        await peopleCloudComponent.checkSelectedPeople(`${testUser.firstName} ${testUser.lastName}`);
        await peopleCloudComponent.checkSelectedPeople(`${noRoleUser.firstName} ${noRoleUser.lastName}`);

        await peopleCloudComponent.searchAssignee(noRoleUser.lastName);
        await peopleCloudComponent.checkNoResultsFoundError();
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
});

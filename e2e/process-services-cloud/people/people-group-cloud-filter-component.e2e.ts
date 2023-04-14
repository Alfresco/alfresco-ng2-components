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

import { createApiService, GroupCloudComponentPage, GroupIdentityService, IdentityService, LoginPage, PeopleCloudComponentPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { PeopleGroupCloudComponentPage } from './../pages/people-group-cloud-component.page';

describe('People Groups Cloud Component', () => {

    describe('People Groups Cloud Component', () => {

        const loginSSOPage = new LoginPage();
        const peopleGroupCloudComponentPage = new PeopleGroupCloudComponentPage();
        const peopleCloudComponent = new PeopleCloudComponentPage();
        const groupCloudComponentPage = new GroupCloudComponentPage();

        const apiService = createApiService();
        const identityService = new IdentityService(apiService);
        const groupIdentityService = new GroupIdentityService(apiService);

        let apsUser;
        let testUser;
        let noRoleUser;
        let groupNoRole;
        let users = [];
        let hrGroup;
        let testGroup;

        beforeAll(async () => {
            await apiService.loginWithProfile('identityAdmin');

            hrGroup = await groupIdentityService.getGroupInfoByGroupName('hr');
            testGroup = await groupIdentityService.getGroupInfoByGroupName('testgroup');
            testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
            apsUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);

            await identityService.addUserToGroup(testUser.idIdentityService, testGroup.id);
            await identityService.addUserToGroup(apsUser.idIdentityService, hrGroup.id);

            noRoleUser = await identityService.createIdentityUser();
            groupNoRole = await groupIdentityService.createIdentityGroup();

            users = [apsUser.idIdentityService, noRoleUser.idIdentityService, testUser.idIdentityService];

            await loginSSOPage.login(apsUser.username, apsUser.password);
        });

        afterAll(async () => {
            await apiService.loginWithProfile('identityAdmin');
            for (const user of users) {
                await identityService.deleteIdentityUser(user);
            }

            await groupIdentityService.deleteIdentityGroup(groupNoRole.id);
        });

        beforeEach(async () => {
            await peopleGroupCloudComponentPage.navigateTo();
        });

        it('[C305041] Should filter the People Single Selection with the Application name filter', async () => {
            await peopleGroupCloudComponentPage.checkPeopleCloudSingleSelectionIsSelected();
            await peopleGroupCloudComponentPage.enterPeopleAppName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name);

            await peopleCloudComponent.searchAssignee(testUser.firstName);
            await peopleCloudComponent.checkUserIsDisplayed(`${testUser.firstName} ${testUser.lastName}`);
            await peopleCloudComponent.selectAssigneeFromList(`${testUser.firstName} ${testUser.lastName}`);

            await expect(await peopleCloudComponent.checkSelectedPeople(`${testUser.firstName} ${testUser.lastName}`)).toBeTruthy(`${testUser.firstName} ${testUser.lastName} is not visible here!`);
        });

        it('[C305041] Should filter the People Multiple Selection with the Application name filter', async () => {
            await peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            await peopleGroupCloudComponentPage.enterPeopleAppName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name);
            await peopleCloudComponent.searchAssignee(testUser.firstName);
            await peopleCloudComponent.checkUserIsDisplayed(`${testUser.firstName} ${testUser.lastName}`);
            await peopleCloudComponent.selectAssigneeFromList(`${testUser.firstName} ${testUser.lastName}`);

            await peopleCloudComponent.searchAssignee(apsUser.firstName);
            await peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
            await peopleCloudComponent.selectAssigneeFromList(`${apsUser.firstName} ${apsUser.lastName}`);
            await expect(await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName} ${apsUser.lastName}`)).toBeTruthy(`${apsUser.firstName} ${apsUser.lastName} is not visible here!`);

            await peopleCloudComponent.searchAssignee(noRoleUser.firstName);
            await expect(await peopleCloudComponent.checkNoResultsFoundError()).toBeTruthy('There is something in the list!');
        });

        it('[C305041] Should filter the Groups Single Selection with the Application name filter', async () => {
            await peopleGroupCloudComponentPage.clickGroupCloudSingleSelection();
            await peopleGroupCloudComponentPage.enterGroupAppName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name);
            await groupCloudComponentPage.searchGroups(hrGroup.name);
            await groupCloudComponentPage.checkGroupIsDisplayed(hrGroup.name);
            await groupCloudComponentPage.selectGroupFromList(hrGroup.name);
            await expect(await groupCloudComponentPage.checkSelectedGroup(hrGroup.name)).toBeTruthy(`${hrGroup.name} is not visible here!`);
        });

        it('[C305041] Should filter the Groups Multiple Selection with the Application name filter', async () => {
            await peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
            await peopleGroupCloudComponentPage.enterGroupAppName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name);
            await groupCloudComponentPage.searchGroups(testGroup.name);
            await groupCloudComponentPage.checkGroupIsDisplayed(testGroup.name);
            await groupCloudComponentPage.selectGroupFromList(testGroup.name);
            await groupCloudComponentPage.checkSelectedGroup(testGroup.name);
            await expect(await groupCloudComponentPage.checkSelectedGroup(testGroup.name)).toBeTruthy(`${testGroup.name} is not visible here!`);

            await groupCloudComponentPage.searchGroupsToExisting(hrGroup.name);
            await groupCloudComponentPage.checkGroupIsDisplayed(hrGroup.name);
            await groupCloudComponentPage.selectGroupFromList(hrGroup.name);
            await groupCloudComponentPage.checkSelectedGroup(hrGroup.name);
            await expect(await groupCloudComponentPage.checkSelectedGroup(hrGroup.name)).toBeTruthy(`${hrGroup.name} is not visible here!`);

            await groupCloudComponentPage.searchGroupsToExisting(groupNoRole.name);
            await groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name);
        });
    });
});

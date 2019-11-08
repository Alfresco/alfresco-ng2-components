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
import { LoginSSOPage, IdentityService, GroupIdentityService, ApiService } from '@alfresco/adf-testing';

describe('People Groups Cloud Component', () => {

    describe('People Groups Cloud Component', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const peopleGroupCloudComponentPage = new PeopleGroupCloudComponentPage();
        const peopleCloudComponent = new PeopleCloudComponentPage();
        const groupCloudComponentPage = new GroupCloudComponentPage();
        const apiService = new ApiService(
            browser.params.config.oauth2.clientId,
            browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
        );
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;

        let apsUser, testUser;
        let noRoleUser;
        let groupNoRole;
        let users = [];
        let hrGroup;
        let testGroup;

        beforeAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

            identityService = new IdentityService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            hrGroup = await groupIdentityService.getGroupInfoByGroupName('hr');
            testGroup = await groupIdentityService.getGroupInfoByGroupName('testgroup');

            testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
            apsUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
            await identityService.addUserToGroup(testUser.idIdentityService, testGroup.id);
            await identityService.addUserToGroup(apsUser.idIdentityService, hrGroup.id);
            noRoleUser = await identityService.createIdentityUser();

            groupNoRole = await groupIdentityService.createIdentityGroup();

            users = [apsUser.idIdentityService, noRoleUser.idIdentityService, testUser.idIdentityService];

            await loginSSOPage.loginSSOIdentityService(apsUser.email, apsUser.password);
        });

        afterAll(async () => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            for (let i = 0; i < users.length; i++) {
                await identityService.deleteIdentityUser(users[i]);
            }

            await groupIdentityService.deleteIdentityGroup(groupNoRole.id);
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
            await peopleGroupCloudComponentPage.enterPeopleAppName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name);
            await peopleCloudComponent.searchAssignee(testUser.firstName);
            await peopleCloudComponent.checkUserIsDisplayed(`${testUser.firstName} ${testUser.lastName}`);
            await peopleCloudComponent.selectAssigneeFromList(`${testUser.firstName} ${testUser.lastName}`);
            await browser.sleep(100);
            await expect(await peopleCloudComponent.getAssigneeFieldContent()).toBe(`${testUser.firstName} ${testUser.lastName}`);
        });

        it('[C305041] Should filter the People Multiple Selection with the Application name filter', async () => {
            await peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection();
            await peopleGroupCloudComponentPage.clickPeopleFilerByApp();
            await peopleGroupCloudComponentPage.enterPeopleAppName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name);
            await peopleCloudComponent.searchAssignee(testUser.firstName);
            await peopleCloudComponent.checkUserIsDisplayed(`${testUser.firstName} ${testUser.lastName}`);
            await peopleCloudComponent.selectAssigneeFromList(`${testUser.firstName} ${testUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${testUser.firstName} ${testUser.lastName}`);

            await peopleCloudComponent.searchAssigneeToExisting(apsUser.firstName);
            await peopleCloudComponent.checkUserIsDisplayed(`${apsUser.firstName} ${apsUser.lastName}`);
            await peopleCloudComponent.selectAssigneeFromList(`${apsUser.firstName} ${apsUser.lastName}`);
            await peopleCloudComponent.checkSelectedPeople(`${apsUser.firstName} ${apsUser.lastName}`);

            await peopleCloudComponent.searchAssigneeToExisting(noRoleUser.firstName);
            await peopleCloudComponent.checkUserIsNotDisplayed(`${noRoleUser.firstName} ${noRoleUser.lastName}`);
        });

        it('[C305041] Should filter the Groups Single Selection with the Application name filter', async () => {
            await peopleGroupCloudComponentPage.clickGroupCloudSingleSelection();
            await peopleGroupCloudComponentPage.clickGroupFilerByApp();
            await peopleGroupCloudComponentPage.enterGroupAppName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name);
            await groupCloudComponentPage.searchGroups(hrGroup.name);
            await groupCloudComponentPage.checkGroupIsDisplayed(hrGroup.name);
            await groupCloudComponentPage.selectGroupFromList(hrGroup.name);
            await expect(await groupCloudComponentPage.getGroupsFieldContent()).toBe(hrGroup.name);
        });

        it('[C305041] Should filter the Groups Multiple Selection with the Application name filter', async () => {
            await peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection();
            await peopleGroupCloudComponentPage.clickGroupFilerByApp();
            await peopleGroupCloudComponentPage.enterGroupAppName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name);
            await groupCloudComponentPage.searchGroups(testGroup.name);
            await groupCloudComponentPage.checkGroupIsDisplayed(testGroup.name);
            await groupCloudComponentPage.selectGroupFromList(testGroup.name);
            await groupCloudComponentPage.checkSelectedGroup(testGroup.name);

            await groupCloudComponentPage.searchGroupsToExisting(hrGroup.name);
            await groupCloudComponentPage.checkGroupIsDisplayed(hrGroup.name);
            await groupCloudComponentPage.selectGroupFromList(hrGroup.name);
            await groupCloudComponentPage.checkSelectedGroup(hrGroup.name);

            await groupCloudComponentPage.searchGroupsToExisting(groupNoRole.name);
            await groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name);
        });

    });

});

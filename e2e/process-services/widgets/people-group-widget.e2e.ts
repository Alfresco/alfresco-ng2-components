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

import { createApiService, ApplicationsUtil, LoginPage, UserModel, UsersActions, Widget } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/tasks.page';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import CONSTANTS = require('../../util/constants');
import { AdminGroupsApi } from '@alfresco/js-api';

describe('People and Group widget', () => {

    const app = browser.params.resources.Files.MORE_WIDGETS;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();
    const widget = new Widget();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const adminGroupsApi = new AdminGroupsApi(apiService.getInstance());

    let user: UserModel;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        user = await usersActions.createUser();
        await createGroupAndUsers(user.tenantId);
        await apiService.login(user.username, user.password);

        await applicationsService.importPublishDeployApp(app.file_path, { renewIdmEntries: true });

        await loginPage.login(user.username, user.password);
    });

    beforeEach(async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.tasksListPage().checkTaskListIsLoaded();
    });

    it('[C275715] Add group widget - Visibility and group restriction', async () => {
        const name = 'group visibility task';
        const groupVisibilityForm = app.ADD_GROUP_VISIBILITY;
        await taskPage.createTask({ name, formName: groupVisibilityForm.formName });
        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        await taskPage.formFields().checkWidgetIsHidden(groupVisibilityForm.FIELD.widget_id);
        await widget.checkboxWidget().clickCheckboxInput(groupVisibilityForm.FIELD.checkbox_id);
        await taskPage.formFields().checkWidgetIsVisible(groupVisibilityForm.FIELD.widget_id);

        await widget.groupWidget().insertGroup(groupVisibilityForm.FIELD.widget_id, groupVisibilityForm.searchTerm);
        await widget.groupWidget().checkDropDownListIsDisplayed();
        const suggestions = await widget.groupWidget().getDropDownList();
        await expect(suggestions.sort()).toEqual(['Heros', 'Users']);
        await widget.groupWidget().selectGroupFromDropDown('Users');
        await taskPage.taskDetails().clickCompleteFormTask();
    });

    it('[C275716] Add group widget - sub group restrictions', async () => {
        const name = 'group widget - subgroup restriction';
        const subgroupFrom = app.ADD_GROUP_AND_SUBGROUP_RESTRICTION;
        await taskPage.createTask({ name, formName: subgroupFrom.formName });
        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        await taskPage.formFields().checkWidgetIsHidden(subgroupFrom.FIELD.widget_id);
        await widget.checkboxWidget().clickCheckboxInput(subgroupFrom.FIELD.checkbox_id);
        await taskPage.formFields().checkWidgetIsVisible(subgroupFrom.FIELD.widget_id);

        await widget.groupWidget().insertGroup(subgroupFrom.FIELD.widget_id, subgroupFrom.searchTerm);
        await widget.groupWidget().checkDropDownListIsDisplayed();
        const suggestions = await widget.groupWidget().getDropDownList();
        await expect(suggestions.sort()).toEqual(getSubGroupsName().sort());
        await widget.groupWidget().selectGroupFromDropDown(getSubGroupsName()[0]);
        await taskPage.taskDetails().clickCompleteFormTask();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();

        await taskPage.tasksListPage().selectRow(name);
        await widget.groupWidget().checkGroupFieldIsDisplayed();
        await expect(await widget.groupWidget().getFieldValue(subgroupFrom.FIELD.widget_id)).toBe('Heros');
    });

    it('[C275714] Add people widget - group restrictions', async () => {
        const name = 'people widget - group restrictions';
        const peopleWidget = app.ADD_PEOPLE_AND_GROUP_RESTRICTION;
        await taskPage.createTask({ name, formName: peopleWidget.formName });
        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        await taskPage.formFields().checkWidgetIsHidden(peopleWidget.FIELD.widget_id);
        await widget.checkboxWidget().clickCheckboxInput(peopleWidget.FIELD.checkbox_id);
        await taskPage.formFields().checkWidgetIsVisible(peopleWidget.FIELD.widget_id);

        await widget.peopleWidget().insertUser(peopleWidget.FIELD.widget_id, peopleWidget.searchTerm);
        await widget.peopleWidget().checkDropDownListIsDisplayed();
        const suggestions = await widget.peopleWidget().getDropDownList();
        await expect(suggestions.sort()).toEqual(getGroupMembers().sort());
        await widget.peopleWidget().selectUserFromDropDown(getGroupMembers()[0]);
        await taskPage.taskDetails().clickCompleteFormTask();
    });

    async function createGroupAndUsers(tenantId: number) {
        await apiService.loginWithProfile('admin');

        const userCreated = await Promise.all(app.groupUser.map(usersToCreate =>
            usersActions.createUser(new UserModel({
                tenantId,
                firstName: usersToCreate.firstName,
                lastName: usersToCreate.lastName
            }))
        ));

        const subgroupUser = await usersActions.createUser(new UserModel({
            tenantId, firstName: app.subGroupUser.firstName, lastName: app.subGroupUser.lastName
        }));

        const group = await adminGroupsApi.createNewGroup({
            name: app.group.name,
            tenantId,
            type: 1
        });

        await Promise.all(userCreated.map((userToAddGroup: UserModel) => adminGroupsApi.addGroupMember(group.id, userToAddGroup.id)));

        const subgroups: any[] = await Promise.all(getSubGroupsName().map((name) =>
            adminGroupsApi.createNewGroup({
                name,
                tenantId,
                type: 1,
                parentGroupId: group.id
            })
        ));

        await Promise.all(subgroups.map((subgroup) => adminGroupsApi.addGroupMember(subgroup.id, subgroupUser.id)));

    }

    function getSubGroupsName() {
        return app.group.subgroup.map(subgroup => subgroup.name);
    }

    function getGroupMembers() {
        return app.groupUser.map(groupUser => `${groupUser.firstName} ${groupUser.lastName}`);
    }
});

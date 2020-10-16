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

import { ApiService, ApplicationsUtil, LoginPage, UserModel, UsersActions, Widget } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/tasks.page';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import CONSTANTS = require('../../util/constants');

describe('Typeahead widget', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();
    const widget = new Widget();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);

    let user: UserModel;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        user = await usersActions.createUser();

        await apiService.login(user.email, user.password);
        await applicationsService.importPublishDeployApp(app.file_path, { renewIdmEntries: true });
        await loginPage.login(user.email, user.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(user.tenantId);
    });

    beforeEach(async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.tasksListPage().checkTaskListIsLoaded();
    });

    it('[C307988] Type ahead form control should work for URLs', async () => {
        const name = 'typahead widget task';
        const typeaheadWidget = app.TYPE_AHEAD_WIDGET;
        await taskPage.createTask({name, formName: typeaheadWidget.formName});
        await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

        await widget.typeahedWidget().checkTypeaheadFieldIsDisplayed();
        await widget.typeahedWidget().fillTypeaheadField(typeaheadWidget.case1.searchTerm);
        await widget.typeahedWidget().checkDropDownListIsDisplayed();
        let suggestions = await widget.typeahedWidget().getDropDownList();
        await expect(suggestions.sort()).toEqual(typeaheadWidget.case1.result.sort());

        await widget.typeahedWidget().fillTypeaheadField(typeaheadWidget.case2.searchTerm);

        await widget.typeahedWidget().checkDropDownListIsDisplayed();
        suggestions = await widget.typeahedWidget().getDropDownList();
        await expect(suggestions.sort()).toEqual(typeaheadWidget.case2.result);

        await widget.typeahedWidget().selectOptionFromDropdown();
        await taskPage.taskDetails().clickCompleteFormTask();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();

        await taskPage.tasksListPage().selectRow(name);
        await widget.typeahedWidget().checkTypeaheadFieldIsDisplayed();

        await browser.sleep(1000);

        await expect(await widget.typeahedWidget().getFieldValue('1583773306434')).toBe(typeaheadWidget.case2.result[0]);
    });
});

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

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../../actions/users.actions';
import { LoginPage, Widget, ApplicationService } from '@alfresco/adf-testing';
import { TasksPage } from '../../pages/adf/process-services/tasks.page';
import { browser } from 'protractor';
import { User } from '../../models/APS/user';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import CONSTANTS = require('../../util/constants');

describe('Typeahead widget', () => {

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();
    const widget = new Widget();
    const usersActions = new UsersActions();
    const alfrescoJsApi = new AlfrescoApi({
        provider: 'BPM',
        hostBpm: browser.params.testConfig.adf_aps.host
    });

    const app = browser.params.resources.Files.WIDGET_CHECK_APP;
    let user: User;

    beforeAll(async () => {
        await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        user = await usersActions.createTenantAndUser(alfrescoJsApi);

        await alfrescoJsApi.login(user.email, user.password);
        const applicationsService = new ApplicationService(this.alfrescoJsApi);
        await applicationsService.importPublishDeployApp(app.file_path, { renewIdmEntries: true });
        await loginPage.loginToProcessServicesUsingUserModel(user);
    });

    afterAll(async () => {
        await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId);
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
        await expect(await widget.typeahedWidget().getFieldValue('1583773306434')).toBe(typeaheadWidget.case2.result[0]);
    });
});

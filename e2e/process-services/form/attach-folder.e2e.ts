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
    ApplicationsUtil,
    ContentNodeSelectorDialogPage,
    IntegrationService,
    LocalStorageUtil,
    LoginPage,
    StringUtil,
    UserModel,
    UsersActions,
    UploadActions,
    Widget,
    SearchService
} from '@alfresco/adf-testing';
import { TasksPage } from './../pages/tasks.page';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import CONSTANTS = require('../../util/constants');

describe('Attach Folder', () => {
    const app = browser.params.resources.Files.WIDGET_CHECK_APP;

    const apiService = createApiService({ provider: 'ALL' });
    const searchService = new SearchService(apiService);
    const integrationService = new IntegrationService(apiService);
    const applicationService = new ApplicationsUtil(apiService);
    const usersActions = new UsersActions(apiService);

    const loginPage = new LoginPage();
    const widget = new Widget();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();

    let user: UserModel;
    const folderName = StringUtil.generateRandomString(5);

    beforeAll(async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ALL');

        await apiService.loginWithProfile('admin');
        user = await usersActions.createUser();

        await integrationService.addCSIntegration({
            tenantId: user.tenantId,
            name: 'adf dev',
            host: browser.params.testConfig.appConfig.ecmHost
        });
        await apiService.login(user.username, user.password);
        await applicationService.importPublishDeployApp(app.file_path);
        await new UploadActions(apiService).createFolder(folderName, '-my-');
        await searchService.isSearchable(folderName);
        await loginPage.login(user.username, user.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(user.tenantId);
    });

    it('[C246534] Attach folder - ACS', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.createTask({ name: 'Attach folder', formName: app.UPLOAD_FOLDER_FORM_CS.formName });

        const contentFileWidget = widget.attachFolderWidget();
        await contentFileWidget.clickWidget(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id);

        await searchService.isSearchable(folderName);
        await contentNodeSelector.searchAndSelectResult(folderName, folderName);
        await expect(await contentNodeSelector.checkCancelButtonIsEnabled()).toBe(true);
        await expect(await contentNodeSelector.checkCopyMoveButtonIsEnabled()).toBe(true);

        await searchService.isSearchable('Meeting Notes');
        await contentNodeSelector.searchAndSelectResult('Meeting Notes', 'Meeting Notes');
        await expect(await contentNodeSelector.checkCancelButtonIsEnabled()).toBe(true);
        await expect(await contentNodeSelector.checkCopyMoveButtonIsEnabled()).toBe(false);

        await contentNodeSelector.clickCancelButton();
        await widget.attachFolderWidget().checkFolderIsNotAttached(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id, folderName);

        await contentFileWidget.clickWidget(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id);
        await contentNodeSelector.checkDialogIsDisplayed();

        await contentNodeSelector.searchAndSelectResult(folderName, folderName);
        await expect(await contentNodeSelector.checkCancelButtonIsEnabled()).toBe(true);
        await expect(await contentNodeSelector.checkCopyMoveButtonIsEnabled()).toBe(true);

        await contentNodeSelector.clickMoveCopyButton();
        await widget.attachFolderWidget().checkFolderIsAttached(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id, folderName);
        await widget.attachFolderWidget().removeFolder(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id, folderName);
        await taskPage.formFields().checkWidgetIsVisible(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id);
        await widget.attachFolderWidget().checkFolderIsNotAttached(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id, folderName);

        await contentFileWidget.clickWidget(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id);
        await contentNodeSelector.checkDialogIsDisplayed();

        await searchService.isSearchable(folderName);
        await contentNodeSelector.searchAndSelectResult(folderName, folderName);
        await contentNodeSelector.checkCancelButtonIsEnabled();
        await contentNodeSelector.checkCopyMoveButtonIsEnabled();
        await contentNodeSelector.clickMoveCopyButton();
        await taskPage.taskDetails().clickCompleteFormTask();
    });
});

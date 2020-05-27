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

import {
    ApplicationsUtil,
    ContentNodeSelectorDialogPage,
    IntegrationService,
    LoginSSOPage,
    Widget
} from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasks.page';
import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { User } from '../models/APS/user';
import CONSTANTS = require('../util/constants');

describe('Attach Folder', () => {
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ALL',
        hostEcm: browser.params.testConfig.adf_acs.host,
        hostBpm: browser.params.testConfig.adf_aps.host
    });
    const integrationService = new IntegrationService(this.alfrescoJsApi);
    const applicationService = new ApplicationsUtil(this.alfrescoJsApi);

    const users = new UsersActions();
    const loginPage = new LoginSSOPage();
    const widget = new Widget();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();

    const app = browser.params.resources.Files.WIDGET_CHECK_APP;
    const meetingNotes = 'Meeting Notes';
    const { adminEmail, adminPassword } = browser.params.testConfig.adf;
    let user: User;

    beforeAll(async () => {
        await this.alfrescoJsApi.login(adminEmail, adminPassword);
        user = await users.createTenantAndUser(this.alfrescoJsApi);

        const acsUser = { ...user, id: user.email }; delete acsUser.type; delete acsUser.tenantId;
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await integrationService.addCSIntegration({ tenantId: user.tenantId, name: 'adf dev', host: browser.params.testConfig.adf_acs.host });
        await this.alfrescoJsApi.login(user.email, user.password);
        await applicationService.importPublishDeployApp(app.file_path);
        await loginPage.login(user.email, user.password);
    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(adminEmail, adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId);
   });

    it('[C246534] Attach folder - ACS', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.createTask({ name: 'Attach folder', formName: app.UPLOAD_FOLDER_FORM_CS.formName });

        const contentFileWidget = widget.attachFolderWidget();
        await contentFileWidget.clickWidget(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id);

        await contentNodeSelector.searchAndSelectResult(user.email, user.email);
        await expect(await contentNodeSelector.checkCancelButtonIsEnabled()).toBe(true);
        await expect(await contentNodeSelector.checkCopyMoveButtonIsEnabled()).toBe(true);

        await contentNodeSelector.searchAndSelectResult(meetingNotes, meetingNotes);
        await expect(await contentNodeSelector.checkCancelButtonIsEnabled()).toBe(true);
        await expect(await contentNodeSelector.checkCopyMoveButtonIsEnabled()).toBe(false);

        await contentNodeSelector.clickCancelButton();
        await widget.attachFolderWidget().checkFolderIsNotAttached(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id, user.email);

        await contentFileWidget.clickWidget(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id);
        await contentNodeSelector.checkDialogIsDisplayed();

        await contentNodeSelector.searchAndSelectResult(user.email, user.email);
        await expect(await contentNodeSelector.checkCancelButtonIsEnabled()).toBe(true);
        await expect(await contentNodeSelector.checkCopyMoveButtonIsEnabled()).toBe(true);

        await contentNodeSelector.clickMoveCopyButton();
        await widget.attachFolderWidget().checkFolderIsAttached(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id, user.email);
        await widget.attachFolderWidget().removeFolder(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id, user.email);
        await taskPage.formFields().checkWidgetIsVisible(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id);
        await widget.attachFolderWidget().checkFolderIsNotAttached(app.UPLOAD_FOLDER_FORM_CS.FIELD.widget_id, user.email);
    });
});

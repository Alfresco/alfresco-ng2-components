/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import LoginPage = require('../pages/adf/loginPage');
import { ProcessServicesPage } from '../pages/adf/process_services/processServicesPage';
import ProcessFiltersPage = require('../pages/adf/process_services/processFiltersPage');
import FileModel = require('../models/ACS/fileModel');
import { AttachmentListPage } from '../pages/adf/process_services/attachmentListPage';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';

describe('Attachment list', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let attachmentListPage = new AttachmentListPage();
    let processFiltersPage = new ProcessFiltersPage();

    let processUserModel;
    let app = resources.Files.APP_WITH_PROCESSES;
    let pngFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name
    });
    let pdfFile = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });

    beforeAll(async(done) => {
        let users = new UsersActions();
        let apps = new AppsActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    it('[C277296] Attach a file to task app - process list', function () {
        processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();
        processFiltersPage.startProcess().selectFromProcessDropdown(app.process_se_name).clickFormStartProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList('My Default Name');
        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.checkFileIsAttached(pngFile.name);
        attachmentListPage.clickAttachFileButton(pdfFile.location);
        attachmentListPage.checkFileIsAttached(pngFile.name);
        attachmentListPage.checkFileIsAttached(pdfFile.name);
    });

    it('[C277299] Attach a file to custom app - process list', function () {
        processServicesPage.goToProcessServices().goToApp(app.title).clickProcessButton();
        processFiltersPage.startProcess().selectFromProcessDropdown(app.process_se_name).clickFormStartProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList('My Default Name');
        attachmentListPage.clickAttachFileButton(pngFile.location);
        attachmentListPage.checkFileIsAttached(pngFile.name);
        attachmentListPage.clickAttachFileButton(pdfFile.location);
        attachmentListPage.checkFileIsAttached(pngFile.name);
        attachmentListPage.checkFileIsAttached(pdfFile.name);
    });
});

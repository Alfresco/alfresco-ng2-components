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
    DropActions,
    LoginPage,
    NotificationHistoryPage,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { FileModel } from '../../models/ACS/file.model';
import { DataTablePage } from '../../core/pages/data-table.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Datatable component', () => {

    const dragAndDropDataTablePage = new DataTablePage();
    const loginPage = new LoginPage();
    const acsUser = new UserModel();
    const navigationBarPage = new NavigationBarPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const pngFile = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        await usersActions.createUser(acsUser);

        await loginPage.login(acsUser.username, acsUser.password);
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    describe('Datatable component - Drag and Drop', () => {
        beforeAll(async () => {
            await navigationBarPage.navigateToDragAndDropDatatable();
            await dragAndDropDataTablePage.dataTable.waitForTableBody();
        });

        it('[C307984] Should trigger the event handling header-drop and cell-drop', async () => {
            const dragAndDropHeader = dragAndDropDataTablePage.getDropTargetIdColumnHeader();
            await DropActions.dropFile(dragAndDropHeader, pngFile.location);
            await notificationHistoryPage.checkNotifyContains('Dropped data on [ id ] header');

            const dragAndDropCell = dragAndDropDataTablePage.getDropTargetIdColumnCell(1);
            await DropActions.dropFile(dragAndDropCell, pngFile.location);
            await notificationHistoryPage.checkNotifyContains('Dropped data on [ id ] cell');
        });
    });
});

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

import { ApiService, LoginSSOPage, UploadActions, UserModel } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { TreeViewPage } from '../pages/adf/content-services/tree-view.page';
import { browser } from 'protractor';
import { UsersActions } from '../actions/users.actions';

describe('Tree View Component', () => {

    const loginPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const treeViewPage = new TreeViewPage();

    let acsUser: UserModel;
    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    const uploadActions = new UploadActions(apiService);

    let treeFolder, secondTreeFolder, thirdTreeFolder;

    const nodeNames = {
        folder: 'Folder1',
        secondFolder: 'Folder2',
        thirdFolder: 'Folder3',
        parentFolder: '-my-',
        document: 'MyFile'
    };

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        acsUser = await usersActions.createUser();

        await apiService.getInstance().login(acsUser.email, acsUser.password);

        treeFolder = await apiService.getInstance().nodes.addNode(nodeNames.parentFolder, {
            name: nodeNames.folder,
            nodeType: 'cm:folder'
        });
        secondTreeFolder = await apiService.getInstance().nodes.addNode(nodeNames.parentFolder, {
            name: nodeNames.secondFolder,
            nodeType: 'cm:folder'
        });
        thirdTreeFolder = await apiService.getInstance().nodes.addNode(secondTreeFolder.entry.id, {
            name: nodeNames.thirdFolder,
            nodeType: 'cm:folder'
        });
        await apiService.getInstance().nodes.addNode(thirdTreeFolder.entry.id, {
            name: nodeNames.document,
            nodeType: 'cm:content'
        });

        await loginPage.login(acsUser.email, acsUser.password);

        await navigationBarPage.clickTreeViewButton();
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        await uploadActions.deleteFileOrFolder(treeFolder.entry.id);
        await uploadActions.deleteFileOrFolder(secondTreeFolder.entry.id);
    });

    it('[C289972] Should be able to show folders and sub-folders of a node as a tree view', async () => {
        await treeViewPage.checkTreeViewTitleIsDisplayed();

        await expect(await treeViewPage.getNodeId()).toEqual(nodeNames.parentFolder);

        await treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.folder);
        await treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.secondFolder);

        await treeViewPage.clickNode(nodeNames.secondFolder);

        await treeViewPage.checkClickedNodeName(nodeNames.secondFolder);
        await treeViewPage.checkNodeIsDisplayedAsOpen(nodeNames.secondFolder);
        await treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.thirdFolder);

        await treeViewPage.clickNode(nodeNames.thirdFolder);

        await treeViewPage.checkClickedNodeName(nodeNames.thirdFolder);
        await treeViewPage.checkNodeIsDisplayedAsOpen(nodeNames.thirdFolder);

        await treeViewPage.clickNode(nodeNames.secondFolder);

        await treeViewPage.checkClickedNodeName(nodeNames.secondFolder);
        await treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.secondFolder);
        await treeViewPage.checkNodeIsNotDisplayed(nodeNames.thirdFolder);
    });

    it('[C289973] Should be able to change the default nodeId', async () => {
        await treeViewPage.clearNodeIdInput();

        await treeViewPage.checkNoNodeIdMessageIsDisplayed();
        await treeViewPage.addNodeId(secondTreeFolder.entry.id);

        await treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.thirdFolder);

        await treeViewPage.addNodeId('ThisIdDoesNotExist');
        await treeViewPage.checkErrorMessageIsDisplayed();

        await treeViewPage.addNodeId(nodeNames.parentFolder);

        await treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.folder);
        await treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.secondFolder);

        await treeViewPage.clickNode(nodeNames.secondFolder);

        await treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.thirdFolder);
    });

    it('[C290071] Should not be able to display files', async () => {
        await treeViewPage.addNodeId(secondTreeFolder.entry.id);

        await treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.thirdFolder);

        await treeViewPage.clickNode(nodeNames.thirdFolder);

        await expect(await treeViewPage.getTotalNodes()).toEqual(1);
    });
});

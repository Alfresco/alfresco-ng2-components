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

var AdfLoginPage = require('./pages/adf/loginPage.js');
var ContentServicesPage = require('./pages/adf/contentServicesPage.js');

var AcsUserModel = require('./models/ACS/acsUserModel.js');
var FolderModel = require('./models/ACS/folderModel.js');

var PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');
var NodesAPI = require('./restAPI/ACS/NodesAPI.js');
var QueriesAPI = require('./restAPI/ACS/QueriesAPI.js');

var TestConfig = require('./test.config.js');
var Util = require('./util/util.js');

xdescribe('Enable infinite scrolling', () => {

    var adfLoginPage = new AdfLoginPage();
    var contentServicesPage = new ContentServicesPage();

    var acsUser = new AcsUserModel();
    var adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminEmail,
        'password': TestConfig.adf.adminPassword
    });
    var folderModel = new FolderModel({ 'name': 'folderOne' });

    var retryNumber = 30;
    var fileNames = [], nrOfFiles = 30;
    var fileNum = 0;

    var files = {
        base: 'newFile',
        extension: '.txt'
    };

    beforeAll(function (done) {
        fileNames = Util.generateSeqeunceFiles(1, nrOfFiles, files.base, files.extension);

        PeopleAPI.createUserViaAPI(adminUserModel, acsUser)
            .then(() => {
                adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
                return contentServicesPage.goToDocumentList();
            })
            .then(() => {
                return NodesAPI.uploadFolderViaAPI(acsUser, folderModel, '-my-');
            })
            .then(() => {
                return NodesAPI.createEmptyFilesViaAPI(acsUser, fileNames, folderModel.id);
            })
            .then(function (data) {
                QueriesAPI.getNodes(retryNumber, acsUser, 'term=nothing*&rootNodeId=-root-', nrOfFiles, () => {
                    done();
                });
            });

    });

    it('Enable infinite scrolling', () => {
        contentServicesPage.navigateToFolder(folderModel.name);
        contentServicesPage.enableInfiniteScrolling();
        contentServicesPage.clickLoadMoreButton();
        for (fileNum; fileNum < nrOfFiles; fileNum++) {
            contentServicesPage.checkContentIsDisplayed(fileNames[fileNum]);
        }
    });
});

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
var FileModel = require('./models/ACS/fileModel.js');
var FolderModel = require('./models/ACS/folderModel.js');

var PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');
var NodesAPI = require('./restAPI/ACS/NodesAPI.js');
var QueriesAPI = require('./restAPI/ACS/QueriesAPI.js');

var TestConfig = require('./test.config.js');
var resources = require('./util/resources.js');
var Util = require('./util/util.js');

xdescribe('Test DocumentList component', () =>{

    var adfLoginPage = new AdfLoginPage();
    var contentServicesPage = new ContentServicesPage();

    var acsUser = new AcsUserModel();
    var adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminEmail,
        'password': TestConfig.adf.adminPassword
    });
    var pdfFileModel = new FileModel({'name': resources.Files.ADF_DOCUMENTS.PDF.file_name});
    var docxFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
        'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
    });
    var testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });
    var folderOneModel = new FolderModel({'name': 'folderOne'});
    var folderTwoModel = new FolderModel({'name': 'folderTwo'});

    var retryNumber = 30;
    var rootFolder = 'APP.PERSONAL-FILES', userHomes = 'User Homes', rootFolderName = 'Personal Files';
    var fileNames = [], adminFileNames = [], nrOfFiles = 15, adminNrOfFiles = 5;

    var files = {
        base: 'newFile',
        firstFile: 'newFile14.txt',
        extension: '.txt',
    };

    var extensions = {
        pdf: 'pdf',
        docx: 'word',
        test: 'document',
    };

    beforeAll(function (done) {
        fileNames = Util.generateSeqeunceFiles(1, nrOfFiles, files.base, files.extension);
        adminFileNames = Util.generateSeqeunceFiles(nrOfFiles + 1, nrOfFiles + adminNrOfFiles, files.base, files.extension);

        PeopleAPI.createUserViaAPI(adminUserModel, acsUser)
            .then(() =>{
                adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
                return contentServicesPage.goToDocumentList();
            })
            .then(() =>{
                return protractor.promise.all([
                    NodesAPI.uploadFileViaAPI(acsUser, pdfFileModel, '-my-', false),
                    NodesAPI.uploadFileViaAPI(acsUser, docxFileModel, '-my-', false),
                    NodesAPI.uploadFileViaAPI(acsUser, testFileModel, '-my-', false),
                    NodesAPI.uploadFolderViaAPI(acsUser, folderOneModel, '-my-')
                ]);
            })
            .then(() =>{
                return protractor.promise.all([
                    NodesAPI.createEmptyFilesViaAPI(acsUser, fileNames, folderOneModel.id),
                    NodesAPI.createEmptyFilesViaAPI(adminUserModel, adminFileNames, folderOneModel.id)
                ]);
            })
            .then(function (data) {
                QueriesAPI.getNodes(retryNumber, acsUser, 'term=nothing*&rootNodeId=-root-', nrOfFiles + adminNrOfFiles, () =>{
                    done();
                });
            });

    });

    it('1. File has tooltip', () =>{
        expect(contentServicesPage.getTooltip(pdfFileModel.name)).toEqual(pdfFileModel.name);
    });

    it('2. Folder has tooltip', () =>{
        expect(contentServicesPage.getTooltip(folderOneModel.name)).toEqual(folderOneModel.name);
        expect(contentServicesPage.getBreadcrumbTooltip(rootFolderName)).toEqual(rootFolderName);
    });

    it('4. Sort content ascending by name.', () =>{
        contentServicesPage.doubleClickRow(folderOneModel.name).checkContentIsDisplayed(files.firstFile);
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(folderOneModel.name);
        expect(contentServicesPage.getCurrentFolderID()).toContain(folderOneModel.id);
        contentServicesPage.sortAndCheckListIsOrderedByName(true).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    it('5. Sort content descending by name.', () =>{
        contentServicesPage.sortAndCheckListIsOrderedByName(false).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    it('6. Sort content ascending by author.', () =>{
        contentServicesPage.sortAndCheckListIsOrderedByAuthor(true).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    it('7. Sort content descending by author.', () =>{
        contentServicesPage.sortAndCheckListIsOrderedByAuthor(false).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    it('8. Sort content ascending by created date.', () =>{
        contentServicesPage.sortAndCheckListIsOrderedByCreated(true).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    it('9. Sort content descending by created date.', () =>{
        contentServicesPage.sortAndCheckListIsOrderedByCreated(false).then(function (result) {
            expect(result).toEqual(true);
        });
    });

    it('10. File can be uploaded in a new created folder.', () =>{
        contentServicesPage.createNewFolder(folderTwoModel.name).checkContentIsDisplayed(folderTwoModel.name);
        contentServicesPage.doubleClickRow(folderTwoModel.name).checkEmptyFolderMessageIsDisplayed();
    });

    it('11. Navigate to child folder via breadcrumbs.', () =>{
        contentServicesPage.navigateToFolderViaBreadcrumbs(rootFolder);
        contentServicesPage.doubleClickEntireRow(userHomes).doubleClickEntireRow(acsUser.getId()).checkContentIsDisplayed(folderOneModel.name)
            .doubleClickRow(folderOneModel.name).checkContentIsDisplayed(folderTwoModel.name).doubleClickRow(folderTwoModel.name);
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(folderTwoModel.name);
    });

    it('12. Navigate to parent folder via breadcrumbs.', () =>{
        contentServicesPage.navigateToFolderViaBreadcrumbs(folderOneModel.name);
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(folderOneModel.name);
        expect(contentServicesPage.getCurrentFolderID()).toContain(folderOneModel.id);
        Util.refreshBrowser();
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(folderOneModel.name);
        expect(contentServicesPage.getCurrentFolderID()).toContain(folderOneModel.id);
    });

    it('13. Navigate to root folder via breadcrumbs.', () =>{
        contentServicesPage.navigateToFolderViaBreadcrumbs(rootFolder);
        expect(contentServicesPage.getActiveBreadcrumb()).toEqual(rootFolderName);
    });

    it('17. Each known extension has it s own icon.', () =>{
        contentServicesPage.doubleClickEntireRow(userHomes).doubleClickEntireRow(acsUser.getId());
        contentServicesPage.checkContentIsDisplayed(pdfFileModel.name);
        contentServicesPage.checkContentIsDisplayed(docxFileModel.name);
        contentServicesPage.checkContentIsDisplayed(testFileModel.name);
        contentServicesPage.checkIconColumn(pdfFileModel.name, extensions.pdf);
        contentServicesPage.checkIconColumn(docxFileModel.name, extensions.docx);
        contentServicesPage.checkIconColumn(testFileModel.name, extensions.test);
    });
});

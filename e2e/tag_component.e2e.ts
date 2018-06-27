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

var PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');
var NodesAPI = require('./restAPI/ACS/NodesAPI.js');

var AcsUserModel = require('./models/ACS/acsUserModel.js');
var FileModel = require('./models/ACS/fileModel.js');

var AdfLoginPage = require('./pages/adf/loginPage.js');
var TagPage = require('./pages/adf/tagPage.js');

var TestConfig = require('./test.config.js');
var resources = require('./util/resources.js');
var Util = require('./util/util.js');

xdescribe("Tag component", () => {

    var adfLoginPage = new AdfLoginPage();
    var tagPage = new TagPage();

    var acsUser = new AcsUserModel();
    var adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
    });
    var pdfFileModel = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    var sameTag = Util.generateRandomStringToLowerCase();
    var tagList = [Util.generateRandomStringToLowerCase(), Util.generateRandomStringToLowerCase()];
    var uppercaseTag = Util.generateRandomStringToUpperCase();
    var digitsTag = Util.generateRandomStringDigits();
    var nonLatinTag = Util.generateRandomStringNonLatin();

    beforeAll(function (done) {
        PeopleAPI.createUserViaAPI(adminUserModel, acsUser)
            .then(NodesAPI.uploadFileViaAPI(acsUser, pdfFileModel, '-my-', false))
            .then(adfLoginPage.loginToContentServicesUsingUserModel(acsUser))
            .then(done());
    });

    it('Tag node ID', () => {
        tagPage.goToTagPage();
        expect(tagPage.getNodeId()).toEqual('');
        expect(tagPage.getNewTagPlaceholder()).toEqual('New Tag');
        expect(tagPage.addTagButtonIsEnabled()).toEqual(false);
        tagPage.checkTagListIsEmpty();
        tagPage.checkTagListByNodeIdIsEmpty();
        expect(tagPage.addNewTagInput('a').addTagButtonIsEnabled()).toEqual(false);
        expect(tagPage.getNewTagInput()).toEqual('a');
    });

    it('New tag for specific Node ID', () => {
        tagPage.goToTagPage();
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(tagList[0]);
        tagPage.checkTagIsDisplayedInTagList(tagList[0]);
        tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[0]);
        tagPage.checkTagIsDisplayedInTagListContentServices(tagList[0]);
    });

    it('Tag name already exists', () => {
        tagPage.goToTagPage();
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(sameTag);
        tagPage.checkTagIsDisplayedInTagList(sameTag);
        tagPage.addTag(sameTag);
        expect(tagPage.getErrorMessage()).toEqual('Tag already exists');
    });

    it('Multiple tags', () => {
        tagPage.goToTagPage();
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.checkTagListIsOrderedAscending();
        tagPage.checkTagListByNodeIdIsOrderedAscending();
        tagPage.checkTagListContentServicesIsOrderedAscending();
    });

    it('Tag text field', () => {
        tagPage.goToTagPage();
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(uppercaseTag);
        tagPage.checkTagIsDisplayedInTagList(uppercaseTag.toLowerCase());
        tagPage.checkTagIsDisplayedInTagListByNodeId(uppercaseTag.toLowerCase());
        tagPage.checkTagIsDisplayedInTagListContentServices(uppercaseTag.toLowerCase());
        tagPage.checkTagIsNotDisplayedInTagList(uppercaseTag);
        tagPage.addTag(digitsTag);
        tagPage.checkTagIsDisplayedInTagList(digitsTag);
        tagPage.checkTagIsDisplayedInTagListByNodeId(digitsTag);
        tagPage.checkTagIsDisplayedInTagListContentServices(digitsTag);
        tagPage.addTag(nonLatinTag);
        tagPage.checkTagIsDisplayedInTagList(nonLatinTag);
        tagPage.checkTagIsDisplayedInTagListByNodeId(nonLatinTag);
        tagPage.checkTagIsDisplayedInTagListContentServices(nonLatinTag);
    });
});




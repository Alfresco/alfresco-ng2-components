"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var resources = require("../../util/resources");
var ContentModel = require("./contentModel");
var ContentPropertiesModel = require("./contentProperties");
var createdByModel_1 = require("./createdByModel");
var adf_testing_1 = require("@alfresco/adf-testing");
var FileModel = /** @class */ (function () {
    function FileModel(details) {
        this.id = adf_testing_1.StringUtil.generateRandomString();
        this.name = adf_testing_1.StringUtil.generateRandomString();
        this.shortName = this.name;
        this.location = resources.Files.ADF_DOCUMENTS.PDF.file_location;
        this.tooltip = this.name;
        this.version = '';
        this.firstPageText = resources.Files.ADF_DOCUMENTS.PDF.first_page_text;
        this.lastPageText = resources.Files.ADF_DOCUMENTS.PDF.last_page_text;
        this.secondPageText = resources.Files.ADF_DOCUMENTS.PDF.second_page_text;
        this.lastPageNumber = resources.Files.ADF_DOCUMENTS.PDF.last_page_number;
        this.createdAt = '';
        this.password = '';
        this.createdByUser = new createdByModel_1.CreatedByModel();
        this.modifiedByUser = new createdByModel_1.CreatedByModel();
        this.content = {};
        this.properties = {};
        Object.assign(this, details);
    }
    FileModel.prototype.getName = function () {
        return this.name;
    };
    FileModel.prototype.setVersion = function (ver) {
        this.version = '-' + ver;
    };
    FileModel.prototype.getVersionName = function () {
        var extension = this.name.split('.')[1];
        var name = this.name.split('.')[0];
        return name + this.version + '.' + extension;
    };
    FileModel.prototype.getShortName = function () {
        return this.shortName;
    };
    FileModel.prototype.getLocation = function () {
        return this.location;
    };
    FileModel.prototype.getTooltip = function () {
        return this.tooltip;
    };
    FileModel.prototype.getId = function () {
        return this.id;
    };
    FileModel.prototype.getFirstPageText = function () {
        return this.firstPageText;
    };
    FileModel.prototype.getLastPageText = function () {
        return this.lastPageText;
    };
    FileModel.prototype.getSecondPageText = function () {
        return this.secondPageText;
    };
    FileModel.prototype.getLastPageNumber = function () {
        return this.lastPageNumber;
    };
    FileModel.prototype.getCreatedByUser = function () {
        return this.createdByUser;
    };
    FileModel.prototype.getModifiedByUser = function () {
        return this.modifiedByUser;
    };
    FileModel.prototype.getContent = function () {
        return this.content;
    };
    FileModel.prototype.getProperties = function () {
        return this.properties;
    };
    FileModel.prototype.update = function (details) {
        Object.assign(this, {
            createdByUser: new createdByModel_1.CreatedByModel(details.createdByUser),
            modifiedByUser: new createdByModel_1.CreatedByModel(details.modifiedByUser),
            content: new ContentModel(details.content),
            properties: new ContentPropertiesModel(details.properties)
        });
    };
    return FileModel;
}());
exports.FileModel = FileModel;
//# sourceMappingURL=fileModel.js.map
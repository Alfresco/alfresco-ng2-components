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

var Util = require('../../util/util');
var resources = require('../../util/resources');
var CreatedByModel = require('./createdByModel');
var ContentModel = require('./contentModel');
var ContentPropertiesModel = require('./contentProperties');

var FileModel = function (details) {

    this.id = Util.generateRandomString();
    this.name = Util.generateRandomString();
    this.shortName = this.name;
    this.location = resources.Files.ADF_DOCUMENTS.PDF.file_location;
    this.tooltip = this.name;
    this.version = "";
    this.firstPageText = resources.Files.ADF_DOCUMENTS.PDF.first_page_text;
    this.lastPageText = resources.Files.ADF_DOCUMENTS.PDF.last_page_text;
    this.secondPageText = resources.Files.ADF_DOCUMENTS.PDF.second_page_text;
    this.lastPageNumber = resources.Files.ADF_DOCUMENTS.PDF.last_page_number;
    this.createdAt = "";
    this.createdByUser = {};
    this.modifiedByUser = {};
    this.content = {};
    this.properties = {};

    this.getName = function () {
        return this.name;
    };

    this.setVersion = function (ver) {
        this.version = "-" + ver;
    };

    this.getVersionName = function () {
        var extension = this.name.split(".")[1];
        var name = this.name.split(".")[0];
        return name + this.version + "." + extension;
    };

    this.getShortName = function () {
        return this.shortName;
    };

    this.getLocation = function () {
        return this.location;
    };

    this.getTooltip = function () {
        return this.tooltip;
    };

    this.getId = function () {
        return this.id;
    };

    this.getFirstPageText = function () {
        return this.firstPageText;
    };

    this.getLastPageText = function () {
        return this.lastPageText;
    };

    this.getSecondPageText = function () {
        return this.secondPageText;
    };

    this.getLastPageNumber = function () {
        return this.lastPageNumber;
    };

    this.getCreatedByUser = function () {
        return this.createdByUser;
    };

    this.getModifiedByUser = function () {
        return this.modifiedByUser;
    };

    this.getContent = function () {
        return this.content;
    };

    this.getProperties = function () {
        return this.properties;
    };

    this.update = function(details) {
        Object.assign(this, {
            createdByUser: new CreatedByModel(details.createdByUser),
            modifiedByUser: new CreatedByModel(details.modifiedByUser),
            content: new ContentModel(details.content),
            properties: new ContentPropertiesModel(details.properties)
        })
    }

    Object.assign(this, details);

};
module.exports = FileModel;

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

import { browser } from 'protractor';
import ContentModel = require('./contentModel');
import ContentPropertiesModel = require('./contentProperties');
import { CreatedByModel } from './created-by-model';
import { StringUtil } from '@alfresco/adf-testing';

export class FileModel {

    id = StringUtil.generateRandomString();
    name = StringUtil.generateRandomString();
    shortName = this.name;
    location = browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path;
    tooltip = this.name;
    version = '';
    firstPageText = browser.params.resources.Files.ADF_DOCUMENTS.PDF.first_page_text;
    lastPageText = browser.params.resources.Files.ADF_DOCUMENTS.PDF.last_page_text;
    secondPageText = browser.params.resources.Files.ADF_DOCUMENTS.PDF.second_page_text;
    lastPageNumber = browser.params.resources.Files.ADF_DOCUMENTS.PDF.last_page_number;
    createdAt = '';
    password = '';
    createdByUser = new CreatedByModel();
    modifiedByUser = new CreatedByModel();
    content: ContentModel = {};
    properties: ContentPropertiesModel = {};

    constructor(details?: any) {
        Object.assign(this, details);
    }

    getName() {
        return this.name;
    }

    setVersion(ver) {
        this.version = '-' + ver;
    }

    getVersionName() {
        const extension = this.name.split('.')[1];
        const name = this.name.split('.')[0];
        return name + this.version + '.' + extension;
    }

    getShortName() {
        return this.shortName;
    }

    getLocation() {
        return this.location;
    }

    getTooltip() {
        return this.tooltip;
    }

    getId() {
        return this.id;
    }

    getFirstPageText() {
        return this.firstPageText;
    }

    getLastPageText() {
        return this.lastPageText;
    }

    getSecondPageText() {
        return this.secondPageText;
    }

    getLastPageNumber() {
        return this.lastPageNumber;
    }

    getCreatedByUser(): CreatedByModel {
        return this.createdByUser;
    }

    getModifiedByUser(): CreatedByModel {
        return this.modifiedByUser;
    }

    getContent(): ContentModel {
        return this.content;
    }

    getProperties(): ContentPropertiesModel {
        return this.properties;
    }

    update(details) {
        Object.assign(this, {
            createdByUser: new CreatedByModel(details.createdByUser),
            modifiedByUser: new CreatedByModel(details.modifiedByUser),
            content: new ContentModel(details.content),
            properties: new ContentPropertiesModel(details.properties)
        });
    }
}

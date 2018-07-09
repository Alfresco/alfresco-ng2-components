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

var ProcessCreatedByModel = require('./ProcessCreatedByModel');

var ProcessModel = function (details) {

    this.id;
    this.name;
    this.version;
    this.modelType;
    this.description;
    this.createdByFullName;
    this.createdBy;
    this.lastUpdatedByFullName;
    this.lastUpdatedBy;
    this.lastUpdated;
    this.startedBy = {};

    this.getName = function () {
        return this.name;
    };

    this.getId = function () {
        return this.id;
    };

    this.getVersion = function () {
        return this.version;
    };

    this.getModelType = function () {
        return this.modelType;
    };

    this.getDescription = function () {
        return this.description;
    };

    this.getCreatedByFullName = function () {
        return this.createdByFullName;
    };

    this.getCreatedBy = function () {
        return this.createdBy;
    };

    this.getLastUpdatedByFullName = function () {
        return this.lastUpdatedByFullName;
    };

    this.getLastUpdatedBy = function () {
        return this.lastUpdatedBy;
    };

    this.getLastUpdated = function () {
        return this.lastUpdated;
    };

    this.getStartedBy = function () {
        return this.startedBy;
    };

    Object.assign(this, details);
    Object.assign(this.startedBy, new ProcessCreatedByModel(details.startedBy));


};
module.exports = ProcessModel;

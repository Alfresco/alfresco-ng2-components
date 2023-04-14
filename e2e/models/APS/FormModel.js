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

var FormModel = function (details) {

    this.id;
    this.name;
    this.description;
    this.modelId;
    this.appDefinitionId;
    this.appDeploymentId;
    this.tenantId;

    this.getName = function () {
        return this.name;
    };

    this.getId = function () {
        return this.id;
    };

    this.getDescription = function () {
        return this.description;
    };

    this.getModelId = function () {
        return this.modelId;
    };

    this.getAppDefinitionId = function () {
        return this.appDefinitionId;
    };

    this.getAppDeploymentId = function () {
        return this.appDeploymentId;
    };

    this.getTenantId = function () {
        return this.tenantId;
    };

    Object.assign(this, details);
};
module.exports = FormModel;

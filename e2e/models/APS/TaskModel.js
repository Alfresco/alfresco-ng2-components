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

var TaskAssigneeModel = require('./TaskAssigneeModel');

var TaskModel = function (details) {

    this.id;
    this.name;
    this.description;
    this.category;
    this.created;
    this.dueDate;
    this.priority;
    this.parentTaskName;
    this.parentTaskId;
    this.formKey;
    this.duration;
    this.endDate;
    this.assignee = {};

    this.getName = function () {
        return this.name;
    };

    this.getId = function () {
        return this.id;
    };

    this.getDescription = function () {
        return this.description;
    };

    this.getCategory = function () {
        return this.category;
    };

    this.getCreated = function () {
        return this.created;
    };

    this.getDueDate = function () {
        return this.dueDate;
    };

    this.getPriority = function () {
        return this.priority;
    };

    this.getDuration = function () {
        return this.duration;
    };

    this.getEndDate = function () {
        return this.endDate;
    };

    this.getParentTaskName = function () {
        return this.parentTaskName;
    };

    this.getParentTaskId = function () {
        return this.parentTaskId;
    };

    this.getFormKey = function () {
        return this.formKey;
    };

    this.getAssignee = function () {
        return this.assignee;
    };

    Object.assign(this, details);
    Object.assign(this.assignee, new TaskAssigneeModel(details.assignee));
};
module.exports = TaskModel;

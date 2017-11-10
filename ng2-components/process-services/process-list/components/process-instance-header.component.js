"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@adf/core");
var core_2 = require("@angular/core");
var ProcessInstanceHeaderComponent = (function () {
    function ProcessInstanceHeaderComponent() {
    }
    ProcessInstanceHeaderComponent.prototype.ngOnChanges = function (changes) {
        this.refreshData();
    };
    ProcessInstanceHeaderComponent.prototype.refreshData = function () {
        if (this.processInstance) {
            this.properties = [
                new core_1.CardViewTextItemModel({
                    label: 'ADF_PROCESS_LIST.PROPERTIES.STATUS',
                    value: this.getProcessStatus(),
                    key: 'status'
                }),
                new core_1.CardViewDateItemModel({
                    label: 'ADF_PROCESS_LIST.PROPERTIES.DUE_DATE',
                    value: this.processInstance.ended,
                    format: 'MMM DD YYYY',
                    key: 'dueDate',
                    default: 'ADF_PROCESS_LIST.PROPERTIES.DUE_DATE_DEFAULT'
                }),
                new core_1.CardViewTextItemModel({
                    label: 'ADF_PROCESS_LIST.PROPERTIES.CATEGORY',
                    value: this.processInstance.processDefinitionCategory,
                    key: 'category',
                    default: 'ADF_PROCESS_LIST.PROPERTIES.CATEGORY_DEFAULT'
                }),
                new core_1.CardViewTextItemModel({
                    label: 'ADF_PROCESS_LIST.PROPERTIES.BUSINESS_KEY',
                    value: this.processInstance.businessKey,
                    key: 'businessKey',
                    default: 'ADF_PROCESS_LIST.PROPERTIES.BUSINESS_KEY_DEFAULT'
                }),
                new core_1.CardViewTextItemModel({
                    label: 'ADF_PROCESS_LIST.PROPERTIES.CREATED_BY',
                    value: this.getStartedByFullName(),
                    key: 'assignee',
                    default: 'ADF_PROCESS_LIST.PROPERTIES.CREATED_BY_DEFAULT'
                }),
                new core_1.CardViewDateItemModel({
                    label: 'ADF_PROCESS_LIST.PROPERTIES.CREATED',
                    value: this.processInstance.started,
                    format: 'MMM DD YYYY',
                    key: 'created'
                }),
                new core_1.CardViewTextItemModel({ label: 'ADF_PROCESS_LIST.PROPERTIES.ID',
                    value: this.processInstance.id,
                    key: 'id'
                }),
                new core_1.CardViewTextItemModel({ label: 'ADF_PROCESS_LIST.PROPERTIES.DESCRIPTION',
                    value: this.processInstance.processDefinitionDescription,
                    key: 'description',
                    default: 'ADF_PROCESS_LIST.PROPERTIES.DESCRIPTION_DEFAULT'
                })
            ];
        }
    };
    ProcessInstanceHeaderComponent.prototype.getProcessStatus = function () {
        if (this.processInstance) {
            return this.isRunning() ? 'Running' : 'Completed';
        }
    };
    ProcessInstanceHeaderComponent.prototype.getStartedByFullName = function () {
        var fullName = '';
        if (this.processInstance && this.processInstance.startedBy) {
            fullName += this.processInstance.startedBy.firstName || '';
            fullName += fullName ? ' ' : '';
            fullName += this.processInstance.startedBy.lastName || '';
        }
        return fullName;
    };
    ProcessInstanceHeaderComponent.prototype.isRunning = function () {
        return this.processInstance && !this.processInstance.ended;
    };
    __decorate([
        core_2.Input()
    ], ProcessInstanceHeaderComponent.prototype, "processInstance", void 0);
    ProcessInstanceHeaderComponent = __decorate([
        core_2.Component({
            selector: 'adf-process-instance-header',
            templateUrl: './process-instance-header.component.html',
            styleUrls: ['./process-instance-header.component.css']
        })
    ], ProcessInstanceHeaderComponent);
    return ProcessInstanceHeaderComponent;
}());
exports.ProcessInstanceHeaderComponent = ProcessInstanceHeaderComponent;

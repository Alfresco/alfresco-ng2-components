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
var core_1 = require("@angular/core");
var form_1 = require("../../form");
var process_definition_model_1 = require("./../models/process-definition.model");
var StartProcessInstanceComponent = (function () {
    function StartProcessInstanceComponent(activitiProcess) {
        this.activitiProcess = activitiProcess;
        this.start = new core_1.EventEmitter();
        this.cancel = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.processDefinitions = [];
        this.currentProcessDef = new process_definition_model_1.ProcessDefinitionRepresentation();
        this.errorMessageId = '';
    }
    StartProcessInstanceComponent.prototype.ngOnChanges = function (changes) {
        var appIdChange = changes['appId'];
        var appId = appIdChange ? appIdChange.currentValue : null;
        this.load(appId);
    };
    StartProcessInstanceComponent.prototype.load = function (appId) {
        var _this = this;
        this.resetSelectedProcessDefinition();
        this.resetErrorMessage();
        this.activitiProcess.getProcessDefinitions(appId).subscribe(function (res) {
            _this.processDefinitions = res;
        }, function () {
            _this.errorMessageId = 'ADF_PROCESS_LIST.START_PROCESS.ERROR.LOAD_PROCESS_DEFS';
        });
    };
    StartProcessInstanceComponent.prototype.startProcess = function (outcome) {
        var _this = this;
        if (this.currentProcessDef.id && this.name) {
            this.resetErrorMessage();
            var formValues = this.startForm ? this.startForm.form.values : undefined;
            this.activitiProcess.startProcess(this.currentProcessDef.id, this.name, outcome, formValues, this.variables).subscribe(function (res) {
                _this.name = '';
                _this.start.emit(res);
            }, function (err) {
                _this.errorMessageId = 'ADF_PROCESS_LIST.START_PROCESS.ERROR.START';
                _this.error.error(err);
            });
        }
    };
    StartProcessInstanceComponent.prototype.onProcessDefChange = function (processDefinitionId) {
        var processDef = this.processDefinitions.find(function (processDefinition) {
            return processDefinition.id === processDefinitionId;
        });
        if (processDef) {
            this.currentProcessDef = JSON.parse(JSON.stringify(processDef));
        }
        else {
            this.resetSelectedProcessDefinition();
        }
    };
    StartProcessInstanceComponent.prototype.cancelStartProcess = function () {
        this.cancel.emit();
    };
    StartProcessInstanceComponent.prototype.hasStartForm = function () {
        return this.currentProcessDef && this.currentProcessDef.hasStartForm;
    };
    StartProcessInstanceComponent.prototype.isProcessDefinitionEmpty = function () {
        return this.processDefinitions ? (this.processDefinitions.length > 0 || this.errorMessageId) : this.errorMessageId;
    };
    StartProcessInstanceComponent.prototype.isStartFormMissingOrValid = function () {
        if (this.startForm) {
            return this.startForm.form && this.startForm.form.isValid;
        }
        else {
            return true;
        }
    };
    StartProcessInstanceComponent.prototype.validateForm = function () {
        return this.currentProcessDef.id && this.name && this.isStartFormMissingOrValid();
    };
    StartProcessInstanceComponent.prototype.resetSelectedProcessDefinition = function () {
        this.currentProcessDef = new process_definition_model_1.ProcessDefinitionRepresentation();
    };
    StartProcessInstanceComponent.prototype.resetErrorMessage = function () {
        this.errorMessageId = '';
    };
    StartProcessInstanceComponent.prototype.hasErrorMessage = function () {
        return this.processDefinitions.length === 0 && !this.errorMessageId;
    };
    StartProcessInstanceComponent.prototype.onOutcomeClick = function (outcome) {
        this.startProcess(outcome);
    };
    StartProcessInstanceComponent.prototype.reset = function () {
        this.resetSelectedProcessDefinition();
        this.name = '';
        if (this.startForm) {
            this.startForm.data = {};
        }
        this.resetErrorMessage();
    };
    StartProcessInstanceComponent.prototype.hasProcessName = function () {
        return this.name ? true : false;
    };
    __decorate([
        core_1.Input()
    ], StartProcessInstanceComponent.prototype, "appId", void 0);
    __decorate([
        core_1.Input()
    ], StartProcessInstanceComponent.prototype, "variables", void 0);
    __decorate([
        core_1.Output()
    ], StartProcessInstanceComponent.prototype, "start", void 0);
    __decorate([
        core_1.Output()
    ], StartProcessInstanceComponent.prototype, "cancel", void 0);
    __decorate([
        core_1.Output()
    ], StartProcessInstanceComponent.prototype, "error", void 0);
    __decorate([
        core_1.ViewChild(form_1.StartFormComponent)
    ], StartProcessInstanceComponent.prototype, "startForm", void 0);
    StartProcessInstanceComponent = __decorate([
        core_1.Component({
            selector: 'adf-start-process',
            templateUrl: './start-process.component.html',
            styleUrls: ['./start-process.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], StartProcessInstanceComponent);
    return StartProcessInstanceComponent;
}());
exports.StartProcessInstanceComponent = StartProcessInstanceComponent;

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
/**
 * <adf-webscript-get [scriptPath]="string"
 *                         [scriptArgs]="Object"
 *                         [contextRoot]="string"
 *                         [servicePath]="string"
 *                         [contentType]="JSON|HTML|DATATABLE"
 *                         (success)="customMethod($event)>
 * </adf-webscript-get>
 *
 * This component, provide a get webscript viewer
 *
 * @InputParam {string} scriptPath path to Web Script (as defined by Web Script)
 * @InputParam {Object} scriptArgs arguments to pass to Web Script
 * @InputParam {string} contextRoot path where application is deployed default value 'alfresco'
 * @InputParam {string} servicePath path where Web Script service is mapped default value 'service'
 * @InputParam {string} contentType JSON | HTML | DATATABLE | TEXT
 *
 * @Output - success - The event is emitted when the data are recived
 *
 * @returns {WebscriptComponent} .
 */
var WebscriptComponent = (function () {
    function WebscriptComponent(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
        this.showData = true;
        this.contextRoot = 'alfresco';
        this.servicePath = 'service';
        this.contentType = 'TEXT';
        this.success = new core_2.EventEmitter();
        this.data = undefined;
        this.showError = false;
    }
    WebscriptComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.showData) {
            this.clean();
        }
        return new Promise(function (resolve, reject) {
            _this.apiService.getInstance().webScript.executeWebScript('GET', _this.scriptPath, _this.scriptArgs, _this.contextRoot, _this.servicePath).then(function (webScriptdata) {
                _this.data = webScriptdata;
                if (_this.showData) {
                    if (_this.contentType === 'DATATABLE') {
                        _this.data = _this.showDataAsDataTable(webScriptdata);
                    }
                }
                _this.success.emit(_this.data);
                resolve();
            }, function (error) {
                _this.logService.log('Error' + error);
                reject();
            });
        });
    };
    /**
     * show the data in a ng2-alfresco-datatable
     *
     * @param data
     *
     * @retutns the data as datatable
     */
    WebscriptComponent.prototype.showDataAsDataTable = function (data) {
        var datatableData = null;
        try {
            if (!data.schema) {
                data.schema = core_1.ObjectDataTableAdapter.generateSchema(data.data);
            }
            if (data.schema && data.schema.length > 0) {
                this.data = new core_1.ObjectDataTableAdapter(data.data, data.schema);
            }
        }
        catch (e) {
            this.logService.error('error during the cast as datatable');
        }
        return datatableData;
    };
    WebscriptComponent.prototype.clean = function () {
        this.data = undefined;
    };
    WebscriptComponent.prototype.isDataTableContent = function () {
        return this.contentType === 'DATATABLE';
    };
    __decorate([
        core_2.Input()
    ], WebscriptComponent.prototype, "scriptPath", void 0);
    __decorate([
        core_2.Input()
    ], WebscriptComponent.prototype, "scriptArgs", void 0);
    __decorate([
        core_2.Input()
    ], WebscriptComponent.prototype, "showData", void 0);
    __decorate([
        core_2.Input()
    ], WebscriptComponent.prototype, "contextRoot", void 0);
    __decorate([
        core_2.Input()
    ], WebscriptComponent.prototype, "servicePath", void 0);
    __decorate([
        core_2.Input()
    ], WebscriptComponent.prototype, "contentType", void 0);
    __decorate([
        core_2.Output()
    ], WebscriptComponent.prototype, "success", void 0);
    WebscriptComponent = __decorate([
        core_2.Component({
            selector: 'adf-webscript-get',
            templateUrl: 'webscript.component.html'
        })
    ], WebscriptComponent);
    return WebscriptComponent;
}());
exports.WebscriptComponent = WebscriptComponent;

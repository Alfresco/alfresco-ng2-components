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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var log_service_1 = require("../../services/log.service");
var alfresco_api_service_1 = require("../../services/alfresco-api.service");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var EcmModelService = /** @class */ (function () {
    function EcmModelService(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
    }
    EcmModelService_1 = EcmModelService;
    EcmModelService.prototype.createEcmTypeForActivitiForm = function (formName, form) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.searchActivitiEcmModel().subscribe(function (model) {
                if (!model) {
                    _this.createActivitiEcmModel(formName, form).subscribe(function (typeForm) {
                        observer.next(typeForm);
                        observer.complete();
                    });
                }
                else {
                    _this.saveFomType(formName, form).subscribe(function (typeForm) {
                        observer.next(typeForm);
                        observer.complete();
                    });
                }
            }, function (err) { return _this.handleError(err); });
        });
    };
    EcmModelService.prototype.searchActivitiEcmModel = function () {
        return this.getEcmModels().pipe(operators_1.map(function (ecmModels) {
            return ecmModels.list.entries.find(function (model) { return model.entry.name === EcmModelService_1.MODEL_NAME; });
        }));
    };
    EcmModelService.prototype.createActivitiEcmModel = function (formName, form) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.createEcmModel(EcmModelService_1.MODEL_NAME, EcmModelService_1.MODEL_NAMESPACE).subscribe(function (model) {
                _this.logService.info('model created', model);
                _this.activeEcmModel(EcmModelService_1.MODEL_NAME).subscribe(function (modelActive) {
                    _this.logService.info('model active', modelActive);
                    _this.createEcmTypeWithProperties(formName, form).subscribe(function (typeCreated) {
                        observer.next(typeCreated);
                        observer.complete();
                    });
                }, function (err) { return _this.handleError(err); });
            }, function (err) { return _this.handleError(err); });
        });
    };
    EcmModelService.prototype.saveFomType = function (formName, form) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.searchEcmType(formName, EcmModelService_1.MODEL_NAME).subscribe(function (ecmType) {
                _this.logService.info('custom types', ecmType);
                if (!ecmType) {
                    _this.createEcmTypeWithProperties(formName, form).subscribe(function (typeCreated) {
                        observer.next(typeCreated);
                        observer.complete();
                    });
                }
                else {
                    observer.next(ecmType);
                    observer.complete();
                }
            }, function (err) { return _this.handleError(err); });
        });
    };
    EcmModelService.prototype.createEcmTypeWithProperties = function (formName, form) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.createEcmType(formName, EcmModelService_1.MODEL_NAME, EcmModelService_1.TYPE_MODEL).subscribe(function (typeCreated) {
                _this.logService.info('type Created', typeCreated);
                _this.addPropertyToAType(EcmModelService_1.MODEL_NAME, formName, form).subscribe(function (propertyAdded) {
                    _this.logService.info('property Added', propertyAdded);
                    observer.next(typeCreated);
                    observer.complete();
                }, function (err) { return _this.handleError(err); });
            }, function (err) { return _this.handleError(err); });
        });
    };
    EcmModelService.prototype.searchEcmType = function (typeName, modelName) {
        return this.getEcmType(modelName).pipe(operators_1.map(function (customTypes) {
            return customTypes.list.entries.find(function (type) { return type.entry.prefixedName === typeName || type.entry.title === typeName; });
        }));
    };
    EcmModelService.prototype.activeEcmModel = function (modelName) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().core.customModelApi.activateCustomModel(modelName))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    EcmModelService.prototype.createEcmModel = function (modelName, nameSpace) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().core.customModelApi.createCustomModel('DRAFT', '', modelName, modelName, nameSpace))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    EcmModelService.prototype.getEcmModels = function () {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().core.customModelApi.getAllCustomModel())
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    EcmModelService.prototype.getEcmType = function (modelName) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().core.customModelApi.getAllCustomType(modelName))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    EcmModelService.prototype.createEcmType = function (typeName, modelName, parentType) {
        var _this = this;
        var name = this.cleanNameType(typeName);
        return rxjs_1.from(this.apiService.getInstance().core.customModelApi.createCustomType(modelName, name, parentType, typeName, ''))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    EcmModelService.prototype.addPropertyToAType = function (modelName, typeName, formFields) {
        var _this = this;
        var name = this.cleanNameType(typeName);
        var properties = [];
        if (formFields && formFields.values) {
            for (var key in formFields.values) {
                if (key) {
                    properties.push({
                        name: key,
                        title: key,
                        description: key,
                        dataType: 'd:text',
                        multiValued: false,
                        mandatory: false,
                        mandatoryEnforced: false
                    });
                }
            }
        }
        return rxjs_1.from(this.apiService.getInstance().core.customModelApi.addPropertyToType(modelName, name, properties))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    EcmModelService.prototype.cleanNameType = function (name) {
        var cleanName = name;
        if (name.indexOf(':') !== -1) {
            cleanName = name.split(':')[1];
        }
        return cleanName.replace(/[^a-zA-Z ]/g, '');
    };
    EcmModelService.prototype.toJson = function (res) {
        if (res) {
            return res || {};
        }
        return {};
    };
    EcmModelService.prototype.handleError = function (err) {
        this.logService.error(err);
    };
    var EcmModelService_1;
    EcmModelService.MODEL_NAMESPACE = 'activitiForms';
    EcmModelService.MODEL_NAME = 'activitiFormsModel';
    EcmModelService.TYPE_MODEL = 'cm:folder';
    EcmModelService = EcmModelService_1 = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            log_service_1.LogService])
    ], EcmModelService);
    return EcmModelService;
}());
exports.EcmModelService = EcmModelService;
//# sourceMappingURL=ecm-model.service.js.map
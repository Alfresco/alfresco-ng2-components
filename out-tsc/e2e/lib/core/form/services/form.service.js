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
var alfresco_api_service_1 = require("../../services/alfresco-api.service");
var log_service_1 = require("../../services/log.service");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var form_definition_model_1 = require("../models/form-definition.model");
var index_1 = require("./../components/widgets/core/index");
var ecm_model_service_1 = require("./ecm-model.service");
var operators_1 = require("rxjs/operators");
var FormService = /** @class */ (function () {
    function FormService(ecmModelService, apiService, logService) {
        this.ecmModelService = ecmModelService;
        this.apiService = apiService;
        this.logService = logService;
        this.formLoaded = new rxjs_1.Subject();
        this.formDataRefreshed = new rxjs_1.Subject();
        this.formFieldValueChanged = new rxjs_1.Subject();
        this.formEvents = new rxjs_1.Subject();
        this.taskCompleted = new rxjs_1.Subject();
        this.taskCompletedError = new rxjs_1.Subject();
        this.taskSaved = new rxjs_1.Subject();
        this.taskSavedError = new rxjs_1.Subject();
        this.formContentClicked = new rxjs_1.Subject();
        this.validateForm = new rxjs_1.Subject();
        this.validateFormField = new rxjs_1.Subject();
        this.validateDynamicTableRow = new rxjs_1.Subject();
        this.executeOutcome = new rxjs_1.Subject();
    }
    FormService_1 = FormService;
    Object.defineProperty(FormService.prototype, "taskApi", {
        get: function () {
            return this.apiService.getInstance().activiti.taskApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "modelsApi", {
        get: function () {
            return this.apiService.getInstance().activiti.modelsApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "editorApi", {
        get: function () {
            return this.apiService.getInstance().activiti.editorApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "processApi", {
        get: function () {
            return this.apiService.getInstance().activiti.processApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "processInstanceVariablesApi", {
        get: function () {
            return this.apiService.getInstance().activiti.processInstanceVariablesApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "usersWorkflowApi", {
        get: function () {
            return this.apiService.getInstance().activiti.usersWorkflowApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormService.prototype, "groupsApi", {
        get: function () {
            return this.apiService.getInstance().activiti.groupsApi;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Parses JSON data to create a corresponding Form model.
     * @param json JSON to create the form
     * @param data Values for the form fields
     * @param readOnly Should the form fields be read-only?
     * @returns Form model created from input data
     */
    FormService.prototype.parseForm = function (json, data, readOnly) {
        if (readOnly === void 0) { readOnly = false; }
        if (json) {
            var form = new index_1.FormModel(json, data, readOnly, this);
            if (!json.fields) {
                form.outcomes = [
                    new index_1.FormOutcomeModel(form, {
                        id: '$save',
                        name: index_1.FormOutcomeModel.SAVE_ACTION,
                        isSystem: true
                    })
                ];
            }
            return form;
        }
        return null;
    };
    /**
     * Creates a Form with a field for each metadata property.
     * @param formName Name of the new form
     * @returns The new form
     */
    FormService.prototype.createFormFromANode = function (formName) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.createForm(formName).subscribe(function (form) {
                _this.ecmModelService.searchEcmType(formName, ecm_model_service_1.EcmModelService.MODEL_NAME).subscribe(function (customType) {
                    var formDefinitionModel = new form_definition_model_1.FormDefinitionModel(form.id, form.name, form.lastUpdatedByFullName, form.lastUpdated, customType.entry.properties);
                    rxjs_1.from(_this.editorApi.saveForm(form.id, formDefinitionModel)).subscribe(function (formData) {
                        observer.next(formData);
                        observer.complete();
                    }, function (err) { return _this.handleError(err); });
                }, function (err) { return _this.handleError(err); });
            }, function (err) { return _this.handleError(err); });
        });
    };
    /**
     * Create a Form.
     * @param formName Name of the new form
     * @returns The new form
     */
    FormService.prototype.createForm = function (formName) {
        var dataModel = {
            name: formName,
            description: '',
            modelType: 2,
            stencilSet: 0
        };
        return rxjs_1.from(this.modelsApi.createModel(dataModel));
    };
    /**
     * Saves a form.
     * @param formId ID of the form to save
     * @param formModel Model data for the form
     * @returns Data for the saved form
     */
    FormService.prototype.saveForm = function (formId, formModel) {
        return rxjs_1.from(this.editorApi.saveForm(formId, formModel));
    };
    /**
     * Searches for a form by name.
     * @param name The form name to search for
     * @returns Form model(s) matching the search name
     */
    FormService.prototype.searchFrom = function (name) {
        var _this = this;
        var opts = {
            'modelType': 2
        };
        return rxjs_1.from(this.modelsApi.getModels(opts))
            .pipe(operators_1.map(function (forms) {
            return forms.data.find(function (formData) { return formData.name === name; });
        }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets all the forms.
     * @returns List of form models
     */
    FormService.prototype.getForms = function () {
        var _this = this;
        var opts = {
            'modelType': 2
        };
        return rxjs_1.from(this.modelsApi.getModels(opts))
            .pipe(operators_1.map(this.toJsonArray), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets process definitions.
     * @returns List of process definitions
     */
    FormService.prototype.getProcessDefinitions = function () {
        var _this = this;
        return rxjs_1.from(this.processApi.getProcessDefinitions({}))
            .pipe(operators_1.map(this.toJsonArray), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets instance variables for a process.
     * @param processInstanceId ID of the target process
     * @returns List of instance variable information
     */
    FormService.prototype.getProcessVariablesById = function (processInstanceId) {
        var _this = this;
        return rxjs_1.from(this.processInstanceVariablesApi.getProcessInstanceVariables(processInstanceId))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets all the tasks.
     * @returns List of tasks
     */
    FormService.prototype.getTasks = function () {
        var _this = this;
        return rxjs_1.from(this.taskApi.listTasks({}))
            .pipe(operators_1.map(this.toJsonArray), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets a task.
     * @param taskId Task Id
     * @returns Task info
     */
    FormService.prototype.getTask = function (taskId) {
        var _this = this;
        return rxjs_1.from(this.taskApi.getTask(taskId))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Saves a task form.
     * @param taskId Task Id
     * @param formValues Form Values
     * @returns Null response when the operation is complete
     */
    FormService.prototype.saveTaskForm = function (taskId, formValues) {
        var _this = this;
        var saveFormRepresentation = { values: formValues };
        return rxjs_1.from(this.taskApi.saveTaskForm(taskId, saveFormRepresentation))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Completes a Task Form.
     * @param taskId Task Id
     * @param formValues Form Values
     * @param outcome Form Outcome
     * @returns Null response when the operation is complete
     */
    FormService.prototype.completeTaskForm = function (taskId, formValues, outcome) {
        var _this = this;
        var completeFormRepresentation = { values: formValues };
        if (outcome) {
            completeFormRepresentation.outcome = outcome;
        }
        return rxjs_1.from(this.taskApi.completeTaskForm(taskId, completeFormRepresentation))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets a form related to a task.
     * @param taskId ID of the target task
     * @returns Form definition
     */
    FormService.prototype.getTaskForm = function (taskId) {
        var _this = this;
        return rxjs_1.from(this.taskApi.getTaskForm(taskId))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets a form definition.
     * @param formId ID of the target form
     * @returns Form definition
     */
    FormService.prototype.getFormDefinitionById = function (formId) {
        var _this = this;
        return rxjs_1.from(this.editorApi.getForm(formId))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets the form definition with a given name.
     * @param name The form name
     * @returns Form definition
     */
    FormService.prototype.getFormDefinitionByName = function (name) {
        var _this = this;
        var opts = {
            'filter': 'myReusableForms',
            'filterText': name,
            'modelType': 2
        };
        return rxjs_1.from(this.modelsApi.getModels(opts))
            .pipe(operators_1.map(this.getFormId), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets the start form instance for a given process.
     * @param processId Process definition ID
     * @returns Form definition
     */
    FormService.prototype.getStartFormInstance = function (processId) {
        var _this = this;
        return rxjs_1.from(this.processApi.getProcessInstanceStartForm(processId))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets a process instance.
     * @param processId ID of the process to get
     * @returns Process instance
     */
    FormService.prototype.getProcessInstance = function (processId) {
        var _this = this;
        return rxjs_1.from(this.processApi.getProcessInstance(processId))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets the start form definition for a given process.
     * @param processId Process definition ID
     * @returns Form definition
     */
    FormService.prototype.getStartFormDefinition = function (processId) {
        var _this = this;
        return rxjs_1.from(this.processApi.getProcessDefinitionStartForm(processId))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets values of fields populated by a REST backend.
     * @param taskId Task identifier
     * @param field Field identifier
     * @returns Field values
     */
    FormService.prototype.getRestFieldValues = function (taskId, field) {
        var _this = this;
        return rxjs_1.from(this.taskApi.getRestFieldValues(taskId, field))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets values of fields populated by a REST backend using a process ID.
     * @param processDefinitionId Process identifier
     * @param field Field identifier
     * @returns Field values
     */
    FormService.prototype.getRestFieldValuesByProcessId = function (processDefinitionId, field) {
        var _this = this;
        return rxjs_1.from(this.processApi.getRestFieldValues(processDefinitionId, field))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets column values of fields populated by a REST backend using a process ID.
     * @param processDefinitionId Process identifier
     * @param field Field identifier
     * @param column Column identifier
     * @returns Field values
     */
    FormService.prototype.getRestFieldValuesColumnByProcessId = function (processDefinitionId, field, column) {
        var _this = this;
        return rxjs_1.from(this.processApi.getRestTableFieldValues(processDefinitionId, field, column))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets column values of fields populated by a REST backend.
     * @param taskId Task identifier
     * @param field Field identifier
     * @param column Column identifier
     * @returns Field values
     */
    FormService.prototype.getRestFieldValuesColumn = function (taskId, field, column) {
        var _this = this;
        return rxjs_1.from(this.taskApi.getRestFieldValuesColumn(taskId, field, column))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Returns a URL for the profile picture of a user.
     * @param userId ID of the target user
     * @returns URL string
     */
    FormService.prototype.getUserProfileImageApi = function (userId) {
        return this.apiService.getInstance().activiti.userApi.getUserProfilePictureUrl(userId);
    };
    /**
     * Gets a list of workflow users.
     * @param filter Filter to select specific users
     * @param groupId Group ID for the search
     * @returns Array of users
     */
    FormService.prototype.getWorkflowUsers = function (filter, groupId) {
        var _this = this;
        var option = { filter: filter };
        if (groupId) {
            option.groupId = groupId;
        }
        return rxjs_1.from(this.usersWorkflowApi.getUsers(option))
            .pipe(operators_1.switchMap(function (response) { return response.data || []; }), operators_1.map(function (user) {
            user.userImage = _this.getUserProfileImageApi(user.id);
            return rxjs_1.of(user);
        }), operators_1.combineAll(), operators_1.defaultIfEmpty([]), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets a list of groups in a workflow.
     * @param filter Filter to select specific groups
     * @param groupId Group ID for the search
     * @returns Array of groups
     */
    FormService.prototype.getWorkflowGroups = function (filter, groupId) {
        var _this = this;
        var option = { filter: filter };
        if (groupId) {
            option.groupId = groupId;
        }
        return rxjs_1.from(this.groupsApi.getGroups(option))
            .pipe(operators_1.map(function (response) { return response.data || []; }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets the ID of a form.
     * @param form Object representing a form
     * @returns ID string
     */
    FormService.prototype.getFormId = function (form) {
        var result = null;
        if (form && form.data && form.data.length > 0) {
            result = form.data[0].id;
        }
        return result;
    };
    /**
     * Creates a JSON representation of form data.
     * @param res Object representing form data
     * @returns JSON data
     */
    FormService.prototype.toJson = function (res) {
        if (res) {
            return res || {};
        }
        return {};
    };
    /**
     * Creates a JSON array representation of form data.
     * @param res Object representing form data
     * @returns JSON data
     */
    FormService.prototype.toJsonArray = function (res) {
        if (res) {
            return res.data || [];
        }
        return [];
    };
    /**
     * Reports an error message.
     * @param error Data object with optional `message` and `status` fields for the error
     * @returns Error message
     */
    FormService.prototype.handleError = function (error) {
        var errMsg = FormService_1.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? error.status + " - " + error.statusText : FormService_1.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return rxjs_1.throwError(errMsg);
    };
    var FormService_1;
    FormService.UNKNOWN_ERROR_MESSAGE = 'Unknown error';
    FormService.GENERIC_ERROR_MESSAGE = 'Server error';
    FormService = FormService_1 = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [ecm_model_service_1.EcmModelService,
            alfresco_api_service_1.AlfrescoApiService,
            log_service_1.LogService])
    ], FormService);
    return FormService;
}());
exports.FormService = FormService;
//# sourceMappingURL=form.service.js.map
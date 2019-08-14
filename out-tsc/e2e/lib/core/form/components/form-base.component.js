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
var widgets_1 = require("./widgets");
var core_1 = require("@angular/core");
var FormBaseComponent = /** @class */ (function () {
    function FormBaseComponent() {
        /** Toggle rendering of the form title. */
        this.showTitle = true;
        /** Toggle rendering of the `Complete` outcome button. */
        this.showCompleteButton = true;
        /** If true then the `Complete` outcome button is shown but it will be disabled. */
        this.disableCompleteButton = false;
        /** If true then the `Save` outcome button is shown but will be disabled. */
        this.disableSaveButton = false;
        /** If true then the `Start Process` outcome button is shown but it will be disabled. */
        this.disableStartProcessButton = false;
        /** Toggle rendering of the `Save` outcome button. */
        this.showSaveButton = true;
        /** Toggle readonly state of the form. Forces all form widgets to render as readonly if enabled. */
        this.readOnly = false;
        /** Toggle rendering of the `Refresh` button. */
        this.showRefreshButton = true;
        /** Toggle rendering of the validation icon next to the form title. */
        this.showValidationIcon = true;
        /** Emitted when the supplied form values have a validation error. */
        this.formError = new core_1.EventEmitter();
        /** Emitted when any outcome is executed. Default behaviour can be prevented
         * via `event.preventDefault()`.
         */
        this.executeOutcome = new core_1.EventEmitter();
        /**
         * Emitted when any error occurs.
         */
        this.error = new core_1.EventEmitter();
    }
    FormBaseComponent.prototype.getParsedFormDefinition = function () {
        return this;
    };
    FormBaseComponent.prototype.hasForm = function () {
        return this.form ? true : false;
    };
    FormBaseComponent.prototype.isTitleEnabled = function () {
        var titleEnabled = false;
        if (this.showTitle && this.form) {
            titleEnabled = true;
        }
        return titleEnabled;
    };
    FormBaseComponent.prototype.getColorForOutcome = function (outcomeName) {
        return outcomeName === FormBaseComponent.COMPLETE_OUTCOME_NAME ? FormBaseComponent.COMPLETE_BUTTON_COLOR : '';
    };
    FormBaseComponent.prototype.isOutcomeButtonEnabled = function (outcome) {
        if (this.form.readOnly) {
            return false;
        }
        if (outcome) {
            if (outcome.name === widgets_1.FormOutcomeModel.SAVE_ACTION) {
                return this.disableSaveButton ? false : this.form.isValid;
            }
            if (outcome.name === widgets_1.FormOutcomeModel.COMPLETE_ACTION) {
                return this.disableCompleteButton ? false : this.form.isValid;
            }
            if (outcome.name === widgets_1.FormOutcomeModel.START_PROCESS_ACTION) {
                return this.disableStartProcessButton ? false : this.form.isValid;
            }
            return this.form.isValid;
        }
        return false;
    };
    FormBaseComponent.prototype.isOutcomeButtonVisible = function (outcome, isFormReadOnly) {
        if (outcome && outcome.name) {
            if (outcome.name === widgets_1.FormOutcomeModel.COMPLETE_ACTION) {
                return this.showCompleteButton;
            }
            if (isFormReadOnly) {
                return outcome.isSelected;
            }
            if (outcome.name === widgets_1.FormOutcomeModel.SAVE_ACTION) {
                return this.showSaveButton;
            }
            if (outcome.name === widgets_1.FormOutcomeModel.START_PROCESS_ACTION) {
                return false;
            }
            return true;
        }
        return false;
    };
    /**
     * Invoked when user clicks outcome button.
     * @param outcome Form outcome model
     */
    FormBaseComponent.prototype.onOutcomeClicked = function (outcome) {
        if (!this.readOnly && outcome && this.form) {
            if (!this.onExecuteOutcome(outcome)) {
                return false;
            }
            if (outcome.isSystem) {
                if (outcome.id === FormBaseComponent.SAVE_OUTCOME_ID) {
                    this.saveTaskForm();
                    return true;
                }
                if (outcome.id === FormBaseComponent.COMPLETE_OUTCOME_ID) {
                    this.completeTaskForm();
                    return true;
                }
                if (outcome.id === FormBaseComponent.START_PROCESS_OUTCOME_ID) {
                    this.completeTaskForm();
                    return true;
                }
                if (outcome.id === FormBaseComponent.CUSTOM_OUTCOME_ID) {
                    this.onTaskSaved(this.form);
                    this.storeFormAsMetadata();
                    return true;
                }
            }
            else {
                // Note: Activiti is using NAME field rather than ID for outcomes
                if (outcome.name) {
                    this.onTaskSaved(this.form);
                    this.completeTaskForm(outcome.name);
                    return true;
                }
            }
        }
        return false;
    };
    FormBaseComponent.prototype.handleError = function (err) {
        this.error.emit(err);
    };
    FormBaseComponent.SAVE_OUTCOME_ID = '$save';
    FormBaseComponent.COMPLETE_OUTCOME_ID = '$complete';
    FormBaseComponent.START_PROCESS_OUTCOME_ID = '$startProcess';
    FormBaseComponent.CUSTOM_OUTCOME_ID = '$custom';
    FormBaseComponent.COMPLETE_BUTTON_COLOR = 'primary';
    FormBaseComponent.COMPLETE_OUTCOME_NAME = 'COMPLETE';
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], FormBaseComponent.prototype, "path", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], FormBaseComponent.prototype, "nameNode", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FormBaseComponent.prototype, "showTitle", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FormBaseComponent.prototype, "showCompleteButton", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FormBaseComponent.prototype, "disableCompleteButton", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FormBaseComponent.prototype, "disableSaveButton", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FormBaseComponent.prototype, "disableStartProcessButton", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FormBaseComponent.prototype, "showSaveButton", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FormBaseComponent.prototype, "readOnly", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FormBaseComponent.prototype, "showRefreshButton", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FormBaseComponent.prototype, "showValidationIcon", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], FormBaseComponent.prototype, "fieldValidators", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], FormBaseComponent.prototype, "formError", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], FormBaseComponent.prototype, "executeOutcome", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], FormBaseComponent.prototype, "error", void 0);
    return FormBaseComponent;
}());
exports.FormBaseComponent = FormBaseComponent;
//# sourceMappingURL=form-base.component.js.map
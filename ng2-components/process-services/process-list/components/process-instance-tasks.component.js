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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var task_list_1 = require("../../task-list");
var Rx_1 = require("rxjs/Rx");
var ProcessInstanceTasksComponent = (function () {
    function ProcessInstanceTasksComponent(activitiProcess, logService, dialog) {
        var _this = this;
        this.activitiProcess = activitiProcess;
        this.logService = logService;
        this.dialog = dialog;
        this.showRefreshButton = true;
        this.error = new core_1.EventEmitter();
        this.activeTasks = [];
        this.completedTasks = [];
        this.taskClick = new core_1.EventEmitter();
        this.task$ = new Rx_1.Observable(function (observer) { return _this.taskObserver = observer; }).share();
        this.completedTask$ = new Rx_1.Observable(function (observer) { return _this.completedTaskObserver = observer; }).share();
    }
    ProcessInstanceTasksComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.task$.subscribe(function (task) {
            _this.activeTasks.push(task);
        });
        this.completedTask$.subscribe(function (task) {
            _this.completedTasks.push(task);
        });
    };
    ProcessInstanceTasksComponent.prototype.ngOnChanges = function (changes) {
        var processInstanceDetails = changes['processInstanceDetails'];
        if (processInstanceDetails && processInstanceDetails.currentValue) {
            this.load(processInstanceDetails.currentValue.id);
        }
    };
    ProcessInstanceTasksComponent.prototype.load = function (processInstanceId) {
        this.loadActive(processInstanceId);
        this.loadCompleted(processInstanceId);
    };
    ProcessInstanceTasksComponent.prototype.loadActive = function (processInstanceId) {
        var _this = this;
        this.activeTasks = [];
        if (processInstanceId) {
            this.activitiProcess.getProcessTasks(processInstanceId, null).subscribe(function (res) {
                res.forEach(function (task) {
                    _this.taskObserver.next(task);
                });
            }, function (err) {
                _this.error.emit(err);
            });
        }
        else {
            this.activeTasks = [];
        }
    };
    ProcessInstanceTasksComponent.prototype.loadCompleted = function (processInstanceId) {
        var _this = this;
        this.completedTasks = [];
        if (processInstanceId) {
            this.activitiProcess.getProcessTasks(processInstanceId, 'completed').subscribe(function (res) {
                res.forEach(function (task) {
                    _this.completedTaskObserver.next(task);
                });
            }, function (err) {
                _this.error.emit(err);
            });
        }
        else {
            this.completedTasks = [];
        }
    };
    ProcessInstanceTasksComponent.prototype.hasStartFormDefined = function () {
        return this.processInstanceDetails && this.processInstanceDetails.startFormDefined === true;
    };
    ProcessInstanceTasksComponent.prototype.getUserFullName = function (user) {
        if (user) {
            return (user.firstName && user.firstName !== 'null'
                ? user.firstName + ' ' : '') +
                user.lastName;
        }
        return 'Nobody';
    };
    ProcessInstanceTasksComponent.prototype.getFormatDate = function (value, format) {
        var datePipe = new common_1.DatePipe('en-US');
        try {
            return datePipe.transform(value, format);
        }
        catch (err) {
            this.logService.error("ProcessListInstanceTask: error parsing date " + value + " to format " + format);
        }
    };
    ProcessInstanceTasksComponent.prototype.clickTask = function ($event, task) {
        var args = new task_list_1.TaskDetailsEvent(task);
        this.taskClick.emit(args);
    };
    ProcessInstanceTasksComponent.prototype.clickStartTask = function () {
        this.processId = this.processInstanceDetails.id;
        this.showStartDialog();
    };
    ProcessInstanceTasksComponent.prototype.showStartDialog = function () {
        this.dialog.open(this.startDialog, { height: '500px', width: '700px' });
    };
    ProcessInstanceTasksComponent.prototype.closeSartDialog = function () {
        this.dialog.closeAll();
    };
    ProcessInstanceTasksComponent.prototype.onRefreshClicked = function () {
        this.load(this.processInstanceDetails.id);
    };
    ProcessInstanceTasksComponent.prototype.onFormContentClick = function () {
        this.closeSartDialog();
    };
    __decorate([
        core_1.Input()
    ], ProcessInstanceTasksComponent.prototype, "processInstanceDetails", void 0);
    __decorate([
        core_1.Input()
    ], ProcessInstanceTasksComponent.prototype, "showRefreshButton", void 0);
    __decorate([
        core_1.Output()
    ], ProcessInstanceTasksComponent.prototype, "error", void 0);
    __decorate([
        core_1.ViewChild('startDialog')
    ], ProcessInstanceTasksComponent.prototype, "startDialog", void 0);
    __decorate([
        core_1.ViewChild('taskdetails')
    ], ProcessInstanceTasksComponent.prototype, "taskdetails", void 0);
    __decorate([
        core_1.Output()
    ], ProcessInstanceTasksComponent.prototype, "taskClick", void 0);
    ProcessInstanceTasksComponent = __decorate([
        core_1.Component({
            selector: 'adf-process-instance-tasks',
            templateUrl: './process-instance-tasks.component.html',
            styleUrls: ['./process-instance-tasks.component.css']
        })
    ], ProcessInstanceTasksComponent);
    return ProcessInstanceTasksComponent;
}());
exports.ProcessInstanceTasksComponent = ProcessInstanceTasksComponent;

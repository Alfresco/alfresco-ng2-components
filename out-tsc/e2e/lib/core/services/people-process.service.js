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
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var alfresco_api_service_1 = require("./alfresco-api.service");
var log_service_1 = require("./log.service");
var operators_1 = require("rxjs/operators");
var PeopleProcessService = /** @class */ (function () {
    function PeopleProcessService(alfrescoJsApi, logService) {
        this.alfrescoJsApi = alfrescoJsApi;
        this.logService = logService;
    }
    /**
     * Gets information about users across all tasks.
     * @param taskId ID of the task
     * @param searchWord Filter text to search for
     * @returns Array of user information objects
     */
    PeopleProcessService.prototype.getWorkflowUsers = function (taskId, searchWord) {
        var _this = this;
        var option = { excludeTaskId: taskId, filter: searchWord };
        return rxjs_1.from(this.getWorkflowUserApi(option))
            .pipe(operators_1.map(function (response) { return response.data || []; }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets the profile picture URL for the specified user.
     * @param user The target user
     * @returns Profile picture URL
     */
    PeopleProcessService.prototype.getUserImage = function (user) {
        return this.getUserProfileImageApi(user.id);
    };
    /**
     * Sets a user to be involved with a task.
     * @param taskId ID of the target task
     * @param idToInvolve ID of the user to involve
     * @returns Empty response when the update completes
     */
    PeopleProcessService.prototype.involveUserWithTask = function (taskId, idToInvolve) {
        var _this = this;
        var node = { userId: idToInvolve };
        return rxjs_1.from(this.involveUserToTaskApi(taskId, node))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Removes a user who is currently involved with a task.
     * @param taskId ID of the target task
     * @param idToRemove ID of the user to remove
     * @returns Empty response when the update completes
     */
    PeopleProcessService.prototype.removeInvolvedUser = function (taskId, idToRemove) {
        var _this = this;
        var node = { userId: idToRemove };
        return rxjs_1.from(this.removeInvolvedUserFromTaskApi(taskId, node))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    PeopleProcessService.prototype.getWorkflowUserApi = function (options) {
        return this.alfrescoJsApi.getInstance().activiti.usersWorkflowApi.getUsers(options);
    };
    PeopleProcessService.prototype.involveUserToTaskApi = function (taskId, node) {
        return this.alfrescoJsApi.getInstance().activiti.taskActionsApi.involveUser(taskId, node);
    };
    PeopleProcessService.prototype.removeInvolvedUserFromTaskApi = function (taskId, node) {
        return this.alfrescoJsApi.getInstance().activiti.taskActionsApi.removeInvolvedUser(taskId, node);
    };
    PeopleProcessService.prototype.getUserProfileImageApi = function (userId) {
        return this.alfrescoJsApi.getInstance().activiti.userApi.getUserProfilePictureUrl(userId);
    };
    /**
     * Throw the error
     * @param error
     */
    PeopleProcessService.prototype.handleError = function (error) {
        this.logService.error(error);
        return rxjs_1.throwError(error || 'Server error');
    };
    PeopleProcessService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            log_service_1.LogService])
    ], PeopleProcessService);
    return PeopleProcessService;
}());
exports.PeopleProcessService = PeopleProcessService;
//# sourceMappingURL=people-process.service.js.map
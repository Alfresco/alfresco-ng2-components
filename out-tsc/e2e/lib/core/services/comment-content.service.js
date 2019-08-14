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
var comment_model_1 = require("../models/comment.model");
var alfresco_api_service_1 = require("../services/alfresco-api.service");
var log_service_1 = require("../services/log.service");
var operators_1 = require("rxjs/operators");
var CommentContentService = /** @class */ (function () {
    function CommentContentService(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
    }
    /**
     * Adds a comment to a node.
     * @param nodeId ID of the target node
     * @param message Text for the comment
     * @returns Details of the comment added
     */
    CommentContentService.prototype.addNodeComment = function (nodeId, message) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().core.commentsApi.addComment(nodeId, { content: message }))
            .pipe(operators_1.map(function (response) {
            return new comment_model_1.CommentModel({
                id: response.entry.id,
                message: response.entry.content,
                created: response.entry.createdAt,
                createdBy: response.entry.createdBy
            });
        }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets all comments that have been added to a node.
     * @param nodeId ID of the target node
     * @returns Details for each comment
     */
    CommentContentService.prototype.getNodeComments = function (nodeId) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().core.commentsApi.getComments(nodeId))
            .pipe(operators_1.map(function (response) {
            var comments = [];
            response.list.entries.forEach(function (comment) {
                comments.push(new comment_model_1.CommentModel({
                    id: comment.entry.id,
                    message: comment.entry.content,
                    created: comment.entry.createdAt,
                    createdBy: comment.entry.createdBy
                }));
            });
            return comments;
        }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    CommentContentService.prototype.handleError = function (error) {
        this.logService.error(error);
        return rxjs_1.throwError(error || 'Server error');
    };
    CommentContentService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            log_service_1.LogService])
    ], CommentContentService);
    return CommentContentService;
}());
exports.CommentContentService = CommentContentService;
//# sourceMappingURL=comment-content.service.js.map
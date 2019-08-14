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
var comment_process_service_1 = require("../services/comment-process.service");
var comment_content_service_1 = require("../services/comment-content.service");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var CommentsComponent = /** @class */ (function () {
    function CommentsComponent(commentProcessService, commentContentService) {
        var _this = this;
        this.commentProcessService = commentProcessService;
        this.commentContentService = commentContentService;
        /** Are the comments read only? */
        this.readOnly = false;
        /** Emitted when an error occurs while displaying/adding a comment. */
        this.error = new core_1.EventEmitter();
        this.comments = [];
        this.beingAdded = false;
        this.comment$ = new rxjs_1.Observable(function (observer) { return _this.commentObserver = observer; })
            .pipe(operators_1.share());
        this.comment$.subscribe(function (comment) {
            _this.comments.push(comment);
        });
    }
    CommentsComponent.prototype.ngOnChanges = function (changes) {
        this.taskId = null;
        this.nodeId = null;
        this.taskId = changes['taskId'] ? changes['taskId'].currentValue : null;
        this.nodeId = changes['nodeId'] ? changes['nodeId'].currentValue : null;
        if (this.taskId || this.nodeId) {
            this.getComments();
        }
        else {
            this.resetComments();
        }
    };
    CommentsComponent.prototype.getComments = function () {
        var _this = this;
        this.resetComments();
        if (this.isATask()) {
            this.commentProcessService.getTaskComments(this.taskId).subscribe(function (comments) {
                if (comments && comments instanceof Array) {
                    comments = comments.sort(function (comment1, comment2) {
                        var date1 = new Date(comment1.created);
                        var date2 = new Date(comment2.created);
                        return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
                    });
                    comments.forEach(function (currentComment) {
                        _this.commentObserver.next(currentComment);
                    });
                }
            }, function (err) {
                _this.error.emit(err);
            });
        }
        if (this.isANode()) {
            this.commentContentService.getNodeComments(this.nodeId).subscribe(function (comments) {
                if (comments && comments instanceof Array) {
                    comments = comments.sort(function (comment1, comment2) {
                        var date1 = new Date(comment1.created);
                        var date2 = new Date(comment2.created);
                        return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
                    });
                    comments.forEach(function (comment) {
                        _this.commentObserver.next(comment);
                    });
                }
            }, function (err) {
                _this.error.emit(err);
            });
        }
    };
    CommentsComponent.prototype.resetComments = function () {
        this.comments = [];
    };
    CommentsComponent.prototype.add = function () {
        var _this = this;
        if (this.message && this.message.trim() && !this.beingAdded) {
            var comment = this.sanitize(this.message);
            this.beingAdded = true;
            if (this.isATask()) {
                this.commentProcessService.addTaskComment(this.taskId, comment)
                    .subscribe(function (res) {
                    _this.comments.unshift(res);
                    _this.message = '';
                    _this.beingAdded = false;
                }, function (err) {
                    _this.error.emit(err);
                    _this.beingAdded = false;
                });
            }
            if (this.isANode()) {
                this.commentContentService.addNodeComment(this.nodeId, comment)
                    .subscribe(function (res) {
                    _this.comments.unshift(res);
                    _this.message = '';
                    _this.beingAdded = false;
                }, function (err) {
                    _this.error.emit(err);
                    _this.beingAdded = false;
                });
            }
        }
    };
    CommentsComponent.prototype.clear = function () {
        this.message = '';
    };
    CommentsComponent.prototype.isReadOnly = function () {
        return this.readOnly;
    };
    CommentsComponent.prototype.isATask = function () {
        return this.taskId ? true : false;
    };
    CommentsComponent.prototype.isANode = function () {
        return this.nodeId ? true : false;
    };
    CommentsComponent.prototype.sanitize = function (input) {
        return input.replace(/<[^>]+>/g, '')
            .replace(/^\s+|\s+$|\s+(?=\s)/g, '')
            .replace(/\r?\n/g, '<br/>');
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CommentsComponent.prototype, "taskId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CommentsComponent.prototype, "nodeId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CommentsComponent.prototype, "readOnly", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], CommentsComponent.prototype, "error", void 0);
    CommentsComponent = __decorate([
        core_1.Component({
            selector: 'adf-comments',
            templateUrl: './comments.component.html',
            styleUrls: ['./comments.component.scss']
        }),
        __metadata("design:paramtypes", [comment_process_service_1.CommentProcessService, comment_content_service_1.CommentContentService])
    ], CommentsComponent);
    return CommentsComponent;
}());
exports.CommentsComponent = CommentsComponent;
//# sourceMappingURL=comments.component.js.map
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
var Rx_1 = require("rxjs/Rx");
/**
 * @returns {TagService}
 */
var TagService = (function () {
    function TagService(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
        this.refresh = new core_1.EventEmitter();
    }
    TagService.prototype.getTagsByNodeId = function (nodeId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().core.tagsApi.getNodeTags(nodeId))
            .catch(function (err) { return _this.handleError(err); });
    };
    TagService.prototype.getAllTheTags = function () {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().core.tagsApi.getTags())
            .catch(function (err) { return _this.handleError(err); });
    };
    TagService.prototype.addTag = function (nodeId, tagName) {
        var _this = this;
        var alfrescoApi = this.apiService.getInstance();
        var tagBody = new alfrescoApi.core.TagBody();
        tagBody.tag = tagName;
        var promiseAdd = Rx_1.Observable.fromPromise(this.apiService.getInstance().core.tagsApi.addTag(nodeId, tagBody));
        promiseAdd.subscribe(function (data) {
            _this.refresh.emit(data);
        }, function (err) {
            _this.handleError(err);
        });
        return promiseAdd;
    };
    TagService.prototype.removeTag = function (nodeId, tag) {
        var _this = this;
        var promiseRemove = Rx_1.Observable.fromPromise(this.apiService.getInstance().core.tagsApi.removeTag(nodeId, tag));
        promiseRemove.subscribe(function (data) {
            _this.refresh.emit(data);
        }, function (err) {
            _this.handleError(err);
        });
        return promiseRemove;
    };
    TagService.prototype.handleError = function (error) {
        this.logService.error(error);
        return Rx_1.Observable.throw(error || 'Server error');
    };
    __decorate([
        core_1.Output()
    ], TagService.prototype, "refresh", void 0);
    TagService = __decorate([
        core_1.Injectable()
    ], TagService);
    return TagService;
}());
exports.TagService = TagService;

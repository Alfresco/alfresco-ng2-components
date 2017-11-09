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
/**
 *
 * This component, provide a list of the tags relative a node with actions button to add or remove new tag
 *
 * @returns {TagComponent} .
 */
var TagActionsComponent = (function () {
    function TagActionsComponent(tagService, translateService) {
        var _this = this;
        this.tagService = tagService;
        this.translateService = translateService;
        this.successAdd = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.result = new core_1.EventEmitter();
        this.disableAddTag = true;
        this.tagService.refresh.subscribe(function () {
            _this.refreshTag();
        });
    }
    TagActionsComponent.prototype.ngOnChanges = function () {
        return this.refreshTag();
    };
    TagActionsComponent.prototype.refreshTag = function () {
        var _this = this;
        this.tagService.getTagsByNodeId(this.nodeId).subscribe(function (data) {
            _this.tagsEntries = data.list.entries;
            _this.disableAddTag = false;
            _this.result.emit(_this.tagsEntries);
        }, function () {
            _this.tagsEntries = null;
            _this.disableAddTag = true;
            _this.result.emit(_this.tagsEntries);
        });
    };
    TagActionsComponent.prototype.addTag = function () {
        var _this = this;
        if (this.searchTag(this.newTagName)) {
            this.translateService.get('TAG.MESSAGES.EXIST').subscribe(function (error) {
                _this.errorMsg = error;
            });
            this.error.emit(this.errorMsg);
        }
        else {
            this.tagService.addTag(this.nodeId, this.newTagName).subscribe(function () {
                _this.newTagName = '';
                _this.successAdd.emit(_this.nodeId);
            });
        }
    };
    TagActionsComponent.prototype.searchTag = function (searchTagName) {
        if (this.tagsEntries) {
            return this.tagsEntries.find(function (currentTag) {
                return (searchTagName === currentTag.entry.tag);
            });
        }
    };
    TagActionsComponent.prototype.cleanErrorMsg = function () {
        this.errorMsg = '';
    };
    TagActionsComponent.prototype.removeTag = function (tag) {
        this.tagService.removeTag(this.nodeId, tag);
    };
    __decorate([
        core_1.Input()
    ], TagActionsComponent.prototype, "nodeId", void 0);
    __decorate([
        core_1.Output()
    ], TagActionsComponent.prototype, "successAdd", void 0);
    __decorate([
        core_1.Output()
    ], TagActionsComponent.prototype, "error", void 0);
    __decorate([
        core_1.Output()
    ], TagActionsComponent.prototype, "result", void 0);
    TagActionsComponent = __decorate([
        core_1.Component({
            selector: 'adf-tag-node-actions-list',
            templateUrl: './tag-actions.component.html',
            styleUrls: ['./tag-actions.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TagActionsComponent);
    return TagActionsComponent;
}());
exports.TagActionsComponent = TagActionsComponent;

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
 * This component, ShowNodeTag a list of the tag on relative a node
 *
 * @returns {TagNodeList} .
 */
var TagNodeListComponent = (function () {
    /**
     * Constructor
     * @param tagService
     */
    function TagNodeListComponent(tagService) {
        var _this = this;
        this.tagService = tagService;
        this.results = new core_1.EventEmitter();
        this.tagService.refresh.subscribe(function () {
            _this.refreshTag();
        });
    }
    TagNodeListComponent.prototype.ngOnChanges = function () {
        return this.refreshTag();
    };
    TagNodeListComponent.prototype.refreshTag = function () {
        var _this = this;
        this.tagService.getTagsByNodeId(this.nodeId).subscribe(function (data) {
            _this.tagsEntries = data.list.entries;
            _this.results.emit(_this.tagsEntries);
        });
    };
    TagNodeListComponent.prototype.removeTag = function (tag) {
        var _this = this;
        this.tagService.removeTag(this.nodeId, tag).subscribe(function () {
            _this.refreshTag();
        });
    };
    __decorate([
        core_1.Input()
    ], TagNodeListComponent.prototype, "nodeId", void 0);
    __decorate([
        core_1.Output()
    ], TagNodeListComponent.prototype, "results", void 0);
    TagNodeListComponent = __decorate([
        core_1.Component({
            selector: 'adf-tag-node-list',
            templateUrl: './tag-node-list.component.html',
            styleUrls: ['./tag-node-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TagNodeListComponent);
    return TagNodeListComponent;
}());
exports.TagNodeListComponent = TagNodeListComponent;

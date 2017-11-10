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
var ContentColumnComponent = (function () {
    function ContentColumnComponent(list, logService) {
        this.list = list;
        this.logService = logService;
        this.type = 'text';
        this.sortable = false;
        this.title = '';
        this.logService.log('ContentColumnComponent is deprecated starting with 1.7.0 and may be removed in future versions. Use DataColumnComponent instead.');
    }
    ContentColumnComponent.prototype.ngOnInit = function () {
        if (!this.srTitle && this.key === '$thumbnail') {
            this.srTitle = 'Thumbnail';
        }
    };
    ContentColumnComponent.prototype.ngAfterContentInit = function () {
        this.register();
    };
    ContentColumnComponent.prototype.register = function () {
        if (this.list) {
            return this.list.registerColumn(this);
        }
        return false;
    };
    __decorate([
        core_1.Input()
    ], ContentColumnComponent.prototype, "key", void 0);
    __decorate([
        core_1.Input()
    ], ContentColumnComponent.prototype, "type", void 0);
    __decorate([
        core_1.Input()
    ], ContentColumnComponent.prototype, "format", void 0);
    __decorate([
        core_1.Input()
    ], ContentColumnComponent.prototype, "sortable", void 0);
    __decorate([
        core_1.Input()
    ], ContentColumnComponent.prototype, "title", void 0);
    __decorate([
        core_1.ContentChild(core_1.TemplateRef)
    ], ContentColumnComponent.prototype, "template", void 0);
    __decorate([
        core_1.Input('sr-title')
    ], ContentColumnComponent.prototype, "srTitle", void 0);
    __decorate([
        core_1.Input('class')
    ], ContentColumnComponent.prototype, "cssClass", void 0);
    ContentColumnComponent = __decorate([
        core_1.Component({
            selector: 'content-column',
            template: ''
        })
    ], ContentColumnComponent);
    return ContentColumnComponent;
}());
exports.ContentColumnComponent = ContentColumnComponent;

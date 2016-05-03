/**
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
System.register(['angular2/core', './content-column-list', './../models/content-column.model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, content_column_list_1, content_column_model_1;
    var ContentColumn;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (content_column_list_1_1) {
                content_column_list_1 = content_column_list_1_1;
            },
            function (content_column_model_1_1) {
                content_column_model_1 = content_column_model_1_1;
            }],
        execute: function() {
            ContentColumn = (function () {
                function ContentColumn(list) {
                    this.list = list;
                    this.title = '';
                }
                ContentColumn.prototype.ngOnInit = function () {
                    var model = new content_column_model_1.ContentColumnModel();
                    model.title = this.title;
                    model.source = this.source;
                    this.list.registerColumn(model);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ContentColumn.prototype, "title", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ContentColumn.prototype, "source", void 0);
                ContentColumn = __decorate([
                    core_1.Component({
                        selector: 'content-column',
                        template: ''
                    }), 
                    __metadata('design:paramtypes', [content_column_list_1.ContentColumnList])
                ], ContentColumn);
                return ContentColumn;
            }());
            exports_1("ContentColumn", ContentColumn);
        }
    }
});
//# sourceMappingURL=content-column.js.map
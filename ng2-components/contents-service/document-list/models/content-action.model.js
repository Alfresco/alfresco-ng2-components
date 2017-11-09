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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ContentActionModel = (function () {
    function ContentActionModel(obj) {
        this.disableWithNoPermission = false;
        this.disabled = false;
        if (obj) {
            this.icon = obj.icon;
            this.title = obj.title;
            this.handler = obj.handler;
            this.execute = obj.execute;
            this.target = obj.target;
            this.permission = obj.permission;
            this.disableWithNoPermission = obj.disableWithNoPermission;
            this.disabled = obj.disabled;
        }
    }
    return ContentActionModel;
}());
exports.ContentActionModel = ContentActionModel;
var DocumentActionModel = (function (_super) {
    __extends(DocumentActionModel, _super);
    function DocumentActionModel(json) {
        var _this = _super.call(this, json) || this;
        _this.target = 'document';
        return _this;
    }
    return DocumentActionModel;
}(ContentActionModel));
exports.DocumentActionModel = DocumentActionModel;
var FolderActionModel = (function (_super) {
    __extends(FolderActionModel, _super);
    function FolderActionModel(json) {
        var _this = _super.call(this, json) || this;
        _this.target = 'folder';
        return _this;
    }
    return FolderActionModel;
}(ContentActionModel));
exports.FolderActionModel = FolderActionModel;

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
var document_library_model_1 = require("../models/document-library.model");
var PageNode = (function (_super) {
    __extends(PageNode, _super);
    function PageNode(entries) {
        var _this = _super.call(this) || this;
        _this.list = new document_library_model_1.NodePagingList();
        _this.list.entries = entries || [];
        return _this;
    }
    return PageNode;
}(document_library_model_1.NodePaging));
exports.PageNode = PageNode;
var FileNode = (function (_super) {
    __extends(FileNode, _super);
    function FileNode(name, mimeType) {
        var _this = _super.call(this) || this;
        _this.entry = new document_library_model_1.NodeMinimal();
        _this.entry.id = 'file-id';
        _this.entry.isFile = true;
        _this.entry.isFolder = false;
        _this.entry.name = name;
        _this.entry.path = new document_library_model_1.PathInfoEntity();
        _this.entry.content = new document_library_model_1.ContentInfo();
        _this.entry.content.mimeType = mimeType || 'text/plain';
        return _this;
    }
    return FileNode;
}(document_library_model_1.NodeMinimalEntry));
exports.FileNode = FileNode;
var FolderNode = (function (_super) {
    __extends(FolderNode, _super);
    function FolderNode(name) {
        var _this = _super.call(this) || this;
        _this.entry = new document_library_model_1.NodeMinimal();
        _this.entry.id = 'folder-id';
        _this.entry.isFile = false;
        _this.entry.isFolder = true;
        _this.entry.name = name;
        _this.entry.path = new document_library_model_1.PathInfoEntity();
        return _this;
    }
    return FolderNode;
}(document_library_model_1.NodeMinimalEntry));
exports.FolderNode = FolderNode;

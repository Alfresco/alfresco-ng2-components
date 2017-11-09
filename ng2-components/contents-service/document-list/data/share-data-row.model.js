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
Object.defineProperty(exports, "__esModule", { value: true });
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var ShareDataRow = (function () {
    function ShareDataRow(obj, documentListService, permissionsStyle) {
        this.obj = obj;
        this.documentListService = documentListService;
        this.permissionsStyle = permissionsStyle;
        this.cache = {};
        this.isSelected = false;
        this.cssClass = '';
        if (!obj) {
            throw new Error(ShareDataRow.ERR_OBJECT_NOT_FOUND);
        }
        this.isDropTarget = this.isFolderAndHasPermissionToUpload(obj);
        if (permissionsStyle) {
            this.cssClass = this.getPermissionClass(obj);
        }
    }
    Object.defineProperty(ShareDataRow.prototype, "node", {
        get: function () {
            return this.obj;
        },
        enumerable: true,
        configurable: true
    });
    ShareDataRow.prototype.getPermissionClass = function (nodeEntity) {
        var _this = this;
        var permissionsClasses = '';
        this.permissionsStyle.forEach(function (currentPermissionsStyle) {
            if (_this.applyPermissionStyleToFolder(nodeEntity.entry, currentPermissionsStyle) || _this.applyPermissionStyleToFile(nodeEntity.entry, currentPermissionsStyle)) {
                if (_this.documentListService.hasPermission(nodeEntity.entry, currentPermissionsStyle.permission)) {
                    permissionsClasses += " " + currentPermissionsStyle.css;
                }
            }
        });
        return permissionsClasses;
    };
    ShareDataRow.prototype.applyPermissionStyleToFile = function (node, currentPermissionsStyle) {
        return (currentPermissionsStyle.isFile && node.isFile);
    };
    ShareDataRow.prototype.applyPermissionStyleToFolder = function (node, currentPermissionsStyle) {
        return (currentPermissionsStyle.isFolder && node.isFolder);
    };
    ShareDataRow.prototype.isFolderAndHasPermissionToUpload = function (obj) {
        return this.isFolder(obj) && this.documentListService.hasPermission(obj.entry, 'create');
    };
    ShareDataRow.prototype.isFolder = function (obj) {
        return obj.entry && obj.entry.isFolder;
    };
    ShareDataRow.prototype.cacheValue = function (key, value) {
        this.cache[key] = value;
        return value;
    };
    ShareDataRow.prototype.getValue = function (key) {
        if (this.cache[key] !== undefined) {
            return this.cache[key];
        }
        return ng2_alfresco_core_1.ObjectUtils.getValue(this.obj.entry, key);
    };
    ShareDataRow.prototype.hasValue = function (key) {
        return this.getValue(key) !== undefined;
    };
    ShareDataRow.ERR_OBJECT_NOT_FOUND = 'Object source not found';
    return ShareDataRow;
}());
exports.ShareDataRow = ShareDataRow;

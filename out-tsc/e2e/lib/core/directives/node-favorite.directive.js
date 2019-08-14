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
/* tslint:disable:no-input-rename  */
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var alfresco_api_service_1 = require("../services/alfresco-api.service");
var operators_1 = require("rxjs/operators");
var NodeFavoriteDirective = /** @class */ (function () {
    function NodeFavoriteDirective(alfrescoApiService) {
        this.alfrescoApiService = alfrescoApiService;
        this.favorites = [];
        /** Array of nodes to toggle as favorites. */
        this.selection = [];
        /** Emitted when the favorite setting is complete. */
        this.toggle = new core_1.EventEmitter();
        /** Emitted when the favorite setting fails. */
        this.error = new core_1.EventEmitter();
    }
    NodeFavoriteDirective.prototype.onClick = function () {
        this.toggleFavorite();
    };
    NodeFavoriteDirective.prototype.ngOnChanges = function (changes) {
        if (!changes.selection.currentValue.length) {
            this.favorites = [];
            return;
        }
        this.markFavoritesNodes(changes.selection.currentValue);
    };
    NodeFavoriteDirective.prototype.toggleFavorite = function () {
        var _this = this;
        if (!this.favorites.length) {
            return;
        }
        var every = this.favorites.every(function (selected) { return selected.entry.isFavorite; });
        if (every) {
            var batch = this.favorites.map(function (selected) {
                // shared files have nodeId
                var id = selected.entry.nodeId || selected.entry.id;
                return rxjs_1.from(_this.alfrescoApiService.favoritesApi.removeFavoriteSite('-me-', id));
            });
            rxjs_1.forkJoin(batch).subscribe(function () {
                _this.favorites.map(function (selected) { return selected.entry.isFavorite = false; });
                _this.toggle.emit();
            }, function (error) { return _this.error.emit(error); });
        }
        if (!every) {
            var notFavorite_1 = this.favorites.filter(function (node) { return !node.entry.isFavorite; });
            var body = notFavorite_1.map(function (node) { return _this.createFavoriteBody(node); });
            rxjs_1.from(this.alfrescoApiService.favoritesApi.addFavorite('-me-', body))
                .subscribe(function () {
                notFavorite_1.map(function (selected) { return selected.entry.isFavorite = true; });
                _this.toggle.emit();
            }, function (error) { return _this.error.emit(error); });
        }
    };
    NodeFavoriteDirective.prototype.markFavoritesNodes = function (selection) {
        var _this = this;
        if (selection.length <= this.favorites.length) {
            var newFavorites = this.reduce(this.favorites, selection);
            this.favorites = newFavorites;
        }
        var result = this.diff(selection, this.favorites);
        var batch = this.getProcessBatch(result);
        rxjs_1.forkJoin(batch).subscribe(function (data) {
            var _a;
            (_a = _this.favorites).push.apply(_a, data);
        });
    };
    NodeFavoriteDirective.prototype.hasFavorites = function () {
        if (this.favorites && !this.favorites.length) {
            return false;
        }
        return this.favorites.every(function (selected) { return selected.entry.isFavorite; });
    };
    NodeFavoriteDirective.prototype.getProcessBatch = function (selection) {
        var _this = this;
        return selection.map(function (selected) { return _this.getFavorite(selected); });
    };
    NodeFavoriteDirective.prototype.getFavorite = function (selected) {
        var node = selected.entry;
        // ACS 6.x with 'isFavorite' include
        if (node && node.hasOwnProperty('isFavorite')) {
            return rxjs_1.of(selected);
        }
        // ACS 5.x and 6.x without 'isFavorite' include
        var _a = node, name = _a.name, isFile = _a.isFile, isFolder = _a.isFolder;
        var id = node.nodeId || node.id;
        var promise = this.alfrescoApiService.favoritesApi.getFavorite('-me-', id);
        return rxjs_1.from(promise).pipe(operators_1.map(function () { return ({
            entry: {
                id: id,
                isFolder: isFolder,
                isFile: isFile,
                name: name,
                isFavorite: true
            }
        }); }), operators_1.catchError(function () {
            return rxjs_1.of({
                entry: {
                    id: id,
                    isFolder: isFolder,
                    isFile: isFile,
                    name: name,
                    isFavorite: false
                }
            });
        }));
    };
    NodeFavoriteDirective.prototype.createFavoriteBody = function (node) {
        var _a;
        var type = this.getNodeType(node);
        // shared files have nodeId
        var id = node.entry.nodeId || node.entry.id;
        return {
            target: (_a = {},
                _a[type] = {
                    guid: id
                },
                _a)
        };
    };
    NodeFavoriteDirective.prototype.getNodeType = function (node) {
        // shared could only be files
        if (!node.entry.isFile && !node.entry.isFolder) {
            return 'file';
        }
        return node.entry.isFile ? 'file' : 'folder';
    };
    NodeFavoriteDirective.prototype.diff = function (list, patch) {
        var ids = patch.map(function (item) { return item.entry.id; });
        return list.filter(function (item) { return ids.includes(item.entry.id) ? null : item; });
    };
    NodeFavoriteDirective.prototype.reduce = function (patch, comparator) {
        var ids = comparator.map(function (item) { return item.entry.id; });
        return patch.filter(function (item) { return ids.includes(item.entry.id) ? item : null; });
    };
    __decorate([
        core_1.Input('adf-node-favorite'),
        __metadata("design:type", Array)
    ], NodeFavoriteDirective.prototype, "selection", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NodeFavoriteDirective.prototype, "toggle", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NodeFavoriteDirective.prototype, "error", void 0);
    __decorate([
        core_1.HostListener('click'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NodeFavoriteDirective.prototype, "onClick", null);
    NodeFavoriteDirective = __decorate([
        core_1.Directive({
            selector: '[adf-node-favorite]',
            exportAs: 'adfFavorite'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService])
    ], NodeFavoriteDirective);
    return NodeFavoriteDirective;
}());
exports.NodeFavoriteDirective = NodeFavoriteDirective;
//# sourceMappingURL=node-favorite.directive.js.map
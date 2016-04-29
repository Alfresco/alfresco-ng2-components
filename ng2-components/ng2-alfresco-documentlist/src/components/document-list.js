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
System.register(['angular2/core', './../services/alfresco.service'], function(exports_1, context_1) {
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
    var core_1, alfresco_service_1;
    var DocumentList;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (alfresco_service_1_1) {
                alfresco_service_1 = alfresco_service_1_1;
            }],
        execute: function() {
            DocumentList = (function () {
                function DocumentList(_alfrescoService) {
                    this._alfrescoService = _alfrescoService;
                    this.navigate = true;
                    this.breadcrumb = false;
                    this.thumbnails = true;
                    this.itemClick = new core_1.EventEmitter();
                    this.rootFolder = {
                        name: 'Document Library',
                        path: 'swsdp/documentLibrary'
                    };
                    this.currentFolderPath = 'swsdp/documentLibrary';
                    this.route = [];
                    this.documentActions = [];
                    this.quickDocumentActions = [];
                    this.folderActions = [];
                    this.quickFolderActions = [];
                }
                DocumentList.prototype.canNavigateParent = function () {
                    return this.navigate &&
                        !this.breadcrumb &&
                        this.currentFolderPath !== this.rootFolder.path;
                };
                DocumentList.prototype.ngOnInit = function () {
                    this.route.push(this.rootFolder);
                    this.displayFolderContent(this.rootFolder.path);
                };
                DocumentList.prototype.ngAfterViewChecked = function () {
                    // workaround for MDL issues with dynamic components
                    if (componentHandler) {
                        componentHandler.upgradeAllRegistered();
                    }
                };
                DocumentList.prototype.onNavigateParentClick = function ($event) {
                    if ($event) {
                        $event.preventDefault();
                    }
                    if (this.navigate) {
                        this.route.pop();
                        var parent_1 = this.route.length > 0 ? this.route[this.route.length - 1] : this.rootFolder;
                        if (parent_1) {
                            this.displayFolderContent(parent_1.path);
                        }
                    }
                };
                DocumentList.prototype.onItemClick = function (item, $event) {
                    if ($event) {
                        $event.preventDefault();
                    }
                    this.itemClick.emit({
                        value: item
                    });
                    if (this.navigate && item) {
                        if (item.isFolder) {
                            var path = this.getItemPath(item);
                            this.route.push({
                                name: item.displayName,
                                path: path
                            });
                            this.displayFolderContent(path);
                        }
                    }
                };
                DocumentList.prototype.goToRoute = function (r, $event) {
                    if ($event) {
                        $event.preventDefault();
                    }
                    if (this.navigate) {
                        var idx = this.route.indexOf(r);
                        if (idx > -1) {
                            this.route.splice(idx + 1);
                            this.displayFolderContent(r.path);
                        }
                    }
                };
                DocumentList.prototype.getContentUrl = function (document) {
                    return this._alfrescoService.getContentUrl(document);
                };
                DocumentList.prototype.getDocumentThumbnailUrl = function (document) {
                    return this._alfrescoService.getDocumentThumbnailUrl(document);
                };
                DocumentList.prototype.registerDocumentAction = function (action) {
                    if (action) {
                        this.documentActions.push(action);
                    }
                };
                DocumentList.prototype.executeContentAction = function (document, action) {
                    // todo: safety checks
                    action.handler(document);
                };
                DocumentList.prototype.getItemPath = function (item) {
                    var container = item.location.container;
                    var path = item.location.path !== '/' ? (item.location.path + '/') : '/';
                    var relativePath = container + path + item.fileName;
                    return item.location.site + '/' + relativePath;
                };
                DocumentList.prototype.displayFolderContent = function (path) {
                    var _this = this;
                    this.currentFolderPath = path;
                    this._alfrescoService
                        .getFolder(path)
                        .subscribe(function (folder) { return _this.folder = folder; }, function (error) { return _this.errorMessage = error; });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], DocumentList.prototype, "navigate", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], DocumentList.prototype, "breadcrumb", void 0);
                __decorate([
                    core_1.Input('folder-icon'), 
                    __metadata('design:type', String)
                ], DocumentList.prototype, "folderIcon", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], DocumentList.prototype, "thumbnails", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], DocumentList.prototype, "itemClick", void 0);
                DocumentList = __decorate([
                    core_1.Component({
                        selector: 'alfresco-document-list',
                        styles: [
                            "\n            :host .full-width { width: 100%; }\n            \n            :host .folder-thumbnail {\n                font-size: 48px;\n                cursor: pointer;\n            }\n            \n            :host .document-thumbnail {\n                width: 48px;\n                height: 48px;\n                cursor: pointer;\n            }\n            \n            :host .content-header {\n                font-size: 15px;\n            }\n           \n            :host .content-header:hover {\n                text-decoration: underline;\n                cursor: pointer;\n            }\n            \n            :host .parent-folder-link { cursor: pointer; }\n            :host .parent-folder-link > td { text-align: left; }\n            :host .folder-header-cell { cursor: pointer; }\n            \n            :host .breadcrumb { margin-bottom: 4px; }\n\n            :host .folder-icon {\n                float: left;\n                margin-right: 10px;\n                font-size: 4em;\n            }\n\n            :host .file-icon {\n                width: 52px;\n                height: 52px;\n                float: left;\n                margin-right: 10px;\n            }\n            \n            :host .document-header {\n                font-size: 24px;\n                line-height: 32px;\n            }\n            \n            :host .document-header:hover {\n                text-decoration: underline;\n            }\n        "
                        ],
                        template: "\n        <ol *ngIf=\"breadcrumb\" class=\"breadcrumb\">\n            <li *ngFor=\"#r of route; #last = last\" [class.active]=\"last\" [ngSwitch]=\"last\">\n                <span *ngSwitchWhen=\"true\">{{r.name}}</span>\n                <a *ngSwitchDefault href=\"#\" (click)=\"goToRoute(r, $event)\">{{r.name}}</a>\n            </li>\n        </ol>\n        <table *ngIf=\"folder\" class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width\">\n            <thead>\n                <tr>\n                    <!-- Thumbnails -->\n                    <th *ngIf=\"thumbnails\"></th>\n                    <!-- Name -->\n                    <th class=\"mdl-data-table__cell--non-numeric full-width\">Name</th>\n                    <!-- Actions -->\n                    <th></th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr class=\"parent-folder-link\" *ngIf=\"canNavigateParent()\" (click)=\"onNavigateParentClick($event)\">\n                    <td colspan=\"3\">\n                        <button class=\"mdl-button mdl-js-button mdl-button--icon\"\n                                (click)=\"onNavigateParentClick($event)\">\n                            <i class=\"material-icons\">arrow_upward</i>\n                        </button>\n                    </td>\n                </tr>\n                \n                <tr *ngFor=\"#content of folder.items; #idx = index\">\n                    <!-- Thumbnails: folder -->\n                    <td *ngIf=\"thumbnails && content.isFolder\">\n                        <i class=\"material-icons folder-thumbnail\" \n                            (click)=\"onItemClick(content, $event)\">{{folderIcon || 'folder_open'}}</i>\n                    </td>\n                    \n                     <!-- Thumbnails: document -->\n                    <td *ngIf=\"thumbnails && !content.isFolder\">\n                        <img *ngIf=\"thumbnails\" class=\"document-thumbnail\"\n                             alt=\"\"\n                             src=\"{{getDocumentThumbnailUrl(content)}}\"\n                             (click)=\"onItemClick(content, $event)\">\n                    </td>\n                    \n                    <!-- Name: folder -->\n                    <td *ngIf=\"content.isFolder\" class=\"mdl-data-table__cell--non-numeric folder-header-cell\" \n                        (click)=\"onItemClick(content, $event)\">\n                        <span class=\"content-header\">\n                            {{content.displayName}}\n                        </span>\n                    </td>\n                    \n                    <!-- Name: document -->\n                    <td *ngIf=\"!content.isFolder\" class=\"mdl-data-table__cell--non-numeric\" >\n                        <span class=\"content-header\" (click)=\"onItemClick(content, $event)\">\n                            {{content.displayName}}\n                        </span>\n                    </td>\n                    \n                    \n                    <!-- Actions: Folder cell template -->\n                    <td *ngIf=\"content.isFolder\">\n                        <!-- quick action buttons -->\n                        <button class=\"mdl-button mdl-js-button mdl-button--icon\"\n                                *ngFor=\"#action of quickFolderActions\"\n                                (click)=\"executeContentAction(content, action)\">\n                            <i class=\"material-icons\">{{action.icon}}</i>\n                        </button>\n                        \n                        <!-- action menu -->\n                        <button [id]=\"'folder_action_menu_' + idx\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n                            <i class=\"material-icons\">more_vert</i>\n                        </button>\n                        <ul class=\"mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect\"\n                            [attr.for]=\"'folder_action_menu_' + idx\">\n                            <li class=\"mdl-menu__item\"\n                                *ngFor=\"#action of folderActions\"\n                                (click)=\"executeContentAction(content, action)\">\n                                {{action.title}}\n                            </li>\n                        </ul>\n                    </td>\n                    <!-- Actions: Document cell template -->\n                    <td *ngIf=\"!content.isFolder\">\n                        <!-- quick action buttons -->\n                        <button class=\"mdl-button mdl-js-button mdl-button--icon\"\n                                *ngFor=\"#action of quickDocumentActions\"\n                                (click)=\"executeContentAction(content, action)\">\n                            <i class=\"material-icons\">{{action.icon}}</i>\n                        </button>\n                        \n                        <!-- action menu -->\n                        <button [id]=\"'document_action_menu_' + idx\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n                            <i class=\"material-icons\">more_vert</i>\n                        </button>\n                        <ul class=\"mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect\"\n                            [attr.for]=\"'document_action_menu_' + idx\">\n                            <li class=\"mdl-menu__item\"\n                                *ngFor=\"#action of documentActions\"\n                                (click)=\"executeContentAction(content, action)\">\n                                {{action.title}}\n                            </li>\n                        </ul>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n    ",
                        providers: [alfresco_service_1.AlfrescoService]
                    }), 
                    __metadata('design:paramtypes', [alfresco_service_1.AlfrescoService])
                ], DocumentList);
                return DocumentList;
            }());
            exports_1("DocumentList", DocumentList);
        }
    }
});
//# sourceMappingURL=document-list.js.map
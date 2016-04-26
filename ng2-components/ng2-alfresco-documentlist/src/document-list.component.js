System.register(['angular2/core', './alfresco.service'], function(exports_1, context_1) {
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
                    this.folderIconClass = 'fa fa-folder-o fa-4x';
                    this.thumbnails = true;
                    this.downloads = true;
                    this.itemClick = new core_1.EventEmitter();
                    this.rootFolder = {
                        name: 'Document Library',
                        path: 'swsdp/documentLibrary'
                    };
                    this.currentFolderPath = 'swsdp/documentLibrary';
                    this.route = [];
                    this.documentActions = [];
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
                    this.documentActions.push(action);
                };
                DocumentList.prototype.executeDocumentAction = function (document, action) {
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
                    core_1.Input('folder-icon-class'), 
                    __metadata('design:type', String)
                ], DocumentList.prototype, "folderIconClass", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], DocumentList.prototype, "thumbnails", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], DocumentList.prototype, "downloads", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], DocumentList.prototype, "itemClick", void 0);
                DocumentList = __decorate([
                    core_1.Component({
                        selector: 'alfresco-document-list',
                        styles: [
                            "\n            :host .breadcrumb {\n                margin-bottom: 4px;\n            }\n\n            :host .folder-icon {\n                float: left;\n                margin-right: 10px;\n            }\n\n            :host .file-icon {\n                width: 52px;\n                height: 52px;\n                float: left;\n                margin-right: 10px;\n            }\n            \n            :host .document-header {\n                font-size: 24px;\n                line-height: 32px;\n            }\n            \n            :host .document-header:hover {\n                text-decoration: underline;\n            }\n        "
                        ],
                        template: "\n        <ol *ngIf=\"breadcrumb\" class=\"breadcrumb\">\n            <li *ngFor=\"#r of route; #last = last\" [class.active]=\"last\" [ngSwitch]=\"last\">\n                <span *ngSwitchWhen=\"true\">{{r.name}}</span>\n                <a *ngSwitchDefault href=\"#\" (click)=\"goToRoute(r, $event)\">{{r.name}}</a>\n            </li>\n        </ol>\n        <div *ngIf=\"folder\" class=\"list-group\">\n            <a href=\"#\" *ngIf=\"canNavigateParent()\" (click)=\"onNavigateParentClick($event)\" class=\"list-group-item\">\n                <i class=\"fa fa-level-up\"></i> ...\n            </a>\n            <a href=\"#\" *ngFor=\"#document of folder.items\" class=\"list-group-item clearfix\">\n                \n                <div *ngIf=\"!document.isFolder\" class=\"btn-group pull-right\">\n                    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" \n                          aria-haspopup=\"true\" aria-expanded=\"false\">\n                        Actions <span class=\"caret\"></span>\n                    </button>\n                    <ul class=\"dropdown-menu\">\n                        <li>\n                            <a *ngIf=\"downloads && !document.isFolder\" \n                                href=\"{{getContentUrl(document)}}\" \n                                download target=\"_blank\">\n                                Download\n                            </a>\n                        </li>\n                        <li role=\"separator\" class=\"divider\"></li>\n                        <li *ngFor=\"#documentAction of documentActions\">\n                            <a href=\"#\" (click)=\"executeDocumentAction(document, documentAction)\">{{documentAction.title}}</a>\n                        </li>\n                    </ul>\n                </div>\n                \n                <i *ngIf=\"thumbnails && document.isFolder\" class=\"folder-icon {{folderIconClass}}\"\n                    (click)=\"onItemClick(document, $event)\">\n                </i>\n                <img *ngIf=\"thumbnails && !document.isFolder\" class=\"file-icon\"\n                    alt=\"\"\n                    src=\"{{getDocumentThumbnailUrl(document)}}\"\n                    (click)=\"onItemClick(document, $event)\">\n                <h1 class=\"list-group-item-heading document-header\" (click)=\"onItemClick(document, $event)\" >\n                    {{document.displayName}}\n                </h1>\n                <p class=\"list-group-item-text\">{{document.description}}</p>\n                <small>\n                    Modified {{document.modifiedOn}} by {{document.modifiedBy}}\n                </small>\n            </a>\n        </div>\n    ",
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
//# sourceMappingURL=document-list.component.js.map
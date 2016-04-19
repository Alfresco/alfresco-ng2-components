System.register(["angular2/core", "./alfresco.service"], function(exports_1, context_1) {
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
                    // example: <alfresco-document-list [navigate]="false"></alfresco-document-list>
                    this.navigate = true;
                    this.rootFolderPath = 'swsdp/documentLibrary';
                    this.currentFolderPath = 'swsdp/documentLibrary';
                    this.route = [];
                }
                DocumentList.prototype.canNavigateParent = function () {
                    return this.currentFolderPath !== this.rootFolderPath;
                };
                DocumentList.prototype.ngOnInit = function () {
                    this.route.push(this.rootFolderPath);
                    this.displayFolderContent(this.rootFolderPath);
                };
                DocumentList.prototype.displayFolderContent = function (path) {
                    var _this = this;
                    this.currentFolderPath = path;
                    this._alfrescoService
                        .getFolder(path)
                        .subscribe(function (folder) { return _this.folder = folder; }, function (error) { return _this.errorMessage = error; });
                };
                DocumentList.prototype.onNavigateParentClick = function ($event) {
                    if ($event) {
                        $event.preventDefault();
                    }
                    if (this.navigate) {
                        this.route.pop();
                        var parent = this.route.length > 0 ? this.route[this.route.length - 1] : this.rootFolderPath;
                        if (parent) {
                            this.displayFolderContent(parent);
                        }
                    }
                };
                DocumentList.prototype.onItemClick = function (item, $event) {
                    if ($event) {
                        $event.preventDefault();
                    }
                    if (this.navigate && item) {
                        if (item.isFolder) {
                            var path = this.getItemPath(item);
                            this.route.push(path);
                            this.displayFolderContent(path);
                        }
                    }
                };
                DocumentList.prototype.getItemPath = function (item) {
                    var container = item.location.container;
                    var path = item.location.path !== '/' ? (item.location.path + '/') : '/';
                    var relativePath = container + path + item.fileName;
                    return item.location.site + '/' + relativePath;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], DocumentList.prototype, "navigate", void 0);
                DocumentList = __decorate([
                    core_1.Component({
                        selector: 'alfresco-document-list',
                        template: "\n        <div *ngIf=\"folder\" class=\"list-group\">\n            <a href=\"#\" *ngIf=\"canNavigateParent()\" (click)=\"onNavigateParentClick($event)\" class=\"list-group-item\">\n                <i class=\"fa fa-level-up\"></i> ...\n            </a>\n            <a href=\"#\" *ngFor=\"#document of folder.items\" (click)=\"onItemClick(document, $event)\" class=\"list-group-item\">\n                <i *ngIf=\"document.isFolder\" class=\"fa fa-folder-o\"></i>\n                {{document.displayName}}\n            </a>\n        </div>\n    ",
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
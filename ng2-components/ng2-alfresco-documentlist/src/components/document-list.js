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
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
var document_list_service_1 = require("./../services/document-list.service");
var share_datatable_adapter_1 = require("./../data/share-datatable-adapter");
var DocumentList = DocumentList_1 = (function () {
    function DocumentList(documentListService, ngZone, translate) {
        this.documentListService = documentListService;
        this.ngZone = ngZone;
        this.translate = translate;
        this.DEFAULT_FOLDER_PATH = '/';
        this.baseComponentPath = module.id.replace('/components/document-list.js', '');
        this.fallbackThubnail = this.baseComponentPath + '/../assets/images/ft_ic_miscellaneous.svg';
        this.currentFolderId = null;
        this.navigate = true;
        this.navigationMode = DocumentList_1.DOUBLE_CLICK_NAVIGATION;
        this.thumbnails = false;
        this.multiselect = false;
        this.contentActions = false;
        this.contextMenuActions = false;
        this.creationMenuActions = true;
        this.pageSize = DocumentList_1.DEFAULT_PAGE_SIZE;
        this.nodeClick = new core_1.EventEmitter();
        this.nodeDblClick = new core_1.EventEmitter();
        this.folderChange = new core_1.EventEmitter();
        this.preview = new core_1.EventEmitter();
        this.success = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this._path = this.DEFAULT_FOLDER_PATH;
        this.actions = [];
        this.contextActionHandler = new Rx_1.Subject();
        this.data = new share_datatable_adapter_1.ShareDataTableAdapter(this.documentListService, './..', []);
        if (translate) {
            translate.addTranslationFolder('ng2-alfresco-documentlist', 'node_modules/ng2-alfresco-documentlist/src');
        }
    }
    Object.defineProperty(DocumentList.prototype, "rootFolderId", {
        get: function () {
            if (this.data) {
                return this.data.rootFolderId;
            }
            return null;
        },
        set: function (value) {
            this.data.rootFolderId = value || this.data.DEFAULT_ROOT_ID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentList.prototype, "rowFilter", {
        set: function (value) {
            if (this.data) {
                this.data.setFilter(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(DocumentList.prototype, "imageResolver", {
        set: function (value) {
            if (this.data) {
                this.data.setImageResolver(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentList.prototype, "currentFolderPath", {
        get: function () {
            return this._path;
        },
        set: function (value) {
            this._path = value;
        },
        enumerable: true,
        configurable: true
    });
    DocumentList.prototype.getContextActions = function (node) {
        var _this = this;
        if (node && node.entry) {
            var actions = this.getNodeActions(node);
            if (actions && actions.length > 0) {
                return actions.map(function (a) {
                    return {
                        model: a,
                        node: node,
                        subject: _this.contextActionHandler
                    };
                });
            }
        }
        return null;
    };
    DocumentList.prototype.contextActionCallback = function (action) {
        if (action) {
            this.executeContentAction(action.node, action.model);
        }
    };
    DocumentList.prototype.ngOnInit = function () {
        var _this = this;
        this.data.thumbnails = this.thumbnails;
        this.data.maxItems = this.pageSize;
        this.contextActionHandler.subscribe(function (val) { return _this.contextActionCallback(val); });
        if (this.isMobile()) {
            this.navigationMode = DocumentList_1.SINGLE_CLICK_NAVIGATION;
        }
        this.loadFolder();
    };
    DocumentList.prototype.ngAfterContentInit = function () {
        var columns = this.data.getColumns();
        if (!columns || columns.length === 0) {
            this.setupDefaultColumns();
        }
    };
    DocumentList.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes['currentFolderId'] && changes['currentFolderId'].currentValue) {
            var folderId = changes['currentFolderId'].currentValue;
            this.loadFolderById(folderId)
                .then(function () {
                _this._path = null;
            })
                .catch(function (err) {
                _this.error.emit(err);
            });
        }
        else if (changes['currentFolderPath']) {
            var path_1 = changes['currentFolderPath'].currentValue || this.DEFAULT_FOLDER_PATH;
            this.currentFolderPath = path_1;
            this.loadFolderByPath(path_1)
                .then(function () {
                _this._path = path_1;
                _this.folderChange.emit({ path: path_1 });
            })
                .catch(function (err) {
                _this.error.emit(err);
            });
        }
        else if (changes['rootFolderId']) {
            this.loadFolderByPath(this.currentFolderPath)
                .then(function () {
                _this._path = _this.currentFolderPath;
                _this.folderChange.emit({ path: _this.currentFolderPath });
            })
                .catch(function (err) {
                _this.error.emit(err);
            });
        }
    };
    DocumentList.prototype.isEmptyTemplateDefined = function () {
        if (this.dataTable) {
            if (this.emptyFolderTemplate) {
                return true;
            }
        }
        return false;
    };
    DocumentList.prototype.isMobile = function () {
        return !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    DocumentList.prototype.getNodeActions = function (node) {
        var target = null;
        if (node && node.entry) {
            if (node.entry.isFile) {
                target = 'document';
            }
            if (node.entry.isFolder) {
                target = 'folder';
            }
            if (target) {
                var ltarget_1 = target.toLowerCase();
                return this.actions.filter(function (entry) {
                    return entry.target.toLowerCase() === ltarget_1;
                });
            }
        }
        return [];
    };
    DocumentList.prototype.onShowContextMenu = function (e) {
        if (e) {
            e.preventDefault();
        }
    };
    DocumentList.prototype.performNavigation = function (node) {
        if (node && node.entry && node.entry.isFolder) {
            this.currentFolderPath = this.getNodePath(node);
            this.currentFolderId = null;
            this.loadFolder();
            this.folderChange.emit({ path: this.currentFolderPath });
            return true;
        }
        return false;
    };
    DocumentList.prototype.executeContentAction = function (node, action) {
        if (node && node.entry && action) {
            action.handler(node, this);
        }
    };
    DocumentList.prototype.loadFolderByPath = function (path) {
        return this.data.loadPath(path);
    };
    DocumentList.prototype.loadFolderById = function (id) {
        return this.data.loadById(id);
    };
    DocumentList.prototype.reload = function () {
        var _this = this;
        this.ngZone.run(function () {
            _this.loadFolder();
        });
    };
    DocumentList.prototype.loadFolder = function () {
        var _this = this;
        if (this.currentFolderId) {
            this.loadFolderById(this.currentFolderId)
                .catch(function (err) {
                _this.error.emit(err);
            });
        }
        else if (this.currentFolderPath) {
            this.loadFolderByPath(this.currentFolderPath)
                .catch(function (err) {
                _this.error.emit(err);
            });
        }
    };
    DocumentList.prototype.getNodePath = function (node) {
        if (node) {
            var pathWithCompanyHome = node.entry.path.name;
            return pathWithCompanyHome.replace('/Company Home', '') + '/' + node.entry.name;
        }
        return null;
    };
    DocumentList.prototype.setupDefaultColumns = function () {
        var colThumbnail = new ng2_alfresco_datatable_1.ObjectDataColumn({
            type: 'image',
            key: '$thumbnail',
            title: '',
            srTitle: 'Thumbnail'
        });
        var colName = new ng2_alfresco_datatable_1.ObjectDataColumn({
            type: 'text',
            key: 'name',
            title: 'Name',
            cssClass: 'full-width',
            sortable: true
        });
        this.data.setColumns([colThumbnail, colName]);
    };
    DocumentList.prototype.onPreviewFile = function (node) {
        if (node) {
            this.preview.emit({
                value: node
            });
        }
    };
    DocumentList.prototype.onNodeClick = function (node) {
        this.nodeClick.emit({
            value: node
        });
        if (this.navigate && this.navigationMode === DocumentList_1.SINGLE_CLICK_NAVIGATION) {
            if (node && node.entry) {
                if (node.entry.isFile) {
                    this.onPreviewFile(node);
                }
                if (node.entry.isFolder) {
                    this.performNavigation(node);
                }
            }
        }
    };
    DocumentList.prototype.onRowClick = function (event) {
        var item = event.value.node;
        this.onNodeClick(item);
    };
    DocumentList.prototype.onNodeDblClick = function (node) {
        this.nodeDblClick.emit({
            value: node
        });
        if (this.navigate && this.navigationMode === DocumentList_1.DOUBLE_CLICK_NAVIGATION) {
            if (node && node.entry) {
                if (node.entry.isFile) {
                    this.onPreviewFile(node);
                }
                if (node.entry.isFolder) {
                    this.performNavigation(node);
                }
            }
        }
    };
    DocumentList.prototype.onRowDblClick = function (event) {
        var item = event.value.node;
        this.onNodeDblClick(item);
    };
    DocumentList.prototype.onShowRowContextMenu = function (event) {
        if (this.contextMenuActions) {
            var args = event.args;
            var node = args.row.node;
            if (node) {
                args.actions = this.getContextActions(node) || [];
            }
        }
    };
    DocumentList.prototype.onShowRowActionsMenu = function (event) {
        if (this.contentActions) {
            var args = event.args;
            var node = args.row.node;
            if (node) {
                args.actions = this.getNodeActions(node) || [];
            }
        }
    };
    DocumentList.prototype.onExecuteRowAction = function (event) {
        if (this.contentActions) {
            var args = event.args;
            var node = args.row.node;
            var action = args.action;
            this.executeContentAction(node, action);
        }
    };
    DocumentList.prototype.onActionMenuError = function (event) {
        this.error.emit(event);
    };
    DocumentList.prototype.onActionMenuSuccess = function (event) {
        this.reload();
        this.success.emit(event);
    };
    return DocumentList;
}());
DocumentList.SINGLE_CLICK_NAVIGATION = 'click';
DocumentList.DOUBLE_CLICK_NAVIGATION = 'dblclick';
DocumentList.DEFAULT_PAGE_SIZE = 20;
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DocumentList.prototype, "fallbackThubnail", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], DocumentList.prototype, "rootFolderId", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DocumentList.prototype, "currentFolderId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DocumentList.prototype, "navigate", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DocumentList.prototype, "navigationMode", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DocumentList.prototype, "thumbnails", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DocumentList.prototype, "multiselect", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DocumentList.prototype, "contentActions", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DocumentList.prototype, "contextMenuActions", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DocumentList.prototype, "creationMenuActions", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], DocumentList.prototype, "pageSize", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function])
], DocumentList.prototype, "rowFilter", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function])
], DocumentList.prototype, "imageResolver", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DocumentList.prototype, "nodeClick", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DocumentList.prototype, "nodeDblClick", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DocumentList.prototype, "folderChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DocumentList.prototype, "preview", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DocumentList.prototype, "success", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DocumentList.prototype, "error", void 0);
__decorate([
    core_1.ViewChild(ng2_alfresco_datatable_1.DataTableComponent),
    __metadata("design:type", ng2_alfresco_datatable_1.DataTableComponent)
], DocumentList.prototype, "dataTable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], DocumentList.prototype, "currentFolderPath", null);
__decorate([
    core_1.HostListener('contextmenu', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], DocumentList.prototype, "onShowContextMenu", null);
DocumentList = DocumentList_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-document-list',
        styles: [".document-list_empty_template {     text-align: center;     margin-top: 20px;     margin-bottom: 20px; }  .document-list__this-space-is-empty {     height: 32px;     opacity: 0.26;     font-family: Muli, Helvetica, Arial, sans-serif;     font-size: 24px;     line-height: 1.33;     letter-spacing: -1px;     color: #000000; }  .document-list__drag-drop {     height: 56px;     opacity: 0.54;     font-family: Muli, Helvetica, Arial, sans-serif;     font-size: 56px;     line-height: 1;     letter-spacing: -2px;     color: #000000;     margin-top: 40px; }  .document-list__any-files-here-to-add {     height: 24px;     opacity: 0.54;     font-family: Muli, Helvetica, Arial, sans-serif;     font-size: 16px;     line-height: 1.5;     letter-spacing: -0.4px;     color: #000000;     margin-top: 17px; }  .document-list__empty_doc_lib {     width: 565px;     height: 161px;     object-fit: contain;     margin-top: 17px; }"],
        template: "<alfresco-document-menu-action *ngIf=\"creationMenuActions\"                                [currentFolderPath]=\"currentFolderPath\"                                (success)=\"onActionMenuSuccess($event)\"                                (error)=\"onActionMenuError($event)\"> </alfresco-document-menu-action> <alfresco-datatable     [data]=\"data\"     [actions]=\"contentActions\"     [multiselect]=\"multiselect\"     [fallbackThumbnail]=\"fallbackThubnail\"     (showRowContextMenu)=\"onShowRowContextMenu($event)\"     (showRowActionsMenu)=\"onShowRowActionsMenu($event)\"     (executeRowAction)=\"onExecuteRowAction($event)\"     (rowClick)=\"onRowClick($event)\"     (rowDblClick)=\"onRowDblClick($event)\">     <div *ngIf=\"!isEmptyTemplateDefined()\">         <no-content-template>             <template>                 <div class=\"document-list_empty_template\">                     <div class=\"document-list__this-space-is-empty\">This folder is empty</div>                     <div class=\"document-list__drag-drop\">Drag and Drop</div>                     <div class=\"document-list__any-files-here-to-add\">any files here to add</div>                     <img [src]=\"baseComponentPath + '/../assets/images/empty_doc_lib.svg'\" class=\"document-list__empty_doc_lib\">                 </div>             </template>         </no-content-template>     </div> </alfresco-datatable>"
    }),
    __metadata("design:paramtypes", [document_list_service_1.DocumentListService,
        core_1.NgZone,
        ng2_alfresco_core_1.AlfrescoTranslationService])
], DocumentList);
exports.DocumentList = DocumentList;
var DocumentList_1;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZG9jdW1lbnQtbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBYXVCO0FBQ3ZCLDhCQUFrQztBQUVsQyx1REFBK0Q7QUFDL0QsaUVBQTRGO0FBQzVGLDZFQUEwRTtBQUUxRSw2RUFLMkM7QUFVM0MsSUFBYSxZQUFZO0lBd0dyQixzQkFDWSxtQkFBd0MsRUFDeEMsTUFBYyxFQUNkLFNBQXFDO1FBRnJDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGNBQVMsR0FBVCxTQUFTLENBQTRCO1FBckdqRCx3QkFBbUIsR0FBVyxHQUFHLENBQUM7UUFFbEMsc0JBQWlCLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsOEJBQThCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFHMUUscUJBQWdCLEdBQVcsSUFBSSxDQUFDLGlCQUFpQixHQUFHLDJDQUEyQyxDQUFDO1FBUWhHLG9CQUFlLEdBQVcsSUFBSSxDQUFDO1FBVS9CLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFHekIsbUJBQWMsR0FBVyxjQUFZLENBQUMsdUJBQXVCLENBQUM7UUFHOUQsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUc1QixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUc3QixtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUdoQyx1QkFBa0IsR0FBWSxLQUFLLENBQUM7UUFHcEMsd0JBQW1CLEdBQVksSUFBSSxDQUFDO1FBR3BDLGFBQVEsR0FBVyxjQUFZLENBQUMsaUJBQWlCLENBQUM7UUFpQmxELGNBQVMsR0FBc0IsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFHbEQsaUJBQVksR0FBc0IsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFHckQsaUJBQVksR0FBc0IsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFHckQsWUFBTyxHQUFzQixJQUFJLG1CQUFZLEVB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YUFBTSxFQUFFOzhCQUNLLG1CQUFZO2tEQUEyQjtBQUdyRDtJQURDLGFBQU0sRUFBRTs4QkFDQSxtQkFBWTs2Q0FBMkI7QUFHaEQ7SUFEQyxhQUFNLEVBQUU7OEJBQ0EsbUJBQVk7NkNBQTJCO0FBR2hEO0lBREMsYUFBTSxFQUFFOzhCQUNGLG1CQUFZOzJDQUEyQjtBQUc5QztJQURDLGdCQUFTLENBQUMsMkNBQWtCLENBQUM7OEJBQ25CLDJDQUFrQjsrQ0FBQztBQUs5QjtJQURDLFlBQUssRUFBRTs7O3FEQUdQO0FBMklEO0lBREMsbUJBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7cUNBQ2xCLEtBQUs7O3FEQUkxQjtBQTNPUSxZQUFZO0lBTnhCLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsUUFBUSxFQUFFLHdCQUF3QjtRQUNsQyxNQUFNLEVBQUUsQ0FBQywwNUJBQTA1QixDQUFDO1FBQ3A2QixRQUFRLEVBQUUscTNDQUFxM0M7S0FDbDRDLENBQUM7cUNBMEdtQywyQ0FBbUI7UUFDaEMsYUFBTTtRQUNILDhDQUEwQjtHQTNHeEMsWUFBWSxDQTZaeEI7QUE3Wlksb0NBQVkiLCJmaWxlIjoiY29tcG9uZW50cy9kb2N1bWVudC1saXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTYgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgT25Jbml0LFxuICAgIElucHV0LFxuICAgIE9uQ2hhbmdlcyxcbiAgICBPdXRwdXQsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBOZ1pvbmUsXG4gICAgVmlld0NoaWxkLFxuICAgIEhvc3RMaXN0ZW5lclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzL1J4JztcbmltcG9ydCB7IE1pbmltYWxOb2RlRW50aXR5IH0gZnJvbSAnYWxmcmVzY28tanMtYXBpJztcbmltcG9ydCB7IEFsZnJlc2NvVHJhbnNsYXRpb25TZXJ2aWNlIH0gZnJvbSAnbmcyLWFsZnJlc2NvLWNvcmUnO1xuaW1wb3J0IHsgRGF0YVJvd0V2ZW50LCBEYXRhVGFibGVDb21wb25lbnQsIE9iamVjdERhdGFDb2x1bW4gfSBmcm9tICduZzItYWxmcmVzY28tZGF0YXRhYmxlJztcbmltcG9ydCB7IERvY3VtZW50TGlzdFNlcnZpY2UgfSBmcm9tICcuLy4uL3NlcnZpY2VzL2RvY3VtZW50LWxpc3Quc2VydmljZSc7XG5pbXBvcnQgeyBDb250ZW50QWN0aW9uTW9kZWwgfSBmcm9tICcuLy4uL21vZGVscy9jb250ZW50LWFjdGlvbi5tb2RlbCc7XG5pbXBvcnQge1xuICAgIFNoYXJlRGF0YVRhYmxlQWRhcHRlcixcbiAgICBTaGFyZURhdGFSb3csXG4gICAgUm93RmlsdGVyLFxuICAgIEltYWdlUmVzb2x2ZXJcbn0gZnJvbSAnLi8uLi9kYXRhL3NoYXJlLWRhdGF0YWJsZS1hZGFwdGVyJztcblxuZGVjbGFyZSB2YXIgbW9kdWxlOiBhbnk7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc2VsZWN0b3I6ICdhbGZyZXNjby1kb2N1bWVudC1saXN0JyxcbiAgICBzdHlsZXM6IFtcIi5kb2N1bWVudC1saXN0X2VtcHR5X3RlbXBsYXRlIHsgICAgIHRleHQtYWxpZ246IGNlbnRlcjsgICAgIG1hcmdpbi10b3A6IDIwcHg7ICAgICBtYXJnaW4tYm90dG9tOiAyMHB4OyB9ICAuZG9jdW1lbnQtbGlzdF9fdGhpcy1zcGFjZS1pcy1lbXB0eSB7ICAgICBoZWlnaHQ6IDMycHg7ICAgICBvcGFjaXR5OiAwLjI2OyAgICAgZm9udC1mYW1pbHk6IE11bGksIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7ICAgICBmb250LXNpemU6IDI0cHg7ICAgICBsaW5lLWhlaWdodDogMS4zMzsgICAgIGxldHRlci1zcGFjaW5nOiAtMXB4OyAgICAgY29sb3I6ICMwMDAwMDA7IH0gIC5kb2N1bWVudC1saXN0X19kcmFnLWRyb3AgeyAgICAgaGVpZ2h0OiA1NnB4OyAgICAgb3BhY2l0eTogMC41NDsgICAgIGZvbnQtZmFtaWx5OiBNdWxpLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmOyAgICAgZm9udC1zaXplOiA1NnB4OyAgICAgbGluZS1oZWlnaHQ6IDE7ICAgICBsZXR0ZXItc3BhY2luZzogLTJweDsgICAgIGNvbG9yOiAjMDAwMDAwOyAgICAgbWFyZ2luLXRvcDogNDBweDsgfSAgLmRvY3VtZW50LWxpc3RfX2FueS1maWxlcy1oZXJlLXRvLWFkZCB7ICAgICBoZWlnaHQ6IDI0cHg7ICAgICBvcGFjaXR5OiAwLjU0OyAgICAgZm9udC1mYW1pbHk6IE11bGksIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7ICAgICBmb250LXNpemU6IDE2cHg7ICAgICBsaW5lLWhlaWdodDogMS41OyAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjRweDsgICAgIGNvbG9yOiAjMDAwMDAwOyAgICAgbWFyZ2luLXRvcDogMTdweDsgfSAgLmRvY3VtZW50LWxpc3RfX2VtcHR5X2RvY19saWIgeyAgICAgd2lkdGg6IDU2NXB4OyAgICAgaGVpZ2h0OiAxNjFweDsgICAgIG9iamVjdC1maXQ6IGNvbnRhaW47ICAgICBtYXJnaW4tdG9wOiAxN3B4OyB9XCJdLFxuICAgIHRlbXBsYXRlOiBcIjxhbGZyZXNjby1kb2N1bWVudC1tZW51LWFjdGlvbiAqbmdJZj1cXFwiY3JlYXRpb25NZW51QWN0aW9uc1xcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjdXJyZW50Rm9sZGVyUGF0aF09XFxcImN1cnJlbnRGb2xkZXJQYXRoXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN1Y2Nlc3MpPVxcXCJvbkFjdGlvbk1lbnVTdWNjZXNzKCRldmVudClcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXJyb3IpPVxcXCJvbkFjdGlvbk1lbnVFcnJvcigkZXZlbnQpXFxcIj4gPC9hbGZyZXNjby1kb2N1bWVudC1tZW51LWFjdGlvbj4gPGFsZnJlc2NvLWRhdGF0YWJsZSAgICAgW2RhdGFdPVxcXCJkYXRhXFxcIiAgICAgW2FjdGlvbnNdPVxcXCJjb250ZW50QWN0aW9uc1xcXCIgICAgIFttdWx0aXNlbGVjdF09XFxcIm11bHRpc2VsZWN0XFxcIiAgICAgW2ZhbGxiYWNrVGh1bWJuYWlsXT1cXFwiZmFsbGJhY2tUaHVibmFpbFxcXCIgICAgIChzaG93Um93Q29udGV4dE1lbnUpPVxcXCJvblNob3dSb3dDb250ZXh0TWVudSgkZXZlbnQpXFxcIiAgICAgKHNob3dSb3dBY3Rpb25zTWVudSk9XFxcIm9uU2hvd1Jvd0FjdGlvbnNNZW51KCRldmVudClcXFwiICAgICAoZXhlY3V0ZVJvd0FjdGlvbik9XFxcIm9uRXhlY3V0ZVJvd0FjdGlvbigkZXZlbnQpXFxcIiAgICAgKHJvd0NsaWNrKT1cXFwib25Sb3dDbGljaygkZXZlbnQpXFxcIiAgICAgKHJvd0RibENsaWNrKT1cXFwib25Sb3dEYmxDbGljaygkZXZlbnQpXFxcIj4gICAgIDxkaXYgKm5nSWY9XFxcIiFpc0VtcHR5VGVtcGxhdGVEZWZpbmVkKClcXFwiPiAgICAgICAgIDxuby1jb250ZW50LXRlbXBsYXRlPiAgICAgICAgICAgICA8dGVtcGxhdGU+ICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkb2N1bWVudC1saXN0X2VtcHR5X3RlbXBsYXRlXFxcIj4gICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkb2N1bWVudC1saXN0X190aGlzLXNwYWNlLWlzLWVtcHR5XFxcIj5UaGlzIGZvbGRlciBpcyBlbXB0eTwvZGl2PiAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImRvY3VtZW50LWxpc3RfX2RyYWctZHJvcFxcXCI+RHJhZyBhbmQgRHJvcDwvZGl2PiAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImRvY3VtZW50LWxpc3RfX2FueS1maWxlcy1oZXJlLXRvLWFkZFxcXCI+YW55IGZpbGVzIGhlcmUgdG8gYWRkPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgPGltZyBbc3JjXT1cXFwiYmFzZUNvbXBvbmVudFBhdGggKyAnLy4uL2Fzc2V0cy9pbWFnZXMvZW1wdHlfZG9jX2xpYi5zdmcnXFxcIiBjbGFzcz1cXFwiZG9jdW1lbnQtbGlzdF9fZW1wdHlfZG9jX2xpYlxcXCI+ICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgPC90ZW1wbGF0ZT4gICAgICAgICA8L25vLWNvbnRlbnQtdGVtcGxhdGU+ICAgICA8L2Rpdj4gPC9hbGZyZXNjby1kYXRhdGFibGU+XCJcbn0pXG5leHBvcnQgY2xhc3MgRG9jdW1lbnRMaXN0IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyQ29udGVudEluaXQge1xuXG4gICAgc3RhdGljIFNJTkdMRV9DTElDS19OQVZJR0FUSU9OOiBzdHJpbmcgPSAnY2xpY2snO1xuICAgIHN0YXRpYyBET1VCTEVfQ0xJQ0tfTkFWSUdBVElPTjogc3RyaW5nID0gJ2RibGNsaWNrJztcbiAgICBzdGF0aWMgREVGQVVMVF9QQUdFX1NJWkU6IG51bWJlciA9IDIwO1xuXG4gICAgREVGQVVMVF9GT0xERVJfUEFUSDogc3RyaW5nID0gJy8nO1xuXG4gICAgYmFzZUNvbXBvbmVudFBhdGggPSBtb2R1bGUuaWQucmVwbGFjZSgnL2NvbXBvbmVudHMvZG9jdW1lbnQtbGlzdC5qcycsICcnKTtcblxuICAgIEBJbnB1dCgpXG4gICAgZmFsbGJhY2tUaHVibmFpbDogc3RyaW5nID0gdGhpcy5iYXNlQ29tcG9uZW50UGF0aCArICcvLi4vYXNzZXRzL2ltYWdlcy9mdF9pY19taXNjZWxsYW5lb3VzLnN2Zyc7XG5cbiAgICBASW5wdXQoKVxuICAgIHNldCByb290Rm9sZGVySWQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmRhdGEucm9vdEZvbGRlcklkID0gdmFsdWUgfHwgdGhpcy5kYXRhLkRFRkFVTFRfUk9PVF9JRDtcbiAgICB9XG5cbiAgICBASW5wdXQoKVxuICAgIGN1cnJlbnRGb2xkZXJJZDogc3RyaW5nID0gbnVsbDtcblxuICAgIGdldCByb290Rm9sZGVySWQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5yb290Rm9sZGVySWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBuYXZpZ2F0ZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKVxuICAgIG5hdmlnYXRpb25Nb2RlOiBzdHJpbmcgPSBEb2N1bWVudExpc3QuRE9VQkxFX0NMSUNLX05BVklHQVRJT047IC8vIGNsaWNrfGRibGNsaWNrXG5cbiAgICBASW5wdXQoKVxuICAgIHRodW1ibmFpbHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgbXVsdGlzZWxlY3Q6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgY29udGVudEFjdGlvbnM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgY29udGV4dE1lbnVBY3Rpb25zOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKVxuICAgIGNyZWF0aW9uTWVudUFjdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KClcbiAgICBwYWdlU2l6ZTogbnVtYmVyID0gRG9jdW1lbnRMaXN0LkRFRkFVTFRfUEFHRV9TSVpFO1xuXG4gICAgQElucHV0KClcbiAgICBzZXQgcm93RmlsdGVyKHZhbHVlOiBSb3dGaWx0ZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhLnNldEZpbHRlcih2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQElucHV0KClcbiAgICBzZXQgaW1hZ2VSZXNvbHZlcih2YWx1ZTogSW1hZ2VSZXNvbHZlcikge1xuICAgICAgICBpZiAodGhpcy5kYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEuc2V0SW1hZ2VSZXNvbHZlcih2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBAT3V0cHV0KClcbiAgICBub2RlQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpXG4gICAgbm9kZURibENsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIGZvbGRlckNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBwcmV2aWV3OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHN1Y2Nlc3M6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpXG4gICAgZXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQFZpZXdDaGlsZChEYXRhVGFibGVDb21wb25lbnQpXG4gICAgZGF0YVRhYmxlOiBEYXRhVGFibGVDb21wb25lbnQ7XG5cbiAgICBwcml2YXRlIF9wYXRoID0gdGhpcy5ERUZBVUxUX0ZPTERFUl9QQVRIO1xuXG4gICAgQElucHV0KClcbiAgICBzZXQgY3VycmVudEZvbGRlclBhdGgodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9wYXRoID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRGb2xkZXJQYXRoKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuICAgIH1cblxuICAgIGVycm9yTWVzc2FnZTtcbiAgICBhY3Rpb25zOiBDb250ZW50QWN0aW9uTW9kZWxbXSA9IFtdO1xuICAgIGVtcHR5Rm9sZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgY29udGV4dEFjdGlvbkhhbmRsZXI6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgZGF0YTogU2hhcmVEYXRhVGFibGVBZGFwdGVyO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgZG9jdW1lbnRMaXN0U2VydmljZTogRG9jdW1lbnRMaXN0U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgcHJpdmF0ZSB0cmFuc2xhdGU6IEFsZnJlc2NvVHJhbnNsYXRpb25TZXJ2aWNlKSB7XG5cbiAgICAgICAgdGhpcy5kYXRhID0gbmV3IFNoYXJlRGF0YVRhYmxlQWRhcHRlcih0aGlzLmRvY3VtZW50TGlzdFNlcnZpY2UsICcuLy4uJywgW10pO1xuXG4gICAgICAgIGlmICh0cmFuc2xhdGUpIHtcbiAgICAgICAgICAgIHRyYW5zbGF0ZS5hZGRUcmFuc2xhdGlvbkZvbGRlcignbmcyLWFsZnJlc2NvLWRvY3VtZW50bGlzdCcsICdub2RlX21vZHVsZXMvbmcyLWFsZnJlc2NvLWRvY3VtZW50bGlzdC9zcmMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldENvbnRleHRBY3Rpb25zKG5vZGU6IE1pbmltYWxOb2RlRW50aXR5KSB7XG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuZW50cnkpIHtcbiAgICAgICAgICAgIGxldCBhY3Rpb25zID0gdGhpcy5nZXROb2RlQWN0aW9ucyhub2RlKTtcbiAgICAgICAgICAgIGlmIChhY3Rpb25zICYmIGFjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY3Rpb25zLm1hcChhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiBhLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YmplY3Q6IHRoaXMuY29udGV4dEFjdGlvbkhhbmRsZXJcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb250ZXh0QWN0aW9uQ2FsbGJhY2soYWN0aW9uKSB7XG4gICAgICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUNvbnRlbnRBY3Rpb24oYWN0aW9uLm5vZGUsIGFjdGlvbi5tb2RlbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5kYXRhLnRodW1ibmFpbHMgPSB0aGlzLnRodW1ibmFpbHM7XG4gICAgICAgIHRoaXMuZGF0YS5tYXhJdGVtcyA9IHRoaXMucGFnZVNpemU7XG4gICAgICAgIHRoaXMuY29udGV4dEFjdGlvbkhhbmRsZXIuc3Vic2NyaWJlKHZhbCA9PiB0aGlzLmNvbnRleHRBY3Rpb25DYWxsYmFjayh2YWwpKTtcblxuICAgICAgICAvLyBBdXRvbWF0aWNhbGx5IGVuZm9yY2Ugc2luZ2xlLWNsaWNrIG5hdmlnYXRpb24gZm9yIG1vYmlsZSBicm93c2Vyc1xuICAgICAgICBpZiAodGhpcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRpb25Nb2RlID0gRG9jdW1lbnRMaXN0LlNJTkdMRV9DTElDS19OQVZJR0FUSU9OO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2FkRm9sZGVyKCk7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICBsZXQgY29sdW1ucyA9IHRoaXMuZGF0YS5nZXRDb2x1bW5zKCk7XG4gICAgICAgIGlmICghY29sdW1ucyB8fCBjb2x1bW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zZXR1cERlZmF1bHRDb2x1bW5zKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGlmIChjaGFuZ2VzWydjdXJyZW50Rm9sZGVySWQnXSAmJiBjaGFuZ2VzWydjdXJyZW50Rm9sZGVySWQnXS5jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICAgIGxldCBmb2xkZXJJZCA9IGNoYW5nZXNbJ2N1cnJlbnRGb2xkZXJJZCddLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMubG9hZEZvbGRlckJ5SWQoZm9sZGVySWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXRoID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmVtaXQoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFuZ2VzWydjdXJyZW50Rm9sZGVyUGF0aCddKSB7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gY2hhbmdlc1snY3VycmVudEZvbGRlclBhdGgnXS5jdXJyZW50VmFsdWUgfHwgdGhpcy5ERUZBVUxUX0ZPTERFUl9QQVRIO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Rm9sZGVyUGF0aCA9IHBhdGg7XG4gICAgICAgICAgICB0aGlzLmxvYWRGb2xkZXJCeVBhdGgocGF0aClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvbGRlckNoYW5nZS5lbWl0KHsgcGF0aDogcGF0aCB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmVtaXQoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFuZ2VzWydyb290Rm9sZGVySWQnXSkge1xuICAgICAgICAgICAgLy8gdGhpcy5jdXJyZW50Rm9sZGVyUGF0aCA9IHRoaXMuREVGQVVMVF9GT0xERVJfUEFUSDtcbiAgICAgICAgICAgIHRoaXMubG9hZEZvbGRlckJ5UGF0aCh0aGlzLmN1cnJlbnRGb2xkZXJQYXRoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGF0aCA9IHRoaXMuY3VycmVudEZvbGRlclBhdGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9sZGVyQ2hhbmdlLmVtaXQoeyBwYXRoOiB0aGlzLmN1cnJlbnRGb2xkZXJQYXRoIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IuZW1pdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNFbXB0eVRlbXBsYXRlRGVmaW5lZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVRhYmxlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5lbXB0eUZvbGRlclRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlzTW9iaWxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISEvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgfVxuXG4gICAgZ2V0Tm9kZUFjdGlvbnMobm9kZTogTWluaW1hbE5vZGVFbnRpdHkpOiBDb250ZW50QWN0aW9uTW9kZWxbXSB7XG4gICAgICAgIGxldCB0YXJnZXQgPSBudWxsO1xuXG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuZW50cnkpIHtcbiAgICAgICAgICAgIGlmIChub2RlLmVudHJ5LmlzRmlsZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldCA9ICdkb2N1bWVudCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub2RlLmVudHJ5LmlzRm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gJ2ZvbGRlcic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXQpIHtcblxuICAgICAgICAgICAgICAgIGxldCBsdGFyZ2V0ID0gdGFyZ2V0LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25zLmZpbHRlcihlbnRyeSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeS50YXJnZXQudG9Mb3dlckNhc2UoKSA9PT0gbHRhcmdldDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjb250ZXh0bWVudScsIFsnJGV2ZW50J10pXG4gICAgb25TaG93Q29udGV4dE1lbnUoZT86IEV2ZW50KSB7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwZXJmb3JtTmF2aWdhdGlvbihub2RlOiBNaW5pbWFsTm9kZUVudGl0eSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmVudHJ5ICYmIG5vZGUuZW50cnkuaXNGb2xkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEZvbGRlclBhdGggPSB0aGlzLmdldE5vZGVQYXRoKG5vZGUpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Rm9sZGVySWQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5sb2FkRm9sZGVyKCk7XG4gICAgICAgICAgICB0aGlzLmZvbGRlckNoYW5nZS5lbWl0KHsgcGF0aDogdGhpcy5jdXJyZW50Rm9sZGVyUGF0aCB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VkIHdoZW4gZXhlY3V0aW5nIGNvbnRlbnQgYWN0aW9uIGZvciBhIGRvY3VtZW50IG9yIGZvbGRlci5cbiAgICAgKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGJlIHRoZSBjb250ZXh0IG9mIHRoZSBleGVjdXRpb24uXG4gICAgICogQHBhcmFtIGFjdGlvbiBBY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWdhaW5zdCB0aGUgY29udGV4dC5cbiAgICAgKi9cbiAgICBleGVjdXRlQ29udGVudEFjdGlvbihub2RlOiBNaW5pbWFsTm9kZUVudGl0eSwgYWN0aW9uOiBDb250ZW50QWN0aW9uTW9kZWwpIHtcbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5lbnRyeSAmJiBhY3Rpb24pIHtcbiAgICAgICAgICAgIGFjdGlvbi5oYW5kbGVyKG5vZGUsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZEZvbGRlckJ5UGF0aChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYWRQYXRoKHBhdGgpO1xuICAgIH1cblxuICAgIGxvYWRGb2xkZXJCeUlkKGlkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYWRCeUlkKGlkKTtcbiAgICB9XG5cbiAgICByZWxvYWQoKSB7XG4gICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRGb2xkZXIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWRGb2xkZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRGb2xkZXJJZCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkRm9sZGVyQnlJZCh0aGlzLmN1cnJlbnRGb2xkZXJJZClcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvci5lbWl0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50Rm9sZGVyUGF0aCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkRm9sZGVyQnlQYXRoKHRoaXMuY3VycmVudEZvbGRlclBhdGgpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IuZW1pdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIHBhdGggZm9yIGEgZ2l2ZW4gbm9kZS5cbiAgICAgKiBAcGFyYW0gbm9kZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0Tm9kZVBhdGgobm9kZTogTWluaW1hbE5vZGVFbnRpdHkpOiBzdHJpbmcge1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgbGV0IHBhdGhXaXRoQ29tcGFueUhvbWUgPSBub2RlLmVudHJ5LnBhdGgubmFtZTtcbiAgICAgICAgICAgIHJldHVybiBwYXRoV2l0aENvbXBhbnlIb21lLnJlcGxhY2UoJy9Db21wYW55IEhvbWUnLCAnJykgKyAnLycgKyBub2RlLmVudHJ5Lm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHNldCBvZiBwcmVkZWZpbmVkIGNvbHVtbnMuXG4gICAgICovXG4gICAgc2V0dXBEZWZhdWx0Q29sdW1ucygpOiB2b2lkIHtcbiAgICAgICAgbGV0IGNvbFRodW1ibmFpbCA9IG5ldyBPYmplY3REYXRhQ29sdW1uKHtcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgICAgICBrZXk6ICckdGh1bWJuYWlsJyxcbiAgICAgICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgICAgIHNyVGl0bGU6ICdUaHVtYm5haWwnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBjb2xOYW1lID0gbmV3IE9iamVjdERhdGFDb2x1bW4oe1xuICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAga2V5OiAnbmFtZScsXG4gICAgICAgICAgICB0aXRsZTogJ05hbWUnLFxuICAgICAgICAgICAgY3NzQ2xhc3M6ICdmdWxsLXdpZHRoJyxcbiAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGF0YS5zZXRDb2x1bW5zKFtjb2xUaHVtYm5haWwsIGNvbE5hbWVdKTtcbiAgICB9XG5cbiAgICBvblByZXZpZXdGaWxlKG5vZGU6IE1pbmltYWxOb2RlRW50aXR5KSB7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICB0aGlzLnByZXZpZXcuZW1pdCh7XG4gICAgICAgICAgICAgICAgdmFsdWU6IG5vZGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Ob2RlQ2xpY2sobm9kZTogTWluaW1hbE5vZGVFbnRpdHkpIHtcbiAgICAgICAgdGhpcy5ub2RlQ2xpY2suZW1pdCh7XG4gICAgICAgICAgICB2YWx1ZTogbm9kZVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5uYXZpZ2F0ZSAmJiB0aGlzLm5hdmlnYXRpb25Nb2RlID09PSBEb2N1bWVudExpc3QuU0lOR0xFX0NMSUNLX05BVklHQVRJT04pIHtcbiAgICAgICAgICAgIGlmIChub2RlICYmIG5vZGUuZW50cnkpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5lbnRyeS5pc0ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblByZXZpZXdGaWxlKG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChub2RlLmVudHJ5LmlzRm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGVyZm9ybU5hdmlnYXRpb24obm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Sb3dDbGljayhldmVudDogRGF0YVJvd0V2ZW50KSB7XG4gICAgICAgIGxldCBpdGVtID0gKDxTaGFyZURhdGFSb3c+IGV2ZW50LnZhbHVlKS5ub2RlO1xuICAgICAgICB0aGlzLm9uTm9kZUNsaWNrKGl0ZW0pO1xuICAgIH1cblxuICAgIG9uTm9kZURibENsaWNrKG5vZGU6IE1pbmltYWxOb2RlRW50aXR5KSB7XG4gICAgICAgIHRoaXMubm9kZURibENsaWNrLmVtaXQoe1xuICAgICAgICAgICAgdmFsdWU6IG5vZGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubmF2aWdhdGUgJiYgdGhpcy5uYXZpZ2F0aW9uTW9kZSA9PT0gRG9jdW1lbnRMaXN0LkRPVUJMRV9DTElDS19OQVZJR0FUSU9OKSB7XG4gICAgICAgICAgICBpZiAobm9kZSAmJiBub2RlLmVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuZW50cnkuaXNGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25QcmV2aWV3RmlsZShub2RlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5lbnRyeS5pc0ZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBlcmZvcm1OYXZpZ2F0aW9uKG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUm93RGJsQ2xpY2soZXZlbnQ/OiBEYXRhUm93RXZlbnQpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSAoPFNoYXJlRGF0YVJvdz4gZXZlbnQudmFsdWUpLm5vZGU7XG4gICAgICAgIHRoaXMub25Ob2RlRGJsQ2xpY2soaXRlbSk7XG4gICAgfVxuXG4gICAgb25TaG93Um93Q29udGV4dE1lbnUoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnVBY3Rpb25zKSB7XG4gICAgICAgICAgICBsZXQgYXJncyA9IGV2ZW50LmFyZ3M7XG4gICAgICAgICAgICBsZXQgbm9kZSA9ICg8U2hhcmVEYXRhUm93PiBhcmdzLnJvdykubm9kZTtcbiAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgYXJncy5hY3Rpb25zID0gdGhpcy5nZXRDb250ZXh0QWN0aW9ucyhub2RlKSB8fCBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uU2hvd1Jvd0FjdGlvbnNNZW51KGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRBY3Rpb25zKSB7XG4gICAgICAgICAgICBsZXQgYXJncyA9IGV2ZW50LmFyZ3M7XG4gICAgICAgICAgICBsZXQgbm9kZSA9ICg8U2hhcmVEYXRhUm93PiBhcmdzLnJvdykubm9kZTtcbiAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgYXJncy5hY3Rpb25zID0gdGhpcy5nZXROb2RlQWN0aW9ucyhub2RlKSB8fCBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRXhlY3V0ZVJvd0FjdGlvbihldmVudCkge1xuICAgICAgICBpZiAodGhpcy5jb250ZW50QWN0aW9ucykge1xuICAgICAgICAgICAgbGV0IGFyZ3MgPSBldmVudC5hcmdzO1xuICAgICAgICAgICAgbGV0IG5vZGUgPSAoPFNoYXJlRGF0YVJvdz4gYXJncy5yb3cpLm5vZGU7XG4gICAgICAgICAgICBsZXQgYWN0aW9uID0gKDxDb250ZW50QWN0aW9uTW9kZWw+IGFyZ3MuYWN0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUNvbnRlbnRBY3Rpb24obm9kZSwgYWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQWN0aW9uTWVudUVycm9yKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZXJyb3IuZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgb25BY3Rpb25NZW51U3VjY2VzcyhldmVudCkge1xuICAgICAgICB0aGlzLnJlbG9hZCgpO1xuICAgICAgICB0aGlzLnN1Y2Nlc3MuZW1pdChldmVudCk7XG4gICAgfVxufVxuIl19

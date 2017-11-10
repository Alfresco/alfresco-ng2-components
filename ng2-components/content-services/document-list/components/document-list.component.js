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
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var core_2 = require("@adf/core");
var Rx_1 = require("rxjs/Rx");
var preset_model_1 = require("../models/preset.model");
var share_datatable_adapter_1 = require("./../data/share-datatable-adapter");
var content_action_model_1 = require("./../models/content-action.model");
var node_event_1 = require("./node.event");
var PaginationStrategy;
(function (PaginationStrategy) {
    PaginationStrategy[PaginationStrategy["Finite"] = 0] = "Finite";
    PaginationStrategy[PaginationStrategy["Infinite"] = 1] = "Infinite";
})(PaginationStrategy = exports.PaginationStrategy || (exports.PaginationStrategy = {}));
var DocumentListComponent = (function () {
    function DocumentListComponent(documentListService, ngZone, elementRef, apiService, appConfig, preferences) {
        this.documentListService = documentListService;
        this.ngZone = ngZone;
        this.elementRef = elementRef;
        this.apiService = apiService;
        this.appConfig = appConfig;
        this.preferences = preferences;
        this.permissionsStyle = [];
        this.locationFormat = '/';
        this.navigate = true;
        this.navigationMode = DocumentListComponent_1.DOUBLE_CLICK_NAVIGATION; // click|dblclick
        this.thumbnails = false;
        this.selectionMode = 'single'; // null|single|multiple
        this.multiselect = false;
        this.enablePagination = true;
        this.contentActions = false;
        this.contentActionsPosition = 'right'; // left|right
        this.contextMenuActions = false;
        this.pageSize = DocumentListComponent_1.DEFAULT_PAGE_SIZE;
        this.emptyFolderImageUrl = require('../assets/images/empty_doc_lib.svg');
        this.allowDropFiles = false;
        this.loading = false;
        this.paginationStrategy = PaginationStrategy.Finite;
        this.infiniteLoading = false;
        this.noPermission = false;
        this.selection = new Array();
        this.skipCount = 0;
        this.rowFilter = null;
        this.imageResolver = null;
        // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
        this.currentFolderId = null;
        this.folderNode = null;
        this.node = null;
        this.nodeClick = new core_1.EventEmitter();
        this.nodeDblClick = new core_1.EventEmitter();
        this.folderChange = new core_1.EventEmitter();
        this.preview = new core_1.EventEmitter();
        this.ready = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.actions = [];
        this.contextActionHandler = new Rx_1.Subject();
        this.layoutPresets = {};
        this.currentNodeAllowableOperations = [];
        this.CREATE_PERMISSION = 'create';
        this.defaultPageSizes = [5, 10, 15, 20];
        this.supportedPageSizes = appConfig.get('document-list.supportedPageSizes', this.defaultPageSizes);
    }
    DocumentListComponent_1 = DocumentListComponent;
    DocumentListComponent.prototype.getContextActions = function (node) {
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
    DocumentListComponent.prototype.contextActionCallback = function (action) {
        if (action) {
            this.executeContentAction(action.node, action.model);
        }
    };
    Object.defineProperty(DocumentListComponent.prototype, "hasCustomLayout", {
        get: function () {
            return this.columnList && this.columnList.columns && this.columnList.columns.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    DocumentListComponent.prototype.getDefaultPageSize = function () {
        var result = this.preferences.paginationSize;
        var pageSizes = this.supportedPageSizes || this.defaultPageSizes;
        if (pageSizes && pageSizes.length > 0 && pageSizes.indexOf(result) < 0) {
            result = pageSizes[0];
        }
        return result;
    };
    DocumentListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pageSize = this.getDefaultPageSize();
        this.loadLayoutPresets();
        this.data = new share_datatable_adapter_1.ShareDataTableAdapter(this.documentListService, null, this.getDefaultSorting());
        this.data.thumbnails = this.thumbnails;
        this.data.permissionsStyle = this.permissionsStyle;
        if (this.rowFilter) {
            this.data.setFilter(this.rowFilter);
        }
        if (this.imageResolver) {
            this.data.setImageResolver(this.imageResolver);
        }
        this.contextActionHandler.subscribe(function (val) { return _this.contextActionCallback(val); });
        this.enforceSingleClickNavigationForMobile();
    };
    DocumentListComponent.prototype.ngAfterContentInit = function () {
        var schema = [];
        if (this.hasCustomLayout) {
            schema = this.columnList.columns.map(function (c) { return c; });
        }
        if (!this.data) {
            this.data = new share_datatable_adapter_1.ShareDataTableAdapter(this.documentListService, schema, this.getDefaultSorting());
        }
        else if (schema && schema.length > 0) {
            this.data.setColumns(schema);
        }
        var columns = this.data.getColumns();
        if (!columns || columns.length === 0) {
            this.setupDefaultColumns(this.currentFolderId);
        }
    };
    DocumentListComponent.prototype.ngOnChanges = function (changes) {
        if (changes.folderNode && changes.folderNode.currentValue) {
            this.loadFolder();
        }
        else if (changes.currentFolderId && changes.currentFolderId.currentValue) {
            if (changes.currentFolderId.previousValue !== changes.currentFolderId.currentValue) {
                this.resetPagination();
                this.folderNode = null;
            }
            if (!this.hasCustomLayout) {
                this.setupDefaultColumns(changes.currentFolderId.currentValue);
            }
            this.loadFolderByNodeId(changes.currentFolderId.currentValue);
        }
        else if (this.data) {
            if (changes.node && changes.node.currentValue) {
                this.resetSelection();
                this.data.loadPage(changes.node.currentValue);
            }
            else if (changes.rowFilter) {
                this.data.setFilter(changes.rowFilter.currentValue);
                if (this.currentFolderId) {
                    this.loadFolderNodesByFolderNodeId(this.currentFolderId, this.pageSize, this.skipCount);
                }
            }
            else if (changes.imageResolver) {
                this.data.setImageResolver(changes.imageResolver.currentValue);
            }
        }
    };
    DocumentListComponent.prototype.reload = function (merge) {
        var _this = this;
        if (merge === void 0) { merge = false; }
        this.ngZone.run(function () {
            _this.resetSelection();
            if (_this.folderNode) {
                _this.loadFolder(merge);
            }
            else if (_this.currentFolderId) {
                _this.loadFolderByNodeId(_this.currentFolderId);
            }
            else if (_this.node) {
                _this.data.loadPage(_this.node);
                _this.ready.emit();
            }
        });
    };
    DocumentListComponent.prototype.isEmptyTemplateDefined = function () {
        if (this.dataTable) {
            if (this.emptyFolderTemplate) {
                return true;
            }
        }
        return false;
    };
    DocumentListComponent.prototype.isNoPermissionTemplateDefined = function () {
        if (this.dataTable) {
            if (this.noPermissionTemplate) {
                return true;
            }
        }
        return false;
    };
    DocumentListComponent.prototype.isMobile = function () {
        return !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    DocumentListComponent.prototype.isEmpty = function () {
        return !this.data || this.data.getRows().length === 0;
    };
    DocumentListComponent.prototype.isPaginationEnabled = function () {
        return this.enablePagination && !this.isEmpty();
    };
    DocumentListComponent.prototype.isPaginationNeeded = function () {
        return this.paginationStrategy === PaginationStrategy.Finite;
    };
    DocumentListComponent.prototype.getNodeActions = function (node) {
        var _this = this;
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
                var actionsByTarget = this.actions.filter(function (entry) {
                    return entry.target.toLowerCase() === ltarget_1;
                }).map(function (action) { return new content_action_model_1.ContentActionModel(action); });
                actionsByTarget.forEach(function (action) {
                    _this.checkPermission(node, action);
                });
                return actionsByTarget;
            }
        }
        return [];
    };
    DocumentListComponent.prototype.checkPermission = function (node, action) {
        if (action.permission) {
            if (this.hasPermissions(node)) {
                var permissions = node.entry.allowableOperations;
                var findPermission = permissions.find(function (permission) { return permission === action.permission; });
                if (!findPermission && action.disableWithNoPermission === true) {
                    action.disabled = true;
                }
            }
        }
        return action;
    };
    DocumentListComponent.prototype.hasPermissions = function (node) {
        return node.entry.allowableOperations ? true : false;
    };
    DocumentListComponent.prototype.onShowContextMenu = function (e) {
        if (e && this.contextMenuActions) {
            e.preventDefault();
        }
    };
    DocumentListComponent.prototype.performNavigation = function (node) {
        if (this.canNavigateFolder(node)) {
            this.currentFolderId = node.entry.id;
            this.folderNode = node.entry;
            this.skipCount = 0;
            this.currentNodeAllowableOperations = node.entry['allowableOperations'] ? node.entry['allowableOperations'] : [];
            this.loadFolder();
            this.folderChange.emit(new node_event_1.NodeEntryEvent(node.entry));
            return true;
        }
        return false;
    };
    /**
     * Invoked when executing content action for a document or folder.
     * @param node Node to be the context of the execution.
     * @param action Action to be executed against the context.
     */
    DocumentListComponent.prototype.executeContentAction = function (node, action) {
        if (node && node.entry && action) {
            var handlerSub = void 0;
            if (typeof action.handler === 'function') {
                handlerSub = action.handler(node, this, action.permission);
            }
            else {
                handlerSub = Rx_1.Observable.of(true);
            }
            if (typeof action.execute === 'function') {
                handlerSub.subscribe(function () { action.execute(node); });
            }
        }
    };
    DocumentListComponent.prototype.loadFolder = function (merge) {
        var _this = this;
        if (merge === void 0) { merge = false; }
        if (merge) {
            this.infiniteLoading = true;
        }
        else {
            this.loading = true;
        }
        var nodeId = this.folderNode ? this.folderNode.id : this.currentFolderId;
        if (nodeId) {
            this.loadFolderNodesByFolderNodeId(nodeId, this.pageSize, this.skipCount, merge).catch(function (err) { return _this.error.emit(err); });
        }
    };
    // gets folder node and its content
    DocumentListComponent.prototype.loadFolderByNodeId = function (nodeId) {
        var _this = this;
        this.loading = true;
        this.resetSelection();
        if (nodeId === '-trashcan-') {
            this.loadTrashcan();
        }
        else if (nodeId === '-sharedlinks-') {
            this.loadSharedLinks();
        }
        else if (nodeId === '-sites-') {
            this.loadSites();
        }
        else if (nodeId === '-mysites-') {
            this.loadMemberSites();
        }
        else if (nodeId === '-favorites-') {
            this.loadFavorites();
        }
        else if (nodeId === '-recent-') {
            this.loadRecent();
        }
        else {
            this.documentListService
                .getFolderNode(nodeId)
                .then(function (node) {
                _this.folderNode = node;
                _this.currentFolderId = node.id;
                _this.skipCount = 0;
                _this.currentNodeAllowableOperations = node['allowableOperations'] ? node['allowableOperations'] : [];
                return _this.loadFolderNodesByFolderNodeId(node.id, _this.pageSize, _this.skipCount);
            })
                .catch(function (err) {
                if (JSON.parse(err.message).error.statusCode === 403) {
                    _this.loading = false;
                    _this.noPermission = true;
                }
                _this.error.emit(err);
            });
        }
    };
    DocumentListComponent.prototype.loadFolderNodesByFolderNodeId = function (id, maxItems, skipCount, merge) {
        var _this = this;
        if (merge === void 0) { merge = false; }
        return new Promise(function (resolve, reject) {
            _this.resetSelection();
            _this.documentListService
                .getFolder(null, {
                maxItems: maxItems,
                skipCount: skipCount,
                rootFolderId: id
            })
                .subscribe(function (val) {
                if (_this.isCurrentPageEmpty(val, skipCount)) {
                    _this.updateSkipCount(skipCount - maxItems);
                    _this.loadFolderNodesByFolderNodeId(id, maxItems, skipCount - maxItems).then(function () { return resolve(true); }, function (error) { return reject(error); });
                }
                else {
                    _this.data.loadPage(val, merge);
                    _this.pagination = val.list.pagination;
                    _this.loading = false;
                    _this.infiniteLoading = false;
                    _this.ready.emit();
                    resolve(true);
                }
            }, function (error) {
                reject(error);
            });
        });
    };
    DocumentListComponent.prototype.resetSelection = function () {
        this.dataTable.resetSelection();
        this.selection = [];
    };
    DocumentListComponent.prototype.resetPagination = function () {
        this.skipCount = 0;
    };
    DocumentListComponent.prototype.loadTrashcan = function () {
        var _this = this;
        var options = {
            include: ['path', 'properties'],
            maxItems: this.pageSize,
            skipCount: this.skipCount
        };
        this.apiService.nodesApi.getDeletedNodes(options)
            .then(function (page) { return _this.onPageLoaded(page); })
            .catch(function (error) { return _this.error.emit(error); });
    };
    DocumentListComponent.prototype.loadSharedLinks = function () {
        var _this = this;
        var options = {
            include: ['properties', 'allowableOperations', 'path'],
            maxItems: this.pageSize,
            skipCount: this.skipCount
        };
        this.apiService.sharedLinksApi.findSharedLinks(options)
            .then(function (page) { return _this.onPageLoaded(page); })
            .catch(function (error) { return _this.error.emit(error); });
    };
    DocumentListComponent.prototype.loadSites = function () {
        var _this = this;
        var options = {
            include: ['properties'],
            maxItems: this.pageSize,
            skipCount: this.skipCount
        };
        this.apiService.sitesApi.getSites(options)
            .then(function (page) { return _this.onPageLoaded(page); })
            .catch(function (error) { return _this.error.emit(error); });
    };
    DocumentListComponent.prototype.loadMemberSites = function () {
        var _this = this;
        var options = {
            include: ['properties'],
            maxItems: this.pageSize,
            skipCount: this.skipCount
        };
        this.apiService.peopleApi.getSiteMembership('-me-', options)
            .then(function (result) {
            var page = {
                list: {
                    entries: result.list.entries
                        .map(function (_a) {
                        var site = _a.entry.site;
                        return ({
                            entry: site
                        });
                    }),
                    pagination: result.list.pagination
                }
            };
            _this.onPageLoaded(page);
        })
            .catch(function (error) { return _this.error.emit(error); });
    };
    DocumentListComponent.prototype.loadFavorites = function () {
        var _this = this;
        var options = {
            maxItems: this.pageSize,
            skipCount: this.skipCount,
            where: '(EXISTS(target/file) OR EXISTS(target/folder))',
            include: ['properties', 'allowableOperations', 'path']
        };
        this.apiService.favoritesApi.getFavorites('-me-', options)
            .then(function (result) {
            var page = {
                list: {
                    entries: result.list.entries
                        .map(function (_a) {
                        var target = _a.entry.target;
                        return ({
                            entry: target.file || target.folder
                        });
                    })
                        .map(function (_a) {
                        var entry = _a.entry;
                        entry.properties = {
                            'cm:title': entry.title,
                            'cm:description': entry.description
                        };
                        return { entry: entry };
                    }),
                    pagination: result.list.pagination
                }
            };
            _this.onPageLoaded(page);
        })
            .catch(function (error) { return _this.error.emit(error); });
    };
    DocumentListComponent.prototype.loadRecent = function () {
        var _this = this;
        this.apiService.peopleApi.getPerson('-me-')
            .then(function (person) {
            var username = person.entry.id;
            var query = {
                query: {
                    query: '*',
                    language: 'afts'
                },
                filterQueries: [
                    { query: "cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]" },
                    { query: "cm:modifier:" + username + " OR cm:creator:" + username },
                    { query: "TYPE:\"content\" AND -TYPE:\"app:filelink\" AND -TYPE:\"fm:post\"" }
                ],
                include: ['path', 'properties', 'allowableOperations'],
                sort: [{
                        type: 'FIELD',
                        field: 'cm:modified',
                        ascending: false
                    }],
                paging: {
                    maxItems: _this.pageSize,
                    skipCount: _this.skipCount
                }
            };
            return _this.apiService.searchApi.search(query);
        })
            .then(function (page) { return _this.onPageLoaded(page); })
            .catch(function (error) { return _this.error.emit(error); });
    };
    DocumentListComponent.prototype.onPageLoaded = function (page) {
        if (page) {
            this.data.loadPage(page);
            this.pagination = page.list.pagination;
            this.loading = false;
            this.ready.emit();
        }
    };
    DocumentListComponent.prototype.isCurrentPageEmpty = function (node, skipCount) {
        return !this.hasNodeEntries(node) && this.hasPages(skipCount);
    };
    DocumentListComponent.prototype.hasPages = function (skipCount) {
        return skipCount > 0 && this.isPaginationEnabled();
    };
    DocumentListComponent.prototype.hasNodeEntries = function (node) {
        return node && node.list && node.list.entries && node.list.entries.length > 0;
    };
    /**
     * Creates a set of predefined columns.
     */
    DocumentListComponent.prototype.setupDefaultColumns = function (preset) {
        if (preset === void 0) { preset = 'default'; }
        if (this.data) {
            var columns = this.getLayoutPreset(preset);
            this.data.setColumns(columns);
        }
    };
    DocumentListComponent.prototype.onPreviewFile = function (node) {
        if (node) {
            this.preview.emit(new node_event_1.NodeEntityEvent(node));
        }
    };
    DocumentListComponent.prototype.onNodeClick = function (node) {
        var domEvent = new CustomEvent('node-click', {
            detail: {
                sender: this,
                node: node
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
        var event = new node_event_1.NodeEntityEvent(node);
        this.nodeClick.emit(event);
        if (!event.defaultPrevented) {
            if (this.navigate && this.navigationMode === DocumentListComponent_1.SINGLE_CLICK_NAVIGATION) {
                if (node && node.entry) {
                    if (node.entry.isFile) {
                        this.onPreviewFile(node);
                    }
                    if (node.entry.isFolder) {
                        this.performNavigation(node);
                    }
                }
            }
        }
    };
    DocumentListComponent.prototype.onNodeDblClick = function (node) {
        var domEvent = new CustomEvent('node-dblclick', {
            detail: {
                sender: this,
                node: node
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
        var event = new node_event_1.NodeEntityEvent(node);
        this.nodeDblClick.emit(event);
        if (!event.defaultPrevented) {
            if (this.navigate && this.navigationMode === DocumentListComponent_1.DOUBLE_CLICK_NAVIGATION) {
                if (node && node.entry) {
                    if (node.entry.isFile) {
                        this.onPreviewFile(node);
                    }
                    if (node.entry.isFolder) {
                        this.performNavigation(node);
                    }
                }
            }
        }
    };
    DocumentListComponent.prototype.onNodeSelect = function (event) {
        this.selection = event.selection.map(function (entry) { return entry.node; });
        var domEvent = new CustomEvent('node-select', {
            detail: {
                node: event.row.node,
                selection: this.selection
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    };
    DocumentListComponent.prototype.onNodeUnselect = function (event) {
        this.selection = event.selection.map(function (entry) { return entry.node; });
        var domEvent = new CustomEvent('node-unselect', {
            detail: {
                node: event.row.node,
                selection: this.selection
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    };
    DocumentListComponent.prototype.onShowRowContextMenu = function (event) {
        if (this.contextMenuActions) {
            var args = event.value;
            var node = args.row.node;
            if (node) {
                args.actions = this.getContextActions(node) || [];
            }
        }
    };
    DocumentListComponent.prototype.onShowRowActionsMenu = function (event) {
        if (this.contentActions) {
            var args = event.value;
            var node = args.row.node;
            if (node) {
                args.actions = this.getNodeActions(node) || [];
            }
        }
    };
    DocumentListComponent.prototype.onExecuteRowAction = function (event) {
        if (this.contentActions) {
            var args = event.value;
            var node = args.row.node;
            var action = args.action;
            this.executeContentAction(node, action);
        }
    };
    DocumentListComponent.prototype.onChangePageSize = function (event) {
        this.preferences.paginationSize = event.maxItems;
        this.pageSize = event.maxItems;
        this.skipCount = 0;
        this.reload();
    };
    DocumentListComponent.prototype.onChangePageNumber = function (page) {
        this.pageSize = page.maxItems;
        this.skipCount = page.skipCount;
        this.reload();
    };
    DocumentListComponent.prototype.onNextPage = function (event) {
        this.skipCount = event.skipCount;
        this.reload();
    };
    DocumentListComponent.prototype.loadNextBatch = function (event) {
        this.skipCount = event.skipCount;
        this.reload(true);
    };
    DocumentListComponent.prototype.onPrevPage = function (event) {
        this.skipCount = event.skipCount;
        this.reload();
    };
    DocumentListComponent.prototype.enforceSingleClickNavigationForMobile = function () {
        if (this.isMobile()) {
            this.navigationMode = DocumentListComponent_1.SINGLE_CLICK_NAVIGATION;
        }
    };
    DocumentListComponent.prototype.getDefaultSorting = function () {
        var defaultSorting;
        if (this.sorting) {
            var _a = this.sorting, key = _a[0], direction = _a[1];
            defaultSorting = new core_2.DataSorting(key, direction);
        }
        return defaultSorting;
    };
    DocumentListComponent.prototype.canNavigateFolder = function (node) {
        if (this.isCustomSource(this.currentFolderId)) {
            return false;
        }
        if (node && node.entry && node.entry.isFolder) {
            return true;
        }
        return false;
    };
    DocumentListComponent.prototype.isCustomSource = function (folderId) {
        var sources = ['-trashcan-', '-sharedlinks-', '-sites-', '-mysites-', '-favorites-', '-recent-'];
        if (sources.indexOf(folderId) > -1) {
            return true;
        }
        return false;
    };
    DocumentListComponent.prototype.updateSkipCount = function (newSkipCount) {
        this.skipCount = newSkipCount;
    };
    DocumentListComponent.prototype.hasCurrentNodePermission = function (permission) {
        var hasPermission = false;
        if (this.currentNodeAllowableOperations.length > 0) {
            var permFound = this.currentNodeAllowableOperations.find(function (element) { return element === permission; });
            hasPermission = permFound ? true : false;
        }
        return hasPermission;
    };
    DocumentListComponent.prototype.hasCreatePermission = function () {
        return this.hasCurrentNodePermission(this.CREATE_PERMISSION);
    };
    DocumentListComponent.prototype.loadLayoutPresets = function () {
        var externalSettings = this.appConfig.get('document-list.presets', null);
        if (externalSettings) {
            this.layoutPresets = Object.assign({}, preset_model_1.presetsDefaultModel, externalSettings);
        }
        else {
            this.layoutPresets = preset_model_1.presetsDefaultModel;
        }
    };
    DocumentListComponent.prototype.getLayoutPreset = function (name) {
        if (name === void 0) { name = 'default'; }
        return (this.layoutPresets[name] || this.layoutPresets['default']).map(function (col) { return new core_2.ObjectDataColumn(col); });
    };
    DocumentListComponent.SINGLE_CLICK_NAVIGATION = 'click';
    DocumentListComponent.DOUBLE_CLICK_NAVIGATION = 'dblclick';
    DocumentListComponent.DEFAULT_PAGE_SIZE = 20;
    __decorate([
        core_1.ContentChild(ng2_alfresco_core_1.DataColumnListComponent)
    ], DocumentListComponent.prototype, "columnList", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "permissionsStyle", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "locationFormat", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "navigate", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "navigationMode", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "thumbnails", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "selectionMode", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "multiselect", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "enablePagination", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "contentActions", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "contentActionsPosition", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "contextMenuActions", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "pageSize", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "emptyFolderImageUrl", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "allowDropFiles", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "sorting", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "rowStyle", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "rowStyleClass", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "loading", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "paginationStrategy", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "supportedPageSizes", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "rowFilter", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "imageResolver", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "currentFolderId", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "folderNode", void 0);
    __decorate([
        core_1.Input()
    ], DocumentListComponent.prototype, "node", void 0);
    __decorate([
        core_1.Output()
    ], DocumentListComponent.prototype, "nodeClick", void 0);
    __decorate([
        core_1.Output()
    ], DocumentListComponent.prototype, "nodeDblClick", void 0);
    __decorate([
        core_1.Output()
    ], DocumentListComponent.prototype, "folderChange", void 0);
    __decorate([
        core_1.Output()
    ], DocumentListComponent.prototype, "preview", void 0);
    __decorate([
        core_1.Output()
    ], DocumentListComponent.prototype, "ready", void 0);
    __decorate([
        core_1.Output()
    ], DocumentListComponent.prototype, "error", void 0);
    __decorate([
        core_1.ViewChild(core_2.DataTableComponent)
    ], DocumentListComponent.prototype, "dataTable", void 0);
    __decorate([
        core_1.HostListener('contextmenu', ['$event'])
    ], DocumentListComponent.prototype, "onShowContextMenu", null);
    DocumentListComponent = DocumentListComponent_1 = __decorate([
        core_1.Component({
            selector: 'adf-document-list',
            styleUrls: ['./document-list.component.scss'],
            templateUrl: './document-list.component.html',
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DocumentListComponent);
    return DocumentListComponent;
    var DocumentListComponent_1;
}());
exports.DocumentListComponent = DocumentListComponent;

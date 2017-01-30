!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in v||(v[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==g.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=v[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(g.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=v[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return y[e]||(y[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},{id:r.name});t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=v[s],f=y[s];f?l=f.exports:c&&!c.declarative?l=c.esModule:c?(d(c),f=c.module,l=f.exports):l=p(s),f&&f.importers?(f.importers.push(t),t.dependencies.push(f)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=v[e];if(t)t.declarative?f(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=p(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=v[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);void 0!==typeof c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(r){var t={};if(("object"==typeof r||"function"==typeof r)&&r!==e)if(m)for(var n in r)"default"!==n&&c(t,r,n);else{var o=r&&r.hasOwnProperty;for(var n in r)"default"===n||o&&!r.hasOwnProperty(n)||(t[n]=r[n])}return t["default"]=r,x(t,"__useDefault",{value:!0}),t}function c(e,r,t){try{var n;(n=Object.getOwnPropertyDescriptor(r,t))&&x(e,t,n)}catch(o){return e[t]=r[t],!1}}function f(r,t){var n=v[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==g.call(t,u)&&(v[u]?f(u,t):p(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function p(e){if(I[e])return I[e];if("@node/"==e.substr(0,6))return I[e]=s(D(e.substr(6)));var r=v[e];if(!r)throw"Module "+e+" not present.";return a(e),f(e,[]),v[e]=void 0,r.declarative&&x(r.module.exports,"__esModule",{value:!0}),I[e]=r.declarative?r.module.exports:r.esModule}var v={},g=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},m=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(h){m=!1}var x;!function(){try{Object.defineProperty({},"a",{})&&(x=Object.defineProperty)}catch(e){x=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var y={},D="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,I={"@empty":{}};return function(e,n,o,a){return function(u){u(function(u){for(var d={_nodeRequire:D,register:r,registerDynamic:t,get:p,set:function(e,r){I[e]=r},newModule:function(e){return e}},i=0;i<n.length;i++)(function(e,r){r&&r.__esModule?I[e]=r:I[e]=s(r)})(n[i],arguments[i]);a(d);var l=p(e[0]);if(e.length>1)for(var i=1;i<e.length;i++)p(e[i]);return o?l["default"]:l})}}}("undefined"!=typeof self?self:global)

(["1"], ["3","a","4","7","c"], true, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
$__System.registerDynamic("2", ["3", "4", "5", "6", "7"], true, function ($__require, exports, module) {
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

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = this && this.__param || function (paramIndex, decorator) {
        return function (target, key) {
            decorator(target, key, paramIndex);
        };
    };
    var core_1 = $__require("3");
    var router_1 = $__require("4");
    var alfresco_search_service_1 = $__require("5");
    var alfresco_thumbnail_service_1 = $__require("6");
    var ng2_alfresco_core_1 = $__require("7");
    var AlfrescoSearchComponent = AlfrescoSearchComponent_1 = function () {
        function AlfrescoSearchComponent(alfrescoSearchService, translate, _alfrescoThumbnailService, route) {
            this.alfrescoSearchService = alfrescoSearchService;
            this.translate = translate;
            this._alfrescoThumbnailService = _alfrescoThumbnailService;
            this.route = route;
            this.searchTerm = '';
            this.maxResults = 20;
            this.resultSort = null;
            this.rootNodeId = '-root-';
            this.resultType = null;
            this.navigationMode = AlfrescoSearchComponent_1.DOUBLE_CLICK_NAVIGATION;
            this.navigate = new core_1.EventEmitter();
            this.resultsLoad = new core_1.EventEmitter();
            this.results = null;
            this.queryParamName = 'q';
            this.baseComponentPath = module.id.replace('/components/alfresco-search.component.js', '');
        }
        AlfrescoSearchComponent.prototype.ngOnInit = function () {
            var _this = this;
            if (this.translate !== null) {
                this.translate.addTranslationFolder('ng2-alfresco-search', 'node_modules/ng2-alfresco-search/src');
            }
            if (this.route) {
                this.route.params.forEach(function (params) {
                    _this.searchTerm = params.hasOwnProperty(_this.queryParamName) ? params[_this.queryParamName] : null;
                    _this.displaySearchResults(_this.searchTerm);
                });
            } else {
                this.displaySearchResults(this.searchTerm);
            }
        };
        AlfrescoSearchComponent.prototype.ngOnChanges = function (changes) {
            if (changes['searchTerm']) {
                this.searchTerm = changes['searchTerm'].currentValue;
                this.displaySearchResults(this.searchTerm);
            }
        };
        AlfrescoSearchComponent.prototype.getMimeTypeIcon = function (node) {
            if (node.entry.content && node.entry.content.mimeType) {
                var icon = this._alfrescoThumbnailService.getMimeTypeIcon(node.entry.content.mimeType);
                return this.resolveIconPath(icon);
            } else if (node.entry.isFolder) {
                return this.baseComponentPath + "/../assets/images/ft_ic_folder.svg";
            }
        };
        AlfrescoSearchComponent.prototype.resolveIconPath = function (icon) {
            return this.baseComponentPath + "/../assets/images/" + icon;
        };
        AlfrescoSearchComponent.prototype.getMimeTypeKey = function (node) {
            if (node.entry.content && node.entry.content.mimeType) {
                return 'SEARCH.ICONS.' + this._alfrescoThumbnailService.getMimeTypeKey(node.entry.content.mimeType);
            } else {
                return '';
            }
        };
        AlfrescoSearchComponent.prototype.displaySearchResults = function (searchTerm) {
            var _this = this;
            if (searchTerm && this.alfrescoSearchService) {
                var searchOpts = {
                    include: ['path'],
                    rootNodeId: this.rootNodeId,
                    nodeType: this.resultType,
                    maxItems: this.maxResults,
                    orderBy: this.resultSort
                };
                this.alfrescoSearchService.getNodeQueryResults(searchTerm, searchOpts).subscribe(function (results) {
                    _this.results = results.list.entries;
                    _this.resultsLoad.emit(_this.results);
                    _this.errorMessage = null;
                }, function (error) {
                    _this.results = null;
                    _this.errorMessage = error;
                    _this.resultsLoad.error(error);
                });
            }
        };
        AlfrescoSearchComponent.prototype.onItemClick = function (node, event) {
            if (this.navigate && this.navigationMode === AlfrescoSearchComponent_1.SINGLE_CLICK_NAVIGATION) {
                if (node && node.entry) {
                    this.navigate.emit(node);
                }
            }
        };
        AlfrescoSearchComponent.prototype.onItemDblClick = function (node) {
            if (this.navigate && this.navigationMode === AlfrescoSearchComponent_1.DOUBLE_CLICK_NAVIGATION) {
                if (node && node.entry) {
                    this.navigate.emit(node);
                }
            }
        };
        return AlfrescoSearchComponent;
    }();
    AlfrescoSearchComponent.SINGLE_CLICK_NAVIGATION = 'click';
    AlfrescoSearchComponent.DOUBLE_CLICK_NAVIGATION = 'dblclick';
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchComponent.prototype, "searchTerm", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Number)], AlfrescoSearchComponent.prototype, "maxResults", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchComponent.prototype, "resultSort", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchComponent.prototype, "rootNodeId", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchComponent.prototype, "resultType", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchComponent.prototype, "navigationMode", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], AlfrescoSearchComponent.prototype, "navigate", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], AlfrescoSearchComponent.prototype, "resultsLoad", void 0);
    AlfrescoSearchComponent = AlfrescoSearchComponent_1 = __decorate([core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-search',
        styles: [":host .mdl-data-table caption {     margin: 0 0 16px 0;     text-align: left; } :host .mdl-data-table td {     white-space: nowrap; } :host .mdl-data-table td.col-mimetype-icon {     width: 24px; } :host .col-display-name {     min-width: 250px;     overflow: hidden;     text-overflow: ellipsis; }"],
        template: "<table data-automation-id=\"search_result_table\" *ngIf=\"results && results.length && searchTerm\" class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width\">     <caption data-automation-id=\"search_result_found\">{{ 'SEARCH.RESULTS.SUMMARY' | translate:{numResults: results.length, searchTerm: searchTerm} }}</caption>     <thead>     <tr>         <td class=\"mdl-data-table__cell--non-numeric col-mimetype-icon\"></td>         <th class=\"mdl-data-table__cell--non-numeric col-display-name\">             {{'SEARCH.RESULTS.COLUMNS.NAME' | translate}}         </th>         <th class=\"mdl-data-table__cell--non-numeric col-modified-by\">             {{'SEARCH.RESULTS.COLUMNS.MODIFIED_BY' | translate}}         </th>         <th class=\"mdl-data-table__cell--non-numeric col-modified-at\">             {{'SEARCH.RESULTS.COLUMNS.MODIFIED_AT' | translate}}         </th>     </tr>     </thead>     <tbody>      <tr  id=\"result_row_{{idx}}\" tabindex=\"0\" *ngFor=\"let result of results; let idx = index\" (click)=\"onItemClick(result, $event)\" (dblclick)=\"onItemDblClick(result, $event)\" (keyup.enter)=\"onItemClick(result, $event)\">         <td class=\"col-mimetype-icon\"><img src=\"{{getMimeTypeIcon(result)}}\" alt=\"{{getMimeTypeKey(result)|translate}}\" /></td>         <td id=\"result_name_{{idx}}\" class=\"mdl-data-table__cell--non-numeric col-display-name\"             attr.data-automation-id=file_{{result.entry.name}} >{{result.entry.name}}</td>         <td id=\"result_user_{{idx}}\" class=\"mdl-data-table__cell--non-numeric  col-modified-by\"             attr.data-automation-id=file_{{result.entry.name}}_{{result.entry.modifiedByUser.displayName}}>{{result.entry.modifiedByUser.displayName}}</td>         <td class=\"col-modified-at\">{{result.entry.modifiedAt | date}}</td>     </tr>      </tbody> </table> <table id=\"search_no_result\" data-automation-id=\"search_no_result_found\" *ngIf=\"results && results.length === 0\"        class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width\">     <tbody>     <tr>         <td class=\"mdl-data-table__cell--non-numeric\">{{ 'SEARCH.RESULTS.NONE' | translate:{searchTerm: searchTerm} }}</td>     </tr>     </tbody> </table> <p data-automation-id=\"search_error_message\" *ngIf=\"errorMessage\">{{ 'SEARCH.RESULTS.ERROR' | translate:{errorMessage: errorMessage} }}</p>"
    }), __param(3, core_1.Optional()), __metadata("design:paramtypes", [alfresco_search_service_1.AlfrescoSearchService, ng2_alfresco_core_1.AlfrescoTranslationService, alfresco_thumbnail_service_1.AlfrescoThumbnailService, router_1.ActivatedRoute])], AlfrescoSearchComponent);
    exports.AlfrescoSearchComponent = AlfrescoSearchComponent;
    var AlfrescoSearchComponent_1;
    return module.exports;
});
$__System.registerDynamic('8', [], true, function ($__require, exports, module) {
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

    var define,
        global = this || self,
        GLOBAL = global;
    var SearchTermValidator = function () {
        function SearchTermValidator() {}
        SearchTermValidator.minAlphanumericChars = function (minChars) {
            return function (control) {
                return ('' + control.value).replace(/[^0-9a-zA-Z]+/g, '').length >= minChars ? null : {
                    hasMinAlphanumericChars: false
                };
            };
        };
        return SearchTermValidator;
    }();
    exports.SearchTermValidator = SearchTermValidator;
    return module.exports;
});
$__System.registerDynamic("9", ["a", "3", "7", "b", "8", "c"], true, function ($__require, exports, module) {
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

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var forms_1 = $__require("a");
    var core_1 = $__require("3");
    var ng2_alfresco_core_1 = $__require("7");
    var alfresco_search_autocomplete_component_1 = $__require("b");
    var search_term_validator_1 = $__require("8");
    var Rx_1 = $__require("c");
    var AlfrescoSearchControlComponent = function () {
        function AlfrescoSearchControlComponent(translate) {
            this.translate = translate;
            this.searchTerm = '';
            this.inputType = 'text';
            this.autocomplete = false;
            this.expandable = true;
            this.searchChange = new core_1.EventEmitter();
            this.searchSubmit = new core_1.EventEmitter();
            this.fileSelect = new core_1.EventEmitter();
            this.expand = new core_1.EventEmitter();
            this.liveSearchEnabled = true;
            this.liveSearchTerm = '';
            this.liveSearchRoot = '-root-';
            this.liveSearchResultType = null;
            this.liveSearchResultSort = null;
            this.liveSearchMaxResults = 5;
            this.searchActive = false;
            this.searchValid = false;
            this.focusSubject = new Rx_1.Subject();
            this.searchControl = new forms_1.FormControl(this.searchTerm, forms_1.Validators.compose([forms_1.Validators.required, search_term_validator_1.SearchTermValidator.minAlphanumericChars(3)]));
        }
        AlfrescoSearchControlComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.searchControl.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(function (value) {
                _this.onSearchTermChange(value);
            });
            this.setupFocusEventHandlers();
            this.translate.addTranslationFolder('ng2-alfresco-search', 'node_modules/ng2-alfresco-search/src');
        };
        AlfrescoSearchControlComponent.prototype.ngOnDestroy = function () {
            this.focusSubject.unsubscribe();
        };
        AlfrescoSearchControlComponent.prototype.onSearchTermChange = function (value) {
            this.liveSearchTerm = value;
            this.searchControl.setValue(value, true);
            this.searchValid = this.searchControl.valid;
            this.searchChange.emit({
                value: value,
                valid: this.searchValid
            });
        };
        AlfrescoSearchControlComponent.prototype.setupFocusEventHandlers = function () {
            var _this = this;
            var focusEvents = this.focusSubject.asObservable().debounceTime(50);
            focusEvents.filter(function ($event) {
                return $event.type === 'focusin' || $event.type === 'focus';
            }).subscribe(function ($event) {
                _this.onSearchFocus($event);
            });
            focusEvents.filter(function ($event) {
                return $event.type === 'focusout' || $event.type === 'blur';
            }).subscribe(function ($event) {
                _this.onSearchBlur($event);
            });
        };
        AlfrescoSearchControlComponent.prototype.getTextFieldClassName = function () {
            return 'mdl-textfield mdl-js-textfield' + (this.expandable ? ' mdl-textfield--expandable' : '');
        };
        AlfrescoSearchControlComponent.prototype.getTextFieldHolderClassName = function () {
            return this.expandable ? 'search-field mdl-textfield__expandable-holder' : 'search-field';
        };
        AlfrescoSearchControlComponent.prototype.getAutoComplete = function () {
            return this.autocomplete ? 'on' : 'off';
        };
        AlfrescoSearchControlComponent.prototype.onSearch = function (event) {
            this.searchControl.setValue(this.searchTerm, true);
            if (this.searchControl.valid) {
                this.searchSubmit.emit({
                    value: this.searchTerm
                });
                this.searchInput.nativeElement.blur();
            }
        };
        AlfrescoSearchControlComponent.prototype.isAutoCompleteDisplayed = function () {
            return this.searchActive;
        };
        AlfrescoSearchControlComponent.prototype.setAutoCompleteDisplayed = function (display) {
            this.searchActive = display;
        };
        AlfrescoSearchControlComponent.prototype.onFileClicked = function (event) {
            this.setAutoCompleteDisplayed(false);
            this.fileSelect.emit(event);
        };
        AlfrescoSearchControlComponent.prototype.onSearchFocus = function ($event) {
            this.setAutoCompleteDisplayed(true);
        };
        AlfrescoSearchControlComponent.prototype.onSearchBlur = function ($event) {
            this.setAutoCompleteDisplayed(false);
        };
        AlfrescoSearchControlComponent.prototype.onFocus = function ($event) {
            if (this.expandable) {
                this.expand.emit({
                    expanded: true
                });
            }
            this.focusSubject.next($event);
        };
        AlfrescoSearchControlComponent.prototype.onBlur = function ($event) {
            if (this.expandable && (this.searchControl.value === '' || this.searchControl.value === undefined)) {
                this.expand.emit({
                    expanded: false
                });
            }
            this.focusSubject.next($event);
        };
        AlfrescoSearchControlComponent.prototype.onEscape = function () {
            this.setAutoCompleteDisplayed(false);
        };
        AlfrescoSearchControlComponent.prototype.onArrowDown = function () {
            if (this.isAutoCompleteDisplayed()) {
                this.liveSearchComponent.focusResult();
            } else {
                this.setAutoCompleteDisplayed(true);
            }
        };
        AlfrescoSearchControlComponent.prototype.onAutoCompleteFocus = function ($event) {
            this.focusSubject.next($event);
        };
        AlfrescoSearchControlComponent.prototype.onAutoCompleteReturn = function ($event) {
            if (this.searchInput) {
                this.searchInput.nativeElement.focus();
            }
        };
        AlfrescoSearchControlComponent.prototype.onAutoCompleteCancel = function ($event) {
            if (this.searchInput) {
                this.searchInput.nativeElement.focus();
            }
            this.setAutoCompleteDisplayed(false);
        };
        return AlfrescoSearchControlComponent;
    }();
    __decorate([core_1.Input(), __metadata("design:type", Object)], AlfrescoSearchControlComponent.prototype, "searchTerm", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Object)], AlfrescoSearchControlComponent.prototype, "inputType", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], AlfrescoSearchControlComponent.prototype, "autocomplete", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], AlfrescoSearchControlComponent.prototype, "expandable", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], AlfrescoSearchControlComponent.prototype, "searchChange", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], AlfrescoSearchControlComponent.prototype, "searchSubmit", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], AlfrescoSearchControlComponent.prototype, "fileSelect", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], AlfrescoSearchControlComponent.prototype, "expand", void 0);
    __decorate([core_1.ViewChild('searchInput', {}), __metadata("design:type", core_1.ElementRef)], AlfrescoSearchControlComponent.prototype, "searchInput", void 0);
    __decorate([core_1.ViewChild(alfresco_search_autocomplete_component_1.AlfrescoSearchAutocompleteComponent), __metadata("design:type", alfresco_search_autocomplete_component_1.AlfrescoSearchAutocompleteComponent)], AlfrescoSearchControlComponent.prototype, "liveSearchComponent", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], AlfrescoSearchControlComponent.prototype, "liveSearchEnabled", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchControlComponent.prototype, "liveSearchTerm", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchControlComponent.prototype, "liveSearchRoot", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchControlComponent.prototype, "liveSearchResultType", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchControlComponent.prototype, "liveSearchResultSort", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Number)], AlfrescoSearchControlComponent.prototype, "liveSearchMaxResults", void 0);
    AlfrescoSearchControlComponent = __decorate([core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-search-control',
        template: "<form #f=\"ngForm\" (ngSubmit)=\"onSearch(f.value)\">     <div [class]=\"getTextFieldClassName()\">         <label *ngIf=\"expandable\" class=\"mdl-button mdl-js-button mdl-button--icon\" for=\"searchControl\">             <i mdl-upgrade class=\"material-icons\">search</i>         </label>         <div [class]=\"getTextFieldHolderClassName()\">             <input mdl                    class=\"mdl-textfield__input\"                    [type]=\"inputType\"                    [autocomplete]=\"getAutoComplete()\"                    data-automation-id=\"search_input\"                    #searchInput                    id=\"searchControl\"                    [formControl]=\"searchControl\"                    [(ngModel)]=\"searchTerm\"                    (focus)=\"onFocus($event)\"                    (blur)=\"onBlur($event)\"                    (keyup.escape)=\"onEscape($event)\"                    (keyup.arrowdown)=\"onArrowDown($event)\"                    aria-labelledby=\"searchLabel\">             <label id=\"searchLabel\" class=\"mdl-textfield__label\" for=\"searchControl\">{{'SEARCH.CONTROL.LABEL' | translate}}</label>         </div>     </div> </form> <alfresco-search-autocomplete #autocomplete *ngIf=\"liveSearchEnabled\"                               [searchTerm]=\"liveSearchTerm\"                               [rootNodeId]=\"liveSearchRoot\"                               [resultType]=\"liveSearchResultType\"                               [resultSort]=\"liveSearchResultSort\"                               [maxResults]=\"liveSearchMaxResults\"                               [ngClass]=\"{active: searchActive, valid: searchValid}\"                               (fileSelect)=\"onFileClicked($event)\"                               (searchFocus)=\"onAutoCompleteFocus($event)\"                               (scrollBack)=\"onAutoCompleteReturn($event)\"                               (cancel)=\"onAutoCompleteCancel($event)\"></alfresco-search-autocomplete>",
        styles: [".search-field {     width: 267px; } @media only screen and (max-width: 400px) {     .search-field {         width: 200px;     } } @media only screen and (max-width: 320px) {     .search-field {         width: 160px;     } }"]
    }), __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoTranslationService])], AlfrescoSearchControlComponent);
    exports.AlfrescoSearchControlComponent = AlfrescoSearchControlComponent;
    return module.exports;
});
$__System.registerDynamic("5", ["3", "c", "7"], true, function ($__require, exports, module) {
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

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1 = $__require("3");
    var Rx_1 = $__require("c");
    var ng2_alfresco_core_1 = $__require("7");
    var AlfrescoSearchService = function () {
        function AlfrescoSearchService(authService, apiService) {
            this.authService = authService;
            this.apiService = apiService;
        }
        AlfrescoSearchService.prototype.getNodeQueryResults = function (term, options) {
            return Rx_1.Observable.fromPromise(this.getQueryNodesPromise(term, options)).map(function (res) {
                return res;
            }).catch(this.handleError);
        };
        AlfrescoSearchService.prototype.getQueryNodesPromise = function (term, opts) {
            return this.apiService.getInstance().core.queriesApi.findNodes(term, opts);
        };
        AlfrescoSearchService.prototype.handleError = function (error) {
            return Rx_1.Observable.throw(error || 'Server error');
        };
        return AlfrescoSearchService;
    }();
    AlfrescoSearchService = __decorate([core_1.Injectable(), __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoAuthenticationService, ng2_alfresco_core_1.AlfrescoApiService])], AlfrescoSearchService);
    exports.AlfrescoSearchService = AlfrescoSearchService;
    return module.exports;
});
$__System.registerDynamic("6", ["3", "7"], true, function ($__require, exports, module) {
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

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1 = $__require("3");
    var ng2_alfresco_core_1 = $__require("7");
    var AlfrescoThumbnailService = function () {
        function AlfrescoThumbnailService(contentService) {
            this.contentService = contentService;
            this.mimeTypeIcons = {
                'image/png': 'ft_ic_raster_image',
                'image/jpeg': 'ft_ic_raster_image',
                'image/gif': 'ft_ic_raster_image',
                'application/pdf': 'ft_ic_pdf',
                'application/vnd.ms-excel': 'ft_ic_ms_excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'ft_ic_ms_excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'ft_ic_ms_excel',
                'application/msword': 'ft_ic_ms_word',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'ft_ic_ms_word',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'ft_ic_ms_word',
                'application/vnd.ms-powerpoint': 'ft_ic_ms_powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ft_ic_ms_powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.template': 'ft_ic_ms_powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ft_ic_ms_powerpoint',
                'video/mp4': 'ft_ic_video',
                'text/plain': 'ft_ic_document',
                'application/x-javascript': 'ft_ic_document',
                'application/json': 'ft_ic_document',
                'image/svg+xml': 'ft_ic_vector_image',
                'text/html': 'ft_ic_website',
                'application/x-compressed': 'ft_ic_archive',
                'application/x-zip-compressed': 'ft_ic_archive',
                'application/zip': 'ft_ic_archive',
                'application/vnd.apple.keynote': 'ft_ic_presentation',
                'application/vnd.apple.pages': 'ft_ic_document',
                'application/vnd.apple.numbers': 'ft_ic_spreadsheet'
            };
        }
        AlfrescoThumbnailService.prototype.getDocumentThumbnailUrl = function (document) {
            return this.contentService.getDocumentThumbnailUrl(document);
        };
        AlfrescoThumbnailService.prototype.getMimeTypeKey = function (mimeType) {
            var icon = this.mimeTypeIcons[mimeType];
            return icon || 'ft_ic_miscellaneous';
        };
        AlfrescoThumbnailService.prototype.getMimeTypeIcon = function (mimeType) {
            return this.getMimeTypeKey(mimeType) + '.svg';
        };
        return AlfrescoThumbnailService;
    }();
    AlfrescoThumbnailService = __decorate([core_1.Injectable(), __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoContentService])], AlfrescoThumbnailService);
    exports.AlfrescoThumbnailService = AlfrescoThumbnailService;
    return module.exports;
});
$__System.registerDynamic("b", ["3", "5", "6", "7"], true, function ($__require, exports, module) {
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

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1 = $__require("3");
    var alfresco_search_service_1 = $__require("5");
    var alfresco_thumbnail_service_1 = $__require("6");
    var ng2_alfresco_core_1 = $__require("7");
    var AlfrescoSearchAutocompleteComponent = function () {
        function AlfrescoSearchAutocompleteComponent(alfrescoSearchService, translate, alfrescoThumbnailService) {
            this.alfrescoSearchService = alfrescoSearchService;
            this.translate = translate;
            this.alfrescoThumbnailService = alfrescoThumbnailService;
            this.searchTerm = '';
            this.results = null;
            this.maxResults = 5;
            this.resultSort = null;
            this.rootNodeId = '-root';
            this.resultType = null;
            this.fileSelect = new core_1.EventEmitter();
            this.searchFocus = new core_1.EventEmitter();
            this.cancel = new core_1.EventEmitter();
            this.resultsLoad = new core_1.EventEmitter();
            this.scrollBack = new core_1.EventEmitter();
            this.baseComponentPath = module.id.replace('/components/alfresco-search.component.js', '');
        }
        AlfrescoSearchAutocompleteComponent.prototype.ngOnInit = function () {
            if (this.translate) {
                this.translate.addTranslationFolder('ng2-alfresco-search', 'node_modules/ng2-alfresco-search/src');
            }
        };
        AlfrescoSearchAutocompleteComponent.prototype.ngOnChanges = function (changes) {
            if (changes.searchTerm) {
                this.results = null;
                this.errorMessage = null;
                this.displaySearchResults(changes.searchTerm.currentValue);
            }
        };
        AlfrescoSearchAutocompleteComponent.prototype.displaySearchResults = function (searchTerm) {
            var _this = this;
            var searchOpts = {
                include: ['path'],
                rootNodeId: this.rootNodeId,
                nodeType: this.resultType,
                maxItems: this.maxResults,
                orderBy: this.resultSort
            };
            if (searchTerm !== null && searchTerm !== '') {
                this.alfrescoSearchService.getNodeQueryResults(searchTerm, searchOpts).subscribe(function (results) {
                    _this.results = results.list.entries.slice(0, _this.maxResults);
                    _this.errorMessage = null;
                    _this.resultsLoad.emit(_this.results);
                }, function (error) {
                    _this.results = null;
                    _this.errorMessage = error;
                    _this.resultsLoad.error(error);
                });
            }
        };
        AlfrescoSearchAutocompleteComponent.prototype.getMimeTypeIcon = function (node) {
            if (node.entry.content && node.entry.content.mimeType) {
                var icon = this.alfrescoThumbnailService.getMimeTypeIcon(node.entry.content.mimeType);
                return this.resolveIconPath(icon);
            } else if (node.entry.isFolder) {
                return this.baseComponentPath + "/../assets/images/ft_ic_folder.svg";
            }
        };
        AlfrescoSearchAutocompleteComponent.prototype.resolveIconPath = function (icon) {
            return this.baseComponentPath + "/../assets/images/" + icon;
        };
        AlfrescoSearchAutocompleteComponent.prototype.getMimeTypeKey = function (node) {
            if (node.entry.content && node.entry.content.mimeType) {
                return 'SEARCH.ICONS.' + this.alfrescoThumbnailService.getMimeTypeKey(node.entry.content.mimeType);
            } else {
                return '';
            }
        };
        AlfrescoSearchAutocompleteComponent.prototype.focusResult = function () {
            var firstResult = this.resultsTableBody.nativeElement.querySelector('tr');
            firstResult.focus();
        };
        AlfrescoSearchAutocompleteComponent.prototype.onItemClick = function (node) {
            if (node && node.entry) {
                this.fileSelect.emit(node);
            }
        };
        AlfrescoSearchAutocompleteComponent.prototype.onRowFocus = function ($event) {
            this.searchFocus.emit($event);
        };
        AlfrescoSearchAutocompleteComponent.prototype.onRowBlur = function ($event) {
            this.searchFocus.emit($event);
        };
        AlfrescoSearchAutocompleteComponent.prototype.onRowEnter = function (node) {
            if (node && node.entry) {
                if (node.entry.isFile) {
                    this.fileSelect.emit(node);
                }
            }
        };
        AlfrescoSearchAutocompleteComponent.prototype.getNextElementSibling = function (node) {
            return node.nextElementSibling;
        };
        AlfrescoSearchAutocompleteComponent.prototype.getPreviousElementSibling = function (node) {
            return node.previousElementSibling;
        };
        AlfrescoSearchAutocompleteComponent.prototype.onRowArrowDown = function ($event) {
            var nextElement = this.getNextElementSibling($event.target);
            if (nextElement) {
                nextElement.focus();
            }
        };
        AlfrescoSearchAutocompleteComponent.prototype.onRowArrowUp = function ($event) {
            var previousElement = this.getPreviousElementSibling($event.target);
            if (previousElement) {
                previousElement.focus();
            } else {
                this.scrollBack.emit($event);
            }
        };
        AlfrescoSearchAutocompleteComponent.prototype.onRowEscape = function ($event) {
            this.cancel.emit($event);
        };
        return AlfrescoSearchAutocompleteComponent;
    }();
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchAutocompleteComponent.prototype, "searchTerm", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Object)], AlfrescoSearchAutocompleteComponent.prototype, "ngClass", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Number)], AlfrescoSearchAutocompleteComponent.prototype, "maxResults", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchAutocompleteComponent.prototype, "resultSort", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchAutocompleteComponent.prototype, "rootNodeId", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], AlfrescoSearchAutocompleteComponent.prototype, "resultType", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], AlfrescoSearchAutocompleteComponent.prototype, "fileSelect", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], AlfrescoSearchAutocompleteComponent.prototype, "searchFocus", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], AlfrescoSearchAutocompleteComponent.prototype, "cancel", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], AlfrescoSearchAutocompleteComponent.prototype, "resultsLoad", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], AlfrescoSearchAutocompleteComponent.prototype, "scrollBack", void 0);
    __decorate([core_1.ViewChild('resultsTableBody', {}), __metadata("design:type", core_1.ElementRef)], AlfrescoSearchAutocompleteComponent.prototype, "resultsTableBody", void 0);
    AlfrescoSearchAutocompleteComponent = __decorate([core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-search-autocomplete',
        template: "<table data-automation-id=\"autocomplete_results\" *ngIf=\"results && results.length && searchTerm\"        class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width\">     <tbody #resultsTableBody>     <tr id=\"result_row_{{idx}}\" *ngFor=\"let result of results; let idx = index\" tabindex=\"0\"             (blur)=\"onRowBlur($event)\" (focus)=\"onRowFocus($event)\"             (click)=\"onItemClick(result)\"             (keyup.enter)=\"onRowEnter(result)\"             (keyup.arrowdown)=\"onRowArrowDown($event)\"             (keyup.arrowup)=\"onRowArrowUp($event)\"             (keyup.escape)=\"onRowEscape($event)\"             attr.data-automation-id=\"autocomplete_result_for_{{result.entry.name}}\">         <td class=\"img-td\"><img src=\"{{getMimeTypeIcon(result)}}\" alt=\"{{getMimeTypeKey(result)|translate}}\"/></td>         <td>             <div id=\"result_name_{{idx}}\"  class=\"truncate\"><b>{{result.entry.name}}</b></div>             <div id=\"result_user_{{idx}}\"  class=\"truncate\">{{result.entry.createdByUser.displayName}}</div>         </td>     </tr>     </tbody> </table> <table id=\"search_no_result\" data-automation-id=\"search_no_result_found\" *ngIf=\"results && results.length === 0\"        class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width\">     <tbody>     <tr>         <td>             <div class=\"truncate\"><b> {{ 'SEARCH.RESULTS.NONE' | translate:{searchTerm: searchTerm} }}</b></div>         </td>     </tr>     </tbody> </table> <table data-automation-id=\"autocomplete_error_message\" *ngIf=\"errorMessage\"        class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width\">     <tbody>     <tr>         <td>{{ 'SEARCH.RESULTS.ERROR' | translate:{errorMessage: errorMessage} }}</td>     </tr>     </tbody> </table>",
        styles: [":host {     position: absolute;     z-index: 5;     display: none;     color: #555;     margin: -21px 0px 0px 0px; } :host a {     color: #555;     text-decoration: none; } :host table {     width: 300px; } :host .mdl-data-table tbody tr {     height: 32px; } :host .mdl-data-table td {     height: 32px;     padding: 8px;     text-align: left;     border-top: none;     border-bottom: none; } :host.active.valid {     display: block; }  .img-td{     width: 30px; }  .truncate{     width: 240px;     white-space: nowrap;     overflow: hidden;     text-overflow: ellipsis; }  @media screen and (max-width: 400px) {     :host {         right: 0;     }     .truncate{         width: 200px;     } }"]
    }), __metadata("design:paramtypes", [alfresco_search_service_1.AlfrescoSearchService, ng2_alfresco_core_1.AlfrescoTranslationService, alfresco_thumbnail_service_1.AlfrescoThumbnailService])], AlfrescoSearchAutocompleteComponent);
    exports.AlfrescoSearchAutocompleteComponent = AlfrescoSearchAutocompleteComponent;
    return module.exports;
});
$__System.registerDynamic("1", ["3", "a", "7", "5", "6", "2", "9", "b"], true, function ($__require, exports, module) {
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

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    var core_1 = $__require("3");
    var forms_1 = $__require("a");
    var ng2_alfresco_core_1 = $__require("7");
    var alfresco_search_service_1 = $__require("5");
    var alfresco_thumbnail_service_1 = $__require("6");
    var alfresco_search_component_1 = $__require("2");
    var alfresco_search_control_component_1 = $__require("9");
    var alfresco_search_autocomplete_component_1 = $__require("b");
    __export($__require("5"));
    __export($__require("6"));
    __export($__require("2"));
    __export($__require("9"));
    __export($__require("b"));
    exports.ALFRESCO_SEARCH_DIRECTIVES = [alfresco_search_component_1.AlfrescoSearchComponent, alfresco_search_control_component_1.AlfrescoSearchControlComponent, alfresco_search_autocomplete_component_1.AlfrescoSearchAutocompleteComponent];
    exports.ALFRESCO_SEARCH_PROVIDERS = [alfresco_search_service_1.AlfrescoSearchService, alfresco_thumbnail_service_1.AlfrescoThumbnailService];
    var SearchModule = SearchModule_1 = function () {
        function SearchModule() {}
        SearchModule.forRoot = function () {
            return {
                ngModule: SearchModule_1,
                providers: exports.ALFRESCO_SEARCH_PROVIDERS.slice()
            };
        };
        return SearchModule;
    }();
    SearchModule = SearchModule_1 = __decorate([core_1.NgModule({
        imports: [ng2_alfresco_core_1.CoreModule, forms_1.FormsModule, forms_1.ReactiveFormsModule],
        declarations: exports.ALFRESCO_SEARCH_DIRECTIVES.slice(),
        providers: exports.ALFRESCO_SEARCH_PROVIDERS.slice(),
        exports: exports.ALFRESCO_SEARCH_DIRECTIVES.slice()
    }), __metadata("design:paramtypes", [])], SearchModule);
    exports.SearchModule = SearchModule;
    var SearchModule_1;
    

    return module.exports;
});
})
(function(factory) {
  if (typeof define == 'function' && define.amd)
    define(["@angular/core","@angular/forms","@angular/router","ng2-alfresco-core","rxjs/Rx"], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory(require("@angular/core"), require("@angular/forms"), require("@angular/router"), require("ng2-alfresco-core"), require("rxjs/Rx"));
  else
    throw new Error("Module must be loaded as AMD or CommonJS");
});
//# sourceMappingURL=ng2-alfresco-search.js.map
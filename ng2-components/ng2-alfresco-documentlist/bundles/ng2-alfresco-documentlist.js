!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in v||(v[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==g.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=v[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(g.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=v[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return y[e]||(y[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},{id:r.name});t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=v[s],f=y[s];f?l=f.exports:c&&!c.declarative?l=c.esModule:c?(d(c),f=c.module,l=f.exports):l=p(s),f&&f.importers?(f.importers.push(t),t.dependencies.push(f)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=v[e];if(t)t.declarative?f(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=p(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=v[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);void 0!==typeof c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(r){var t={};if(("object"==typeof r||"function"==typeof r)&&r!==e)if(m)for(var n in r)"default"!==n&&c(t,r,n);else{var o=r&&r.hasOwnProperty;for(var n in r)"default"===n||o&&!r.hasOwnProperty(n)||(t[n]=r[n])}return t["default"]=r,x(t,"__useDefault",{value:!0}),t}function c(e,r,t){try{var n;(n=Object.getOwnPropertyDescriptor(r,t))&&x(e,t,n)}catch(o){return e[t]=r[t],!1}}function f(r,t){var n=v[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==g.call(t,u)&&(v[u]?f(u,t):p(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function p(e){if(I[e])return I[e];if("@node/"==e.substr(0,6))return I[e]=s(D(e.substr(6)));var r=v[e];if(!r)throw"Module "+e+" not present.";return a(e),f(e,[]),v[e]=void 0,r.declarative&&x(r.module.exports,"__esModule",{value:!0}),I[e]=r.declarative?r.module.exports:r.esModule}var v={},g=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},m=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(h){m=!1}var x;!function(){try{Object.defineProperty({},"a",{})&&(x=Object.defineProperty)}catch(e){x=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var y={},D="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,I={"@empty":{}};return function(e,n,o,a){return function(u){u(function(u){for(var d={_nodeRequire:D,register:r,registerDynamic:t,get:p,set:function(e,r){I[e]=r},newModule:function(e){return e}},i=0;i<n.length;i++)(function(e,r){r&&r.__esModule?I[e]=r:I[e]=s(r)})(n[i],arguments[i]);a(d);var l=p(e[0]);if(e.length>1)for(var i=1;i<e.length;i++)p(e[i]);return o?l["default"]:l})}}}("undefined"!=typeof self?self:global)

(["1"], ["13","3","5","10","f"], true, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
$__System.registerDynamic("2", ["3", "4", "5"], true, function ($__require, exports, module) {
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
    var document_list_service_1 = $__require("4");
    var ng2_alfresco_core_1 = $__require("5");
    var ERROR_FOLDER_ALREADY_EXIST = 409;
    var DocumentMenuAction = function () {
        function DocumentMenuAction(documentListService, translate) {
            this.documentListService = documentListService;
            this.translate = translate;
            this.success = new core_1.EventEmitter();
            this.error = new core_1.EventEmitter();
            this.actions = [];
            this.folderName = '';
            if (translate) {
                translate.addTranslationFolder('ng2-alfresco-documentlist', 'node_modules/ng2-alfresco-documentlist/src');
            }
        }
        DocumentMenuAction.prototype.ngOnInit = function () {};
        DocumentMenuAction.prototype.createFolder = function (name) {
            var _this = this;
            this.cancel();
            this.documentListService.createFolder(name, this.currentFolderPath).subscribe(function (res) {
                var relativeDir = _this.currentFolderPath;
                _this.folderName = '';
                _this.success.emit({ value: relativeDir });
            }, function (error) {
                var errorMessagePlaceholder = _this.getErrorMessage(error.response);
                if (errorMessagePlaceholder) {
                    _this.message = _this.formatString(errorMessagePlaceholder, [name]);
                    _this.error.emit({ message: _this.message });
                    console.log(_this.message);
                } else {
                    _this.error.emit(error);
                    console.log(error);
                }
            });
        };
        DocumentMenuAction.prototype.showDialog = function () {
            if (!this.dialog.nativeElement.showModal) {
                dialogPolyfill.registerDialog(this.dialog.nativeElement);
            }
            this.dialog.nativeElement.showModal();
        };
        DocumentMenuAction.prototype.cancel = function () {
            if (this.dialog) {
                this.dialog.nativeElement.close();
            }
        };
        DocumentMenuAction.prototype.getErrorMessage = function (response) {
            if (response.body && response.body.error.statusCode === ERROR_FOLDER_ALREADY_EXIST) {
                var errorMessage = void 0;
                errorMessage = this.translate.get('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
                return errorMessage.value;
            }
        };
        DocumentMenuAction.prototype.formatString = function (message, keys) {
            var i = keys.length;
            while (i--) {
                message = message.replace(new RegExp('\\{' + i + '\\}', 'gm'), keys[i]);
            }
            return message;
        };
        DocumentMenuAction.prototype.isFolderNameEmpty = function () {
            return this.folderName === '' ? true : false;
        };
        return DocumentMenuAction;
    }();
    __decorate([core_1.Input(), __metadata("design:type", String)], DocumentMenuAction.prototype, "currentFolderPath", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], DocumentMenuAction.prototype, "success", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], DocumentMenuAction.prototype, "error", void 0);
    __decorate([core_1.ViewChild('dialog'), __metadata("design:type", Object)], DocumentMenuAction.prototype, "dialog", void 0);
    DocumentMenuAction = __decorate([core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-document-menu-action',
        styles: [".container {     display: -webkit-box;     display: -moz-box;     display: -ms-flexbox;     display: -webkit-flex;     display: flex;     -webkit-flex-direction: row;     flex-direction: row;     background-color: #fafafa;     border-bottom: 1px solid transparent;     border-top: 1px solid #e5e5e5;     -webkit-box-shadow: 0 2px 4px rgba(0,0,0,.2);     box-shadow: 0 2px 4px rgba(0,0,0,.2);     height: 53px;     position: relative;     -webkit-transition: height .35s cubic-bezier(0.4,0.0,1,1),border-color .4s;     transition: height .35s cubic-bezier(0.4,0.0,1,1),border-color .4s;     z-index: 5; }  .action {     max-width: 394px;     min-width: 150px; }  .action {     -webkit-align-items: flex-end;     align-items: flex-end;     display: -webkit-box;     display: -moz-box;     display: -ms-flexbox;     display: -webkit-flex;     display: flex;     -webkit-box-sizing: border-box;     box-sizing: border-box;     padding: 13px 0 11px 30px;     -webkit-transition: padding .35s cubic-bezier(0.4, 0.0, 1, 1);     transition: padding .35s cubic-bezier(0.4, 0.0, 1, 1); }  .mdl-menu__item-primary-content {     box-sizing: border-box;     display: -webkit-flex;     display: -ms-flexbox;     display: flex;     -webkit-align-items: center;     -ms-flex-align: center;     align-items: center; }  .mdl-menu__item-primary-content {     -webkit-order: 0;     -ms-flex-order: 0;     order: 0;     -webkit-flex-grow: 2;     -ms-flex-positive: 2;     flex-grow: 2;     text-decoration: none; }  .mdl-menu__item-primary-content {     box-sizing: border-box;     display: -webkit-flex;     display: -ms-flexbox;     display: flex;     -webkit-align-items: center;     -ms-flex-align: center;     align-items: center;  }  .mdl-menu__item-icon {     margin-right: 32px;     margin-top: 10px;     margin-left: 10px; }  .mdl-menu--bottom-left {     width: 200px; }  .mdl-menu__text {     float: right;     margin-right: 22px; }"],
        template: "<div class=\"container\">     <div class=\"action\">         <button id=\"actions\" class=\"mdl-button mdl-js-button mdl-button--raised\">             <i class=\"material-icons\">add</i> {{ 'BUTTON.ACTION_CREATE' | translate }}         </button>         <ul alfresco-mdl-menu class=\"mdl-menu--bottom-left\"             [attr.for]=\"'actions'\">             <li class=\"mdl-menu__item\"                 (click)=\"showDialog()\" >                 <i style=\"float: left;\" class=\"material-icons mdl-menu__item-icon\">folder</i>                 <span class=\"mdl-menu__text\">{{ 'BUTTON.ACTION_NEW_FOLDER' | translate }}</span>             </li>         </ul>     </div> </div>  <dialog class=\"mdl-dialog\" #dialog>     <h4 class=\"mdl-dialog__title\">{{ 'BUTTON.ACTION_NEW_FOLDER' | translate }}</h4>     <div class=\"mdl-dialog__content\">         <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">             <input                     type=\"text\"                     class=\"mdl-textfield__input\"                     id=\"name\"                     required                     [(ngModel)]=\"folderName\"                     placeholder=\"Folder name\"                     data-automation-id=\"name\"                     autocapitalize=\"none\" #name/>         </div>     </div>     <div class=\"mdl-dialog__actions\">         <button type=\"button\" [disabled]=\"isFolderNameEmpty()\" (click)=\"createFolder(folderName)\" class=\"mdl-button\">{{ 'BUTTON.CREATE' | translate }}</button>         <button type=\"button\" (click)=\"cancel()\" class=\"mdl-button close\">{{ 'BUTTON.CANCEL' | translate}}</button>     </div> </dialog>"
    }), __metadata("design:paramtypes", [document_list_service_1.DocumentListService, ng2_alfresco_core_1.AlfrescoTranslationService])], DocumentMenuAction);
    exports.DocumentMenuAction = DocumentMenuAction;
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
    var content_column_list_1 = $__require("7");
    var ContentColumn = function () {
        function ContentColumn(list) {
            this.list = list;
            this.type = 'text';
            this.sortable = false;
            this.title = '';
        }
        ContentColumn.prototype.ngOnInit = function () {
            if (!this.srTitle && this.key === '$thumbnail') {
                this.srTitle = 'Thumbnail';
            }
            this.register();
        };
        ContentColumn.prototype.register = function () {
            if (this.list) {
                return this.list.registerColumn(this);
            }
            return false;
        };
        return ContentColumn;
    }();
    __decorate([core_1.Input(), __metadata("design:type", String)], ContentColumn.prototype, "key", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], ContentColumn.prototype, "type", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], ContentColumn.prototype, "format", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], ContentColumn.prototype, "sortable", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], ContentColumn.prototype, "title", void 0);
    __decorate([core_1.Input('sr-title'), __metadata("design:type", String)], ContentColumn.prototype, "srTitle", void 0);
    __decorate([core_1.Input('class'), __metadata("design:type", String)], ContentColumn.prototype, "cssClass", void 0);
    ContentColumn = __decorate([core_1.Component({
        selector: 'content-column',
        template: ''
    }), __metadata("design:paramtypes", [content_column_list_1.ContentColumnList])], ContentColumn);
    exports.ContentColumn = ContentColumn;
    return module.exports;
});
$__System.registerDynamic("7", ["3", "8"], true, function ($__require, exports, module) {
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
    var document_list_1 = $__require("8");
    var ContentColumnList = function () {
        function ContentColumnList(documentList) {
            this.documentList = documentList;
        }
        ContentColumnList.prototype.registerColumn = function (column) {
            if (this.documentList && column) {
                var columns = this.documentList.data.getColumns();
                columns.push(column);
                return true;
            }
            return false;
        };
        return ContentColumnList;
    }();
    ContentColumnList = __decorate([core_1.Component({
        selector: 'content-columns',
        template: ''
    }), __metadata("design:paramtypes", [document_list_1.DocumentList])], ContentColumnList);
    exports.ContentColumnList = ContentColumnList;
    return module.exports;
});
$__System.registerDynamic("9", ["3", "a", "b", "c", "d"], true, function ($__require, exports, module) {
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
    var content_action_model_1 = $__require("a");
    var content_action_list_1 = $__require("b");
    var document_actions_service_1 = $__require("c");
    var folder_actions_service_1 = $__require("d");
    var ContentAction = function () {
        function ContentAction(list, documentActions, folderActions) {
            this.list = list;
            this.documentActions = documentActions;
            this.folderActions = folderActions;
            this.title = 'Action';
            this.execute = new core_1.EventEmitter();
            this.model = new content_action_model_1.ContentActionModel();
        }
        ContentAction.prototype.ngOnInit = function () {
            var _this = this;
            this.model = new content_action_model_1.ContentActionModel({
                title: this.title,
                icon: this.icon,
                target: this.target
            });
            if (this.handler) {
                this.model.handler = this.getSystemHandler(this.target, this.handler);
            } else if (this.execute) {
                this.model.handler = function (document) {
                    _this.execute.emit({
                        value: document
                    });
                };
            }
            this.register();
        };
        ContentAction.prototype.register = function () {
            if (this.list) {
                return this.list.registerAction(this.model);
            }
            return false;
        };
        ContentAction.prototype.ngOnChanges = function (changes) {
            this.model.title = this.title;
        };
        ContentAction.prototype.getSystemHandler = function (target, name) {
            if (target) {
                var ltarget = target.toLowerCase();
                if (ltarget === 'document') {
                    if (this.documentActions) {
                        return this.documentActions.getHandler(name);
                    }
                    return null;
                }
                if (ltarget === 'folder') {
                    if (this.folderActions) {
                        return this.folderActions.getHandler(name);
                    }
                    return null;
                }
            }
            return null;
        };
        return ContentAction;
    }();
    __decorate([core_1.Input(), __metadata("design:type", String)], ContentAction.prototype, "title", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], ContentAction.prototype, "icon", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], ContentAction.prototype, "handler", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], ContentAction.prototype, "target", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], ContentAction.prototype, "execute", void 0);
    ContentAction = __decorate([core_1.Component({
        selector: 'content-action',
        template: ''
    }), __metadata("design:paramtypes", [content_action_list_1.ContentActionList, document_actions_service_1.DocumentActionsService, folder_actions_service_1.FolderActionsService])], ContentAction);
    exports.ContentAction = ContentAction;
    return module.exports;
});
$__System.registerDynamic("b", ["3", "8"], true, function ($__require, exports, module) {
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
    var document_list_1 = $__require("8");
    var ContentActionList = function () {
        function ContentActionList(documentList) {
            this.documentList = documentList;
        }
        ContentActionList.prototype.registerAction = function (action) {
            if (this.documentList && action) {
                this.documentList.actions.push(action);
                return true;
            }
            return false;
        };
        return ContentActionList;
    }();
    ContentActionList = __decorate([core_1.Component({
        selector: 'content-actions',
        template: ''
    }), __metadata("design:paramtypes", [document_list_1.DocumentList])], ContentActionList);
    exports.ContentActionList = ContentActionList;
    return module.exports;
});
$__System.registerDynamic("e", ["3", "8"], true, function ($__require, exports, module) {
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
    var document_list_1 = $__require("8");
    var EmptyFolderContent = function () {
        function EmptyFolderContent(documentList) {
            this.documentList = documentList;
        }
        EmptyFolderContent.prototype.ngAfterContentInit = function () {
            this.documentList.emptyFolderTemplate = this.template;
            this.documentList.dataTable.noContentTemplate = this.template;
        };
        return EmptyFolderContent;
    }();
    __decorate([core_1.ContentChild(core_1.TemplateRef), __metadata("design:type", Object)], EmptyFolderContent.prototype, "template", void 0);
    EmptyFolderContent = __decorate([core_1.Directive({
        selector: 'empty-folder-content'
    }), __metadata("design:paramtypes", [document_list_1.DocumentList])], EmptyFolderContent);
    exports.EmptyFolderContent = EmptyFolderContent;
    return module.exports;
});
$__System.registerDynamic("8", ["3", "f", "5", "10", "4", "11"], true, function ($__require, exports, module) {
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
    var Rx_1 = $__require("f");
    var ng2_alfresco_core_1 = $__require("5");
    var ng2_alfresco_datatable_1 = $__require("10");
    var document_list_service_1 = $__require("4");
    var share_datatable_adapter_1 = $__require("11");
    var DocumentList = DocumentList_1 = function () {
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
            this.contextActionHandler.subscribe(function (val) {
                return _this.contextActionCallback(val);
            });
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
                this.loadFolderById(folderId).then(function () {
                    _this._path = null;
                }).catch(function (err) {
                    _this.error.emit(err);
                });
            } else if (changes['currentFolderPath']) {
                var path_1 = changes['currentFolderPath'].currentValue || this.DEFAULT_FOLDER_PATH;
                this.currentFolderPath = path_1;
                this.loadFolderByPath(path_1).then(function () {
                    _this._path = path_1;
                    _this.folderChange.emit({ path: path_1 });
                }).catch(function (err) {
                    _this.error.emit(err);
                });
            } else if (changes['rootFolderId']) {
                this.loadFolderByPath(this.currentFolderPath).then(function () {
                    _this._path = _this.currentFolderPath;
                    _this.folderChange.emit({ path: _this.currentFolderPath });
                }).catch(function (err) {
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
                this.loadFolderById(this.currentFolderId).catch(function (err) {
                    _this.error.emit(err);
                });
            } else if (this.currentFolderPath) {
                this.loadFolderByPath(this.currentFolderPath).catch(function (err) {
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
    }();
    DocumentList.SINGLE_CLICK_NAVIGATION = 'click';
    DocumentList.DOUBLE_CLICK_NAVIGATION = 'dblclick';
    DocumentList.DEFAULT_PAGE_SIZE = 20;
    __decorate([core_1.Input(), __metadata("design:type", String)], DocumentList.prototype, "fallbackThubnail", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String), __metadata("design:paramtypes", [String])], DocumentList.prototype, "rootFolderId", null);
    __decorate([core_1.Input(), __metadata("design:type", String)], DocumentList.prototype, "currentFolderId", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], DocumentList.prototype, "navigate", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], DocumentList.prototype, "navigationMode", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], DocumentList.prototype, "thumbnails", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], DocumentList.prototype, "multiselect", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], DocumentList.prototype, "contentActions", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], DocumentList.prototype, "contextMenuActions", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], DocumentList.prototype, "creationMenuActions", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Number)], DocumentList.prototype, "pageSize", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Function), __metadata("design:paramtypes", [Function])], DocumentList.prototype, "rowFilter", null);
    __decorate([core_1.Input(), __metadata("design:type", Function), __metadata("design:paramtypes", [Function])], DocumentList.prototype, "imageResolver", null);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], DocumentList.prototype, "nodeClick", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], DocumentList.prototype, "nodeDblClick", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], DocumentList.prototype, "folderChange", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], DocumentList.prototype, "preview", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], DocumentList.prototype, "success", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], DocumentList.prototype, "error", void 0);
    __decorate([core_1.ViewChild(ng2_alfresco_datatable_1.DataTableComponent), __metadata("design:type", ng2_alfresco_datatable_1.DataTableComponent)], DocumentList.prototype, "dataTable", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String), __metadata("design:paramtypes", [String])], DocumentList.prototype, "currentFolderPath", null);
    __decorate([core_1.HostListener('contextmenu', ['$event']), __metadata("design:type", Function), __metadata("design:paramtypes", [Event]), __metadata("design:returntype", void 0)], DocumentList.prototype, "onShowContextMenu", null);
    DocumentList = DocumentList_1 = __decorate([core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-document-list',
        styles: [".document-list_empty_template {     text-align: center;     margin-top: 20px;     margin-bottom: 20px; }  .document-list__this-space-is-empty {     height: 32px;     opacity: 0.26;     font-family: Muli, Helvetica, Arial, sans-serif;     font-size: 24px;     line-height: 1.33;     letter-spacing: -1px;     color: #000000; }  .document-list__drag-drop {     height: 56px;     opacity: 0.54;     font-family: Muli, Helvetica, Arial, sans-serif;     font-size: 56px;     line-height: 1;     letter-spacing: -2px;     color: #000000;     margin-top: 40px; }  .document-list__any-files-here-to-add {     height: 24px;     opacity: 0.54;     font-family: Muli, Helvetica, Arial, sans-serif;     font-size: 16px;     line-height: 1.5;     letter-spacing: -0.4px;     color: #000000;     margin-top: 17px; }  .document-list__empty_doc_lib {     width: 565px;     height: 161px;     object-fit: contain;     margin-top: 17px; }"],
        template: "<alfresco-document-menu-action *ngIf=\"creationMenuActions\"                                [currentFolderPath]=\"currentFolderPath\"                                (success)=\"onActionMenuSuccess($event)\"                                (error)=\"onActionMenuError($event)\"> </alfresco-document-menu-action> <alfresco-datatable     [data]=\"data\"     [actions]=\"contentActions\"     [multiselect]=\"multiselect\"     [fallbackThumbnail]=\"fallbackThubnail\"     (showRowContextMenu)=\"onShowRowContextMenu($event)\"     (showRowActionsMenu)=\"onShowRowActionsMenu($event)\"     (executeRowAction)=\"onExecuteRowAction($event)\"     (rowClick)=\"onRowClick($event)\"     (rowDblClick)=\"onRowDblClick($event)\">     <div *ngIf=\"!isEmptyTemplateDefined()\">         <no-content-template>             <template>                 <div class=\"document-list_empty_template\">                     <div class=\"document-list__this-space-is-empty\">This folder is empty</div>                     <div class=\"document-list__drag-drop\">Drag and Drop</div>                     <div class=\"document-list__any-files-here-to-add\">any files here to add</div>                     <img [src]=\"baseComponentPath + '/../assets/images/empty_doc_lib.svg'\" class=\"document-list__empty_doc_lib\">                 </div>             </template>         </no-content-template>     </div> </alfresco-datatable>"
    }), __metadata("design:paramtypes", [document_list_service_1.DocumentListService, core_1.NgZone, ng2_alfresco_core_1.AlfrescoTranslationService])], DocumentList);
    exports.DocumentList = DocumentList;
    var DocumentList_1;
    return module.exports;
});
$__System.registerDynamic("12", ["3", "8"], true, function ($__require, exports, module) {
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
    var document_list_1 = $__require("8");
    var DocumentListBreadcrumb = function () {
        function DocumentListBreadcrumb() {
            this._currentFolderPath = '/';
            this.rootFolder = {
                name: 'Root',
                path: '/'
            };
            this.route = [this.rootFolder];
            this.navigate = new core_1.EventEmitter();
            this.pathChanged = new core_1.EventEmitter();
        }
        Object.defineProperty(DocumentListBreadcrumb.prototype, "currentFolderPath", {
            get: function () {
                return this._currentFolderPath;
            },
            set: function (val) {
                if (this._currentFolderPath !== val) {
                    if (val) {
                        this._currentFolderPath = val;
                        this.route = this.parsePath(val);
                    } else {
                        this._currentFolderPath = this.rootFolder.path;
                        this.route = [this.rootFolder];
                    }
                    this.pathChanged.emit({
                        value: this._currentFolderPath,
                        route: this.route
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        DocumentListBreadcrumb.prototype.onRoutePathClick = function (route, e) {
            if (e) {
                e.preventDefault();
            }
            if (route) {
                this.navigate.emit({
                    value: {
                        name: route.name,
                        path: route.path
                    }
                });
                this.currentFolderPath = route.path;
                if (this.target) {
                    this.target.currentFolderPath = route.path;
                    this.target.loadFolder();
                }
            }
        };
        DocumentListBreadcrumb.prototype.parsePath = function (path) {
            var parts = path.split('/').filter(function (val) {
                return val ? true : false;
            });
            var result = [this.rootFolder];
            var parentPath = this.rootFolder.path;
            for (var i = 0; i < parts.length; i++) {
                if (!parentPath.endsWith('/')) {
                    parentPath += '/';
                }
                parentPath += parts[i];
                result.push({
                    name: parts[i],
                    path: parentPath
                });
            }
            return result;
        };
        ;
        return DocumentListBreadcrumb;
    }();
    __decorate([core_1.Input(), __metadata("design:type", String), __metadata("design:paramtypes", [String])], DocumentListBreadcrumb.prototype, "currentFolderPath", null);
    __decorate([core_1.Input(), __metadata("design:type", document_list_1.DocumentList)], DocumentListBreadcrumb.prototype, "target", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], DocumentListBreadcrumb.prototype, "navigate", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], DocumentListBreadcrumb.prototype, "pathChanged", void 0);
    DocumentListBreadcrumb = __decorate([core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-document-list-breadcrumb',
        template: "<ol data-automation-id=\"breadcrumb\" class=\"breadcrumb\">     <li *ngFor=\"let r of route; let last = last\" [class.active]=\"last\" [ngSwitch]=\"last\">         <span *ngSwitchCase=\"true\">{{r.name}}</span>         <a *ngSwitchDefault            href=\"#\"            [attr.data-automation-id]=\"'breadcrumb_' + r.name\"            (click)=\"onRoutePathClick(r, $event)\">             {{r.name}}         </a>     </li> </ol>",
        styles: ["/* breadcrumb */  :host .breadcrumb {     text-align: left;     padding: 8px 15px;     list-style: none;     background-color: #fafafa;     margin: 0 0 4px; }  :host .breadcrumb > li {     display: inline-block;     box-sizing: border-box; }  :host .breadcrumb > li+li:before {     content: \">\\00a0\";     padding: 0 0 0 5px;     opacity: 0.54;     color: #000000; }  :host .breadcrumb > li > a {     text-decoration: none;     opacity: 0.54;     font-family: 'Muli', \"Helvetica\", \"Arial\", sans-serif;     font-size: 14px;     font-weight: 600;     line-height: 1.43;     letter-spacing: -0.2px;     color: #000000; }  :host .breadcrumb > li:hover > a, :host .breadcrumb > .active {     opacity: 0.87;     font-size: 14px;     font-weight: 600;     line-height: 1.43;     letter-spacing: -0.2px;     color: #000000; }"]
    }), __metadata("design:paramtypes", [])], DocumentListBreadcrumb);
    exports.DocumentListBreadcrumb = DocumentListBreadcrumb;
    return module.exports;
});
$__System.registerDynamic("d", ["3", "4"], true, function ($__require, exports, module) {
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
    var document_list_service_1 = $__require("4");
    var FolderActionsService = function () {
        function FolderActionsService(documentListService) {
            this.documentListService = documentListService;
            this.handlers = {};
            this.setupActionHandlers();
        }
        FolderActionsService.prototype.getHandler = function (key) {
            if (key) {
                var lkey = key.toLowerCase();
                return this.handlers[lkey] || null;
            }
            return null;
        };
        FolderActionsService.prototype.setHandler = function (key, handler) {
            if (key) {
                var lkey = key.toLowerCase();
                this.handlers[lkey] = handler;
                return true;
            }
            return false;
        };
        FolderActionsService.prototype.canExecuteAction = function (obj) {
            return this.documentListService && obj && obj.entry.isFolder === true;
        };
        FolderActionsService.prototype.setupActionHandlers = function () {
            this.handlers['delete'] = this.deleteNode.bind(this);
            this.handlers['system1'] = this.handleStandardAction1.bind(this);
            this.handlers['system2'] = this.handleStandardAction2.bind(this);
        };
        FolderActionsService.prototype.handleStandardAction1 = function (document) {
            window.alert('standard folder action 1');
        };
        FolderActionsService.prototype.handleStandardAction2 = function (document) {
            window.alert('standard folder action 2');
        };
        FolderActionsService.prototype.deleteNode = function (obj, target) {
            if (this.canExecuteAction(obj) && obj.entry && obj.entry.id) {
                this.documentListService.deleteNode(obj.entry.id).subscribe(function () {
                    if (target && typeof target.reload === 'function') {
                        target.reload();
                    }
                });
            }
        };
        return FolderActionsService;
    }();
    FolderActionsService = __decorate([core_1.Injectable(), __metadata("design:paramtypes", [document_list_service_1.DocumentListService])], FolderActionsService);
    exports.FolderActionsService = FolderActionsService;
    return module.exports;
});
$__System.registerDynamic("c", ["3", "4", "5"], true, function ($__require, exports, module) {
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
    var document_list_service_1 = $__require("4");
    var ng2_alfresco_core_1 = $__require("5");
    var DocumentActionsService = function () {
        function DocumentActionsService(documentListService, contentService) {
            this.documentListService = documentListService;
            this.contentService = contentService;
            this.handlers = {};
            this.setupActionHandlers();
        }
        DocumentActionsService.prototype.getHandler = function (key) {
            if (key) {
                var lkey = key.toLowerCase();
                return this.handlers[lkey] || null;
            }
            return null;
        };
        DocumentActionsService.prototype.setHandler = function (key, handler) {
            if (key) {
                var lkey = key.toLowerCase();
                this.handlers[lkey] = handler;
                return true;
            }
            return false;
        };
        DocumentActionsService.prototype.canExecuteAction = function (obj) {
            return this.documentListService && obj && obj.entry.isFile === true;
        };
        DocumentActionsService.prototype.setupActionHandlers = function () {
            this.handlers['download'] = this.download.bind(this);
            this.handlers['delete'] = this.deleteNode.bind(this);
            this.handlers['system1'] = this.handleStandardAction1.bind(this);
            this.handlers['system2'] = this.handleStandardAction2.bind(this);
        };
        DocumentActionsService.prototype.handleStandardAction1 = function (obj) {
            window.alert('standard document action 1');
        };
        DocumentActionsService.prototype.handleStandardAction2 = function (obj) {
            window.alert('standard document action 2');
        };
        DocumentActionsService.prototype.download = function (obj) {
            if (this.canExecuteAction(obj) && this.contentService) {
                var link = document.createElement('a');
                document.body.appendChild(link);
                link.setAttribute('download', 'download');
                link.href = this.contentService.getContentUrl(obj);
                link.click();
                document.body.removeChild(link);
                return true;
            }
            return false;
        };
        DocumentActionsService.prototype.deleteNode = function (obj, target) {
            if (this.canExecuteAction(obj) && obj.entry && obj.entry.id) {
                this.documentListService.deleteNode(obj.entry.id).subscribe(function () {
                    if (target && typeof target.reload === 'function') {
                        target.reload();
                    }
                });
            }
        };
        return DocumentActionsService;
    }();
    DocumentActionsService = __decorate([core_1.Injectable(), __metadata("design:paramtypes", [document_list_service_1.DocumentListService, ng2_alfresco_core_1.AlfrescoContentService])], DocumentActionsService);
    exports.DocumentActionsService = DocumentActionsService;
    return module.exports;
});
$__System.registerDynamic("4", ["3", "f", "5"], true, function ($__require, exports, module) {
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
    var Rx_1 = $__require("f");
    var ng2_alfresco_core_1 = $__require("5");
    var DocumentListService = DocumentListService_1 = function () {
        function DocumentListService(authService, contentService, apiService) {
            this.authService = authService;
            this.contentService = contentService;
            this.apiService = apiService;
            this.mimeTypeIcons = {
                'image/png': 'ft_ic_raster_image.svg',
                'image/jpeg': 'ft_ic_raster_image.svg',
                'image/gif': 'ft_ic_raster_image.svg',
                'application/pdf': 'ft_ic_pdf.svg',
                'application/vnd.ms-excel': 'ft_ic_ms_excel.svg',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'ft_ic_ms_excel.svg',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'ft_ic_ms_excel.svg',
                'application/msword': 'ft_ic_ms_word.svg',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'ft_ic_ms_word.svg',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'ft_ic_ms_word.svg',
                'application/vnd.ms-powerpoint': 'ft_ic_ms_powerpoint.svg',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ft_ic_ms_powerpoint.svg',
                'application/vnd.openxmlformats-officedocument.presentationml.template': 'ft_ic_ms_powerpoint.svg',
                'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ft_ic_ms_powerpoint.svg',
                'video/mp4': 'ft_ic_video.svg',
                'text/plain': 'ft_ic_document.svg',
                'application/x-javascript': 'ft_ic_document.svg',
                'application/json': 'ft_ic_document.svg',
                'image/svg+xml': 'ft_ic_vector_image.svg',
                'text/html': 'ft_ic_website.svg',
                'application/x-compressed': 'ft_ic_archive.svg',
                'application/x-zip-compressed': 'ft_ic_archive.svg',
                'application/zip': 'ft_ic_archive.svg',
                'application/vnd.apple.keynote': 'ft_ic_presentation.svg',
                'application/vnd.apple.pages': 'ft_ic_document.svg',
                'application/vnd.apple.numbers': 'ft_ic_spreadsheet.svg'
            };
        }
        DocumentListService.prototype.getNodesPromise = function (folder, opts) {
            var rootNodeId = DocumentListService_1.ROOT_ID;
            if (opts && opts.rootFolderId) {
                rootNodeId = opts.rootFolderId;
            }
            var params = {
                includeSource: true,
                include: ['path', 'properties']
            };
            if (folder) {
                params.relativePath = folder;
            }
            if (opts) {
                if (opts.maxItems) {
                    params.maxItems = opts.maxItems;
                }
                if (opts.skipCount) {
                    params.skipCount = opts.skipCount;
                }
            }
            return this.apiService.getInstance().nodes.getNodeChildren(rootNodeId, params);
        };
        DocumentListService.prototype.deleteNode = function (nodeId) {
            return Rx_1.Observable.fromPromise(this.apiService.getInstance().nodes.deleteNode(nodeId));
        };
        DocumentListService.prototype.createFolder = function (name, path) {
            return Rx_1.Observable.fromPromise(this.apiService.getInstance().nodes.createFolder(name, path)).map(function (res) {
                return res;
            }).catch(this.handleError);
        };
        DocumentListService.prototype.getFolder = function (folder, opts) {
            return Rx_1.Observable.fromPromise(this.getNodesPromise(folder, opts)).map(function (res) {
                return res;
            }).catch(this.handleError);
        };
        DocumentListService.prototype.getDocumentThumbnailUrl = function (node) {
            if (node && this.contentService) {
                return this.contentService.getDocumentThumbnailUrl(node);
            }
            return null;
        };
        DocumentListService.prototype.getMimeTypeIcon = function (mimeType) {
            var icon = this.mimeTypeIcons[mimeType];
            return icon || DocumentListService_1.DEFAULT_MIME_TYPE_ICON;
        };
        DocumentListService.prototype.handleError = function (error) {
            console.error(error);
            return Rx_1.Observable.throw(error || 'Server error');
        };
        return DocumentListService;
    }();
    DocumentListService.DEFAULT_MIME_TYPE_ICON = 'ft_ic_miscellaneous.svg';
    DocumentListService.ROOT_ID = '-root-';
    DocumentListService = DocumentListService_1 = __decorate([core_1.Injectable(), __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoAuthenticationService, ng2_alfresco_core_1.AlfrescoContentService, ng2_alfresco_core_1.AlfrescoApiService])], DocumentListService);
    exports.DocumentListService = DocumentListService;
    var DocumentListService_1;
    return module.exports;
});
$__System.registerDynamic("11", ["13", "5", "10"], true, function ($__require, exports, module) {
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
    var common_1 = $__require("13");
    var ng2_alfresco_core_1 = $__require("5");
    var ng2_alfresco_datatable_1 = $__require("10");
    var ShareDataTableAdapter = function () {
        function ShareDataTableAdapter(documentListService, basePath, schema) {
            this.documentListService = documentListService;
            this.basePath = basePath;
            this.ERR_ROW_NOT_FOUND = 'Row not found';
            this.ERR_COL_NOT_FOUND = 'Column not found';
            this.DEFAULT_ROOT_ID = '-root-';
            this.DEFAULT_DATE_FORMAT = 'medium';
            this.DEFAULT_PAGE_SIZE = 20;
            this.MIN_PAGE_SIZE = 5;
            this._count = 0;
            this._hasMoreItems = false;
            this._totalItems = 0;
            this._skipCount = 0;
            this._maxItems = this.DEFAULT_PAGE_SIZE;
            this.thumbnails = false;
            this.rootFolderId = this.DEFAULT_ROOT_ID;
            this.dataLoaded = new ng2_alfresco_datatable_1.DataLoadedEventEmitter();
            this.rows = [];
            this.columns = schema || [];
            this.resetPagination();
        }
        Object.defineProperty(ShareDataTableAdapter.prototype, "count", {
            get: function () {
                return this._count;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShareDataTableAdapter.prototype, "hasMoreItems", {
            get: function () {
                return this._hasMoreItems;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShareDataTableAdapter.prototype, "totalItems", {
            get: function () {
                return this._totalItems;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShareDataTableAdapter.prototype, "skipCount", {
            get: function () {
                return this._skipCount;
            },
            set: function (value) {
                if (value !== this._skipCount) {
                    this._skipCount = value > 0 ? value : 0;
                    this.loadPath(this.currentPath);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShareDataTableAdapter.prototype, "maxItems", {
            get: function () {
                return this._maxItems;
            },
            set: function (value) {
                if (value !== this._maxItems) {
                    this._maxItems = value > this.MIN_PAGE_SIZE ? value : this.MIN_PAGE_SIZE;
                    this.loadPath(this.currentPath);
                }
            },
            enumerable: true,
            configurable: true
        });
        ShareDataTableAdapter.prototype.getRows = function () {
            return this.rows;
        };
        ShareDataTableAdapter.prototype.setRows = function (rows) {
            this.rows = rows || [];
            this.sort();
        };
        ShareDataTableAdapter.prototype.getColumns = function () {
            return this.columns;
        };
        ShareDataTableAdapter.prototype.setColumns = function (columns) {
            this.columns = columns || [];
        };
        ShareDataTableAdapter.prototype.getValue = function (row, col) {
            if (!row) {
                throw new Error(this.ERR_ROW_NOT_FOUND);
            }
            if (!col) {
                throw new Error(this.ERR_COL_NOT_FOUND);
            }
            var dataRow = row;
            var value = row.getValue(col.key);
            if (dataRow.cache[col.key] !== undefined) {
                return dataRow.cache[col.key];
            }
            if (col.type === 'date') {
                var datePipe = new common_1.DatePipe('en-US');
                var format = col.format || this.DEFAULT_DATE_FORMAT;
                try {
                    var result = datePipe.transform(value, format);
                    return dataRow.cacheValue(col.key, result);
                } catch (err) {
                    console.error("Error parsing date " + value + " to format " + format);
                    return 'Error';
                }
            }
            if (col.type === 'image') {
                if (this.imageResolver) {
                    var resolved = this.imageResolver(row, col);
                    if (resolved) {
                        return resolved;
                    }
                }
                if (col.key === '$thumbnail') {
                    var node = row.node;
                    if (node.entry.isFolder) {
                        return this.getImagePath('ft_ic_folder.svg');
                    }
                    if (node.entry.isFile) {
                        if (this.thumbnails) {
                            if (this.documentListService) {
                                return this.documentListService.getDocumentThumbnailUrl(node);
                            }
                            return null;
                        }
                        if (node.entry.content) {
                            var mimeType = node.entry.content.mimeType;
                            if (mimeType) {
                                var icon = this.documentListService.getMimeTypeIcon(mimeType);
                                if (icon) {
                                    return this.getImagePath(icon);
                                }
                            }
                        }
                    }
                    return this.getImagePath('ft_ic_miscellaneous.svg');
                }
            }
            return dataRow.cacheValue(col.key, value);
        };
        ShareDataTableAdapter.prototype.getSorting = function () {
            return this.sorting;
        };
        ShareDataTableAdapter.prototype.setSorting = function (sorting) {
            this.sorting = sorting;
            this.sortRows(this.rows, this.sorting);
        };
        ShareDataTableAdapter.prototype.sort = function (key, direction) {
            var sorting = this.sorting || new ng2_alfresco_datatable_1.DataSorting();
            if (key) {
                sorting.key = key;
                sorting.direction = direction || 'asc';
            }
            this.setSorting(sorting);
        };
        ShareDataTableAdapter.prototype.loadPath = function (path) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (path && _this.documentListService) {
                    _this.documentListService.getFolder(path, {
                        maxItems: _this._maxItems,
                        skipCount: _this._skipCount,
                        rootFolderId: _this.rootFolderId
                    }).subscribe(function (val) {
                        _this.currentPath = path;
                        _this.loadPage(val);
                        _this.dataLoaded.emit(null);
                        resolve(true);
                    }, function (error) {
                        reject(error);
                    });
                } else {
                    resolve(false);
                }
            });
        };
        ShareDataTableAdapter.prototype.loadById = function (id) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (id && _this.documentListService) {
                    _this.documentListService.getFolder(null, {
                        maxItems: _this._maxItems,
                        skipCount: _this._skipCount,
                        rootFolderId: id
                    }).subscribe(function (val) {
                        _this.loadPage(val);
                        _this.dataLoaded.emit(null);
                        resolve(true);
                    }, function (error) {
                        reject(error);
                    });
                } else {
                    resolve(false);
                }
            });
        };
        ShareDataTableAdapter.prototype.setFilter = function (filter) {
            this.filter = filter;
            if (this.filter && this.currentPath) {
                this.loadPath(this.currentPath);
            }
        };
        ShareDataTableAdapter.prototype.setImageResolver = function (resolver) {
            this.imageResolver = resolver;
        };
        ShareDataTableAdapter.prototype.sortRows = function (rows, sorting) {
            if (sorting && sorting.key && rows && rows.length > 0) {
                rows.sort(function (a, b) {
                    if (a.node.entry.isFolder !== b.node.entry.isFolder) {
                        return a.node.entry.isFolder ? -1 : 1;
                    }
                    var left = a.getValue(sorting.key);
                    if (left) {
                        left = left instanceof Date ? left.valueOf().toString() : left.toString();
                    } else {
                        left = '';
                    }
                    var right = b.getValue(sorting.key);
                    if (right) {
                        right = right instanceof Date ? right.valueOf().toString() : right.toString();
                    } else {
                        right = '';
                    }
                    return sorting.direction === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
                });
            }
        };
        ShareDataTableAdapter.prototype.loadPage = function (page) {
            this.page = page;
            this.resetPagination();
            var rows = [];
            if (page && page.list) {
                var data = page.list.entries;
                if (data && data.length > 0) {
                    rows = data.map(function (item) {
                        return new ShareDataRow(item);
                    });
                    if (this.filter) {
                        rows = rows.filter(this.filter);
                    }
                    if (this.columns && this.columns.length > 0) {
                        var sorting = this.getSorting();
                        if (sorting) {
                            this.sortRows(rows, sorting);
                        } else {
                            var sortable = this.columns.filter(function (c) {
                                return c.sortable;
                            });
                            if (sortable.length > 0) {
                                this.sort(sortable[0].key, 'asc');
                            } else {
                                this.sort(this.columns[0].key, 'asc');
                            }
                        }
                    }
                }
                var pagination = page.list.pagination;
                if (pagination) {
                    this._count = pagination.count;
                    this._hasMoreItems = pagination.hasMoreItems;
                    this._maxItems = pagination.maxItems;
                    this._skipCount = pagination.skipCount;
                    this._totalItems = pagination.totalItems;
                }
            }
            this.rows = rows;
        };
        ShareDataTableAdapter.prototype.getImagePath = function (id) {
            return this.basePath + "/assets/images/" + id;
        };
        ShareDataTableAdapter.prototype.resetPagination = function () {
            this._count = 0;
            this._hasMoreItems = false;
            this._totalItems = 0;
            this._skipCount = 0;
            this._maxItems = this.DEFAULT_PAGE_SIZE;
        };
        return ShareDataTableAdapter;
    }();
    exports.ShareDataTableAdapter = ShareDataTableAdapter;
    var ShareDataRow = function () {
        function ShareDataRow(obj) {
            this.obj = obj;
            this.cache = {};
            this.isSelected = false;
            if (!obj) {
                throw new Error(ShareDataRow.ERR_OBJECT_NOT_FOUND);
            }
        }
        Object.defineProperty(ShareDataRow.prototype, "node", {
            get: function () {
                return this.obj;
            },
            enumerable: true,
            configurable: true
        });
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
            return this.getValue(key) ? true : false;
        };
        return ShareDataRow;
    }();
    ShareDataRow.ERR_OBJECT_NOT_FOUND = 'Object source not found';
    exports.ShareDataRow = ShareDataRow;
    return module.exports;
});
$__System.registerDynamic('a', [], true, function ($__require, exports, module) {
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
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ContentActionModel = function () {
        function ContentActionModel(obj) {
            if (obj) {
                this.icon = obj.icon;
                this.title = obj.title;
                this.handler = obj.handler;
                this.target = obj.target;
            }
        }
        return ContentActionModel;
    }();
    exports.ContentActionModel = ContentActionModel;
    var DocumentActionModel = function (_super) {
        __extends(DocumentActionModel, _super);
        function DocumentActionModel(json) {
            var _this = _super.call(this, json) || this;
            _this.target = 'document';
            return _this;
        }
        return DocumentActionModel;
    }(ContentActionModel);
    exports.DocumentActionModel = DocumentActionModel;
    var FolderActionModel = function (_super) {
        __extends(FolderActionModel, _super);
        function FolderActionModel(json) {
            var _this = _super.call(this, json) || this;
            _this.target = 'folder';
            return _this;
        }
        return FolderActionModel;
    }(ContentActionModel);
    exports.FolderActionModel = FolderActionModel;
    return module.exports;
});
$__System.registerDynamic("14", [], true, function ($__require, exports, module) {
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
    var NodePaging = function () {
        function NodePaging() {}
        return NodePaging;
    }();
    exports.NodePaging = NodePaging;
    var NodePagingList = function () {
        function NodePagingList() {}
        return NodePagingList;
    }();
    exports.NodePagingList = NodePagingList;
    var NodeMinimalEntry = function () {
        function NodeMinimalEntry() {}
        return NodeMinimalEntry;
    }();
    exports.NodeMinimalEntry = NodeMinimalEntry;
    var Pagination = function () {
        function Pagination() {}
        return Pagination;
    }();
    exports.Pagination = Pagination;
    var NodeMinimal = function () {
        function NodeMinimal() {
            this.properties = {};
        }
        return NodeMinimal;
    }();
    exports.NodeMinimal = NodeMinimal;
    var UserInfo = function () {
        function UserInfo() {}
        return UserInfo;
    }();
    exports.UserInfo = UserInfo;
    var ContentInfo = function () {
        function ContentInfo() {}
        return ContentInfo;
    }();
    exports.ContentInfo = ContentInfo;
    var PathInfoEntity = function () {
        function PathInfoEntity() {}
        return PathInfoEntity;
    }();
    exports.PathInfoEntity = PathInfoEntity;
    var PathElementEntity = function () {
        function PathElementEntity() {}
        return PathElementEntity;
    }();
    exports.PathElementEntity = PathElementEntity;
    return module.exports;
});
$__System.registerDynamic("1", ["3", "5", "10", "8", "2", "6", "7", "9", "b", "e", "12", "d", "c", "4", "11", "a", "14"], true, function ($__require, exports, module) {
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
    var ng2_alfresco_core_1 = $__require("5");
    var ng2_alfresco_datatable_1 = $__require("10");
    var document_list_1 = $__require("8");
    var document_menu_action_1 = $__require("2");
    var content_column_1 = $__require("6");
    var content_column_list_1 = $__require("7");
    var content_action_1 = $__require("9");
    var content_action_list_1 = $__require("b");
    var empty_folder_content_1 = $__require("e");
    var breadcrumb_component_1 = $__require("12");
    var folder_actions_service_1 = $__require("d");
    var document_actions_service_1 = $__require("c");
    var document_list_service_1 = $__require("4");
    __export($__require("8"));
    __export($__require("6"));
    __export($__require("7"));
    __export($__require("9"));
    __export($__require("b"));
    __export($__require("e"));
    __export($__require("12"));
    __export($__require("11"));
    __export($__require("d"));
    __export($__require("c"));
    __export($__require("4"));
    __export($__require("a"));
    __export($__require("14"));
    exports.DOCUMENT_LIST_DIRECTIVES = [document_list_1.DocumentList, document_menu_action_1.DocumentMenuAction, content_column_1.ContentColumn, content_column_list_1.ContentColumnList, content_action_1.ContentAction, content_action_list_1.ContentActionList, empty_folder_content_1.EmptyFolderContent, breadcrumb_component_1.DocumentListBreadcrumb];
    exports.DOCUMENT_LIST_PROVIDERS = [document_list_service_1.DocumentListService, folder_actions_service_1.FolderActionsService, document_actions_service_1.DocumentActionsService];
    var DocumentListModule = DocumentListModule_1 = function () {
        function DocumentListModule() {}
        DocumentListModule.forRoot = function () {
            return {
                ngModule: DocumentListModule_1,
                providers: exports.DOCUMENT_LIST_PROVIDERS.slice()
            };
        };
        return DocumentListModule;
    }();
    DocumentListModule = DocumentListModule_1 = __decorate([core_1.NgModule({
        imports: [ng2_alfresco_core_1.CoreModule, ng2_alfresco_datatable_1.DataTableModule],
        declarations: exports.DOCUMENT_LIST_DIRECTIVES.slice(),
        providers: exports.DOCUMENT_LIST_PROVIDERS.slice(),
        exports: [ng2_alfresco_datatable_1.DataTableModule].concat(exports.DOCUMENT_LIST_DIRECTIVES)
    }), __metadata("design:paramtypes", [])], DocumentListModule);
    exports.DocumentListModule = DocumentListModule;
    var DocumentListModule_1;
    

    return module.exports;
});
})
(function(factory) {
  if (typeof define == 'function' && define.amd)
    define(["@angular/common","@angular/core","ng2-alfresco-core","ng2-alfresco-datatable","rxjs/Rx"], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory(require("@angular/common"), require("@angular/core"), require("ng2-alfresco-core"), require("ng2-alfresco-datatable"), require("rxjs/Rx"));
  else
    throw new Error("Module must be loaded as AMD or CommonJS");
});
//# sourceMappingURL=ng2-alfresco-documentlist.js.map
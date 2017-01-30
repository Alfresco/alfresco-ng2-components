!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in v||(v[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==g.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=v[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(g.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=v[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return y[e]||(y[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},{id:r.name});t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=v[s],f=y[s];f?l=f.exports:c&&!c.declarative?l=c.esModule:c?(d(c),f=c.module,l=f.exports):l=p(s),f&&f.importers?(f.importers.push(t),t.dependencies.push(f)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=v[e];if(t)t.declarative?f(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=p(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=v[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);void 0!==typeof c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(r){var t={};if(("object"==typeof r||"function"==typeof r)&&r!==e)if(m)for(var n in r)"default"!==n&&c(t,r,n);else{var o=r&&r.hasOwnProperty;for(var n in r)"default"===n||o&&!r.hasOwnProperty(n)||(t[n]=r[n])}return t["default"]=r,x(t,"__useDefault",{value:!0}),t}function c(e,r,t){try{var n;(n=Object.getOwnPropertyDescriptor(r,t))&&x(e,t,n)}catch(o){return e[t]=r[t],!1}}function f(r,t){var n=v[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==g.call(t,u)&&(v[u]?f(u,t):p(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function p(e){if(I[e])return I[e];if("@node/"==e.substr(0,6))return I[e]=s(D(e.substr(6)));var r=v[e];if(!r)throw"Module "+e+" not present.";return a(e),f(e,[]),v[e]=void 0,r.declarative&&x(r.module.exports,"__esModule",{value:!0}),I[e]=r.declarative?r.module.exports:r.esModule}var v={},g=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},m=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(h){m=!1}var x;!function(){try{Object.defineProperty({},"a",{})&&(x=Object.defineProperty)}catch(e){x=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var y={},D="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,I={"@empty":{}};return function(e,n,o,a){return function(u){u(function(u){for(var d={_nodeRequire:D,register:r,registerDynamic:t,get:p,set:function(e,r){I[e]=r},newModule:function(e){return e}},i=0;i<n.length;i++)(function(e,r){r&&r.__esModule?I[e]=r:I[e]=s(r)})(n[i],arguments[i]);a(d);var l=p(e[0]);if(e.length>1)for(var i=1;i<e.length;i++)p(e[i]);return o?l["default"]:l})}}}("undefined"!=typeof self?self:global)

(["1"], ["3","4","5"], true, function($__System) {
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
    var __param = this && this.__param || function (paramIndex, decorator) {
        return function (target, key) {
            decorator(target, key, paramIndex);
        };
    };
    var core_1 = $__require("3");
    var platform_browser_1 = $__require("4");
    var ng2_alfresco_core_1 = $__require("5");
    var ViewerComponent = function () {
        function ViewerComponent(apiService, element, document) {
            this.apiService = apiService;
            this.element = element;
            this.document = document;
            this.urlFile = '';
            this.fileNodeId = null;
            this.overlayMode = false;
            this.showViewer = true;
            this.showToolbar = true;
            this.showViewerChange = new core_1.EventEmitter();
            this.loaded = false;
        }
        ViewerComponent.prototype.ngOnChanges = function (changes) {
            var _this = this;
            if (this.showViewer) {
                this.hideOtherHeaderBar();
                this.blockOtherScrollBar();
                if (!this.urlFile && !this.fileNodeId) {
                    throw new Error('Attribute urlFile or fileNodeId is required');
                }
                return new Promise(function (resolve, reject) {
                    var alfrescoApi = _this.apiService.getInstance();
                    if (_this.urlFile) {
                        var filenameFromUrl = _this.getFilenameFromUrl(_this.urlFile);
                        _this.displayName = filenameFromUrl ? filenameFromUrl : '';
                        _this.extension = _this.getFileExtension(filenameFromUrl);
                        _this.urlFileContent = _this.urlFile;
                        resolve();
                    } else if (_this.fileNodeId) {
                        alfrescoApi.nodes.getNodeInfo(_this.fileNodeId).then(function (data) {
                            _this.mimeType = data.content.mimeType;
                            _this.displayName = data.name;
                            _this.urlFileContent = alfrescoApi.content.getContentUrl(data.id);
                            _this.loaded = true;
                            resolve();
                        }, function (error) {
                            reject(error);
                            console.log('This node does not exist');
                        });
                    }
                });
            }
        };
        ViewerComponent.prototype.close = function () {
            this.unblockOtherScrollBar();
            if (this.otherMenu) {
                this.otherMenu.hidden = false;
            }
            this.cleanup();
            this.showViewer = false;
            this.showViewerChange.emit(this.showViewer);
        };
        ViewerComponent.prototype.cleanup = function () {
            this.urlFileContent = '';
            this.displayName = '';
            this.fileNodeId = null;
            this.loaded = false;
            this.extension = null;
            this.mimeType = null;
        };
        ViewerComponent.prototype.ngOnDestroy = function () {
            this.cleanup();
        };
        ViewerComponent.prototype.getFilenameFromUrl = function (url) {
            var anchor = url.indexOf('#');
            var query = url.indexOf('?');
            var end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);
            return url.substring(url.lastIndexOf('/', end) + 1, end);
        };
        ViewerComponent.prototype.getFileExtension = function (fileName) {
            return fileName.split('.').pop().toLowerCase();
        };
        ViewerComponent.prototype.isImage = function () {
            return this.isImageExtension() || this.isImageMimeType();
        };
        ViewerComponent.prototype.isMedia = function () {
            return this.isMediaExtension(this.extension) || this.isMediaMimeType();
        };
        ViewerComponent.prototype.isImageExtension = function () {
            return this.extension === 'png' || this.extension === 'jpg' || this.extension === 'jpeg' || this.extension === 'gif' || this.extension === 'bmp';
        };
        ViewerComponent.prototype.isMediaMimeType = function () {
            var mimeExtension;
            if (this.mimeType && this.mimeType.indexOf('/')) {
                mimeExtension = this.mimeType.substr(this.mimeType.indexOf('/') + 1, this.mimeType.length);
            }
            return this.mimeType && this.mimeType.indexOf('video/') === 0 && this.isMediaExtension(mimeExtension);
        };
        ViewerComponent.prototype.isMediaExtension = function (extension) {
            return extension === 'mp4' || extension === 'WebM' || extension === 'Ogg';
        };
        ViewerComponent.prototype.isImageMimeType = function () {
            return this.mimeType && this.mimeType.indexOf('image/') === 0;
        };
        ViewerComponent.prototype.isPdf = function () {
            return this.extension === 'pdf' || this.mimeType === 'application/pdf';
        };
        ViewerComponent.prototype.supportedExtension = function () {
            return this.isImage() || this.isPdf() || this.isMedia();
        };
        ViewerComponent.prototype.handleKeyboardEvent = function (event) {
            var key = event.keyCode;
            if (key === 27 && this.overlayMode) {
                this.close();
            }
        };
        ViewerComponent.prototype.blockOtherScrollBar = function () {
            var mainElements = document.getElementsByTagName('main');
            for (var i = 0; i < mainElements.length; i++) {
                mainElements[i].style.overflow = 'hidden';
            }
        };
        ViewerComponent.prototype.unblockOtherScrollBar = function () {
            var mainElements = document.getElementsByTagName('main');
            for (var i = 0; i < mainElements.length; i++) {
                mainElements[i].style.overflow = '';
            }
        };
        ViewerComponent.prototype.isParentElementHeaderBar = function () {
            return !!this.closestElement(this.element.nativeElement, 'header');
        };
        ViewerComponent.prototype.closestElement = function (elelemnt, nodeName) {
            var parent = elelemnt.parentElement;
            if (parent) {
                if (parent.nodeName.toLowerCase() === nodeName) {
                    return parent;
                } else {
                    return this.closestElement(parent, nodeName);
                }
            } else {
                return null;
            }
        };
        ViewerComponent.prototype.hideOtherHeaderBar = function () {
            if (this.overlayMode && !this.isParentElementHeaderBar()) {
                this.otherMenu = document.querySelector('header');
                if (this.otherMenu) {
                    this.otherMenu.hidden = true;
                }
            }
        };
        ViewerComponent.prototype.isLoaded = function () {
            return this.fileNodeId ? this.loaded : true;
        };
        return ViewerComponent;
    }();
    __decorate([core_1.Input(), __metadata("design:type", String)], ViewerComponent.prototype, "urlFile", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], ViewerComponent.prototype, "fileNodeId", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], ViewerComponent.prototype, "overlayMode", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], ViewerComponent.prototype, "showViewer", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], ViewerComponent.prototype, "showToolbar", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], ViewerComponent.prototype, "showViewerChange", void 0);
    __decorate([core_1.HostListener('document:keydown', ['$event']), __metadata("design:type", Function), __metadata("design:paramtypes", [KeyboardEvent]), __metadata("design:returntype", void 0)], ViewerComponent.prototype, "handleKeyboardEvent", null);
    ViewerComponent = __decorate([core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-viewer',
        template: "<div id=\"viewer\" *ngIf=\"showViewer\" [ngClass]=\"{'all-space': !overlayMode }\">     <div *ngIf=\"overlayMode\">         <div id=\"viewer-shadow-transparent\" class=\"viewer-shadow-transparent\"></div>     </div>      <div id=\"viewer-main-container\" class=\"all-space\" [ngClass]=\"{'viewer-overlay-view': overlayMode }\">          <!-- Start Layout -->         <div [ngClass]=\"{'mdl-layout mdl-js-layout mdl-layout--fixed-header': overlayMode, 'all-space': !overlayMode}\">              <header *ngIf=\"overlayMode\" class=\"mdl-layout__header\">                 <div class=\"mdl-layout__header-row\">                      <!-- File Title -->                     <span id=\"viewer-name-file\" class=\"mdl-layout-title viewer-name-file\">{{displayName}}</span>                      <span class=\"vertical-divider\"></span>                      <div class=\"mdl-layout-spacer\"></div>                      <!-- Start Navigation -->                     <nav class=\"mdl-navigation\">                         <div id=\"viewer-toolbar-view-options\">                             <button *ngIf=\"overlayMode\"                                     class=\"mdl-color--black mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored\"                                     (click)=\"close()\">                                 <i id=\"viewer-close-button\" class=\"icon material-icons\">close</i>                             </button>                         </div>                     </nav>                     <!-- End Navigation -->                 </div>             </header>             <!--<div class=\"mdl-layout__drawer\">-->             <!--<span class=\"mdl-layout-title\">Thumbnail</span>-->             <!--</div>-->             <main id=\"page-content\" class=\"mdl-layout__content\" [ngClass]=\"{'all-space': !overlayMode }\">                  <div class=\"mdl-grid\">                     <!--<div id=\"viewer-previous-file-button\" class=\"center-element mdl-cell mdl-cell&#45;&#45;2-col mdl-cell&#45;&#45;hide-tablet mdl-cell&#45;&#45;hide-phone\">-->                     <!--<button  *ngIf=\"false\"-->                     <!--class=\"center-element mdl-color&#45;&#45;black mdl-button mdl-js-button mdl-button&#45;&#45;fab mdl-button&#45;&#45;mini-fab mdl-button&#45;&#45;colored\"-->                     <!--(click)=\"previousFile()\">-->                     <!--<i class=\"icon material-icons \">keyboard_arrow_left</i>-->                     <!--</button>-->                     <!--</div>-->                      <div id=\"viewer-content-container\" *ngIf=\"isLoaded()\"                          class=\"center-element mdl-cell mdl-cell--12-col\">                          <!-- Start View Switch-->                         <div *ngIf=\"isPdf()\">                             <pdf-viewer [showToolbar]=\"showToolbar\" [urlFile]=\"urlFileContent\"                                         [nameFile]=\"displayName\"></pdf-viewer>                         </div>                         <div class=\"center-element\" *ngIf=\"isImage()\">                             <img-viewer [urlFile]=\"urlFileContent\" [nameFile]=\"displayName\"></img-viewer>                         </div>                         <div class=\"center-element\" *ngIf=\"isMedia()\">                             <media-player [urlFile]=\"urlFileContent\" [mimeType]=\"mimeType\"                                           [nameFile]=\"displayName\"></media-player>                         </div>                         <div *ngIf=\"!supportedExtension()\">                             <not-supported-format [urlFile]=\"urlFileContent\"                                                   [nameFile]=\"displayName\"></not-supported-format>                         </div>                         <!-- End View Switch -->                      </div>                      <!--<div id=\"viewer-next-file-button\" class=\"center-element mdl-cell mdl-cell&#45;&#45;2-col mdl-cell&#45;&#45;hide-tablet mdl-cell&#45;&#45;hide-phone\">-->                     <!--<button *ngIf=\"false\"-->                     <!--class=\"center-element mdl-color&#45;&#45;black mdl-button mdl-js-button mdl-button&#45;&#45;fab mdl-button&#45;&#45;mini-fab mdl-button&#45;&#45;colored\"-->                     <!--(click)=\"nextFile()\">-->                     <!--<i class=\"icon material-icons\">keyboard_arrow_right</i>-->                     <!--</button>-->                     <!--</div>-->                  </div>             </main>         </div>         <!-- End Layout -->     </div> </div>",
        styles: [".button-container {     padding: 0 40px; }  .left {     float: left; }  #page-content {     display: flex;     flex-direction: row;     flex-wrap: wrap;     flex: 1; }  .mdl-grid {     width: 100vw;     padding: 0px !important; }  .viewer-name-file {     width: 50%;     height: 21px;     overflow: hidden !important;     text-overflow: ellipsis; }  .viewer-shadow-transparent {     z-index: 1000;     background-color: #3E3E3E;     position: fixed;     top: 0;     bottom: 0;     left: 0;     right: 0;     opacity: .90; }  .viewer-overlay-view {     position: fixed;     top: 0px;     left: 0px;     z-index: 1000; }  img-viewer {     height: 100%; }  .center-element {     display: flex;     align-items: center;     justify-content: center; }  .all-space{     width: 100%;     height: 100%;     background-color: #515151; }"]
    }), __param(2, core_1.Inject(platform_browser_1.DOCUMENT)), __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoApiService, core_1.ElementRef, Object])], ViewerComponent);
    exports.ViewerComponent = ViewerComponent;
    return module.exports;
});
$__System.registerDynamic("6", ["3"], true, function ($__require, exports, module) {
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
    var ImgViewerComponent = function () {
        function ImgViewerComponent() {}
        ImgViewerComponent.prototype.ngOnChanges = function (changes) {
            if (!this.urlFile) {
                throw new Error('Attribute urlFile is required');
            }
        };
        return ImgViewerComponent;
    }();
    __decorate([core_1.Input(), __metadata("design:type", String)], ImgViewerComponent.prototype, "urlFile", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], ImgViewerComponent.prototype, "nameFile", void 0);
    ImgViewerComponent = __decorate([core_1.Component({
        moduleId: module.id,
        selector: 'img-viewer',
        template: "<div class=\"viewer-image-content\">     <div class=\"viewer-image-row\">         <div class=\"viewer-image-cell\">             <img id=\"viewer-image\" src=\"{{urlFile}}\"  alt=\"{{nameFile}}\" class=\"center-element viewer-image\"/>         </div>     </div> </div>",
        styles: [".viewer-image-row {     display: -webkit-box;     display: -moz-box;     display: -ms-flexbox;     display: -webkit-flex;     display: flex;      -webkit-box-orient: horizontal;     -moz-box-orient: horizontal;     box-orient: horizontal;     flex-direction: row;      -webkit-box-pack: center;     -moz-box-pack: center;     box-pack: center;     justify-content: center;      -webkit-box-align: center;     -moz-box-align: center;     box-align: center;     align-items: center; }  .viewer-image-cell {     -webkit-box-flex: 1;     -moz-box-flex: 1;     box-flex: 1;     -webkit-flex: 1 1 auto;     flex: 1 1 auto;      padding: 10px;     margin: 10px;      text-align: center; }  .viewer-image {     height: 80vh;     max-width:100%; }"]
    }), __metadata("design:paramtypes", [])], ImgViewerComponent);
    exports.ImgViewerComponent = ImgViewerComponent;
    return module.exports;
});
$__System.registerDynamic("7", ["3"], true, function ($__require, exports, module) {
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
    var MediaPlayerComponent = function () {
        function MediaPlayerComponent() {}
        MediaPlayerComponent.prototype.ngOnChanges = function (changes) {
            if (!this.urlFile) {
                throw new Error('Attribute urlFile is required');
            }
        };
        return MediaPlayerComponent;
    }();
    __decorate([core_1.Input(), __metadata("design:type", String)], MediaPlayerComponent.prototype, "urlFile", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], MediaPlayerComponent.prototype, "mimeType", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], MediaPlayerComponent.prototype, "nameFile", void 0);
    MediaPlayerComponent = __decorate([core_1.Component({
        moduleId: module.id,
        selector: 'media-player',
        template: "<div class=\"viewer-video-content\">     <div class=\"viewer-video-row\">         <div class=\"viewer-video-cell\">             <video controls  >                 <source [src]=\"urlFile\" [type]=\"mimeType\" />             </video>         </div>     </div> </div>",
        styles: [".viewer-video-row {     display: -webkit-box;     display: -moz-box;     display: -ms-flexbox;     display: -webkit-flex;     display: flex;      -webkit-box-orient: horizontal;     -moz-box-orient: horizontal;     box-orient: horizontal;     flex-direction: row;      -webkit-box-pack: center;     -moz-box-pack: center;     box-pack: center;     justify-content: center;      -webkit-box-align: center;     -moz-box-align: center;     box-align: center;     align-items: center; }  .viewer-video-cell {     -webkit-box-flex: 1;     -moz-box-flex: 1;     box-flex: 1;     -webkit-flex: 1 1 auto;     flex: 1 1 auto;      padding: 10px;     margin: 10px;      text-align: center; }  video {     max-height: 80vh;     display: flex;     flex-direction: row;     flex-wrap: nowrap;     justify-content: center;     align-items: center;     align-content: center;     max-width: 100%;     margin-left: auto;     margin-right: auto; }"]
    }), __metadata("design:paramtypes", [])], MediaPlayerComponent);
    exports.MediaPlayerComponent = MediaPlayerComponent;
    return module.exports;
});
$__System.registerDynamic("8", ["3"], true, function ($__require, exports, module) {
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
    var NotSupportedFormat = function () {
        function NotSupportedFormat() {}
        NotSupportedFormat.prototype.download = function () {
            window.open(this.urlFile);
        };
        return NotSupportedFormat;
    }();
    __decorate([core_1.Input(), __metadata("design:type", String)], NotSupportedFormat.prototype, "nameFile", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], NotSupportedFormat.prototype, "urlFile", void 0);
    NotSupportedFormat = __decorate([core_1.Component({
        moduleId: module.id,
        selector: 'not-supported-format',
        template: "<section class=\"section--center mdl-grid mdl-grid--no-spacing\">     <div class=\"viewer-margin mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone mdl-shadow--2dp\">         <div class=\"viewer-download-text mdl-card__supporting-text full_width\">             <h4>File <span>{{nameFile}}</span> is an unsupported format</h4>         </div>         <div class=\"center-element mdl-card__actions\">             <button id=\"viewer-download-button\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" (click)=\"download()\">                 <i class=\"viewer-margin-cloud-download material-icons\">cloud_download</i>   Download             </button>         </div>     </div> </section>",
        styles: [" .viewer-download-text  {     text-align: center; }  .viewer-margin-cloud-download{     margin-right: 20px; }  .viewer-margin {     margin: auto !important; }  .center-element {     display: flex;     align-items: center;     justify-content: center; }  .full_width{     width :100% !important; }"]
    }), __metadata("design:paramtypes", [])], NotSupportedFormat);
    exports.NotSupportedFormat = NotSupportedFormat;
    return module.exports;
});
$__System.registerDynamic("9", ["3"], true, function ($__require, exports, module) {
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
    var RenderingQueueServices = function () {
        function RenderingQueueServices() {
            this.renderingStates = {
                INITIAL: 0,
                RUNNING: 1,
                PAUSED: 2,
                FINISHED: 3
            };
            this.CLEANUP_TIMEOUT = 30000;
            this.pdfViewer = null;
            this.pdfThumbnailViewer = null;
            this.onIdle = null;
            this.highestPriorityPage = null;
            this.idleTimeout = null;
            this.printing = false;
            this.isThumbnailViewEnabled = false;
        }
        RenderingQueueServices.prototype.setViewer = function (pdfViewer) {
            this.pdfViewer = pdfViewer;
        };
        RenderingQueueServices.prototype.setThumbnailViewer = function (pdfThumbnailViewer) {
            this.pdfThumbnailViewer = pdfThumbnailViewer;
        };
        RenderingQueueServices.prototype.isHighestPriority = function (view) {
            return this.highestPriorityPage === view.renderingId;
        };
        RenderingQueueServices.prototype.renderHighestPriority = function (currentlyVisiblePages) {
            if (this.idleTimeout) {
                clearTimeout(this.idleTimeout);
                this.idleTimeout = null;
            }
            if (this.pdfViewer.forceRendering(currentlyVisiblePages)) {
                return;
            }
            if (this.pdfThumbnailViewer && this.isThumbnailViewEnabled) {
                if (this.pdfThumbnailViewer.forceRendering()) {
                    return;
                }
            }
            if (this.printing) {
                return;
            }
            if (this.onIdle) {
                this.idleTimeout = setTimeout(this.onIdle.bind(this), this.CLEANUP_TIMEOUT);
            }
        };
        RenderingQueueServices.prototype.getHighestPriority = function (visible, views, scrolledDown) {
            var visibleViews = visible.views;
            var numVisible = visibleViews.length;
            if (numVisible === 0) {
                return false;
            }
            for (var i = 0; i < numVisible; ++i) {
                var view = visibleViews[i].view;
                if (!this.isViewFinished(view)) {
                    return view;
                }
            }
            if (scrolledDown) {
                var nextPageIndex = visible.last.id;
                if (views[nextPageIndex] && !this.isViewFinished(views[nextPageIndex])) {
                    return views[nextPageIndex];
                }
            } else {
                var previousPageIndex = visible.first.id - 2;
                if (views[previousPageIndex] && !this.isViewFinished(views[previousPageIndex])) {
                    return views[previousPageIndex];
                }
            }
            return null;
        };
        RenderingQueueServices.prototype.isViewFinished = function (view) {
            return view.renderingState === this.renderingStates.FINISHED;
        };
        RenderingQueueServices.prototype.renderView = function (view) {
            var state = view.renderingState;
            switch (state) {
                case this.renderingStates.FINISHED:
                    return false;
                case this.renderingStates.PAUSED:
                    this.highestPriorityPage = view.renderingId;
                    view.resume();
                    break;
                case this.renderingStates.RUNNING:
                    this.highestPriorityPage = view.renderingId;
                    break;
                case this.renderingStates.INITIAL:
                    this.highestPriorityPage = view.renderingId;
                    var continueRendering = function () {
                        this.renderHighestPriority();
                    }.bind(this);
                    view.draw().then(continueRendering, continueRendering);
                    break;
                default:
                    break;
            }
            return true;
        };
        return RenderingQueueServices;
    }();
    RenderingQueueServices = __decorate([core_1.Injectable(), __metadata("design:paramtypes", [])], RenderingQueueServices);
    exports.RenderingQueueServices = RenderingQueueServices;
    return module.exports;
});
$__System.registerDynamic("a", ["3", "9"], true, function ($__require, exports, module) {
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
    var rendering_queue_services_1 = $__require("9");
    var PdfViewerComponent = function () {
        function PdfViewerComponent(renderingQueueServices) {
            this.renderingQueueServices = renderingQueueServices;
            this.showToolbar = true;
            this.currentScaleMode = 'auto';
            this.MAX_AUTO_SCALE = 1.25;
            this.DEFAULT_SCALE_DELTA = 1.1;
            this.MIN_SCALE = 0.25;
            this.MAX_SCALE = 10.0;
        }
        PdfViewerComponent.prototype.ngOnChanges = function (changes) {
            var _this = this;
            if (!this.urlFile) {
                throw new Error('Attribute urlFile is required');
            }
            if (this.urlFile) {
                return new Promise(function (resolve, reject) {
                    var loadingTask = _this.getPDFJS().getDocument(_this.urlFile);
                    loadingTask.onProgress = function (progressData) {
                        var level = progressData.loaded / progressData.total;
                        _this.laodingPercent = Math.round(level * 100);
                    };
                    loadingTask.then(function (pdfDocument) {
                        _this.currentPdfDocument = pdfDocument;
                        _this.totalPages = pdfDocument.numPages;
                        _this.page = 1;
                        _this.displayPage = 1;
                        _this.initPDFViewer(_this.currentPdfDocument);
                        _this.currentPdfDocument.getPage(1).then(function () {
                            _this.scalePage('auto');
                            resolve();
                        }, function (error) {
                            reject(error);
                        });
                    }, function (error) {
                        reject(error);
                    });
                });
            }
        };
        PdfViewerComponent.prototype.getPDFJS = function () {
            return PDFJS;
        };
        PdfViewerComponent.prototype.initPDFViewer = function (pdfDocument) {
            var _this = this;
            PDFJS.verbosity = 1;
            PDFJS.disableWorker = false;
            var documentContainer = document.getElementById('viewer-pdf-container');
            var viewer = document.getElementById('viewer-viewerPdf');
            window.document.addEventListener('scroll', function (event) {
                _this.watchScroll(event.target);
            }, true);
            this.pdfViewer = new PDFJS.PDFViewer({
                container: documentContainer,
                viewer: viewer,
                renderingQueue: this.renderingQueueServices
            });
            this.renderingQueueServices.setViewer(this.pdfViewer);
            this.pdfViewer.setDocument(pdfDocument);
        };
        PdfViewerComponent.prototype.scalePage = function (scaleMode) {
            this.currentScaleMode = scaleMode;
            if (this.pdfViewer) {
                var viewerContainer = document.getElementById('viewer-main-container');
                var documentContainer = document.getElementById('viewer-pdf-container');
                var widthContainer = void 0;
                var heigthContainer = void 0;
                if (viewerContainer && viewerContainer.clientWidth <= documentContainer.clientWidth) {
                    widthContainer = viewerContainer.clientWidth;
                    heigthContainer = viewerContainer.clientHeight;
                } else {
                    widthContainer = documentContainer.clientWidth;
                    heigthContainer = documentContainer.clientHeight;
                }
                var currentPage = this.pdfViewer._pages[this.pdfViewer._currentPageNumber];
                var padding = 20;
                var pageWidthScale = (widthContainer - padding) / currentPage.width * currentPage.scale;
                var pageHeightScale = (heigthContainer - padding) / currentPage.width * currentPage.scale;
                var scale = void 0;
                switch (this.currentScaleMode) {
                    case 'page-actual':
                        scale = 1;
                        break;
                    case 'page-width':
                        scale = pageWidthScale;
                        break;
                    case 'page-height':
                        scale = pageHeightScale;
                        break;
                    case 'page-fit':
                        scale = Math.min(pageWidthScale, pageHeightScale);
                        break;
                    case 'auto':
                        var horizontalScale = void 0;
                        if (this.isLandscape) {
                            horizontalScale = Math.min(pageHeightScale, pageWidthScale);
                        } else {
                            horizontalScale = pageWidthScale;
                        }
                        scale = Math.min(this.MAX_AUTO_SCALE, horizontalScale);
                        break;
                    default:
                        console.error('pdfViewSetScale: \'' + scaleMode + '\' is an unknown zoom value.');
                        return;
                }
                this.setScaleUpdatePages(scale);
            }
        };
        PdfViewerComponent.prototype.setScaleUpdatePages = function (newScale) {
            if (!this.isSameScale(this.currentScale, newScale)) {
                this.currentScale = newScale;
                this.pdfViewer._pages.forEach(function (currentPage) {
                    currentPage.update(newScale);
                });
                this.pdfViewer.update();
            }
        };
        PdfViewerComponent.prototype.isSameScale = function (oldScale, newScale) {
            return newScale === oldScale;
        };
        PdfViewerComponent.prototype.isLandscape = function (width, height) {
            return width > height;
        };
        PdfViewerComponent.prototype.onResize = function () {
            this.scalePage(this.currentScaleMode);
        };
        PdfViewerComponent.prototype.pageFit = function () {
            if (this.currentScaleMode !== 'page-fit') {
                this.scalePage('page-fit');
            } else {
                this.scalePage('auto');
            }
        };
        PdfViewerComponent.prototype.zoomIn = function (ticks) {
            var newScale = this.currentScale;
            do {
                newScale = (newScale * this.DEFAULT_SCALE_DELTA).toFixed(2);
                newScale = Math.ceil(newScale * 10) / 10;
                newScale = Math.min(this.MAX_SCALE, newScale);
            } while (--ticks > 0 && newScale < this.MAX_SCALE);
            this.currentScaleMode = 'auto';
            this.setScaleUpdatePages(newScale);
        };
        PdfViewerComponent.prototype.zoomOut = function (ticks) {
            var newScale = this.currentScale;
            do {
                newScale = (newScale / this.DEFAULT_SCALE_DELTA).toFixed(2);
                newScale = Math.floor(newScale * 10) / 10;
                newScale = Math.max(this.MIN_SCALE, newScale);
            } while (--ticks > 0 && newScale > this.MIN_SCALE);
            this.currentScaleMode = 'auto';
            this.setScaleUpdatePages(newScale);
        };
        PdfViewerComponent.prototype.previousPage = function () {
            if (this.pdfViewer && this.page > 1) {
                this.page--;
                this.displayPage = this.page;
                this.pdfViewer.currentPageNumber = this.page;
            }
        };
        PdfViewerComponent.prototype.nextPage = function () {
            if (this.pdfViewer && this.page < this.totalPages) {
                this.page++;
                this.displayPage = this.page;
                this.pdfViewer.currentPageNumber = this.page;
            }
        };
        PdfViewerComponent.prototype.inputPage = function (page) {
            var pageInput = parseInt(page, 10);
            if (!isNaN(pageInput) && pageInput > 0 && pageInput <= this.totalPages) {
                this.page = pageInput;
                this.displayPage = this.page;
                this.pdfViewer.currentPageNumber = this.page;
            } else {
                this.displayPage = this.page;
            }
        };
        PdfViewerComponent.prototype.watchScroll = function (target) {
            var outputPage = this.getVisibleElement(target);
            if (outputPage) {
                this.page = outputPage.id;
                this.displayPage = this.page;
            }
        };
        PdfViewerComponent.prototype.getVisibleElement = function (target) {
            var _this = this;
            return this.pdfViewer._pages.find(function (page) {
                return _this.isOnScreen(page, target);
            });
        };
        PdfViewerComponent.prototype.isOnScreen = function (page, target) {
            var viewport = {};
            viewport.top = target.scrollTop;
            viewport.bottom = viewport.top + target.scrollHeight;
            var bounds = {};
            bounds.top = page.div.offsetTop;
            bounds.bottom = bounds.top + page.viewport.height;
            return bounds.top <= viewport.bottom && bounds.bottom >= viewport.top;
        };
        ;
        PdfViewerComponent.prototype.handleKeyboardEvent = function (event) {
            var key = event.keyCode;
            if (key === 39) {
                this.nextPage();
            } else if (key === 37) {
                this.previousPage();
            }
        };
        return PdfViewerComponent;
    }();
    __decorate([core_1.Input(), __metadata("design:type", String)], PdfViewerComponent.prototype, "urlFile", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], PdfViewerComponent.prototype, "nameFile", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], PdfViewerComponent.prototype, "showToolbar", void 0);
    __decorate([core_1.HostListener('document:keydown', ['$event']), __metadata("design:type", Function), __metadata("design:paramtypes", [KeyboardEvent]), __metadata("design:returntype", void 0)], PdfViewerComponent.prototype, "handleKeyboardEvent", null);
    PdfViewerComponent = __decorate([core_1.Component({
        moduleId: module.id,
        selector: 'pdf-viewer',
        template: "<!-- Start Pdf Canvas --> <div id=\"viewer-pdf-container\" class=\"viewer-pdf-container\" (keypress)=eventHandler() (window:resize)=\"onResize($event)\">     <div id=\"viewer-viewerPdf\" class=\"pdfViewer\">         <div id=\"loader-container\" class=\"loader-container\">             <div class=\"loader-item\">                 <div id=\"loader-spin\" class=\"mdl-progress mdl-js-progress mdl-progress__indeterminate\"></div>                 <div id=\"loader-text\" class=\"loader-text\">Loading <span>{{nameFile}}</span> {{laodingPercent}}%</div>             </div >         </div>     </div> </div> <!-- End Pdf Canvas -->   <!-- Pagination toolbar start --> <div *ngIf=\"showToolbar\" id=\"viewer-toolbar-pagination\" class=\"viewer-toolbar-pagination mdl-cell--hide-tablet mdl-cell--hide-phone\">     <div id=\"viewer-previous-page-button\" class=\"button-page left\" (click)=\"previousPage()\">         <i class=\"icon material-icons\">keyboard_arrow_left</i>     </div>      <div class=\"viewer-page-counter left\" >         <input id=\"viewer-pagenumber-input\"  #page                (keyup.enter)=\"inputPage(page.value)\" class=\"viewer-pagenumber-input left\" type=\"text\" pattern=\"-?[0-9]*(\\.[0-9]+)?\" value=\"{{displayPage}}\">         <div id=\"viewer-total-pages\"  class=\"left viewer-total-pages\">/ {{totalPages}}</div>     </div>      <div id=\"viewer-next-page-button\" class=\"button-page left\"  (click)=\"nextPage()\" >         <i class=\"icon material-icons\" >keyboard_arrow_right</i>     </div> </div> <!-- Pagination toolbar end -->  <!-- Command toolbar start --> <div *ngIf=\"showToolbar\"  id=\"viewer-toolbar-command\" class=\"viewer-toolbar-command\">     <div id=\"viewer-scale-page-button\" class=\"button-page left\" (click)=\"pageFit()\">         <i class=\"icon material-icons\">zoom_out_map</i>     </div>     <div id=\"viewer-zoom-in-button\" class=\"button-page left\" (click)=\"zoomIn()\">         <i class=\"icon material-icons\">zoom_in</i>     </div>     <div id=\"viewer-zoom-out-button\" class=\"button-page left\" (click)=\"zoomOut()\">         <i class=\"icon material-icons\">zoom_out</i>     </div> </div> <!-- Command toolbar end -->",
        styles: [".loader-container {     display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */     display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */     display: -webkit-flex;     /* NEW - Chrome */     display: flex;             /* NEW, Spec - Opera 12.1, Firefox 20+ */     -webkit-box-flex-direction: row;     -moz-box-flex-direction: row;     -webkit-flex-direction: row;     flex-direction: row;     height:100%; }  .loader-item {     margin: auto;     max-height:100px;     max-width:300px; }  .loader-text{     white-space: nowrap;     text-align: center;     position: relative;     color : #fff; }  .left {     float: left; }  .viewer-toolbar-pagination{     padding-top: 4px;     top: 80px;     right:35px;     width:auto;     position:absolute;     border-radius: 10px;     background: #3E3E3E;     color: white; }  .viewer-toolbar-command{     height: 30px;     padding-top: 4px;     top: 80px;     left:35px;     width:auto;     position:absolute;     border-radius: 10px;     background: #3E3E3E;     color: white; }  .viewer-pagenumber-input {     border: none;     display: block;     font-size: 16px;     padding: 4px 0;     background: 0 0;     text-align: right;     color: inherit;     width: 33px;     margin-right: 4px;     height: 20px; }  .viewer-total-pages {     border: medium none;     display: flex;     font-size: 16px;     padding: 4px 0px;     background: transparent none repeat scroll 0px 0px;     text-align: right;     color: inherit;     margin-right: 4px;     height: 20px;     align-items: center;     justify-content: center; }  .viewer-page-counter {     margin-right: 20px; }  .button-page {     margin-right: 4px;     height: 24px;     width: 24px;     margin-left: 4px;     cursor: pointer; }  .button-page:hover {     cursor: pointer;     background: grey;     border-radius: 24px; } :host >>> .textLayer {     position: absolute;     left: 0;     top: 0;     right: 0;     bottom: 0;     overflow: hidden;     opacity: 0.2;     line-height: 1.0; }  :host >>> .textLayer > div {     color: transparent;     position: absolute;     white-space: pre;     cursor: text;     -webkit-transform-origin: 0% 0%;     -moz-transform-origin: 0% 0%;     -o-transform-origin: 0% 0%;     -ms-transform-origin: 0% 0%;     transform-origin: 0% 0%; }  :host >>> .textLayer .highlight {     margin: -1px;     padding: 1px;      background-color: rgb(180, 0, 170);     border-radius: 4px; }  :host >>> .textLayer .highlight.begin {     border-radius: 4px 0px 0px 4px; }  :host >>> .textLayer .highlight.end {     border-radius: 0px 4px 4px 0px; }  :host >>> .textLayer .highlight.middle {     border-radius: 0px; }  :host >>> .textLayer .highlight.selected {     background-color: rgb(0, 100, 0); }  :host >>> .textLayer ::selection { background: rgb(0,0,255); } :host >>> .textLayer ::-moz-selection { background: rgb(0,0,255); }  :host >>> .textLayer .endOfContent {     display: block;     position: absolute;     left: 0px;     top: 100%;     right: 0px;     bottom: 0px;     z-index: -1;     cursor: default;     -webkit-user-select: none;     -ms-user-select: none;     -moz-user-select: none; }  :host >>> .textLayer .endOfContent.active {     top: 0px; }   :host >>> .annotationLayer section {     position: absolute; }  :host >>> .annotationLayer .linkAnnotation > a {     position: absolute;     font-size: 1em;     top: 0;     left: 0;     width: 100%;     height: 100%; }  :host >>> .annotationLayer .linkAnnotation > a /* -ms-a */  {     background: url(\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\") 0 0 repeat; }  :host >>> .annotationLayer .linkAnnotation > a:hover {     opacity: 0.2;     background: #ff0;     box-shadow: 0px 2px 10px #ff0; }  :host >>> .annotationLayer .textAnnotation img {     position: absolute;     cursor: pointer; }  :host >>> .annotationLayer .popupWrapper {     position: absolute;     width: 20em; }  :host >>> .annotationLayer .popup {     position: absolute;     z-index: 200;     max-width: 20em;     background-color: #FFFF99;     box-shadow: 0px 2px 5px #333;     border-radius: 2px;     padding: 0.6em;     margin-left: 5px;     cursor: pointer;     word-wrap: break-word; }  :host >>> .annotationLayer .popup h1 {     font-size: 1em;     border-bottom: 1px solid #000000;     padding-bottom: 0.2em; }  :host >>> .annotationLayer .popup p {     padding-top: 0.2em; }  :host >>> .annotationLayer .highlightAnnotation, .annotationLayer .underlineAnnotation, .annotationLayer .squigglyAnnotation, .annotationLayer .strikeoutAnnotation, .annotationLayer .fileAttachmentAnnotation {     cursor: pointer; }  :host >>> .pdfViewer .canvasWrapper {     overflow: hidden; }  :host >>> .pdfViewer .page {     direction: ltr;     width: 816px;     height: 1056px;     margin: 1px auto -8px auto;     position: relative;     overflow: visible;     border: 9px solid transparent;     background-clip: content-box;     background-color: white; }  :host >>> .pdfViewer.removePageBorders .page {     margin: 0px auto 10px auto;     border: none; }  :host >>> .pdfViewer .page canvas {     margin: 0;     display: block; }  :host >>> .pdfViewer .page .loadingIcon {     position: absolute;     display: block;     left: 0;     top: 0;     right: 0;     bottom: 0; }  :host >>> .loadingIcon {     width: 100px;     height: 100px;     left: 50% !important;     top: 50% !important;      margin-top: -50px;     margin-left: -50px;      font-size: 5px;     text-indent: -9999em;     border-top: 1.1em solid rgba(3,0,2, 0.2);     border-right: 1.1em solid rgba(3,0,2, 0.2);     border-bottom: 1.1em solid rgba(3,0,2, 0.2);     border-left: 1.1em solid #030002;     -webkit-transform: translateZ(0);     -ms-transform: translateZ(0);     transform: translateZ(0);     -webkit-animation: load8 1.1s infinite linear;     animation: load8 1.1s infinite linear; } :host >>> .loadingIcon, :host >>> .loadingIcon:after {     border-radius: 50%; } @-webkit-keyframes load8 {     0% {         -webkit-transform: rotate(0deg);         transform: rotate(0deg);     }     100% {         -webkit-transform: rotate(360deg);         transform: rotate(360deg);     } } @keyframes load8 {     0% {         -webkit-transform: rotate(0deg);         transform: rotate(0deg);     }     100% {         -webkit-transform: rotate(360deg);         transform: rotate(360deg);     } }  :host >>> * {     padding: 0;     margin: 0; }  :host >>> html {     height: 100%;     width: 100%;     /* Font size is needed to make the activity bar the correct size. */     font-size: 10px; }  :host >>> body {     height: 100%;     width: 100%;     background-color: #404040;     background-image: url(images/texture.png); }  :host >>> body, input, button, select {     font: message-box;     outline: none; }  :host >>> .hidden {     display: none !important; } :host >>> [hidden] {     display: none !important; }   #viewer-pdf-container {     overflow: auto;     -webkit-overflow-scrolling: touch;     position: absolute;     top: 32px;     right: 0;     bottom: 0;     left: 0;     outline: none; } html[dir='ltr'] #viewer-pdf-container {     box-shadow: inset 1px 0 0 hsla(0,0%,100%,.05); } html[dir='rtl'] #viewer-pdf-container {     box-shadow: inset -1px 0 0 hsla(0,0%,100%,.05); }"],
        providers: [rendering_queue_services_1.RenderingQueueServices]
    }), __metadata("design:paramtypes", [rendering_queue_services_1.RenderingQueueServices])], PdfViewerComponent);
    exports.PdfViewerComponent = PdfViewerComponent;
    return module.exports;
});
$__System.registerDynamic("1", ["3", "5", "2", "9", "6", "7", "8", "a"], true, function ($__require, exports, module) {
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
    var viewer_component_1 = $__require("2");
    var rendering_queue_services_1 = $__require("9");
    var imgViewer_component_1 = $__require("6");
    var mediaPlayer_component_1 = $__require("7");
    var notSupportedFormat_component_1 = $__require("8");
    var pdfViewer_component_1 = $__require("a");
    __export($__require("2"));
    __export($__require("9"));
    __export($__require("6"));
    __export($__require("7"));
    __export($__require("8"));
    __export($__require("a"));
    exports.VIEWER_DIRECTIVES = [viewer_component_1.ViewerComponent, imgViewer_component_1.ImgViewerComponent, mediaPlayer_component_1.MediaPlayerComponent, notSupportedFormat_component_1.NotSupportedFormat, pdfViewer_component_1.PdfViewerComponent];
    exports.VIEWER_PROVIDERS = [rendering_queue_services_1.RenderingQueueServices];
    var ViewerModule = ViewerModule_1 = function () {
        function ViewerModule() {}
        ViewerModule.forRoot = function () {
            return {
                ngModule: ViewerModule_1,
                providers: exports.VIEWER_PROVIDERS.slice()
            };
        };
        return ViewerModule;
    }();
    ViewerModule = ViewerModule_1 = __decorate([core_1.NgModule({
        imports: [ng2_alfresco_core_1.CoreModule],
        declarations: exports.VIEWER_DIRECTIVES.slice(),
        providers: exports.VIEWER_PROVIDERS.slice(),
        exports: exports.VIEWER_DIRECTIVES.slice()
    }), __metadata("design:paramtypes", [])], ViewerModule);
    exports.ViewerModule = ViewerModule;
    var ViewerModule_1;
    

    return module.exports;
});
})
(function(factory) {
  if (typeof define == 'function' && define.amd)
    define(["@angular/core","@angular/platform-browser","ng2-alfresco-core"], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory(require("@angular/core"), require("@angular/platform-browser"), require("ng2-alfresco-core"));
  else
    throw new Error("Module must be loaded as AMD or CommonJS");
});
//# sourceMappingURL=ng2-alfresco-viewer.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var ViewerComponent = (function () {
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
                }
                else if (_this.fileNodeId) {
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
        return this.extension === 'png' || this.extension === 'jpg' ||
            this.extension === 'jpeg' || this.extension === 'gif' || this.extension === 'bmp';
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
            }
            else {
                return this.closestElement(parent, nodeName);
            }
        }
        else {
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
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ViewerComponent.prototype, "urlFile", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ViewerComponent.prototype, "fileNodeId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ViewerComponent.prototype, "overlayMode", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ViewerComponent.prototype, "showViewer", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ViewerComponent.prototype, "showToolbar", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], ViewerComponent.prototype, "showViewerChange", void 0);
__decorate([
    core_1.HostListener('document:keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], ViewerComponent.prototype, "handleKeyboardEvent", null);
ViewerComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-viewer',
        template: "<div id=\"viewer\" *ngIf=\"showViewer\" [ngClass]=\"{'all-space': !overlayMode }\">     <div *ngIf=\"overlayMode\">         <div id=\"viewer-shadow-transparent\" class=\"viewer-shadow-transparent\"></div>     </div>      <div id=\"viewer-main-container\" class=\"all-space\" [ngClass]=\"{'viewer-overlay-view': overlayMode }\">          <!-- Start Layout -->         <div [ngClass]=\"{'mdl-layout mdl-js-layout mdl-layout--fixed-header': overlayMode, 'all-space': !overlayMode}\">              <header *ngIf=\"overlayMode\" class=\"mdl-layout__header\">                 <div class=\"mdl-layout__header-row\">                      <!-- File Title -->                     <span id=\"viewer-name-file\" class=\"mdl-layout-title viewer-name-file\">{{displayName}}</span>                      <span class=\"vertical-divider\"></span>                      <div class=\"mdl-layout-spacer\"></div>                      <!-- Start Navigation -->                     <nav class=\"mdl-navigation\">                         <div id=\"viewer-toolbar-view-options\">                             <button *ngIf=\"overlayMode\"                                     class=\"mdl-color--black mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored\"                                     (click)=\"close()\">                                 <i id=\"viewer-close-button\" class=\"icon material-icons\">close</i>                             </button>                         </div>                     </nav>                     <!-- End Navigation -->                 </div>             </header>             <!--<div class=\"mdl-layout__drawer\">-->             <!--<span class=\"mdl-layout-title\">Thumbnail</span>-->             <!--</div>-->             <main id=\"page-content\" class=\"mdl-layout__content\" [ngClass]=\"{'all-space': !overlayMode }\">                  <div class=\"mdl-grid\">                     <!--<div id=\"viewer-previous-file-button\" class=\"center-element mdl-cell mdl-cell&#45;&#45;2-col mdl-cell&#45;&#45;hide-tablet mdl-cell&#45;&#45;hide-phone\">-->                     <!--<button  *ngIf=\"false\"-->                     <!--class=\"center-element mdl-color&#45;&#45;black mdl-button mdl-js-button mdl-button&#45;&#45;fab mdl-button&#45;&#45;mini-fab mdl-button&#45;&#45;colored\"-->                     <!--(click)=\"previousFile()\">-->                     <!--<i class=\"icon material-icons \">keyboard_arrow_left</i>-->                     <!--</button>-->                     <!--</div>-->                      <div id=\"viewer-content-container\" *ngIf=\"isLoaded()\"                          class=\"center-element mdl-cell mdl-cell--12-col\">                          <!-- Start View Switch-->                         <div *ngIf=\"isPdf()\">                             <pdf-viewer [showToolbar]=\"showToolbar\" [urlFile]=\"urlFileContent\"                                         [nameFile]=\"displayName\"></pdf-viewer>                         </div>                         <div class=\"center-element\" *ngIf=\"isImage()\">                             <img-viewer [urlFile]=\"urlFileContent\" [nameFile]=\"displayName\"></img-viewer>                         </div>                         <div class=\"center-element\" *ngIf=\"isMedia()\">                             <media-player [urlFile]=\"urlFileContent\" [mimeType]=\"mimeType\"                                           [nameFile]=\"displayName\"></media-player>                         </div>                         <div *ngIf=\"!supportedExtension()\">                             <not-supported-format [urlFile]=\"urlFileContent\"                                                   [nameFile]=\"displayName\"></not-supported-format>                         </div>                         <!-- End View Switch -->                      </div>                      <!--<div id=\"viewer-next-file-button\" class=\"center-element mdl-cell mdl-cell&#45;&#45;2-col mdl-cell&#45;&#45;hide-tablet mdl-cell&#45;&#45;hide-phone\">-->                     <!--<button *ngIf=\"false\"-->                     <!--class=\"center-element mdl-color&#45;&#45;black mdl-button mdl-js-button mdl-button&#45;&#45;fab mdl-button&#45;&#45;mini-fab mdl-button&#45;&#45;colored\"-->                     <!--(click)=\"nextFile()\">-->                     <!--<i class=\"icon material-icons\">keyboard_arrow_right</i>-->                     <!--</button>-->                     <!--</div>-->                  </div>             </main>         </div>         <!-- End Layout -->     </div> </div>",
        styles: [".button-container {     padding: 0 40px; }  .left {     float: left; }  #page-content {     display: flex;     flex-direction: row;     flex-wrap: wrap;     flex: 1; }  .mdl-grid {     width: 100vw;     padding: 0px !important; }  .viewer-name-file {     width: 50%;     height: 21px;     overflow: hidden !important;     text-overflow: ellipsis; }  .viewer-shadow-transparent {     z-index: 1000;     background-color: #3E3E3E;     position: fixed;     top: 0;     bottom: 0;     left: 0;     right: 0;     opacity: .90; }  .viewer-overlay-view {     position: fixed;     top: 0px;     left: 0px;     z-index: 1000; }  img-viewer {     height: 100%; }  .center-element {     display: flex;     align-items: center;     justify-content: center; }  .all-space{     width: 100%;     height: 100%;     background-color: #515151; }"]
    }),
    __param(2, core_1.Inject(platform_browser_1.DOCUMENT)),
    __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoApiService,
        core_1.ElementRef, Object])
], ViewerComponent);
exports.ViewerComponent = ViewerComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmV0cy92aWV3ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUc7QUFDekcsOERBQXFEO0FBRXJELHVEQUF1RDtBQVF2RCxJQUFhLGVBQWU7SUFnQ3hCLHlCQUFvQixVQUE4QixFQUM5QixPQUFtQixFQUNELFFBQVE7UUFGMUIsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNELGFBQVEsR0FBUixRQUFRLENBQUE7UUEvQjlDLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFHckIsZUFBVSxHQUFXLElBQUksQ0FBQztRQUcxQixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUc3QixlQUFVLEdBQVksSUFBSSxDQUFDO1FBRzNCLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBRzVCLHFCQUFnQixHQUEwQixJQUFJLG1CQUFZLEVBQVcsQ0FBQztRQVl0RSxXQUFNLEdBQVksS0FBSyxDQUFDO0lBS3hCLENBQUM7SUFFRCxxQ0FBVyxHQUFYLFVBQVksT0FBTztRQUFuQixpQkE2QkM7UUE1QkcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztZQUNuRSxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07Z0JBQy9CLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNmLElBQUksZUFBZSxHQUFHLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzVELEtBQUksQ0FBQyxXQUFXLEdBQUcsZUFBZSxHQUFHLGVBQWUsR0FBRyxFQUFFLENBQUM7b0JBQzFELEtBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUN4RCxLQUFJLENBQUMsY0FBYyxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUM7b0JBQ25DLE9BQU8sRUFBRSxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN6QixXQUFXLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBNEI7d0JBQzdFLEtBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7d0JBQ3RDLEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDN0IsS0FBSSxDQUFDLGNBQWMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ2pFLEtBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO3dCQUNuQixPQUFPLEVBQUUsQ0FBQztvQkFDZCxDQUFDLEVBQUUsVUFBVSxLQUFLO3dCQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7b0JBQzVDLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDO0lBS0QsK0JBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNsQyxDQUFDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELGlDQUFPLEdBQVA7UUFDSSxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBRUQscUNBQVcsR0FBWDtRQUNJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBUUQsNENBQWtCLEdBQWxCLFVBQW1CLEdBQVc7UUFDMUIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQ2QsTUFBTSxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFDaEMsS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBUU8sMENBQWdCLEdBQXhCLFVBQXlCLFFBQWdCO1FBQ3JDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ25ELENBQUM7SUFPTyxpQ0FBTyxHQUFmO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBT08saUNBQU8sR0FBZjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMzRSxDQUFDO0lBT08sMENBQWdCLEdBQXhCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSztZQUN2RCxJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQztJQUMxRixDQUFDO0lBT08seUNBQWUsR0FBdkI7UUFDSSxJQUFJLGFBQWEsQ0FBQztRQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0YsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDMUcsQ0FBQztJQVFPLDBDQUFnQixHQUF4QixVQUF5QixTQUFpQjtRQUN0QyxNQUFNLENBQUMsU0FBUyxLQUFLLEtBQUssSUFBSSxTQUFTLEtBQUssTUFBTSxJQUFJLFNBQVMsS0FBSyxLQUFLLENBQUM7SUFDOUUsQ0FBQztJQU9PLHlDQUFlLEdBQXZCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFPTywrQkFBSyxHQUFiO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssaUJBQWlCLENBQUM7SUFDM0UsQ0FBQztJQU9ELDRDQUFrQixHQUFsQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM1RCxDQUFDO0lBT0QsNkNBQW1CLEdBQW5CLFVBQW9CLEtBQW9CO1FBQ3BDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDeEIsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDakIsQ0FBQztJQUNMLENBQUM7SUFPTyw2Q0FBbUIsR0FBM0I7UUFDSSxJQUFJLFlBQVksR0FBUSxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFOUQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDM0MsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQzlDLENBQUM7SUFDTCxDQUFDO0lBT08sK0NBQXFCLEdBQTdCO1FBQ0ksSUFBSSxZQUFZLEdBQVEsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzNDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUN4QyxDQUFDO0lBQ0wsQ0FBQztJQU9PLGtEQUF3QixHQUFoQztRQUNJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBUU8sd0NBQWMsR0FBdEIsVUFBdUIsUUFBcUIsRUFBRSxRQUFnQjtRQUMxRCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDbEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNqRCxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO0lBQ0wsQ0FBQztJQUtPLDRDQUFrQixHQUExQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDakMsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBS0Qsa0NBQVEsR0FBUjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ2hELENBQUM7SUFDTCxzQkFBQztBQUFELENBelJBLEFBeVJDLElBQUE7QUF0Ukc7SUFEQyxZQUFLLEVBQUU7O2dEQUNhO0FBR3JCO0lBREMsWUFBSyxFQUFFOzttREFDa0I7QUFHMUI7SUFEQyxZQUFLLEVBQUU7O29EQUNxQjtBQUc3QjtJQURDLFlBQUssRUFBRTs7bURBQ21CO0FBRzNCO0lBREMsWUFBSyxFQUFFOztvREFDb0I7QUFHNUI7SUFEQyxhQUFNLEVBQUU7OEJBQ1MsbUJBQVk7eURBQXdDO0FBd0x0RTtJQURDLG1CQUFZLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7cUNBQ2xCLGFBQWE7OzBEQUt2QztBQS9NUSxlQUFlO0lBTjNCLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsUUFBUSxFQUFFLGlCQUFpQjtRQUMzQixRQUFRLEVBQUUscStJQUFxK0k7UUFDLytJLE1BQU0sRUFBRSxDQUFDLDZ6QkFBNnpCLENBQUM7S0FDMTBCLENBQUM7SUFtQ2UsV0FBQSxhQUFNLENBQUMsMkJBQVEsQ0FBQyxDQUFBO3FDQUZHLHNDQUFrQjtRQUNyQixpQkFBVTtHQWpDOUIsZUFBZSxDQXlSM0I7QUF6UlksMENBQWUiLCJmaWxlIjoiY29tcG9uZXRzL3ZpZXdlci5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPdXRwdXQsIEhvc3RMaXN0ZW5lciwgRXZlbnRFbWl0dGVyLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBNaW5pbWFsTm9kZUVudHJ5RW50aXR5IH0gZnJvbSAnYWxmcmVzY28tanMtYXBpJztcbmltcG9ydCB7IEFsZnJlc2NvQXBpU2VydmljZSB9IGZyb20gJ25nMi1hbGZyZXNjby1jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICBzZWxlY3RvcjogJ2FsZnJlc2NvLXZpZXdlcicsXG4gICAgdGVtcGxhdGU6IFwiPGRpdiBpZD1cXFwidmlld2VyXFxcIiAqbmdJZj1cXFwic2hvd1ZpZXdlclxcXCIgW25nQ2xhc3NdPVxcXCJ7J2FsbC1zcGFjZSc6ICFvdmVybGF5TW9kZSB9XFxcIj4gICAgIDxkaXYgKm5nSWY9XFxcIm92ZXJsYXlNb2RlXFxcIj4gICAgICAgICA8ZGl2IGlkPVxcXCJ2aWV3ZXItc2hhZG93LXRyYW5zcGFyZW50XFxcIiBjbGFzcz1cXFwidmlld2VyLXNoYWRvdy10cmFuc3BhcmVudFxcXCI+PC9kaXY+ICAgICA8L2Rpdj4gICAgICA8ZGl2IGlkPVxcXCJ2aWV3ZXItbWFpbi1jb250YWluZXJcXFwiIGNsYXNzPVxcXCJhbGwtc3BhY2VcXFwiIFtuZ0NsYXNzXT1cXFwieyd2aWV3ZXItb3ZlcmxheS12aWV3Jzogb3ZlcmxheU1vZGUgfVxcXCI+ICAgICAgICAgIDwhLS0gU3RhcnQgTGF5b3V0IC0tPiAgICAgICAgIDxkaXYgW25nQ2xhc3NdPVxcXCJ7J21kbC1sYXlvdXQgbWRsLWpzLWxheW91dCBtZGwtbGF5b3V0LS1maXhlZC1oZWFkZXInOiBvdmVybGF5TW9kZSwgJ2FsbC1zcGFjZSc6ICFvdmVybGF5TW9kZX1cXFwiPiAgICAgICAgICAgICAgPGhlYWRlciAqbmdJZj1cXFwib3ZlcmxheU1vZGVcXFwiIGNsYXNzPVxcXCJtZGwtbGF5b3V0X19oZWFkZXJcXFwiPiAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibWRsLWxheW91dF9faGVhZGVyLXJvd1xcXCI+ICAgICAgICAgICAgICAgICAgICAgIDwhLS0gRmlsZSBUaXRsZSAtLT4gICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cXFwidmlld2VyLW5hbWUtZmlsZVxcXCIgY2xhc3M9XFxcIm1kbC1sYXlvdXQtdGl0bGUgdmlld2VyLW5hbWUtZmlsZVxcXCI+e3tkaXNwbGF5TmFtZX19PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwidmVydGljYWwtZGl2aWRlclxcXCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZGwtbGF5b3V0LXNwYWNlclxcXCI+PC9kaXY+ICAgICAgICAgICAgICAgICAgICAgIDwhLS0gU3RhcnQgTmF2aWdhdGlvbiAtLT4gICAgICAgICAgICAgICAgICAgICA8bmF2IGNsYXNzPVxcXCJtZGwtbmF2aWdhdGlvblxcXCI+ICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XFxcInZpZXdlci10b29sYmFyLXZpZXctb3B0aW9uc1xcXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uICpuZ0lmPVxcXCJvdmVybGF5TW9kZVxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIm1kbC1jb2xvci0tYmxhY2sgbWRsLWJ1dHRvbiBtZGwtanMtYnV0dG9uIG1kbC1idXR0b24tLWZhYiBtZGwtYnV0dG9uLS1taW5pLWZhYiBtZGwtYnV0dG9uLS1jb2xvcmVkXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVxcXCJjbG9zZSgpXFxcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBpZD1cXFwidmlld2VyLWNsb3NlLWJ1dHRvblxcXCIgY2xhc3M9XFxcImljb24gbWF0ZXJpYWwtaWNvbnNcXFwiPmNsb3NlPC9pPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+ICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgIDwvbmF2PiAgICAgICAgICAgICAgICAgICAgIDwhLS0gRW5kIE5hdmlnYXRpb24gLS0+ICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgPC9oZWFkZXI+ICAgICAgICAgICAgIDwhLS08ZGl2IGNsYXNzPVxcXCJtZGwtbGF5b3V0X19kcmF3ZXJcXFwiPi0tPiAgICAgICAgICAgICA8IS0tPHNwYW4gY2xhc3M9XFxcIm1kbC1sYXlvdXQtdGl0bGVcXFwiPlRodW1ibmFpbDwvc3Bhbj4tLT4gICAgICAgICAgICAgPCEtLTwvZGl2Pi0tPiAgICAgICAgICAgICA8bWFpbiBpZD1cXFwicGFnZS1jb250ZW50XFxcIiBjbGFzcz1cXFwibWRsLWxheW91dF9fY29udGVudFxcXCIgW25nQ2xhc3NdPVxcXCJ7J2FsbC1zcGFjZSc6ICFvdmVybGF5TW9kZSB9XFxcIj4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZGwtZ3JpZFxcXCI+ICAgICAgICAgICAgICAgICAgICAgPCEtLTxkaXYgaWQ9XFxcInZpZXdlci1wcmV2aW91cy1maWxlLWJ1dHRvblxcXCIgY2xhc3M9XFxcImNlbnRlci1lbGVtZW50IG1kbC1jZWxsIG1kbC1jZWxsJiM0NTsmIzQ1OzItY29sIG1kbC1jZWxsJiM0NTsmIzQ1O2hpZGUtdGFibGV0IG1kbC1jZWxsJiM0NTsmIzQ1O2hpZGUtcGhvbmVcXFwiPi0tPiAgICAgICAgICAgICAgICAgICAgIDwhLS08YnV0dG9uICAqbmdJZj1cXFwiZmFsc2VcXFwiLS0+ICAgICAgICAgICAgICAgICAgICAgPCEtLWNsYXNzPVxcXCJjZW50ZXItZWxlbWVudCBtZGwtY29sb3ImIzQ1OyYjNDU7YmxhY2sgbWRsLWJ1dHRvbiBtZGwtanMtYnV0dG9uIG1kbC1idXR0b24mIzQ1OyYjNDU7ZmFiIG1kbC1idXR0b24mIzQ1OyYjNDU7bWluaS1mYWIgbWRsLWJ1dHRvbiYjNDU7JiM0NTtjb2xvcmVkXFxcIi0tPiAgICAgICAgICAgICAgICAgICAgIDwhLS0oY2xpY2spPVxcXCJwcmV2aW91c0ZpbGUoKVxcXCI+LS0+ICAgICAgICAgICAgICAgICAgICAgPCEtLTxpIGNsYXNzPVxcXCJpY29uIG1hdGVyaWFsLWljb25zIFxcXCI+a2V5Ym9hcmRfYXJyb3dfbGVmdDwvaT4tLT4gICAgICAgICAgICAgICAgICAgICA8IS0tPC9idXR0b24+LS0+ICAgICAgICAgICAgICAgICAgICAgPCEtLTwvZGl2Pi0tPiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVxcXCJ2aWV3ZXItY29udGVudC1jb250YWluZXJcXFwiICpuZ0lmPVxcXCJpc0xvYWRlZCgpXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImNlbnRlci1lbGVtZW50IG1kbC1jZWxsIG1kbC1jZWxsLS0xMi1jb2xcXFwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBTdGFydCBWaWV3IFN3aXRjaC0tPiAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVxcXCJpc1BkZigpXFxcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwZGYtdmlld2VyIFtzaG93VG9vbGJhcl09XFxcInNob3dUb29sYmFyXFxcIiBbdXJsRmlsZV09XFxcInVybEZpbGVDb250ZW50XFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25hbWVGaWxlXT1cXFwiZGlzcGxheU5hbWVcXFwiPjwvcGRmLXZpZXdlcj4gICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNlbnRlci1lbGVtZW50XFxcIiAqbmdJZj1cXFwiaXNJbWFnZSgpXFxcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWctdmlld2VyIFt1cmxGaWxlXT1cXFwidXJsRmlsZUNvbnRlbnRcXFwiIFtuYW1lRmlsZV09XFxcImRpc3BsYXlOYW1lXFxcIj48L2ltZy12aWV3ZXI+ICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjZW50ZXItZWxlbWVudFxcXCIgKm5nSWY9XFxcImlzTWVkaWEoKVxcXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bWVkaWEtcGxheWVyIFt1cmxGaWxlXT1cXFwidXJsRmlsZUNvbnRlbnRcXFwiIFttaW1lVHlwZV09XFxcIm1pbWVUeXBlXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmFtZUZpbGVdPVxcXCJkaXNwbGF5TmFtZVxcXCI+PC9tZWRpYS1wbGF5ZXI+ICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVxcXCIhc3VwcG9ydGVkRXh0ZW5zaW9uKClcXFwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5vdC1zdXBwb3J0ZWQtZm9ybWF0IFt1cmxGaWxlXT1cXFwidXJsRmlsZUNvbnRlbnRcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25hbWVGaWxlXT1cXFwiZGlzcGxheU5hbWVcXFwiPjwvbm90LXN1cHBvcnRlZC1mb3JtYXQ+ICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIEVuZCBWaWV3IFN3aXRjaCAtLT4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgIDwhLS08ZGl2IGlkPVxcXCJ2aWV3ZXItbmV4dC1maWxlLWJ1dHRvblxcXCIgY2xhc3M9XFxcImNlbnRlci1lbGVtZW50IG1kbC1jZWxsIG1kbC1jZWxsJiM0NTsmIzQ1OzItY29sIG1kbC1jZWxsJiM0NTsmIzQ1O2hpZGUtdGFibGV0IG1kbC1jZWxsJiM0NTsmIzQ1O2hpZGUtcGhvbmVcXFwiPi0tPiAgICAgICAgICAgICAgICAgICAgIDwhLS08YnV0dG9uICpuZ0lmPVxcXCJmYWxzZVxcXCItLT4gICAgICAgICAgICAgICAgICAgICA8IS0tY2xhc3M9XFxcImNlbnRlci1lbGVtZW50IG1kbC1jb2xvciYjNDU7JiM0NTtibGFjayBtZGwtYnV0dG9uIG1kbC1qcy1idXR0b24gbWRsLWJ1dHRvbiYjNDU7JiM0NTtmYWIgbWRsLWJ1dHRvbiYjNDU7JiM0NTttaW5pLWZhYiBtZGwtYnV0dG9uJiM0NTsmIzQ1O2NvbG9yZWRcXFwiLS0+ICAgICAgICAgICAgICAgICAgICAgPCEtLShjbGljayk9XFxcIm5leHRGaWxlKClcXFwiPi0tPiAgICAgICAgICAgICAgICAgICAgIDwhLS08aSBjbGFzcz1cXFwiaWNvbiBtYXRlcmlhbC1pY29uc1xcXCI+a2V5Ym9hcmRfYXJyb3dfcmlnaHQ8L2k+LS0+ICAgICAgICAgICAgICAgICAgICAgPCEtLTwvYnV0dG9uPi0tPiAgICAgICAgICAgICAgICAgICAgIDwhLS08L2Rpdj4tLT4gICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgPC9tYWluPiAgICAgICAgIDwvZGl2PiAgICAgICAgIDwhLS0gRW5kIExheW91dCAtLT4gICAgIDwvZGl2PiA8L2Rpdj5cIixcbiAgICBzdHlsZXM6IFtcIi5idXR0b24tY29udGFpbmVyIHsgICAgIHBhZGRpbmc6IDAgNDBweDsgfSAgLmxlZnQgeyAgICAgZmxvYXQ6IGxlZnQ7IH0gICNwYWdlLWNvbnRlbnQgeyAgICAgZGlzcGxheTogZmxleDsgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7ICAgICBmbGV4LXdyYXA6IHdyYXA7ICAgICBmbGV4OiAxOyB9ICAubWRsLWdyaWQgeyAgICAgd2lkdGg6IDEwMHZ3OyAgICAgcGFkZGluZzogMHB4ICFpbXBvcnRhbnQ7IH0gIC52aWV3ZXItbmFtZS1maWxlIHsgICAgIHdpZHRoOiA1MCU7ICAgICBoZWlnaHQ6IDIxcHg7ICAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7ICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpczsgfSAgLnZpZXdlci1zaGFkb3ctdHJhbnNwYXJlbnQgeyAgICAgei1pbmRleDogMTAwMDsgICAgIGJhY2tncm91bmQtY29sb3I6ICMzRTNFM0U7ICAgICBwb3NpdGlvbjogZml4ZWQ7ICAgICB0b3A6IDA7ICAgICBib3R0b206IDA7ICAgICBsZWZ0OiAwOyAgICAgcmlnaHQ6IDA7ICAgICBvcGFjaXR5OiAuOTA7IH0gIC52aWV3ZXItb3ZlcmxheS12aWV3IHsgICAgIHBvc2l0aW9uOiBmaXhlZDsgICAgIHRvcDogMHB4OyAgICAgbGVmdDogMHB4OyAgICAgei1pbmRleDogMTAwMDsgfSAgaW1nLXZpZXdlciB7ICAgICBoZWlnaHQ6IDEwMCU7IH0gIC5jZW50ZXItZWxlbWVudCB7ICAgICBkaXNwbGF5OiBmbGV4OyAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjsgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyOyB9ICAuYWxsLXNwYWNleyAgICAgd2lkdGg6IDEwMCU7ICAgICBoZWlnaHQ6IDEwMCU7ICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTE1MTUxOyB9XCJdXG59KVxuZXhwb3J0IGNsYXNzIFZpZXdlckNvbXBvbmVudCB7XG5cbiAgICBASW5wdXQoKVxuICAgIHVybEZpbGU6IHN0cmluZyA9ICcnO1xuXG4gICAgQElucHV0KClcbiAgICBmaWxlTm9kZUlkOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgQElucHV0KClcbiAgICBvdmVybGF5TW9kZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KClcbiAgICBzaG93Vmlld2VyOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpXG4gICAgc2hvd1Rvb2xiYXI6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQE91dHB1dCgpXG4gICAgc2hvd1ZpZXdlckNoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gICAgdXJsRmlsZUNvbnRlbnQ6IHN0cmluZztcblxuICAgIG90aGVyTWVudTogYW55O1xuXG4gICAgZGlzcGxheU5hbWU6IHN0cmluZztcblxuICAgIGV4dGVuc2lvbjogc3RyaW5nO1xuXG4gICAgbWltZVR5cGU6IHN0cmluZztcblxuICAgIGxvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcGlTZXJ2aWNlOiBBbGZyZXNjb0FwaVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQpIHtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XG4gICAgICAgIGlmICh0aGlzLnNob3dWaWV3ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZU90aGVySGVhZGVyQmFyKCk7XG4gICAgICAgICAgICB0aGlzLmJsb2NrT3RoZXJTY3JvbGxCYXIoKTtcbiAgICAgICAgICAgIGlmICghdGhpcy51cmxGaWxlICYmICF0aGlzLmZpbGVOb2RlSWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dHJpYnV0ZSB1cmxGaWxlIG9yIGZpbGVOb2RlSWQgaXMgcmVxdWlyZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGFsZnJlc2NvQXBpID0gdGhpcy5hcGlTZXJ2aWNlLmdldEluc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXJsRmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZW5hbWVGcm9tVXJsID0gdGhpcy5nZXRGaWxlbmFtZUZyb21VcmwodGhpcy51cmxGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5TmFtZSA9IGZpbGVuYW1lRnJvbVVybCA/IGZpbGVuYW1lRnJvbVVybCA6ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4dGVuc2lvbiA9IHRoaXMuZ2V0RmlsZUV4dGVuc2lvbihmaWxlbmFtZUZyb21VcmwpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVybEZpbGVDb250ZW50ID0gdGhpcy51cmxGaWxlO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbGVOb2RlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxmcmVzY29BcGkubm9kZXMuZ2V0Tm9kZUluZm8odGhpcy5maWxlTm9kZUlkKS50aGVuKChkYXRhOiBNaW5pbWFsTm9kZUVudHJ5RW50aXR5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbWVUeXBlID0gZGF0YS5jb250ZW50Lm1pbWVUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5TmFtZSA9IGRhdGEubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXJsRmlsZUNvbnRlbnQgPSBhbGZyZXNjb0FwaS5jb250ZW50LmdldENvbnRlbnRVcmwoZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUaGlzIG5vZGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjbG9zZSB0aGUgdmlld2VyXG4gICAgICovXG4gICAgY2xvc2UoKSB7XG4gICAgICAgIHRoaXMudW5ibG9ja090aGVyU2Nyb2xsQmFyKCk7XG4gICAgICAgIGlmICh0aGlzLm90aGVyTWVudSkge1xuICAgICAgICAgICAgdGhpcy5vdGhlck1lbnUuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhbnVwKCk7XG4gICAgICAgIHRoaXMuc2hvd1ZpZXdlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNob3dWaWV3ZXJDaGFuZ2UuZW1pdCh0aGlzLnNob3dWaWV3ZXIpO1xuICAgIH1cblxuICAgIGNsZWFudXAoKSB7XG4gICAgICAgIHRoaXMudXJsRmlsZUNvbnRlbnQgPSAnJztcbiAgICAgICAgdGhpcy5kaXNwbGF5TmFtZSA9ICcnO1xuICAgICAgICB0aGlzLmZpbGVOb2RlSWQgPSBudWxsO1xuICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmV4dGVuc2lvbiA9IG51bGw7XG4gICAgICAgIHRoaXMubWltZVR5cGUgPSBudWxsO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmNsZWFudXAoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgRmlsZSBuYW1lIGZyb20gdXJsXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gdXJsIGZpbGVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBuYW1lIGZpbGVcbiAgICAgKi9cbiAgICBnZXRGaWxlbmFtZUZyb21VcmwodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGFuY2hvciA9IHVybC5pbmRleE9mKCcjJyk7XG4gICAgICAgIGxldCBxdWVyeSA9IHVybC5pbmRleE9mKCc/Jyk7XG4gICAgICAgIGxldCBlbmQgPSBNYXRoLm1pbihcbiAgICAgICAgICAgIGFuY2hvciA+IDAgPyBhbmNob3IgOiB1cmwubGVuZ3RoLFxuICAgICAgICAgICAgcXVlcnkgPiAwID8gcXVlcnkgOiB1cmwubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIHVybC5zdWJzdHJpbmcodXJsLmxhc3RJbmRleE9mKCcvJywgZW5kKSArIDEsIGVuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSB0b2tlbiBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZU5hbWUgLSBmaWxlIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBmaWxlIG5hbWUgZXh0ZW5zaW9uXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXRGaWxlRXh0ZW5zaW9uKGZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZpbGVOYW1lLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgY29udGVudCBpcyBhbiBpbWFnZSB0aHJvdWdoIHRoZSBleHRlbnNpb24gb3IgbWltZSB0eXBlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGlzSW1hZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzSW1hZ2VFeHRlbnNpb24oKSB8fCB0aGlzLmlzSW1hZ2VNaW1lVHlwZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSBjb250ZW50IGlzIGEgbWVkaWEgdGhyb3VnaCB0aGUgZXh0ZW5zaW9uIG9yIG1pbWUgdHlwZVxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgcHJpdmF0ZSBpc01lZGlhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc01lZGlhRXh0ZW5zaW9uKHRoaXMuZXh0ZW5zaW9uKSB8fCB0aGlzLmlzTWVkaWFNaW1lVHlwZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNoZWNrIGlmIHRoZSBjdXJyZW50IGZpbGUgaXMgYSBzdXBwb3J0ZWQgaW1hZ2UgZXh0ZW5zaW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGlzSW1hZ2VFeHRlbnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVuc2lvbiA9PT0gJ3BuZycgfHwgdGhpcy5leHRlbnNpb24gPT09ICdqcGcnIHx8XG4gICAgICAgICAgICB0aGlzLmV4dGVuc2lvbiA9PT0gJ2pwZWcnIHx8IHRoaXMuZXh0ZW5zaW9uID09PSAnZ2lmJyB8fCB0aGlzLmV4dGVuc2lvbiA9PT0gJ2JtcCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hlY2sgaWYgdGhlIGN1cnJlbnQgZmlsZSBoYXMgYW4gaW1hZ2UtYmFzZWQgbWltZXR5cGVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHByaXZhdGUgaXNNZWRpYU1pbWVUeXBlKCkge1xuICAgICAgICBsZXQgbWltZUV4dGVuc2lvbjtcbiAgICAgICAgaWYgKHRoaXMubWltZVR5cGUgJiYgdGhpcy5taW1lVHlwZS5pbmRleE9mKCcvJykpIHtcbiAgICAgICAgICAgIG1pbWVFeHRlbnNpb24gPSB0aGlzLm1pbWVUeXBlLnN1YnN0cih0aGlzLm1pbWVUeXBlLmluZGV4T2YoJy8nKSArIDEsIHRoaXMubWltZVR5cGUubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5taW1lVHlwZSAmJiB0aGlzLm1pbWVUeXBlLmluZGV4T2YoJ3ZpZGVvLycpID09PSAwICYmIHRoaXMuaXNNZWRpYUV4dGVuc2lvbihtaW1lRXh0ZW5zaW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjaGVjayBpZiB0aGUgY3VycmVudCBmaWxlIGlzIGEgc3VwcG9ydGVkIG1lZGlhIGV4dGVuc2lvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBleHRlbnNpb25cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHByaXZhdGUgaXNNZWRpYUV4dGVuc2lvbihleHRlbnNpb246IHN0cmluZykge1xuICAgICAgICByZXR1cm4gZXh0ZW5zaW9uID09PSAnbXA0JyB8fCBleHRlbnNpb24gPT09ICdXZWJNJyB8fCBleHRlbnNpb24gPT09ICdPZ2cnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNoZWNrIGlmIHRoZSBjdXJyZW50IGZpbGUgaGFzIGFuIGltYWdlLWJhc2VkIG1pbWV0eXBlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGlzSW1hZ2VNaW1lVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWltZVR5cGUgJiYgdGhpcy5taW1lVHlwZS5pbmRleE9mKCdpbWFnZS8nKSA9PT0gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjaGVjayBpZiB0aGUgY3VycmVudCBmaWxlIGlzIGEgc3VwcG9ydGVkIHBkZiBleHRlbnNpb25cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHByaXZhdGUgaXNQZGYoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVuc2lvbiA9PT0gJ3BkZicgfHwgdGhpcy5taW1lVHlwZSA9PT0gJ2FwcGxpY2F0aW9uL3BkZic7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hlY2sgaWYgdGhlIGN1cnJlbnQgZmlsZSBpcyAgYSBzdXBwb3J0ZWQgZXh0ZW5zaW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzdXBwb3J0ZWRFeHRlbnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzSW1hZ2UoKSB8fCB0aGlzLmlzUGRmKCkgfHwgdGhpcy5pc01lZGlhKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGl0ZW5lciBLZXlib2FyZCBFdmVudFxuICAgICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnRcbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXlkb3duJywgWyckZXZlbnQnXSlcbiAgICBoYW5kbGVLZXlib2FyZEV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xuICAgICAgICBpZiAoa2V5ID09PSAyNyAmJiB0aGlzLm92ZXJsYXlNb2RlKSB7IC8vIGVzY1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgaW4gdGhlIGRvY3VtZW50IHRoZXJlIGFyZSBzY3JvbGxhYmxlIG1haW4gYXJlYSBhbmQgZGlzYWJsZSBpdFxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgcHJpdmF0ZSBibG9ja090aGVyU2Nyb2xsQmFyKCkge1xuICAgICAgICBsZXQgbWFpbkVsZW1lbnRzOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbWFpbicpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYWluRWxlbWVudHNbaV0uc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGluIHRoZSBkb2N1bWVudCB0aGVyZSBhcmUgc2Nyb2xsYWJsZSBtYWluIGFyZWEgYW5kIHJlbmFibGUgaXRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHByaXZhdGUgdW5ibG9ja090aGVyU2Nyb2xsQmFyKCkge1xuICAgICAgICBsZXQgbWFpbkVsZW1lbnRzOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbWFpbicpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYWluRWxlbWVudHNbaV0uc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSB2aWV3ZXIgaXMgdXNlZCBpbnNpZGUgYW5kIGhlYWRlciBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGlzUGFyZW50RWxlbWVudEhlYWRlckJhcigpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5jbG9zZXN0RWxlbWVudCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2hlYWRlcicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSB2aWV3ZXIgaXMgdXNlZCBpbnNpZGUgYW5kIGhlYWRlciBlbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbGVtbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbm9kZU5hbWVcbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAgICovXG4gICAgcHJpdmF0ZSBjbG9zZXN0RWxlbWVudChlbGVsZW1udDogSFRNTEVsZW1lbnQsIG5vZGVOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHBhcmVudCA9IGVsZWxlbW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbm9kZU5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZXN0RWxlbWVudChwYXJlbnQsIG5vZGVOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgb3RoZXIgcG9zc2libGUgbWVudSBpbiB0aGUgYXBwbGljYXRpb25cbiAgICAgKi9cbiAgICBwcml2YXRlIGhpZGVPdGhlckhlYWRlckJhcigpIHtcbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheU1vZGUgJiYgIXRoaXMuaXNQYXJlbnRFbGVtZW50SGVhZGVyQmFyKCkpIHtcbiAgICAgICAgICAgIHRoaXMub3RoZXJNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZGVyJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5vdGhlck1lbnUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm90aGVyTWVudS5oaWRkZW4gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRydWUgaWYgdGhlIGRhdGEgYWJvdXQgdGhlIG5vZGUgaW4gdGhlIGVjbSBhcmUgbG9hZGVkXG4gICAgICovXG4gICAgaXNMb2FkZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbGVOb2RlSWQgPyB0aGlzLmxvYWRlZCA6IHRydWU7XG4gICAgfVxufVxuIl19

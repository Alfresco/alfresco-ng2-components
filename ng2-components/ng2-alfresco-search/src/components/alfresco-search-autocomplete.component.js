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
var alfresco_search_service_1 = require("./../services/alfresco-search.service");
var alfresco_thumbnail_service_1 = require("./../services/alfresco-thumbnail.service");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var AlfrescoSearchAutocompleteComponent = (function () {
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
            this.alfrescoSearchService
                .getNodeQueryResults(searchTerm, searchOpts)
                .subscribe(function (results) {
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
        }
        else if (node.entry.isFolder) {
            return this.baseComponentPath + "/../assets/images/ft_ic_folder.svg";
        }
    };
    AlfrescoSearchAutocompleteComponent.prototype.resolveIconPath = function (icon) {
        return this.baseComponentPath + "/../assets/images/" + icon;
    };
    AlfrescoSearchAutocompleteComponent.prototype.getMimeTypeKey = function (node) {
        if (node.entry.content && node.entry.content.mimeType) {
            return 'SEARCH.ICONS.' + this.alfrescoThumbnailService.getMimeTypeKey(node.entry.content.mimeType);
        }
        else {
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
        }
        else {
            this.scrollBack.emit($event);
        }
    };
    AlfrescoSearchAutocompleteComponent.prototype.onRowEscape = function ($event) {
        this.cancel.emit($event);
    };
    return AlfrescoSearchAutocompleteComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchAutocompleteComponent.prototype, "searchTerm", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AlfrescoSearchAutocompleteComponent.prototype, "ngClass", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], AlfrescoSearchAutocompleteComponent.prototype, "maxResults", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchAutocompleteComponent.prototype, "resultSort", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchAutocompleteComponent.prototype, "rootNodeId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchAutocompleteComponent.prototype, "resultType", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], AlfrescoSearchAutocompleteComponent.prototype, "fileSelect", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], AlfrescoSearchAutocompleteComponent.prototype, "searchFocus", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AlfrescoSearchAutocompleteComponent.prototype, "cancel", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AlfrescoSearchAutocompleteComponent.prototype, "resultsLoad", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AlfrescoSearchAutocompleteComponent.prototype, "scrollBack", void 0);
__decorate([
    core_1.ViewChild('resultsTableBody', {}),
    __metadata("design:type", core_1.ElementRef)
], AlfrescoSearchAutocompleteComponent.prototype, "resultsTableBody", void 0);
AlfrescoSearchAutocompleteComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-search-autocomplete',
        template: "<table data-automation-id=\"autocomplete_results\" *ngIf=\"results && results.length && searchTerm\"        class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width\">     <tbody #resultsTableBody>     <tr id=\"result_row_{{idx}}\" *ngFor=\"let result of results; let idx = index\" tabindex=\"0\"             (blur)=\"onRowBlur($event)\" (focus)=\"onRowFocus($event)\"             (click)=\"onItemClick(result)\"             (keyup.enter)=\"onRowEnter(result)\"             (keyup.arrowdown)=\"onRowArrowDown($event)\"             (keyup.arrowup)=\"onRowArrowUp($event)\"             (keyup.escape)=\"onRowEscape($event)\"             attr.data-automation-id=\"autocomplete_result_for_{{result.entry.name}}\">         <td class=\"img-td\"><img src=\"{{getMimeTypeIcon(result)}}\" alt=\"{{getMimeTypeKey(result)|translate}}\"/></td>         <td>             <div id=\"result_name_{{idx}}\"  class=\"truncate\"><b>{{result.entry.name}}</b></div>             <div id=\"result_user_{{idx}}\"  class=\"truncate\">{{result.entry.createdByUser.displayName}}</div>         </td>     </tr>     </tbody> </table> <table id=\"search_no_result\" data-automation-id=\"search_no_result_found\" *ngIf=\"results && results.length === 0\"        class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width\">     <tbody>     <tr>         <td>             <div class=\"truncate\"><b> {{ 'SEARCH.RESULTS.NONE' | translate:{searchTerm: searchTerm} }}</b></div>         </td>     </tr>     </tbody> </table> <table data-automation-id=\"autocomplete_error_message\" *ngIf=\"errorMessage\"        class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width\">     <tbody>     <tr>         <td>{{ 'SEARCH.RESULTS.ERROR' | translate:{errorMessage: errorMessage} }}</td>     </tr>     </tbody> </table>",
        styles: [":host {     position: absolute;     z-index: 5;     display: none;     color: #555;     margin: -21px 0px 0px 0px; } :host a {     color: #555;     text-decoration: none; } :host table {     width: 300px; } :host .mdl-data-table tbody tr {     height: 32px; } :host .mdl-data-table td {     height: 32px;     padding: 8px;     text-align: left;     border-top: none;     border-bottom: none; } :host.active.valid {     display: block; }  .img-td{     width: 30px; }  .truncate{     width: 240px;     white-space: nowrap;     overflow: hidden;     text-overflow: ellipsis; }  @media screen and (max-width: 400px) {     :host {         right: 0;     }     .truncate{         width: 200px;     } }"]
    }),
    __metadata("design:paramtypes", [alfresco_search_service_1.AlfrescoSearchService,
        ng2_alfresco_core_1.AlfrescoTranslationService,
        alfresco_thumbnail_service_1.AlfrescoThumbnailService])
], AlfrescoSearchAutocompleteComponent);
exports.AlfrescoSearchAutocompleteComponent = AlfrescoSearchAutocompleteComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYWxmcmVzY28tc2VhcmNoLWF1dG9jb21wbGV0ZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOzs7Ozs7Ozs7OztBQUVILHNDQUFpSDtBQUNqSCxpRkFBNkY7QUFDN0YsdUZBQW9GO0FBQ3BGLHVEQUErRDtBQVMvRCxJQUFhLG1DQUFtQztJQTJDNUMsNkNBQW9CLHFCQUE0QyxFQUM1QyxTQUFxQyxFQUNyQyx3QkFBa0Q7UUFGbEQsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxjQUFTLEdBQVQsU0FBUyxDQUE0QjtRQUNyQyw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBMUN0RSxlQUFVLEdBQVcsRUFBRSxDQUFDO1FBRXhCLFlBQU8sR0FBUSxJQUFJLENBQUM7UUFRcEIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUd2QixlQUFVLEdBQVcsSUFBSSxDQUFDO1FBRzFCLGVBQVUsR0FBVyxPQUFPLENBQUM7UUFHN0IsZUFBVSxHQUFXLElBQUksQ0FBQztRQUcxQixlQUFVLEdBQXNCLElBQUksbUJBQVksRUFBRSxDQUFDO1FBR25ELGdCQUFXLEdBQTZCLElBQUksbUJBQVksRUFBYyxDQUFDO1FBR3ZFLFdBQU0sR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUc1QixnQkFBVyxHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBR2pDLGVBQVUsR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUloQyxzQkFBaUIsR0FBVyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQywwQ0FBMEMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUs5RixDQUFDO0lBRUQsc0RBQVEsR0FBUjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLEVBQUUsc0NBQXNDLENB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RTs7d0VBQ3dCO0FBR2pDO0lBREMsYUFBTSxFQUFFOzt1RUFDdUI7QUFFRztJQUFsQyxnQkFBUyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQzs4QkFBbUIsaUJBQVU7NkVBQUM7QUF2Q3ZELG1DQUFtQztJQU4vQyxnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFFBQVEsRUFBRSw4QkFBOEI7UUFDeEMsUUFBUSxFQUFFLDZ3REFBNndEO1FBQ3Z4RCxNQUFNLEVBQUUsQ0FBQyx3ckJBQXdyQixDQUFDO0tBQ3JzQixDQUFDO3FDQTRDNkMsK0NBQXFCO1FBQ2pDLDhDQUEwQjtRQUNYLHFEQUF3QjtHQTdDN0QsbUNBQW1DLENBa0wvQztBQWxMWSxrRkFBbUMiLCJmaWxlIjoiY29tcG9uZW50cy9hbGZyZXNjby1zZWFyY2gtYXV0b2NvbXBsZXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPbkNoYW5nZXMsIE91dHB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBbGZyZXNjb1NlYXJjaFNlcnZpY2UsIFNlYXJjaE9wdGlvbnMgfSBmcm9tICcuLy4uL3NlcnZpY2VzL2FsZnJlc2NvLXNlYXJjaC5zZXJ2aWNlJztcbmltcG9ydCB7IEFsZnJlc2NvVGh1bWJuYWlsU2VydmljZSB9IGZyb20gJy4vLi4vc2VydmljZXMvYWxmcmVzY28tdGh1bWJuYWlsLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWxmcmVzY29UcmFuc2xhdGlvblNlcnZpY2UgfSBmcm9tICduZzItYWxmcmVzY28tY29yZSc7XG5pbXBvcnQgeyBNaW5pbWFsTm9kZUVudGl0eSB9IGZyb20gJ2FsZnJlc2NvLWpzLWFwaSc7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc2VsZWN0b3I6ICdhbGZyZXNjby1zZWFyY2gtYXV0b2NvbXBsZXRlJyxcbiAgICB0ZW1wbGF0ZTogXCI8dGFibGUgZGF0YS1hdXRvbWF0aW9uLWlkPVxcXCJhdXRvY29tcGxldGVfcmVzdWx0c1xcXCIgKm5nSWY9XFxcInJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggJiYgc2VhcmNoVGVybVxcXCIgICAgICAgIGNsYXNzPVxcXCJtZGwtZGF0YS10YWJsZSBtZGwtanMtZGF0YS10YWJsZSBtZGwtc2hhZG93LS0yZHAgZnVsbC13aWR0aFxcXCI+ICAgICA8dGJvZHkgI3Jlc3VsdHNUYWJsZUJvZHk+ICAgICA8dHIgaWQ9XFxcInJlc3VsdF9yb3dfe3tpZHh9fVxcXCIgKm5nRm9yPVxcXCJsZXQgcmVzdWx0IG9mIHJlc3VsdHM7IGxldCBpZHggPSBpbmRleFxcXCIgdGFiaW5kZXg9XFxcIjBcXFwiICAgICAgICAgICAgIChibHVyKT1cXFwib25Sb3dCbHVyKCRldmVudClcXFwiIChmb2N1cyk9XFxcIm9uUm93Rm9jdXMoJGV2ZW50KVxcXCIgICAgICAgICAgICAgKGNsaWNrKT1cXFwib25JdGVtQ2xpY2socmVzdWx0KVxcXCIgICAgICAgICAgICAgKGtleXVwLmVudGVyKT1cXFwib25Sb3dFbnRlcihyZXN1bHQpXFxcIiAgICAgICAgICAgICAoa2V5dXAuYXJyb3dkb3duKT1cXFwib25Sb3dBcnJvd0Rvd24oJGV2ZW50KVxcXCIgICAgICAgICAgICAgKGtleXVwLmFycm93dXApPVxcXCJvblJvd0Fycm93VXAoJGV2ZW50KVxcXCIgICAgICAgICAgICAgKGtleXVwLmVzY2FwZSk9XFxcIm9uUm93RXNjYXBlKCRldmVudClcXFwiICAgICAgICAgICAgIGF0dHIuZGF0YS1hdXRvbWF0aW9uLWlkPVxcXCJhdXRvY29tcGxldGVfcmVzdWx0X2Zvcl97e3Jlc3VsdC5lbnRyeS5uYW1lfX1cXFwiPiAgICAgICAgIDx0ZCBjbGFzcz1cXFwiaW1nLXRkXFxcIj48aW1nIHNyYz1cXFwie3tnZXRNaW1lVHlwZUljb24ocmVzdWx0KX19XFxcIiBhbHQ9XFxcInt7Z2V0TWltZVR5cGVLZXkocmVzdWx0KXx0cmFuc2xhdGV9fVxcXCIvPjwvdGQ+ICAgICAgICAgPHRkPiAgICAgICAgICAgICA8ZGl2IGlkPVxcXCJyZXN1bHRfbmFtZV97e2lkeH19XFxcIiAgY2xhc3M9XFxcInRydW5jYXRlXFxcIj48Yj57e3Jlc3VsdC5lbnRyeS5uYW1lfX08L2I+PC9kaXY+ICAgICAgICAgICAgIDxkaXYgaWQ9XFxcInJlc3VsdF91c2VyX3t7aWR4fX1cXFwiICBjbGFzcz1cXFwidHJ1bmNhdGVcXFwiPnt7cmVzdWx0LmVudHJ5LmNyZWF0ZWRCeVVzZXIuZGlzcGxheU5hbWV9fTwvZGl2PiAgICAgICAgIDwvdGQ+ICAgICA8L3RyPiAgICAgPC90Ym9keT4gPC90YWJsZT4gPHRhYmxlIGlkPVxcXCJzZWFyY2hfbm9fcmVzdWx0XFxcIiBkYXRhLWF1dG9tYXRpb24taWQ9XFxcInNlYXJjaF9ub19yZXN1bHRfZm91bmRcXFwiICpuZ0lmPVxcXCJyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID09PSAwXFxcIiAgICAgICAgY2xhc3M9XFxcIm1kbC1kYXRhLXRhYmxlIG1kbC1qcy1kYXRhLXRhYmxlIG1kbC1zaGFkb3ctLTJkcCBmdWxsLXdpZHRoXFxcIj4gICAgIDx0Ym9keT4gICAgIDx0cj4gICAgICAgICA8dGQ+ICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRydW5jYXRlXFxcIj48Yj4ge3sgJ1NFQVJDSC5SRVNVTFRTLk5PTkUnIHwgdHJhbnNsYXRlOntzZWFyY2hUZXJtOiBzZWFyY2hUZXJtfSB9fTwvYj48L2Rpdj4gICAgICAgICA8L3RkPiAgICAgPC90cj4gICAgIDwvdGJvZHk+IDwvdGFibGU+IDx0YWJsZSBkYXRhLWF1dG9tYXRpb24taWQ9XFxcImF1dG9jb21wbGV0ZV9lcnJvcl9tZXNzYWdlXFxcIiAqbmdJZj1cXFwiZXJyb3JNZXNzYWdlXFxcIiAgICAgICAgY2xhc3M9XFxcIm1kbC1kYXRhLXRhYmxlIG1kbC1qcy1kYXRhLXRhYmxlIG1kbC1zaGFkb3ctLTJkcCBmdWxsLXdpZHRoXFxcIj4gICAgIDx0Ym9keT4gICAgIDx0cj4gICAgICAgICA8dGQ+e3sgJ1NFQVJDSC5SRVNVTFRTLkVSUk9SJyB8IHRyYW5zbGF0ZTp7ZXJyb3JNZXNzYWdlOiBlcnJvck1lc3NhZ2V9IH19PC90ZD4gICAgIDwvdHI+ICAgICA8L3Rib2R5PiA8L3RhYmxlPlwiLFxuICAgIHN0eWxlczogW1wiOmhvc3QgeyAgICAgcG9zaXRpb246IGFic29sdXRlOyAgICAgei1pbmRleDogNTsgICAgIGRpc3BsYXk6IG5vbmU7ICAgICBjb2xvcjogIzU1NTsgICAgIG1hcmdpbjogLTIxcHggMHB4IDBweCAwcHg7IH0gOmhvc3QgYSB7ICAgICBjb2xvcjogIzU1NTsgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTsgfSA6aG9zdCB0YWJsZSB7ICAgICB3aWR0aDogMzAwcHg7IH0gOmhvc3QgLm1kbC1kYXRhLXRhYmxlIHRib2R5IHRyIHsgICAgIGhlaWdodDogMzJweDsgfSA6aG9zdCAubWRsLWRhdGEtdGFibGUgdGQgeyAgICAgaGVpZ2h0OiAzMnB4OyAgICAgcGFkZGluZzogOHB4OyAgICAgdGV4dC1hbGlnbjogbGVmdDsgICAgIGJvcmRlci10b3A6IG5vbmU7ICAgICBib3JkZXItYm90dG9tOiBub25lOyB9IDpob3N0LmFjdGl2ZS52YWxpZCB7ICAgICBkaXNwbGF5OiBibG9jazsgfSAgLmltZy10ZHsgICAgIHdpZHRoOiAzMHB4OyB9ICAudHJ1bmNhdGV7ICAgICB3aWR0aDogMjQwcHg7ICAgICB3aGl0ZS1zcGFjZTogbm93cmFwOyAgICAgb3ZlcmZsb3c6IGhpZGRlbjsgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzOyB9ICBAbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0MDBweCkgeyAgICAgOmhvc3QgeyAgICAgICAgIHJpZ2h0OiAwOyAgICAgfSAgICAgLnRydW5jYXRleyAgICAgICAgIHdpZHRoOiAyMDBweDsgICAgIH0gfVwiXVxufSlcbmV4cG9ydCBjbGFzcyBBbGZyZXNjb1NlYXJjaEF1dG9jb21wbGV0ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICAgIEBJbnB1dCgpXG4gICAgc2VhcmNoVGVybTogc3RyaW5nID0gJyc7XG5cbiAgICByZXN1bHRzOiBhbnkgPSBudWxsO1xuXG4gICAgZXJyb3JNZXNzYWdlO1xuXG4gICAgQElucHV0KClcbiAgICBuZ0NsYXNzOiBhbnk7XG5cbiAgICBASW5wdXQoKVxuICAgIG1heFJlc3VsdHM6IG51bWJlciA9IDU7XG5cbiAgICBASW5wdXQoKVxuICAgIHJlc3VsdFNvcnQ6IHN0cmluZyA9IG51bGw7XG5cbiAgICBASW5wdXQoKVxuICAgIHJvb3ROb2RlSWQ6IHN0cmluZyA9ICctcm9vdCc7XG5cbiAgICBASW5wdXQoKVxuICAgIHJlc3VsdFR5cGU6IHN0cmluZyA9IG51bGw7XG5cbiAgICBAT3V0cHV0KClcbiAgICBmaWxlU2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHNlYXJjaEZvY3VzOiBFdmVudEVtaXR0ZXI8Rm9jdXNFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPEZvY3VzRXZlbnQ+KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBjYW5jZWwgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICByZXN1bHRzTG9hZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHNjcm9sbEJhY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAVmlld0NoaWxkKCdyZXN1bHRzVGFibGVCb2R5Jywge30pIHJlc3VsdHNUYWJsZUJvZHk6IEVsZW1lbnRSZWY7XG5cbiAgICBiYXNlQ29tcG9uZW50UGF0aDogc3RyaW5nID0gbW9kdWxlLmlkLnJlcGxhY2UoJy9jb21wb25lbnRzL2FsZnJlc2NvLXNlYXJjaC5jb21wb25lbnQuanMnLCAnJyk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFsZnJlc2NvU2VhcmNoU2VydmljZTogQWxmcmVzY29TZWFyY2hTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgdHJhbnNsYXRlOiBBbGZyZXNjb1RyYW5zbGF0aW9uU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGFsZnJlc2NvVGh1bWJuYWlsU2VydmljZTogQWxmcmVzY29UaHVtYm5haWxTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zbGF0ZSkge1xuICAgICAgICAgICAgdGhpcy50cmFuc2xhdGUuYWRkVHJhbnNsYXRpb25Gb2xkZXIoJ25nMi1hbGZyZXNjby1zZWFyY2gnLCAnbm9kZV9tb2R1bGVzL25nMi1hbGZyZXNjby1zZWFyY2gvc3JjJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XG4gICAgICAgIGlmIChjaGFuZ2VzLnNlYXJjaFRlcm0pIHtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0cyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlTZWFyY2hSZXN1bHRzKGNoYW5nZXMuc2VhcmNoVGVybS5jdXJyZW50VmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZHMgYW5kIGRpc3BsYXlzIHNlYXJjaCByZXN1bHRzXG4gICAgICogQHBhcmFtIHNlYXJjaFRlcm0gU2VhcmNoIHF1ZXJ5IGVudGVyZWQgYnkgdXNlclxuICAgICAqL1xuICAgIHByaXZhdGUgZGlzcGxheVNlYXJjaFJlc3VsdHMoc2VhcmNoVGVybSkge1xuICAgICAgICBsZXQgc2VhcmNoT3B0czogU2VhcmNoT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFsncGF0aCddLFxuICAgICAgICAgICAgcm9vdE5vZGVJZDogdGhpcy5yb290Tm9kZUlkLFxuICAgICAgICAgICAgbm9kZVR5cGU6IHRoaXMucmVzdWx0VHlwZSxcbiAgICAgICAgICAgIG1heEl0ZW1zOiB0aGlzLm1heFJlc3VsdHMsXG4gICAgICAgICAgICBvcmRlckJ5OiB0aGlzLnJlc3VsdFNvcnRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNlYXJjaFRlcm0gIT09IG51bGwgJiYgc2VhcmNoVGVybSAhPT0gJycpIHtcbiAgICAgICAgICAgIHRoaXMuYWxmcmVzY29TZWFyY2hTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLmdldE5vZGVRdWVyeVJlc3VsdHMoc2VhcmNoVGVybSwgc2VhcmNoT3B0cylcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzdWx0cyA9IHJlc3VsdHMubGlzdC5lbnRyaWVzLnNsaWNlKDAsIHRoaXMubWF4UmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdHNMb2FkLmVtaXQodGhpcy5yZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bHRzID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gPGFueT5lcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzdWx0c0xvYWQuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGh1bWJuYWlsIFVSTCBmb3IgdGhlIGdpdmVuIGRvY3VtZW50IG5vZGUuXG4gICAgICogQHBhcmFtIG5vZGUgTm9kZSB0byBnZXQgVVJMIGZvci5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBVUkwgYWRkcmVzcy5cbiAgICAgKi9cbiAgICBnZXRNaW1lVHlwZUljb24obm9kZTogTWluaW1hbE5vZGVFbnRpdHkpOiBzdHJpbmcge1xuICAgICAgICBpZiAobm9kZS5lbnRyeS5jb250ZW50ICYmIG5vZGUuZW50cnkuY29udGVudC5taW1lVHlwZSkge1xuICAgICAgICAgICAgbGV0IGljb24gPSB0aGlzLmFsZnJlc2NvVGh1bWJuYWlsU2VydmljZS5nZXRNaW1lVHlwZUljb24obm9kZS5lbnRyeS5jb250ZW50Lm1pbWVUeXBlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc29sdmVJY29uUGF0aChpY29uKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmVudHJ5LmlzRm9sZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5iYXNlQ29tcG9uZW50UGF0aH0vLi4vYXNzZXRzL2ltYWdlcy9mdF9pY19mb2xkZXIuc3ZnYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc29sdmVJY29uUGF0aChpY29uOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5iYXNlQ29tcG9uZW50UGF0aH0vLi4vYXNzZXRzL2ltYWdlcy8ke2ljb259YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRodW1ibmFpbCBtZXNzYWdlIGtleSBmb3IgdGhlIGdpdmVuIGRvY3VtZW50IG5vZGUsIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGxvb2sgdXAgYWx0IHRleHRcbiAgICAgKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGdldCBVUkwgZm9yLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFVSTCBhZGRyZXNzLlxuICAgICAqL1xuICAgIGdldE1pbWVUeXBlS2V5KG5vZGU6IE1pbmltYWxOb2RlRW50aXR5KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKG5vZGUuZW50cnkuY29udGVudCAmJiBub2RlLmVudHJ5LmNvbnRlbnQubWltZVR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiAnU0VBUkNILklDT05TLicgKyB0aGlzLmFsZnJlc2NvVGh1bWJuYWlsU2VydmljZS5nZXRNaW1lVHlwZUtleShub2RlLmVudHJ5LmNvbnRlbnQubWltZVR5cGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9jdXNSZXN1bHQoKTogdm9pZCB7XG4gICAgICAgIGxldCBmaXJzdFJlc3VsdDogYW55ID0gdGhpcy5yZXN1bHRzVGFibGVCb2R5Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcigndHInKTtcbiAgICAgICAgZmlyc3RSZXN1bHQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBvbkl0ZW1DbGljayhub2RlOiBNaW5pbWFsTm9kZUVudGl0eSk6IHZvaWQge1xuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmVudHJ5KSB7XG4gICAgICAgICAgICB0aGlzLmZpbGVTZWxlY3QuZW1pdChub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUm93Rm9jdXMoJGV2ZW50OiBGb2N1c0V2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoRm9jdXMuZW1pdCgkZXZlbnQpO1xuICAgIH1cblxuICAgIG9uUm93Qmx1cigkZXZlbnQ6IEZvY3VzRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWFyY2hGb2N1cy5lbWl0KCRldmVudCk7XG4gICAgfVxuXG4gICAgb25Sb3dFbnRlcihub2RlOiBNaW5pbWFsTm9kZUVudGl0eSk6IHZvaWQge1xuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmVudHJ5KSB7XG4gICAgICAgICAgICBpZiAobm9kZS5lbnRyeS5pc0ZpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVTZWxlY3QuZW1pdChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TmV4dEVsZW1lbnRTaWJsaW5nKG5vZGU6IEVsZW1lbnQpOiBFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIG5vZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UHJldmlvdXNFbGVtZW50U2libGluZyhub2RlOiBFbGVtZW50KTogRWxlbWVudCB7XG4gICAgICAgIHJldHVybiBub2RlLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgfVxuXG4gICAgb25Sb3dBcnJvd0Rvd24oJGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGxldCBuZXh0RWxlbWVudDogYW55ID0gdGhpcy5nZXROZXh0RWxlbWVudFNpYmxpbmcoPEVsZW1lbnQ+ICRldmVudC50YXJnZXQpO1xuICAgICAgICBpZiAobmV4dEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG5leHRFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblJvd0Fycm93VXAoJGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGxldCBwcmV2aW91c0VsZW1lbnQ6IGFueSA9IHRoaXMuZ2V0UHJldmlvdXNFbGVtZW50U2libGluZyg8RWxlbWVudD4gJGV2ZW50LnRhcmdldCk7XG4gICAgICAgIGlmIChwcmV2aW91c0VsZW1lbnQpIHtcbiAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxCYWNrLmVtaXQoJGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUm93RXNjYXBlKCRldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNhbmNlbC5lbWl0KCRldmVudCk7XG4gICAgfVxuXG59XG4iXX0=

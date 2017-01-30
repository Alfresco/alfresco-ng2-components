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
var router_1 = require("@angular/router");
var alfresco_search_service_1 = require("./../services/alfresco-search.service");
var alfresco_thumbnail_service_1 = require("./../services/alfresco-thumbnail.service");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var AlfrescoSearchComponent = AlfrescoSearchComponent_1 = (function () {
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
        }
        else {
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
        }
        else if (node.entry.isFolder) {
            return this.baseComponentPath + "/../assets/images/ft_ic_folder.svg";
        }
    };
    AlfrescoSearchComponent.prototype.resolveIconPath = function (icon) {
        return this.baseComponentPath + "/../assets/images/" + icon;
    };
    AlfrescoSearchComponent.prototype.getMimeTypeKey = function (node) {
        if (node.entry.content && node.entry.content.mimeType) {
            return 'SEARCH.ICONS.' + this._alfrescoThumbnailService.getMimeTypeKey(node.entry.content.mimeType);
        }
        else {
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
            this.alfrescoSearchService
                .getNodeQueryResults(searchTerm, searchOpts)
                .subscribe(function (results) {
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
}());
AlfrescoSearchComponent.SINGLE_CLICK_NAVIGATION = 'click';
AlfrescoSearchComponent.DOUBLE_CLICK_NAVIGATION = 'dblclick';
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchComponent.prototype, "searchTerm", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], AlfrescoSearchComponent.prototype, "maxResults", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchComponent.prototype, "resultSort", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchComponent.prototype, "rootNodeId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchComponent.prototype, "resultType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchComponent.prototype, "navigationMode", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], AlfrescoSearchComponent.prototype, "navigate", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AlfrescoSearchComponent.prototype, "resultsLoad", void 0);
AlfrescoSearchComponent = AlfrescoSearchComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-search',
        styles: [":host .mdl-data-table caption {     margin: 0 0 16px 0;     text-align: left; } :host .mdl-data-table td {     white-space: nowrap; } :host .mdl-data-table td.col-mimetype-icon {     width: 24px; } :host .col-display-name {     min-width: 250px;     overflow: hidden;     text-overflow: ellipsis; }"],
        template: "<table data-automation-id=\"search_result_table\" *ngIf=\"results && results.length && searchTerm\" class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width\">     <caption data-automation-id=\"search_result_found\">{{ 'SEARCH.RESULTS.SUMMARY' | translate:{numResults: results.length, searchTerm: searchTerm} }}</caption>     <thead>     <tr>         <td class=\"mdl-data-table__cell--non-numeric col-mimetype-icon\"></td>         <th class=\"mdl-data-table__cell--non-numeric col-display-name\">             {{'SEARCH.RESULTS.COLUMNS.NAME' | translate}}         </th>         <th class=\"mdl-data-table__cell--non-numeric col-modified-by\">             {{'SEARCH.RESULTS.COLUMNS.MODIFIED_BY' | translate}}         </th>         <th class=\"mdl-data-table__cell--non-numeric col-modified-at\">             {{'SEARCH.RESULTS.COLUMNS.MODIFIED_AT' | translate}}         </th>     </tr>     </thead>     <tbody>      <tr  id=\"result_row_{{idx}}\" tabindex=\"0\" *ngFor=\"let result of results; let idx = index\" (click)=\"onItemClick(result, $event)\" (dblclick)=\"onItemDblClick(result, $event)\" (keyup.enter)=\"onItemClick(result, $event)\">         <td class=\"col-mimetype-icon\"><img src=\"{{getMimeTypeIcon(result)}}\" alt=\"{{getMimeTypeKey(result)|translate}}\" /></td>         <td id=\"result_name_{{idx}}\" class=\"mdl-data-table__cell--non-numeric col-display-name\"             attr.data-automation-id=file_{{result.entry.name}} >{{result.entry.name}}</td>         <td id=\"result_user_{{idx}}\" class=\"mdl-data-table__cell--non-numeric  col-modified-by\"             attr.data-automation-id=file_{{result.entry.name}}_{{result.entry.modifiedByUser.displayName}}>{{result.entry.modifiedByUser.displayName}}</td>         <td class=\"col-modified-at\">{{result.entry.modifiedAt | date}}</td>     </tr>      </tbody> </table> <table id=\"search_no_result\" data-automation-id=\"search_no_result_found\" *ngIf=\"results && results.length === 0\"        class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width\">     <tbody>     <tr>         <td class=\"mdl-data-table__cell--non-numeric\">{{ 'SEARCH.RESULTS.NONE' | translate:{searchTerm: searchTerm} }}</td>     </tr>     </tbody> </table> <p data-automation-id=\"search_error_message\" *ngIf=\"errorMessage\">{{ 'SEARCH.RESULTS.ERROR' | translate:{errorMessage: errorMessage} }}</p>"
    }),
    __param(3, core_1.Optional()),
    __metadata("design:paramtypes", [alfresco_search_service_1.AlfrescoSearchService,
        ng2_alfresco_core_1.AlfrescoTranslationService,
        alfresco_thumbnail_service_1.AlfrescoThumbnailService,
        router_1.ActivatedRoute])
], AlfrescoSearchComponent);
exports.AlfrescoSearchComponent = AlfrescoSearchComponent;
var AlfrescoSearchComponent_1;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYWxmcmVzY28tc2VhcmNoLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQW1IO0FBQ25ILDBDQUF5RDtBQUN6RCxpRkFBNkY7QUFDN0YsdUZBQW9GO0FBQ3BGLHVEQUErRDtBQVMvRCxJQUFhLHVCQUF1QjtJQXFDaEMsaUNBQW9CLHFCQUE0QyxFQUM1QyxTQUFxQyxFQUNyQyx5QkFBbUQsRUFDdkMsS0FBcUI7UUFIakMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxjQUFTLEdBQVQsU0FBUyxDQUE0QjtRQUNyQyw4QkFBeUIsR0FBekIseUJBQXlCLENBQTBCO1FBQ3ZDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBbENyRCxlQUFVLEdBQVcsRUFBRSxDQUFDO1FBR3hCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFHeEIsZUFBVSxHQUFXLElBQUksQ0FBQztRQUcxQixlQUFVLEdBQVcsUUFBUSxDQUFDO1FBRzlCLGVBQVUsR0FBVyxJQUFJLENBQUM7UUFHMUIsbUJBQWMsR0FBVyx5QkFBdUIsQ0FBQyx1QkFBdUIsQ0FBQztRQUd6RSxhQUFRLEdBQW9DLElBQUksbUJBQVksRUFBcUIsQ0FBQztRQUdsRixnQkFBVyxHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBRWpDLFlBQU8sR0FBUSxJQUFJLENBQUM7UUFJcEIsbUJBQWMsR0FBRyxHQUFHLENBQUM7UUFFckIsc0JBQWlCLEdBQVcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsMENBQTBDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFNOUYsQ0FBQztJQUVELDBDQUFRLEdBQVI7UUFBQSxpQkFZQztRQVhHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLHFC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QUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUwsOEJBQUM7QUFBRCxDQTdJQSxBQTZJQyxJQUFBO0FBM0lVLCtDQUF1QixHQUFXLE9BQU8sQ0FBQztBQUMxQywrQ0FBdUIsR0FBVyxVQUFVLENBQUM7QUFHcEQ7SUFEQyxZQUFLLEVBQUU7OzJEQUNnQjtBQUd4QjtJQURDLFlBQUssRUFBRTs7MkRBQ2dCO0FBR3hCO0lBREMsWUFBSyxFQUFFOzsyREFDa0I7QUFHMUI7SUFEQyxZQUFLLEVBQUU7OzJEQUNzQjtBQUc5QjtJQURDLFlBQUssRUFBRTs7MkRBQ2tCO0FBRzFCO0lBREMsWUFBSyxFQUFFOzsrREFDaUU7QUFHekU7SUFEQyxhQUFNLEVBQUU7OEJBQ0MsbUJBQVk7eURBQTREO0FBR2xGO0lBREMsYUFBTSxFQUFFOzs0REFDd0I7QUEzQnhCLHVCQUF1QjtJQU5uQyxnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFFBQVEsRUFBRSxpQkFBaUI7UUFDM0IsTUFBTSxFQUFFLENBQUMsNFNBQTRTLENBQUM7UUFDdFQsUUFBUSxFQUFFLDh6RUFBOHpFO0tBQzMwRSxDQUFDO0lBeUNlLFdBQUEsZUFBUSxFQUFFLENBQUE7cUNBSG9CLCtDQUFxQjtRQUNqQyw4Q0FBMEI7UUFDVixxREFBd0I7UUFDaEMsdUJBQWM7R0F4QzVDLHVCQUF1QixDQTZJbkM7QUE3SVksMERBQXVCIiwiZmlsZSI6ImNvbXBvbmVudHMvYWxmcmVzY28tc2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0LCBPcHRpb25hbCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQWxmcmVzY29TZWFyY2hTZXJ2aWNlLCBTZWFyY2hPcHRpb25zIH0gZnJvbSAnLi8uLi9zZXJ2aWNlcy9hbGZyZXNjby1zZWFyY2guc2VydmljZSc7XG5pbXBvcnQgeyBBbGZyZXNjb1RodW1ibmFpbFNlcnZpY2UgfSBmcm9tICcuLy4uL3NlcnZpY2VzL2FsZnJlc2NvLXRodW1ibmFpbC5zZXJ2aWNlJztcbmltcG9ydCB7IEFsZnJlc2NvVHJhbnNsYXRpb25TZXJ2aWNlIH0gZnJvbSAnbmcyLWFsZnJlc2NvLWNvcmUnO1xuaW1wb3J0IHsgTWluaW1hbE5vZGVFbnRpdHkgfSBmcm9tICdhbGZyZXNjby1qcy1hcGknO1xuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHNlbGVjdG9yOiAnYWxmcmVzY28tc2VhcmNoJyxcbiAgICBzdHlsZXM6IFtcIjpob3N0IC5tZGwtZGF0YS10YWJsZSBjYXB0aW9uIHsgICAgIG1hcmdpbjogMCAwIDE2cHggMDsgICAgIHRleHQtYWxpZ246IGxlZnQ7IH0gOmhvc3QgLm1kbC1kYXRhLXRhYmxlIHRkIHsgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7IH0gOmhvc3QgLm1kbC1kYXRhLXRhYmxlIHRkLmNvbC1taW1ldHlwZS1pY29uIHsgICAgIHdpZHRoOiAyNHB4OyB9IDpob3N0IC5jb2wtZGlzcGxheS1uYW1lIHsgICAgIG1pbi13aWR0aDogMjUwcHg7ICAgICBvdmVyZmxvdzogaGlkZGVuOyAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7IH1cIl0sXG4gICAgdGVtcGxhdGU6IFwiPHRhYmxlIGRhdGEtYXV0b21hdGlvbi1pZD1cXFwic2VhcmNoX3Jlc3VsdF90YWJsZVxcXCIgKm5nSWY9XFxcInJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggJiYgc2VhcmNoVGVybVxcXCIgY2xhc3M9XFxcIm1kbC1kYXRhLXRhYmxlIG1kbC1qcy1kYXRhLXRhYmxlIG1kbC1zaGFkb3ctLTJkcCBmdWxsLXdpZHRoXFxcIj4gICAgIDxjYXB0aW9uIGRhdGEtYXV0b21hdGlvbi1pZD1cXFwic2VhcmNoX3Jlc3VsdF9mb3VuZFxcXCI+e3sgJ1NFQVJDSC5SRVNVTFRTLlNVTU1BUlknIHwgdHJhbnNsYXRlOntudW1SZXN1bHRzOiByZXN1bHRzLmxlbmd0aCwgc2VhcmNoVGVybTogc2VhcmNoVGVybX0gfX08L2NhcHRpb24+ICAgICA8dGhlYWQ+ICAgICA8dHI+ICAgICAgICAgPHRkIGNsYXNzPVxcXCJtZGwtZGF0YS10YWJsZV9fY2VsbC0tbm9uLW51bWVyaWMgY29sLW1pbWV0eXBlLWljb25cXFwiPjwvdGQ+ICAgICAgICAgPHRoIGNsYXNzPVxcXCJtZGwtZGF0YS10YWJsZV9fY2VsbC0tbm9uLW51bWVyaWMgY29sLWRpc3BsYXktbmFtZVxcXCI+ICAgICAgICAgICAgIHt7J1NFQVJDSC5SRVNVTFRTLkNPTFVNTlMuTkFNRScgfCB0cmFuc2xhdGV9fSAgICAgICAgIDwvdGg+ICAgICAgICAgPHRoIGNsYXNzPVxcXCJtZGwtZGF0YS10YWJsZV9fY2VsbC0tbm9uLW51bWVyaWMgY29sLW1vZGlmaWVkLWJ5XFxcIj4gICAgICAgICAgICAge3snU0VBUkNILlJFU1VMVFMuQ09MVU1OUy5NT0RJRklFRF9CWScgfCB0cmFuc2xhdGV9fSAgICAgICAgIDwvdGg+ICAgICAgICAgPHRoIGNsYXNzPVxcXCJtZGwtZGF0YS10YWJsZV9fY2VsbC0tbm9uLW51bWVyaWMgY29sLW1vZGlmaWVkLWF0XFxcIj4gICAgICAgICAgICAge3snU0VBUkNILlJFU1VMVFMuQ09MVU1OUy5NT0RJRklFRF9BVCcgfCB0cmFuc2xhdGV9fSAgICAgICAgIDwvdGg+ICAgICA8L3RyPiAgICAgPC90aGVhZD4gICAgIDx0Ym9keT4gICAgICA8dHIgIGlkPVxcXCJyZXN1bHRfcm93X3t7aWR4fX1cXFwiIHRhYmluZGV4PVxcXCIwXFxcIiAqbmdGb3I9XFxcImxldCByZXN1bHQgb2YgcmVzdWx0czsgbGV0IGlkeCA9IGluZGV4XFxcIiAoY2xpY2spPVxcXCJvbkl0ZW1DbGljayhyZXN1bHQsICRldmVudClcXFwiIChkYmxjbGljayk9XFxcIm9uSXRlbURibENsaWNrKHJlc3VsdCwgJGV2ZW50KVxcXCIgKGtleXVwLmVudGVyKT1cXFwib25JdGVtQ2xpY2socmVzdWx0LCAkZXZlbnQpXFxcIj4gICAgICAgICA8dGQgY2xhc3M9XFxcImNvbC1taW1ldHlwZS1pY29uXFxcIj48aW1nIHNyYz1cXFwie3tnZXRNaW1lVHlwZUljb24ocmVzdWx0KX19XFxcIiBhbHQ9XFxcInt7Z2V0TWltZVR5cGVLZXkocmVzdWx0KXx0cmFuc2xhdGV9fVxcXCIgLz48L3RkPiAgICAgICAgIDx0ZCBpZD1cXFwicmVzdWx0X25hbWVfe3tpZHh9fVxcXCIgY2xhc3M9XFxcIm1kbC1kYXRhLXRhYmxlX19jZWxsLS1ub24tbnVtZXJpYyBjb2wtZGlzcGxheS1uYW1lXFxcIiAgICAgICAgICAgICBhdHRyLmRhdGEtYXV0b21hdGlvbi1pZD1maWxlX3t7cmVzdWx0LmVudHJ5Lm5hbWV9fSA+e3tyZXN1bHQuZW50cnkubmFtZX19PC90ZD4gICAgICAgICA8dGQgaWQ9XFxcInJlc3VsdF91c2VyX3t7aWR4fX1cXFwiIGNsYXNzPVxcXCJtZGwtZGF0YS10YWJsZV9fY2VsbC0tbm9uLW51bWVyaWMgIGNvbC1tb2RpZmllZC1ieVxcXCIgICAgICAgICAgICAgYXR0ci5kYXRhLWF1dG9tYXRpb24taWQ9ZmlsZV97e3Jlc3VsdC5lbnRyeS5uYW1lfX1fe3tyZXN1bHQuZW50cnkubW9kaWZpZWRCeVVzZXIuZGlzcGxheU5hbWV9fT57e3Jlc3VsdC5lbnRyeS5tb2RpZmllZEJ5VXNlci5kaXNwbGF5TmFtZX19PC90ZD4gICAgICAgICA8dGQgY2xhc3M9XFxcImNvbC1tb2RpZmllZC1hdFxcXCI+e3tyZXN1bHQuZW50cnkubW9kaWZpZWRBdCB8IGRhdGV9fTwvdGQ+ICAgICA8L3RyPiAgICAgIDwvdGJvZHk+IDwvdGFibGU+IDx0YWJsZSBpZD1cXFwic2VhcmNoX25vX3Jlc3VsdFxcXCIgZGF0YS1hdXRvbWF0aW9uLWlkPVxcXCJzZWFyY2hfbm9fcmVzdWx0X2ZvdW5kXFxcIiAqbmdJZj1cXFwicmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA9PT0gMFxcXCIgICAgICAgIGNsYXNzPVxcXCJtZGwtZGF0YS10YWJsZSBtZGwtanMtZGF0YS10YWJsZSBtZGwtc2hhZG93LS0yZHAgZnVsbC13aWR0aFxcXCI+ICAgICA8dGJvZHk+ICAgICA8dHI+ICAgICAgICAgPHRkIGNsYXNzPVxcXCJtZGwtZGF0YS10YWJsZV9fY2VsbC0tbm9uLW51bWVyaWNcXFwiPnt7ICdTRUFSQ0guUkVTVUxUUy5OT05FJyB8IHRyYW5zbGF0ZTp7c2VhcmNoVGVybTogc2VhcmNoVGVybX0gfX08L3RkPiAgICAgPC90cj4gICAgIDwvdGJvZHk+IDwvdGFibGU+IDxwIGRhdGEtYXV0b21hdGlvbi1pZD1cXFwic2VhcmNoX2Vycm9yX21lc3NhZ2VcXFwiICpuZ0lmPVxcXCJlcnJvck1lc3NhZ2VcXFwiPnt7ICdTRUFSQ0guUkVTVUxUUy5FUlJPUicgfCB0cmFuc2xhdGU6e2Vycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlfSB9fTwvcD5cIlxufSlcbmV4cG9ydCBjbGFzcyBBbGZyZXNjb1NlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0IHtcblxuICAgIHN0YXRpYyBTSU5HTEVfQ0xJQ0tfTkFWSUdBVElPTjogc3RyaW5nID0gJ2NsaWNrJztcbiAgICBzdGF0aWMgRE9VQkxFX0NMSUNLX05BVklHQVRJT046IHN0cmluZyA9ICdkYmxjbGljayc7XG5cbiAgICBASW5wdXQoKVxuICAgIHNlYXJjaFRlcm06IHN0cmluZyA9ICcnO1xuXG4gICAgQElucHV0KClcbiAgICBtYXhSZXN1bHRzOiBudW1iZXIgPSAyMDtcblxuICAgIEBJbnB1dCgpXG4gICAgcmVzdWx0U29ydDogc3RyaW5nID0gbnVsbDtcblxuICAgIEBJbnB1dCgpXG4gICAgcm9vdE5vZGVJZDogc3RyaW5nID0gJy1yb290LSc7XG5cbiAgICBASW5wdXQoKVxuICAgIHJlc3VsdFR5cGU6IHN0cmluZyA9IG51bGw7XG5cbiAgICBASW5wdXQoKVxuICAgIG5hdmlnYXRpb25Nb2RlOiBzdHJpbmcgPSBBbGZyZXNjb1NlYXJjaENvbXBvbmVudC5ET1VCTEVfQ0xJQ0tfTkFWSUdBVElPTjsgLy8gY2xpY2t8ZGJsY2xpY2tcblxuICAgIEBPdXRwdXQoKVxuICAgIG5hdmlnYXRlOiBFdmVudEVtaXR0ZXI8TWluaW1hbE5vZGVFbnRpdHk+ID0gbmV3IEV2ZW50RW1pdHRlcjxNaW5pbWFsTm9kZUVudGl0eT4oKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHJlc3VsdHNMb2FkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgcmVzdWx0czogYW55ID0gbnVsbDtcblxuICAgIGVycm9yTWVzc2FnZTtcblxuICAgIHF1ZXJ5UGFyYW1OYW1lID0gJ3EnO1xuXG4gICAgYmFzZUNvbXBvbmVudFBhdGg6IHN0cmluZyA9IG1vZHVsZS5pZC5yZXBsYWNlKCcvY29tcG9uZW50cy9hbGZyZXNjby1zZWFyY2guY29tcG9uZW50LmpzJywgJycpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhbGZyZXNjb1NlYXJjaFNlcnZpY2U6IEFsZnJlc2NvU2VhcmNoU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHRyYW5zbGF0ZTogQWxmcmVzY29UcmFuc2xhdGlvblNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBfYWxmcmVzY29UaHVtYm5haWxTZXJ2aWNlOiBBbGZyZXNjb1RodW1ibmFpbFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNsYXRlICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRyYW5zbGF0ZS5hZGRUcmFuc2xhdGlvbkZvbGRlcignbmcyLWFsZnJlc2NvLXNlYXJjaCcsICdub2RlX21vZHVsZXMvbmcyLWFsZnJlc2NvLXNlYXJjaC9zcmMnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZS5wYXJhbXMuZm9yRWFjaCgocGFyYW1zOiBQYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaFRlcm0gPSBwYXJhbXMuaGFzT3duUHJvcGVydHkodGhpcy5xdWVyeVBhcmFtTmFtZSkgPyBwYXJhbXNbdGhpcy5xdWVyeVBhcmFtTmFtZV0gOiBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheVNlYXJjaFJlc3VsdHModGhpcy5zZWFyY2hUZXJtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5U2VhcmNoUmVzdWx0cyh0aGlzLnNlYXJjaFRlcm0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBpZiAoY2hhbmdlc1snc2VhcmNoVGVybSddKSB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaFRlcm0gPSBjaGFuZ2VzWydzZWFyY2hUZXJtJ10uY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5U2VhcmNoUmVzdWx0cyh0aGlzLnNlYXJjaFRlcm0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aHVtYm5haWwgVVJMIGZvciB0aGUgZ2l2ZW4gZG9jdW1lbnQgbm9kZS5cbiAgICAgKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGdldCBVUkwgZm9yLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFVSTCBhZGRyZXNzLlxuICAgICAqL1xuICAgIGdldE1pbWVUeXBlSWNvbihub2RlOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAobm9kZS5lbnRyeS5jb250ZW50ICYmIG5vZGUuZW50cnkuY29udGVudC5taW1lVHlwZSkge1xuICAgICAgICAgICAgbGV0IGljb24gPSB0aGlzLl9hbGZyZXNjb1RodW1ibmFpbFNlcnZpY2UuZ2V0TWltZVR5cGVJY29uKG5vZGUuZW50cnkuY29udGVudC5taW1lVHlwZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlSWNvblBhdGgoaWNvbik7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5lbnRyeS5pc0ZvbGRlcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuYmFzZUNvbXBvbmVudFBhdGh9Ly4uL2Fzc2V0cy9pbWFnZXMvZnRfaWNfZm9sZGVyLnN2Z2A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc29sdmVJY29uUGF0aChpY29uOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5iYXNlQ29tcG9uZW50UGF0aH0vLi4vYXNzZXRzL2ltYWdlcy8ke2ljb259YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRodW1ibmFpbCBtZXNzYWdlIGtleSBmb3IgdGhlIGdpdmVuIGRvY3VtZW50IG5vZGUsIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGxvb2sgdXAgYWx0IHRleHRcbiAgICAgKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGdldCBVUkwgZm9yLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFVSTCBhZGRyZXNzLlxuICAgICAqL1xuICAgIGdldE1pbWVUeXBlS2V5KG5vZGU6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChub2RlLmVudHJ5LmNvbnRlbnQgJiYgbm9kZS5lbnRyeS5jb250ZW50Lm1pbWVUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1NFQVJDSC5JQ09OUy4nICsgdGhpcy5fYWxmcmVzY29UaHVtYm5haWxTZXJ2aWNlLmdldE1pbWVUeXBlS2V5KG5vZGUuZW50cnkuY29udGVudC5taW1lVHlwZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkcyBhbmQgZGlzcGxheXMgc2VhcmNoIHJlc3VsdHNcbiAgICAgKiBAcGFyYW0gc2VhcmNoVGVybSBTZWFyY2ggcXVlcnkgZW50ZXJlZCBieSB1c2VyXG4gICAgICovXG4gICAgcHJpdmF0ZSBkaXNwbGF5U2VhcmNoUmVzdWx0cyhzZWFyY2hUZXJtKTogdm9pZCB7XG4gICAgICAgIGlmIChzZWFyY2hUZXJtICYmIHRoaXMuYWxmcmVzY29TZWFyY2hTZXJ2aWNlKSB7XG4gICAgICAgICAgICBsZXQgc2VhcmNoT3B0czogU2VhcmNoT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBpbmNsdWRlOiBbJ3BhdGgnXSxcbiAgICAgICAgICAgICAgICByb290Tm9kZUlkOiB0aGlzLnJvb3ROb2RlSWQsXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6IHRoaXMucmVzdWx0VHlwZSxcbiAgICAgICAgICAgICAgICBtYXhJdGVtczogdGhpcy5tYXhSZXN1bHRzLFxuICAgICAgICAgICAgICAgIG9yZGVyQnk6IHRoaXMucmVzdWx0U29ydFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWxmcmVzY29TZWFyY2hTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLmdldE5vZGVRdWVyeVJlc3VsdHMoc2VhcmNoVGVybSwgc2VhcmNoT3B0cylcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzdWx0cyA9IHJlc3VsdHMubGlzdC5lbnRyaWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bHRzTG9hZC5lbWl0KHRoaXMucmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzdWx0cyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IDxhbnk+ZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdHNMb2FkLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkl0ZW1DbGljayhub2RlLCBldmVudD86IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm5hdmlnYXRlICYmIHRoaXMubmF2aWdhdGlvbk1vZGUgPT09IEFsZnJlc2NvU2VhcmNoQ29tcG9uZW50LlNJTkdMRV9DTElDS19OQVZJR0FUSU9OKSB7XG4gICAgICAgICAgICBpZiAobm9kZSAmJiBub2RlLmVudHJ5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZS5lbWl0KG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25JdGVtRGJsQ2xpY2sobm9kZTogTWluaW1hbE5vZGVFbnRpdHkpIHtcbiAgICAgICAgaWYgKHRoaXMubmF2aWdhdGUgJiYgdGhpcy5uYXZpZ2F0aW9uTW9kZSA9PT0gQWxmcmVzY29TZWFyY2hDb21wb25lbnQuRE9VQkxFX0NMSUNLX05BVklHQVRJT04pIHtcbiAgICAgICAgICAgIGlmIChub2RlICYmIG5vZGUuZW50cnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlLmVtaXQobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==

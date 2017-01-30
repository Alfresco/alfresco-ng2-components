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
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var alfresco_search_autocomplete_component_1 = require("./alfresco-search-autocomplete.component");
var search_term_validator_1 = require("./../forms/search-term-validator");
var Rx_1 = require("rxjs/Rx");
var AlfrescoSearchControlComponent = (function () {
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
        this.searchControl.valueChanges.debounceTime(400).distinctUntilChanged()
            .subscribe(function (value) {
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
        }
        else {
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
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AlfrescoSearchControlComponent.prototype, "searchTerm", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AlfrescoSearchControlComponent.prototype, "inputType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], AlfrescoSearchControlComponent.prototype, "autocomplete", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], AlfrescoSearchControlComponent.prototype, "expandable", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AlfrescoSearchControlComponent.prototype, "searchChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AlfrescoSearchControlComponent.prototype, "searchSubmit", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AlfrescoSearchControlComponent.prototype, "fileSelect", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AlfrescoSearchControlComponent.prototype, "expand", void 0);
__decorate([
    core_1.ViewChild('searchInput', {}),
    __metadata("design:type", core_1.ElementRef)
], AlfrescoSearchControlComponent.prototype, "searchInput", void 0);
__decorate([
    core_1.ViewChild(alfresco_search_autocomplete_component_1.AlfrescoSearchAutocompleteComponent),
    __metadata("design:type", alfresco_search_autocomplete_component_1.AlfrescoSearchAutocompleteComponent)
], AlfrescoSearchControlComponent.prototype, "liveSearchComponent", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], AlfrescoSearchControlComponent.prototype, "liveSearchEnabled", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchControlComponent.prototype, "liveSearchTerm", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchControlComponent.prototype, "liveSearchRoot", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchControlComponent.prototype, "liveSearchResultType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlfrescoSearchControlComponent.prototype, "liveSearchResultSort", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], AlfrescoSearchControlComponent.prototype, "liveSearchMaxResults", void 0);
AlfrescoSearchControlComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-search-control',
        template: "<form #f=\"ngForm\" (ngSubmit)=\"onSearch(f.value)\">     <div [class]=\"getTextFieldClassName()\">         <label *ngIf=\"expandable\" class=\"mdl-button mdl-js-button mdl-button--icon\" for=\"searchControl\">             <i mdl-upgrade class=\"material-icons\">search</i>         </label>         <div [class]=\"getTextFieldHolderClassName()\">             <input mdl                    class=\"mdl-textfield__input\"                    [type]=\"inputType\"                    [autocomplete]=\"getAutoComplete()\"                    data-automation-id=\"search_input\"                    #searchInput                    id=\"searchControl\"                    [formControl]=\"searchControl\"                    [(ngModel)]=\"searchTerm\"                    (focus)=\"onFocus($event)\"                    (blur)=\"onBlur($event)\"                    (keyup.escape)=\"onEscape($event)\"                    (keyup.arrowdown)=\"onArrowDown($event)\"                    aria-labelledby=\"searchLabel\">             <label id=\"searchLabel\" class=\"mdl-textfield__label\" for=\"searchControl\">{{'SEARCH.CONTROL.LABEL' | translate}}</label>         </div>     </div> </form> <alfresco-search-autocomplete #autocomplete *ngIf=\"liveSearchEnabled\"                               [searchTerm]=\"liveSearchTerm\"                               [rootNodeId]=\"liveSearchRoot\"                               [resultType]=\"liveSearchResultType\"                               [resultSort]=\"liveSearchResultSort\"                               [maxResults]=\"liveSearchMaxResults\"                               [ngClass]=\"{active: searchActive, valid: searchValid}\"                               (fileSelect)=\"onFileClicked($event)\"                               (searchFocus)=\"onAutoCompleteFocus($event)\"                               (scrollBack)=\"onAutoCompleteReturn($event)\"                               (cancel)=\"onAutoCompleteCancel($event)\"></alfresco-search-autocomplete>",
        styles: [".search-field {     width: 267px; } @media only screen and (max-width: 400px) {     .search-field {         width: 200px;     } } @media only screen and (max-width: 320px) {     .search-field {         width: 160px;     } }"]
    }),
    __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoTranslationService])
], AlfrescoSearchControlComponent);
exports.AlfrescoSearchControlComponent = AlfrescoSearchControlComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYWxmcmVzY28tc2VhcmNoLWNvbnRyb2wuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7Ozs7Ozs7Ozs7QUFFSCx3Q0FBeUQ7QUFDekQsc0NBQWlIO0FBQ2pILHVEQUErRDtBQUMvRCxtR0FBK0Y7QUFDL0YsMEVBQXVFO0FBQ3ZFLDhCQUE4QztBQVE5QyxJQUFhLDhCQUE4QjtJQTBEdkMsd0NBQW9CLFNBQXFDO1FBQXJDLGNBQVMsR0FBVCxTQUFTLENBQTRCO1FBdkR6RCxlQUFVLEdBQUcsRUFBRSxDQUFDO1FBR2hCLGNBQVMsR0FBRyxNQUFNLENBQUM7UUFHbkIsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFHOUIsZUFBVSxHQUFZLElBQUksQ0FBQztRQUczQixpQkFBWSxHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBR2xDLGlCQUFZLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFHbEMsZUFBVSxHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBR2hDLFdBQU0sR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQVc1QixzQkFBaUIsR0FBWSxJQUFJLENBQUM7UUFHbEMsbUJBQWMsR0FBVyxFQUFFLENBQUM7UUFHNUIsbUJBQWMsR0FBVyxRQUFRLENBQUM7UUFHbEMseUJBQW9CLEdBQVcsSUFBSSxDQUFDO1FBR3BDLHlCQUFvQixHQUFXLElBQUksQ0FBQztRQUdwQyx5QkFBb0IsR0FBVyxDQUFDLENBQUM7UUFFakMsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFFckIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFFWixpQkFBWSxHQUFHLElBQUksWUFBTyxFQUFjLENBQUM7UUFJN0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLG1CQUFXLENBQ2hDLElBQUksQ0FBQyxVQUFVLEVBQ2Ysa0JBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxrQkFBVSxDQUFDLFFBQVEsRUFBRSwyQ0FB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QjtJQURDLFlBQUssRUFBRTs7aUVBQ1c7QUFHbkI7SUFEQyxZQUFLLEVBQUU7O29FQUNzQjtBQUc5QjtJQURDLFlBQUssRUFBRTs7a0VBQ21CO0FBRzNCO0lBREMsYUFBTSxFQUFFOztvRUFDeUI7QUFHbEM7SUFEQyxhQUFNLEVBQUU7O29FQUN5QjtBQUdsQztJQURDLGFBQU0sRUFBRTs7a0VBQ3VCO0FBR2hDO0lBREMsYUFBTSxFQUFFOzs4REFDbUI7QUFLNUI7SUFEQyxnQkFBUyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUM7OEJBQ2hCLGlCQUFVO21FQUFDO0FBR3hCO0lBREMsZ0JBQVMsQ0FBQyw0RUFBbUMsQ0FBQzs4QkFDMUIsNEVBQW1DOzJFQUFDO0FBR3pEO0lBREMsWUFBSyxFQUFFOzt5RUFDMEI7QUFHbEM7SUFEQyxZQUFLLEVBQUU7O3NFQUNvQjtBQUc1QjtJQURDLFlBQUssRUFBRTs7c0VBQzBCO0FBR2xDO0lBREMsWUFBSyxFQUFFOzs0RUFDNEI7QUFHcEM7SUFEQyxZQUFLLEVBQUU7OzRFQUM0QjtBQUdwQztJQURDLFlBQUssRUFBRTs7NEVBQ3lCO0FBbER4Qiw4QkFBOEI7SUFOMUMsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixRQUFRLEVBQUUseUJBQXlCO1FBQ25DLFFBQVEsRUFBRSxpOERBQWk4RDtRQUMzOEQsTUFBTSxFQUFFLENBQUMsaU9BQWlPLENBQUM7S0FDOU8sQ0FBQztxQ0EyRGlDLDhDQUEwQjtHQTFEaEQsOEJBQThCLENBeU0xQztBQXpNWSx3RUFBOEIiLCJmaWxlIjoiY29tcG9uZW50cy9hbGZyZXNjby1zZWFyY2gtY29udHJvbC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgT25Jbml0LCBPbkRlc3Ryb3ksIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBbGZyZXNjb1RyYW5zbGF0aW9uU2VydmljZSB9IGZyb20gJ25nMi1hbGZyZXNjby1jb3JlJztcbmltcG9ydCB7IEFsZnJlc2NvU2VhcmNoQXV0b2NvbXBsZXRlQ29tcG9uZW50IH0gZnJvbSAnLi9hbGZyZXNjby1zZWFyY2gtYXV0b2NvbXBsZXRlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWFyY2hUZXJtVmFsaWRhdG9yIH0gZnJvbSAnLi8uLi9mb3Jtcy9zZWFyY2gtdGVybS12YWxpZGF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMvUngnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHNlbGVjdG9yOiAnYWxmcmVzY28tc2VhcmNoLWNvbnRyb2wnLFxuICAgIHRlbXBsYXRlOiBcIjxmb3JtICNmPVxcXCJuZ0Zvcm1cXFwiIChuZ1N1Ym1pdCk9XFxcIm9uU2VhcmNoKGYudmFsdWUpXFxcIj4gICAgIDxkaXYgW2NsYXNzXT1cXFwiZ2V0VGV4dEZpZWxkQ2xhc3NOYW1lKClcXFwiPiAgICAgICAgIDxsYWJlbCAqbmdJZj1cXFwiZXhwYW5kYWJsZVxcXCIgY2xhc3M9XFxcIm1kbC1idXR0b24gbWRsLWpzLWJ1dHRvbiBtZGwtYnV0dG9uLS1pY29uXFxcIiBmb3I9XFxcInNlYXJjaENvbnRyb2xcXFwiPiAgICAgICAgICAgICA8aSBtZGwtdXBncmFkZSBjbGFzcz1cXFwibWF0ZXJpYWwtaWNvbnNcXFwiPnNlYXJjaDwvaT4gICAgICAgICA8L2xhYmVsPiAgICAgICAgIDxkaXYgW2NsYXNzXT1cXFwiZ2V0VGV4dEZpZWxkSG9sZGVyQ2xhc3NOYW1lKClcXFwiPiAgICAgICAgICAgICA8aW5wdXQgbWRsICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwibWRsLXRleHRmaWVsZF9faW5wdXRcXFwiICAgICAgICAgICAgICAgICAgICBbdHlwZV09XFxcImlucHV0VHlwZVxcXCIgICAgICAgICAgICAgICAgICAgIFthdXRvY29tcGxldGVdPVxcXCJnZXRBdXRvQ29tcGxldGUoKVxcXCIgICAgICAgICAgICAgICAgICAgIGRhdGEtYXV0b21hdGlvbi1pZD1cXFwic2VhcmNoX2lucHV0XFxcIiAgICAgICAgICAgICAgICAgICAgI3NlYXJjaElucHV0ICAgICAgICAgICAgICAgICAgICBpZD1cXFwic2VhcmNoQ29udHJvbFxcXCIgICAgICAgICAgICAgICAgICAgIFtmb3JtQ29udHJvbF09XFxcInNlYXJjaENvbnRyb2xcXFwiICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwic2VhcmNoVGVybVxcXCIgICAgICAgICAgICAgICAgICAgIChmb2N1cyk9XFxcIm9uRm9jdXMoJGV2ZW50KVxcXCIgICAgICAgICAgICAgICAgICAgIChibHVyKT1cXFwib25CbHVyKCRldmVudClcXFwiICAgICAgICAgICAgICAgICAgICAoa2V5dXAuZXNjYXBlKT1cXFwib25Fc2NhcGUoJGV2ZW50KVxcXCIgICAgICAgICAgICAgICAgICAgIChrZXl1cC5hcnJvd2Rvd24pPVxcXCJvbkFycm93RG93bigkZXZlbnQpXFxcIiAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbGxlZGJ5PVxcXCJzZWFyY2hMYWJlbFxcXCI+ICAgICAgICAgICAgIDxsYWJlbCBpZD1cXFwic2VhcmNoTGFiZWxcXFwiIGNsYXNzPVxcXCJtZGwtdGV4dGZpZWxkX19sYWJlbFxcXCIgZm9yPVxcXCJzZWFyY2hDb250cm9sXFxcIj57eydTRUFSQ0guQ09OVFJPTC5MQUJFTCcgfCB0cmFuc2xhdGV9fTwvbGFiZWw+ICAgICAgICAgPC9kaXY+ICAgICA8L2Rpdj4gPC9mb3JtPiA8YWxmcmVzY28tc2VhcmNoLWF1dG9jb21wbGV0ZSAjYXV0b2NvbXBsZXRlICpuZ0lmPVxcXCJsaXZlU2VhcmNoRW5hYmxlZFxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NlYXJjaFRlcm1dPVxcXCJsaXZlU2VhcmNoVGVybVxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Jvb3ROb2RlSWRdPVxcXCJsaXZlU2VhcmNoUm9vdFxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Jlc3VsdFR5cGVdPVxcXCJsaXZlU2VhcmNoUmVzdWx0VHlwZVxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Jlc3VsdFNvcnRdPVxcXCJsaXZlU2VhcmNoUmVzdWx0U29ydFxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW21heFJlc3VsdHNdPVxcXCJsaXZlU2VhcmNoTWF4UmVzdWx0c1xcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVxcXCJ7YWN0aXZlOiBzZWFyY2hBY3RpdmUsIHZhbGlkOiBzZWFyY2hWYWxpZH1cXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmaWxlU2VsZWN0KT1cXFwib25GaWxlQ2xpY2tlZCgkZXZlbnQpXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2VhcmNoRm9jdXMpPVxcXCJvbkF1dG9Db21wbGV0ZUZvY3VzKCRldmVudClcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzY3JvbGxCYWNrKT1cXFwib25BdXRvQ29tcGxldGVSZXR1cm4oJGV2ZW50KVxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNhbmNlbCk9XFxcIm9uQXV0b0NvbXBsZXRlQ2FuY2VsKCRldmVudClcXFwiPjwvYWxmcmVzY28tc2VhcmNoLWF1dG9jb21wbGV0ZT5cIixcbiAgICBzdHlsZXM6IFtcIi5zZWFyY2gtZmllbGQgeyAgICAgd2lkdGg6IDI2N3B4OyB9IEBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDAwcHgpIHsgICAgIC5zZWFyY2gtZmllbGQgeyAgICAgICAgIHdpZHRoOiAyMDBweDsgICAgIH0gfSBAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDMyMHB4KSB7ICAgICAuc2VhcmNoLWZpZWxkIHsgICAgICAgICB3aWR0aDogMTYwcHg7ICAgICB9IH1cIl1cbn0pXG5leHBvcnQgY2xhc3MgQWxmcmVzY29TZWFyY2hDb250cm9sQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KClcbiAgICBzZWFyY2hUZXJtID0gJyc7XG5cbiAgICBASW5wdXQoKVxuICAgIGlucHV0VHlwZSA9ICd0ZXh0JztcblxuICAgIEBJbnB1dCgpXG4gICAgYXV0b2NvbXBsZXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKVxuICAgIGV4cGFuZGFibGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQE91dHB1dCgpXG4gICAgc2VhcmNoQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpXG4gICAgc2VhcmNoU3VibWl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpXG4gICAgZmlsZVNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIGV4cGFuZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIHNlYXJjaENvbnRyb2w6IEZvcm1Db250cm9sO1xuXG4gICAgQFZpZXdDaGlsZCgnc2VhcmNoSW5wdXQnLCB7fSlcbiAgICBzZWFyY2hJbnB1dDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoQWxmcmVzY29TZWFyY2hBdXRvY29tcGxldGVDb21wb25lbnQpXG4gICAgbGl2ZVNlYXJjaENvbXBvbmVudDogQWxmcmVzY29TZWFyY2hBdXRvY29tcGxldGVDb21wb25lbnQ7XG5cbiAgICBASW5wdXQoKVxuICAgIGxpdmVTZWFyY2hFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpXG4gICAgbGl2ZVNlYXJjaFRlcm06IHN0cmluZyA9ICcnO1xuXG4gICAgQElucHV0KClcbiAgICBsaXZlU2VhcmNoUm9vdDogc3RyaW5nID0gJy1yb290LSc7XG5cbiAgICBASW5wdXQoKVxuICAgIGxpdmVTZWFyY2hSZXN1bHRUeXBlOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgQElucHV0KClcbiAgICBsaXZlU2VhcmNoUmVzdWx0U29ydDogc3RyaW5nID0gbnVsbDtcblxuICAgIEBJbnB1dCgpXG4gICAgbGl2ZVNlYXJjaE1heFJlc3VsdHM6IG51bWJlciA9IDU7XG5cbiAgICBzZWFyY2hBY3RpdmUgPSBmYWxzZTtcblxuICAgIHNlYXJjaFZhbGlkID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIGZvY3VzU3ViamVjdCA9IG5ldyBTdWJqZWN0PEZvY3VzRXZlbnQ+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRyYW5zbGF0ZTogQWxmcmVzY29UcmFuc2xhdGlvblNlcnZpY2UpIHtcblxuICAgICAgICB0aGlzLnNlYXJjaENvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woXG4gICAgICAgICAgICB0aGlzLnNlYXJjaFRlcm0sXG4gICAgICAgICAgICBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFNlYXJjaFRlcm1WYWxpZGF0b3IubWluQWxwaGFudW1lcmljQ2hhcnMoMyldKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlYXJjaENvbnRyb2wudmFsdWVDaGFuZ2VzLmRlYm91bmNlVGltZSg0MDApLmRpc3RpbmN0VW50aWxDaGFuZ2VkKClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2VhcmNoVGVybUNoYW5nZSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5zZXR1cEZvY3VzRXZlbnRIYW5kbGVycygpO1xuXG4gICAgICAgIHRoaXMudHJhbnNsYXRlLmFkZFRyYW5zbGF0aW9uRm9sZGVyKCduZzItYWxmcmVzY28tc2VhcmNoJywgJ25vZGVfbW9kdWxlcy9uZzItYWxmcmVzY28tc2VhcmNoL3NyYycpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvY3VzU3ViamVjdC51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25TZWFyY2hUZXJtQ2hhbmdlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5saXZlU2VhcmNoVGVybSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnNlYXJjaENvbnRyb2wuc2V0VmFsdWUodmFsdWUsIHRydWUpO1xuICAgICAgICB0aGlzLnNlYXJjaFZhbGlkID0gdGhpcy5zZWFyY2hDb250cm9sLnZhbGlkO1xuICAgICAgICB0aGlzLnNlYXJjaENoYW5nZS5lbWl0KHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZhbGlkOiB0aGlzLnNlYXJjaFZhbGlkXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBGb2N1c0V2ZW50SGFuZGxlcnMoKSB7XG4gICAgICAgIGxldCBmb2N1c0V2ZW50czogT2JzZXJ2YWJsZTxGb2N1c0V2ZW50PiA9IHRoaXMuZm9jdXNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpLmRlYm91bmNlVGltZSg1MCk7XG4gICAgICAgIGZvY3VzRXZlbnRzLmZpbHRlcigoJGV2ZW50OiBGb2N1c0V2ZW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gJGV2ZW50LnR5cGUgPT09ICdmb2N1c2luJyB8fCAkZXZlbnQudHlwZSA9PT0gJ2ZvY3VzJztcbiAgICAgICAgfSkuc3Vic2NyaWJlKCgkZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25TZWFyY2hGb2N1cygkZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9jdXNFdmVudHMuZmlsdGVyKCgkZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICRldmVudC50eXBlID09PSAnZm9jdXNvdXQnIHx8ICRldmVudC50eXBlID09PSAnYmx1cic7XG4gICAgICAgIH0pLnN1YnNjcmliZSgoJGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uU2VhcmNoQmx1cigkZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRUZXh0RmllbGRDbGFzc05hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdtZGwtdGV4dGZpZWxkIG1kbC1qcy10ZXh0ZmllbGQnICsgKHRoaXMuZXhwYW5kYWJsZSA/ICcgbWRsLXRleHRmaWVsZC0tZXhwYW5kYWJsZScgOiAnJyk7XG4gICAgfVxuXG4gICAgZ2V0VGV4dEZpZWxkSG9sZGVyQ2xhc3NOYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4cGFuZGFibGUgPyAnc2VhcmNoLWZpZWxkIG1kbC10ZXh0ZmllbGRfX2V4cGFuZGFibGUtaG9sZGVyJyA6ICdzZWFyY2gtZmllbGQnO1xuICAgIH1cblxuICAgIGdldEF1dG9Db21wbGV0ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRvY29tcGxldGUgPyAnb24nIDogJ29mZic7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGNhbGxlZCBvbiBmb3JtIHN1Ym1pdCwgaS5lLiB3aGVuIHRoZSB1c2VyIGhhcyBoaXQgZW50ZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCBTdWJtaXQgZXZlbnQgdGhhdCB3YXMgZmlyZWRcbiAgICAgKi9cbiAgICBvblNlYXJjaChldmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlYXJjaENvbnRyb2wuc2V0VmFsdWUodGhpcy5zZWFyY2hUZXJtLCB0cnVlKTtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoQ29udHJvbC52YWxpZCkge1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hTdWJtaXQuZW1pdCh7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuc2VhcmNoVGVybVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNBdXRvQ29tcGxldGVEaXNwbGF5ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlYXJjaEFjdGl2ZTtcbiAgICB9XG5cbiAgICBzZXRBdXRvQ29tcGxldGVEaXNwbGF5ZWQoZGlzcGxheTogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLnNlYXJjaEFjdGl2ZSA9IGRpc3BsYXk7XG4gICAgfVxuXG4gICAgb25GaWxlQ2xpY2tlZChldmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldEF1dG9Db21wbGV0ZURpc3BsYXllZChmYWxzZSk7XG4gICAgICAgIHRoaXMuZmlsZVNlbGVjdC5lbWl0KGV2ZW50KTtcbiAgICB9XG5cbiAgICBvblNlYXJjaEZvY3VzKCRldmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldEF1dG9Db21wbGV0ZURpc3BsYXllZCh0cnVlKTtcbiAgICB9XG5cbiAgICBvblNlYXJjaEJsdXIoJGV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0QXV0b0NvbXBsZXRlRGlzcGxheWVkKGZhbHNlKTtcbiAgICB9XG5cbiAgICBvbkZvY3VzKCRldmVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5leHBhbmRhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmV4cGFuZC5lbWl0KHtcbiAgICAgICAgICAgICAgICBleHBhbmRlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mb2N1c1N1YmplY3QubmV4dCgkZXZlbnQpO1xuICAgIH1cblxuICAgIG9uQmx1cigkZXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZXhwYW5kYWJsZSAmJiAodGhpcy5zZWFyY2hDb250cm9sLnZhbHVlID09PSAnJyB8fCB0aGlzLnNlYXJjaENvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kLmVtaXQoe1xuICAgICAgICAgICAgICAgIGV4cGFuZGVkOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mb2N1c1N1YmplY3QubmV4dCgkZXZlbnQpO1xuICAgIH1cblxuICAgIG9uRXNjYXBlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldEF1dG9Db21wbGV0ZURpc3BsYXllZChmYWxzZSk7XG4gICAgfVxuXG4gICAgb25BcnJvd0Rvd24oKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzQXV0b0NvbXBsZXRlRGlzcGxheWVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMubGl2ZVNlYXJjaENvbXBvbmVudC5mb2N1c1Jlc3VsdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRBdXRvQ29tcGxldGVEaXNwbGF5ZWQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkF1dG9Db21wbGV0ZUZvY3VzKCRldmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvY3VzU3ViamVjdC5uZXh0KCRldmVudCk7XG4gICAgfVxuXG4gICAgb25BdXRvQ29tcGxldGVSZXR1cm4oJGV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaElucHV0KSB7XG4gICAgICAgICAgICAoPGFueT4gdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50KS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25BdXRvQ29tcGxldGVDYW5jZWwoJGV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaElucHV0KSB7XG4gICAgICAgICAgICAoPGFueT4gdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50KS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0QXV0b0NvbXBsZXRlRGlzcGxheWVkKGZhbHNlKTtcbiAgICB9XG5cbn1cbiJdfQ==

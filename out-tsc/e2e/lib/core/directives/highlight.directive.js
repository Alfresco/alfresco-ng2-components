"use strict";
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-input-rename  */
var core_1 = require("@angular/core");
var highlight_transform_service_1 = require("../services/highlight-transform.service");
var HighlightDirective = /** @class */ (function () {
    function HighlightDirective(el, renderer, highlightTransformService) {
        this.el = el;
        this.renderer = renderer;
        this.highlightTransformService = highlightTransformService;
        /** Class selector for highlightable elements. */
        this.selector = '';
        /** Text to highlight. */
        this.search = '';
        /** CSS class used to apply highlighting. */
        this.classToApply = 'adf-highlight';
    }
    HighlightDirective.prototype.ngAfterViewChecked = function () {
        this.highlight();
    };
    HighlightDirective.prototype.highlight = function (search, selector, classToApply) {
        var _this = this;
        if (search === void 0) { search = this.search; }
        if (selector === void 0) { selector = this.selector; }
        if (classToApply === void 0) { classToApply = this.classToApply; }
        if (search && selector) {
            var elements = this.el.nativeElement.querySelectorAll(selector);
            elements.forEach(function (element) {
                var highlightTransformResult = _this.highlightTransformService.highlight(element.innerHTML, search, classToApply);
                if (highlightTransformResult.changed) {
                    _this.renderer.setProperty(element, 'innerHTML', highlightTransformResult.text);
                }
            });
        }
    };
    __decorate([
        core_1.Input('adf-highlight-selector'),
        __metadata("design:type", String)
    ], HighlightDirective.prototype, "selector", void 0);
    __decorate([
        core_1.Input('adf-highlight'),
        __metadata("design:type", String)
    ], HighlightDirective.prototype, "search", void 0);
    __decorate([
        core_1.Input('adf-highlight-class'),
        __metadata("design:type", String)
    ], HighlightDirective.prototype, "classToApply", void 0);
    HighlightDirective = __decorate([
        core_1.Directive({
            selector: '[adf-highlight]'
        }),
        __metadata("design:paramtypes", [core_1.ElementRef,
            core_1.Renderer2,
            highlight_transform_service_1.HighlightTransformService])
    ], HighlightDirective);
    return HighlightDirective;
}());
exports.HighlightDirective = HighlightDirective;
//# sourceMappingURL=highlight.directive.js.map
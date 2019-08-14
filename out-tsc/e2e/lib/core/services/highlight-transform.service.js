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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var HighlightTransformService = /** @class */ (function () {
    function HighlightTransformService() {
    }
    /**
     * Searches for `search` string(s) within `text` and highlights all occurrences.
     * @param text Text to search within
     * @param search Text pattern to search for
     * @param wrapperClass CSS class used to provide highlighting style
     * @returns New text along with boolean value to indicate whether anything was highlighted
     */
    HighlightTransformService.prototype.highlight = function (text, search, wrapperClass) {
        if (wrapperClass === void 0) { wrapperClass = 'adf-highlight'; }
        var isMatching = false, result = text;
        if (search && text) {
            var pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            pattern = pattern.split(' ').filter(function (t) {
                return t.length > 0;
            }).join('|');
            var regex = new RegExp(pattern, 'gi');
            result = text.replace(/<[^>]+>/g, '').replace(regex, function (match) {
                isMatching = true;
                return "<span class=\"" + wrapperClass + "\">" + match + "</span>";
            });
            return { text: result, changed: isMatching };
        }
        else {
            return { text: result, changed: isMatching };
        }
    };
    HighlightTransformService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], HighlightTransformService);
    return HighlightTransformService;
}());
exports.HighlightTransformService = HighlightTransformService;
//# sourceMappingURL=highlight-transform.service.js.map
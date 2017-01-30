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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var alfresco_search_service_1 = require("./src/services/alfresco-search.service");
var alfresco_thumbnail_service_1 = require("./src/services/alfresco-thumbnail.service");
var alfresco_search_component_1 = require("./src/components/alfresco-search.component");
var alfresco_search_control_component_1 = require("./src/components/alfresco-search-control.component");
var alfresco_search_autocomplete_component_1 = require("./src/components/alfresco-search-autocomplete.component");
__export(require("./src/services/alfresco-search.service"));
__export(require("./src/services/alfresco-thumbnail.service"));
__export(require("./src/components/alfresco-search.component"));
__export(require("./src/components/alfresco-search-control.component"));
__export(require("./src/components/alfresco-search-autocomplete.component"));
exports.ALFRESCO_SEARCH_DIRECTIVES = [
    alfresco_search_component_1.AlfrescoSearchComponent,
    alfresco_search_control_component_1.AlfrescoSearchControlComponent,
    alfresco_search_autocomplete_component_1.AlfrescoSearchAutocompleteComponent
];
exports.ALFRESCO_SEARCH_PROVIDERS = [
    alfresco_search_service_1.AlfrescoSearchService,
    alfresco_thumbnail_service_1.AlfrescoThumbnailService
];
var SearchModule = SearchModule_1 = (function () {
    function SearchModule() {
    }
    SearchModule.forRoot = function () {
        return {
            ngModule: SearchModule_1,
            providers: exports.ALFRESCO_SEARCH_PROVIDERS.slice()
        };
    };
    return SearchModule;
}());
SearchModule = SearchModule_1 = __decorate([
    core_1.NgModule({
        imports: [
            ng2_alfresco_core_1.CoreModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule
        ],
        declarations: exports.ALFRESCO_SEARCH_DIRECTIVES.slice(),
        providers: exports.ALFRESCO_SEARCH_PROVIDERS.slice(),
        exports: exports.ALFRESCO_SEARCH_DIRECTIVES.slice()
    }),
    __metadata("design:paramtypes", [])
], SearchModule);
exports.SearchModule = SearchModule;
var SearchModule_1;
//# sourceMappingURL=index.js.map
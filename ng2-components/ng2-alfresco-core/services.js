/**
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
System.register(['./services/AlfrescoSettingsService', './services/AlfrescoTranslationService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AlfrescoSettingsService_1, AlfrescoTranslationService_1;
    var ALFRESCO_CORE_PROVIDERS;
    var exportedNames_1 = {
        'ALFRESCO_CORE_PROVIDERS': true
    };
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default"&& !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (AlfrescoSettingsService_1_1) {
                AlfrescoSettingsService_1 = AlfrescoSettingsService_1_1;
                exportStar_1(AlfrescoSettingsService_1_1);
            },
            function (AlfrescoTranslationService_1_1) {
                AlfrescoTranslationService_1 = AlfrescoTranslationService_1_1;
                exportStar_1(AlfrescoTranslationService_1_1);
            }],
        execute: function() {
            exports_1("default",{
                directives: [],
                providers: [
                    AlfrescoSettingsService_1.AlfrescoSettingsService,
                    AlfrescoTranslationService_1.AlfrescoTranslationLoader
                ]
            });
            exports_1("ALFRESCO_CORE_PROVIDERS", ALFRESCO_CORE_PROVIDERS = [
                AlfrescoSettingsService_1.AlfrescoSettingsService,
                AlfrescoTranslationService_1.AlfrescoTranslationLoader
            ]);
        }
    }
});
//# sourceMappingURL=services.js.map
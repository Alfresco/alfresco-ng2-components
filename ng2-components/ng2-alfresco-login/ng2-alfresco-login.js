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
System.register(['./src/components/alfresco-login.component', './src/services/alfresco-authentication.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var alfresco_login_component_1, alfresco_authentication_service_1;
    var ALFRESCO_LOGIN_DIRECTIVES, ALFRESCO_AUTHENTICATION;
    var exportedNames_1 = {
        'ALFRESCO_LOGIN_DIRECTIVES': true,
        'ALFRESCO_AUTHENTICATION': true
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
            function (alfresco_login_component_1_1) {
                alfresco_login_component_1 = alfresco_login_component_1_1;
                exportStar_1(alfresco_login_component_1_1);
            },
            function (alfresco_authentication_service_1_1) {
                alfresco_authentication_service_1 = alfresco_authentication_service_1_1;
                exportStar_1(alfresco_authentication_service_1_1);
            }],
        execute: function() {
            exports_1("default",{
                directives: [alfresco_login_component_1.AlfrescoLoginComponent],
                providers: [alfresco_authentication_service_1.AlfrescoAuthenticationService]
            });
            exports_1("ALFRESCO_LOGIN_DIRECTIVES", ALFRESCO_LOGIN_DIRECTIVES = [alfresco_login_component_1.AlfrescoLoginComponent]);
            exports_1("ALFRESCO_AUTHENTICATION", ALFRESCO_AUTHENTICATION = [alfresco_authentication_service_1.AlfrescoAuthenticationService]);
        }
    }
});
//# sourceMappingURL=ng2-alfresco-login.js.map
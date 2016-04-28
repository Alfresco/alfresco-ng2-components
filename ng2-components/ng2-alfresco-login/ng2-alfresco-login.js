System.register(['./src/alfresco-login.component', './src/alfresco-authentication.service'], function(exports_1, context_1) {
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
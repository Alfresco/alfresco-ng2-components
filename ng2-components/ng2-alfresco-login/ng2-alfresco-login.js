System.register(['./src/login.component', './src/authentication.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var login_component_1, authentication_service_1;
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
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
                exportStar_1(login_component_1_1);
            },
            function (authentication_service_1_1) {
                authentication_service_1 = authentication_service_1_1;
                exportStar_1(authentication_service_1_1);
            }],
        execute: function() {
            exports_1("default",{
                directives: [login_component_1.Login],
                providers: [authentication_service_1.Authentication]
            });
            exports_1("ALFRESCO_LOGIN_DIRECTIVES", ALFRESCO_LOGIN_DIRECTIVES = [login_component_1.Login]);
            exports_1("ALFRESCO_AUTHENTICATION", ALFRESCO_AUTHENTICATION = [authentication_service_1.Authentication]);
        }
    }
});
//# sourceMappingURL=ng2-alfresco-login.js.map
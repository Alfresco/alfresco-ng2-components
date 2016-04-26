System.register(['./services/AlfrescoSettingsService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AlfrescoSettingsService_1;
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
            }],
        execute: function() {
            exports_1("default",{
                directives: [],
                providers: [AlfrescoSettingsService_1.AlfrescoSettingsService]
            });
            exports_1("ALFRESCO_CORE_PROVIDERS", ALFRESCO_CORE_PROVIDERS = [
                AlfrescoSettingsService_1.AlfrescoSettingsService
            ]);
        }
    }
});
//# sourceMappingURL=services.js.map
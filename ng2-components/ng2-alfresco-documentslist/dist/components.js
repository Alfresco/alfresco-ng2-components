System.register(['./HelloWorld', "./document-list.component.ts", "./alfresco.service.ts"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var HelloWorld_1, document_list_component_ts_1, alfresco_service_ts_1;
    var ALFRESCO_DIRECTIVES, ALFRESCO_PROVIDERS;
    var exportedNames_1 = {
        'ALFRESCO_DIRECTIVES': true,
        'ALFRESCO_PROVIDERS': true
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
            function (HelloWorld_1_1) {
                HelloWorld_1 = HelloWorld_1_1;
                exportStar_1(HelloWorld_1_1);
            },
            function (document_list_component_ts_1_1) {
                document_list_component_ts_1 = document_list_component_ts_1_1;
                exportStar_1(document_list_component_ts_1_1);
            },
            function (alfresco_service_ts_1_1) {
                alfresco_service_ts_1 = alfresco_service_ts_1_1;
                exportStar_1(alfresco_service_ts_1_1);
            }],
        execute: function() {
            exports_1("default",{
                directives: [HelloWorld_1.HelloWorld, document_list_component_ts_1.DocumentList],
                providers: [alfresco_service_ts_1.AlfrescoService]
            });
            exports_1("ALFRESCO_DIRECTIVES", ALFRESCO_DIRECTIVES = [HelloWorld_1.HelloWorld, document_list_component_ts_1.DocumentList]);
            exports_1("ALFRESCO_PROVIDERS", ALFRESCO_PROVIDERS = [alfresco_service_ts_1.AlfrescoService]);
        }
    }
});

//# sourceMappingURL=components.js.map

System.register(['./src/components/document-list', './src/components/document-action', './src/components/document-action-list', './src/components/quick-document-action', './src/components/quick-document-action-list', './src/components/folder-action', './src/components/folder-action-list', './src/components/quick-folder-action', './src/components/quick-folder-action-list', './src/services/folder-actions.service', './src/services/document-actions.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var document_list_1, document_action_1, document_action_list_1, quick_document_action_1, quick_document_action_list_1, folder_action_1, folder_action_list_1, quick_folder_action_1, quick_folder_action_list_1, folder_actions_service_1, document_actions_service_1;
    var DOCUMENT_LIST_DIRECTIVES, DOCUMENT_LIST_PROVIDERS;
    var exportedNames_1 = {
        'DOCUMENT_LIST_DIRECTIVES': true,
        'DOCUMENT_LIST_PROVIDERS': true
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
            function (document_list_1_1) {
                document_list_1 = document_list_1_1;
                exportStar_1(document_list_1_1);
            },
            function (document_action_1_1) {
                document_action_1 = document_action_1_1;
                exportStar_1(document_action_1_1);
            },
            function (document_action_list_1_1) {
                document_action_list_1 = document_action_list_1_1;
                exportStar_1(document_action_list_1_1);
            },
            function (quick_document_action_1_1) {
                quick_document_action_1 = quick_document_action_1_1;
                exportStar_1(quick_document_action_1_1);
            },
            function (quick_document_action_list_1_1) {
                quick_document_action_list_1 = quick_document_action_list_1_1;
                exportStar_1(quick_document_action_list_1_1);
            },
            function (folder_action_1_1) {
                folder_action_1 = folder_action_1_1;
                exportStar_1(folder_action_1_1);
            },
            function (folder_action_list_1_1) {
                folder_action_list_1 = folder_action_list_1_1;
                exportStar_1(folder_action_list_1_1);
            },
            function (quick_folder_action_1_1) {
                quick_folder_action_1 = quick_folder_action_1_1;
                exportStar_1(quick_folder_action_1_1);
            },
            function (quick_folder_action_list_1_1) {
                quick_folder_action_list_1 = quick_folder_action_list_1_1;
                exportStar_1(quick_folder_action_list_1_1);
            },
            function (folder_actions_service_1_1) {
                folder_actions_service_1 = folder_actions_service_1_1;
                exportStar_1(folder_actions_service_1_1);
            },
            function (document_actions_service_1_1) {
                document_actions_service_1 = document_actions_service_1_1;
                exportStar_1(document_actions_service_1_1);
            }],
        execute: function() {
            exports_1("default",{
                directives: [
                    document_list_1.DocumentList,
                    document_action_1.DocumentAction,
                    document_action_list_1.DocumentActionList,
                    quick_document_action_1.QuickDocumentAction,
                    quick_document_action_list_1.QuickDocumentActionList,
                    folder_action_1.FolderAction,
                    folder_action_list_1.FolderActionList,
                    quick_folder_action_1.QuickFolderAction,
                    quick_folder_action_list_1.QuickFolderActionList
                ],
                providers: [
                    folder_actions_service_1.FolderActionsService,
                    document_actions_service_1.DocumentActionsService
                ]
            });
            exports_1("DOCUMENT_LIST_DIRECTIVES", DOCUMENT_LIST_DIRECTIVES = [
                document_list_1.DocumentList,
                document_action_1.DocumentAction,
                document_action_list_1.DocumentActionList,
                quick_document_action_1.QuickDocumentAction,
                quick_document_action_list_1.QuickDocumentActionList,
                folder_action_1.FolderAction,
                folder_action_list_1.FolderActionList,
                quick_folder_action_1.QuickFolderAction,
                quick_folder_action_list_1.QuickFolderActionList
            ]);
            exports_1("DOCUMENT_LIST_PROVIDERS", DOCUMENT_LIST_PROVIDERS = [
                folder_actions_service_1.FolderActionsService,
                document_actions_service_1.DocumentActionsService
            ]);
        }
    }
});
//# sourceMappingURL=ng2-alfresco-documentlist.js.map
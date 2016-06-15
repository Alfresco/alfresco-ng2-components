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
System.register(['./src/components/document-list', './src/components/content-column', './src/components/content-column-list', './src/components/content-action', './src/components/content-action-list', './src/services/folder-actions.service', './src/services/document-actions.service', './src/services/alfresco.service', './src/models/column-sorting.model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var document_list_1, content_column_1, content_column_list_1, content_action_1, content_action_list_1, folder_actions_service_1, document_actions_service_1, alfresco_service_1;
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
            function (content_column_1_1) {
                content_column_1 = content_column_1_1;
                exportStar_1(content_column_1_1);
            },
            function (content_column_list_1_1) {
                content_column_list_1 = content_column_list_1_1;
                exportStar_1(content_column_list_1_1);
            },
            function (content_action_1_1) {
                content_action_1 = content_action_1_1;
                exportStar_1(content_action_1_1);
            },
            function (content_action_list_1_1) {
                content_action_list_1 = content_action_list_1_1;
                exportStar_1(content_action_list_1_1);
            },
            function (folder_actions_service_1_1) {
                folder_actions_service_1 = folder_actions_service_1_1;
                exportStar_1(folder_actions_service_1_1);
            },
            function (document_actions_service_1_1) {
                document_actions_service_1 = document_actions_service_1_1;
                exportStar_1(document_actions_service_1_1);
            },
            function (alfresco_service_1_1) {
                alfresco_service_1 = alfresco_service_1_1;
                exportStar_1(alfresco_service_1_1);
            },
            function (column_sorting_model_1_1) {
                exportStar_1(column_sorting_model_1_1);
            }],
        execute: function() {
            exports_1("default",{
                directives: [
                    document_list_1.DocumentList,
                    content_column_1.ContentColumn,
                    content_column_list_1.ContentColumnList,
                    content_action_1.ContentAction,
                    content_action_list_1.ContentActionList
                ],
                providers: [
                    alfresco_service_1.AlfrescoService,
                    folder_actions_service_1.FolderActionsService,
                    document_actions_service_1.DocumentActionsService
                ]
            });
            exports_1("DOCUMENT_LIST_DIRECTIVES", DOCUMENT_LIST_DIRECTIVES = [
                document_list_1.DocumentList,
                content_column_1.ContentColumn,
                content_column_list_1.ContentColumnList,
                content_action_1.ContentAction,
                content_action_list_1.ContentActionList
            ]);
            exports_1("DOCUMENT_LIST_PROVIDERS", DOCUMENT_LIST_PROVIDERS = [
                alfresco_service_1.AlfrescoService,
                folder_actions_service_1.FolderActionsService,
                document_actions_service_1.DocumentActionsService
            ]);
        }
    }
});
//# sourceMappingURL=ng2-alfresco-documentlist.js.map
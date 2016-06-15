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
System.register(['./src/components/upload-drag-area.component', './src/directives/file-draggable.directive', './src/components/upload-button.component', './src/services/upload.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var upload_drag_area_component_1, file_draggable_directive_1, upload_button_component_1;
    var ALFRESCO_ULPOAD_COMPONENT;
    var exportedNames_1 = {
        'ALFRESCO_ULPOAD_COMPONENT': true
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
            function (upload_drag_area_component_1_1) {
                upload_drag_area_component_1 = upload_drag_area_component_1_1;
                exportStar_1(upload_drag_area_component_1_1);
            },
            function (file_draggable_directive_1_1) {
                file_draggable_directive_1 = file_draggable_directive_1_1;
                exportStar_1(file_draggable_directive_1_1);
            },
            function (upload_button_component_1_1) {
                upload_button_component_1 = upload_button_component_1_1;
                exportStar_1(upload_button_component_1_1);
            },
            function (upload_service_1_1) {
                exportStar_1(upload_service_1_1);
            }],
        execute: function() {
            exports_1("default",{
                component: [upload_drag_area_component_1.UploadDragAreaComponent, upload_button_component_1.UploadButtonComponent],
                directives: [file_draggable_directive_1.FileDraggableDirective]
            });
            exports_1("ALFRESCO_ULPOAD_COMPONENT", ALFRESCO_ULPOAD_COMPONENT = [
                upload_drag_area_component_1.UploadDragAreaComponent,
                upload_button_component_1.UploadButtonComponent,
                file_draggable_directive_1.FileDraggableDirective
            ]);
        }
    }
});
//# sourceMappingURL=ng2-alfresco-upload.js.map
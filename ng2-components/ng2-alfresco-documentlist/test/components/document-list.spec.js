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
System.register(['../../src/components/document-list'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var document_list_1;
    return {
        setters:[
            function (document_list_1_1) {
                document_list_1 = document_list_1_1;
            }],
        execute: function() {
            describe('document-list', function () {
                it('should setup default columns', function () {
                    var list = new document_list_1.DocumentList(null);
                    list.ngAfterContentInit();
                    expect(list.columns.length).not.toBe(0);
                });
            });
        }
    }
});
//# sourceMappingURL=document-list.spec.js.map
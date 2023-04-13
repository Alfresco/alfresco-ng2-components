/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { ObjectDataTableAdapter } from '@alfresco/adf-core';

@Component({
    selector: 'app-template-list',
    templateUrl: './template-demo.component.html'
})
export class TemplateDemoComponent implements AfterViewChecked {

    @ViewChild('defaultDocumentList', { static: true })
    defaultDocumentListComponent: DocumentListComponent;

    @ViewChild('customLoadingDocumentList', { static: true })
    customLoadingDocumentList: DocumentListComponent;

    @ViewChild('customNoPermissionDocumentList', { static: true })
    customNoPermissionDocumentList: DocumentListComponent;

    @ViewChild('defaultNoPermissionDocumentList', { static: true })
    defaultNoPermissionDocumentList: DocumentListComponent;

    @ViewChild('customEmptyDocumentList', { static: true })
    customEmptyDocumentList: DocumentListComponent;

    @ViewChild('defaultEmptyDocumentList', { static: true })
    defaultEmptyDocumentList: DocumentListComponent;

    constructor() {
    }

    ngAfterViewChecked(): void {
        this.defaultDocumentListComponent.dataTable.loading = true;
        this.customLoadingDocumentList.dataTable.loading = true;
        this.customEmptyDocumentList.dataTable.data = new ObjectDataTableAdapter();
        this.defaultEmptyDocumentList.dataTable.data = new ObjectDataTableAdapter();
        this.customNoPermissionDocumentList.dataTable.noPermission = true;
        this.defaultNoPermissionDocumentList.dataTable.noPermission = true;
    }
}

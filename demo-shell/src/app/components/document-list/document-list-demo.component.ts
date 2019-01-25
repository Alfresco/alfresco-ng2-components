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

import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { ObjectDataTableAdapter } from '@alfresco/adf-core';

@Component({
    selector: 'app-document-list',
    templateUrl: './document-list-demo.component.html'
})
export class DocumentListDemoComponent implements AfterViewChecked {

    @ViewChild('defaultDocumentList')
    defaultDocumentListComponent: DocumentListComponent;

    @ViewChild('customLoadingDocumentList')
    customLoadingDocumentList: DocumentListComponent;

    @ViewChild('customNoPermissionDocumentList')
    customNoPermissionDocumentList: DocumentListComponent;

    @ViewChild('defaultNoPermissionDocumentList')
    defaultNoPermissionDocumentList: DocumentListComponent;

    @ViewChild('customEmptyDocumentList')
    customEmptyDocumentList: DocumentListComponent;

    @ViewChild('defaultEmptyDocumentList')
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

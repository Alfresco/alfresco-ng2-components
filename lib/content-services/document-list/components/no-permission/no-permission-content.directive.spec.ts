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

import { TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material';
import { DataTableComponent, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { DocumentListService } from '../../services/document-list.service';
import { CustomResourcesService } from '../../services/custom-resources.service';

import { DocumentListComponent } from './../document-list.component';
import { NoPermissionContentDirective } from './no-permission-content.directive';

describe('NoPermissionContentDirective', () => {

    let noPermissionContent: NoPermissionContentDirective;
    let documentList: DocumentListComponent;

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            MatProgressSpinnerModule
        ],
        declarations: [
            DocumentListComponent
        ],
        providers: [
            DocumentListService,
            CustomResourcesService
        ]
    });

    beforeEach(() => {
        documentList = (TestBed.createComponent(DocumentListComponent).componentInstance as DocumentListComponent);
        documentList.dataTable = new DataTableComponent(null, null);
        noPermissionContent = new NoPermissionContentDirective(documentList);
    });

    it('should be defined', () => {
        expect(noPermissionContent).toBeDefined();
    });

    it('should set template', () => {
        noPermissionContent.template = '<example>';

        noPermissionContent.ngAfterContentInit();

        expect(noPermissionContent.template).toBe(documentList.noPermissionTemplate);
        expect(noPermissionContent.template).toBe(documentList.dataTable.noPermissionTemplate);
    });
});

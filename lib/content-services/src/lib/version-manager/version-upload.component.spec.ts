/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { VersionUploadComponent } from './version-upload.component';
import { ContentService, setupTestBed, UploadService } from '@alfresco/adf-core';
import { ContentTestingModule } from '../testing/content.testing.module';
import { Node } from '@alfresco/js-api';
import { MockProvider } from 'ng-mocks';
import { ApiClientsService } from '@alfresco/adf-core/api';

describe('VersionUploadComponent', () => {
    let component: VersionUploadComponent;
    let fixture: ComponentFixture<VersionUploadComponent>;
    let uploadService: UploadService;
    let contentService: ContentService;

    const node: Node = new Node({
        id: '1234',
        name: 'TEST-NODE',
        isFile: true,
        nodeType: 'FAKE',
        isFolder: false,
        modifiedAt: new Date(),
        modifiedByUser: null,
        createdAt: new Date(),
        createdByUser: null,
        content: {
            mimeType: 'text/html',
            mimeTypeName: 'HTML',
            sizeInBytes: 13
        }
    });

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            UploadService,
            MockProvider(ApiClientsService)
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VersionUploadComponent);
        component = fixture.componentInstance;
        uploadService = TestBed.inject(UploadService);
        contentService = TestBed.inject(ContentService);
        spyOn(contentService, 'hasAllowableOperations').and.returnValue(true);
        component.node = node;
    });

    it('should disabled upload button on upload starts', fakeAsync(() => {
        component.uploadStarted.subscribe(() => {
            expect(component.disabled).toEqual(true);
        });
        uploadService.fileUploadStarting.next();
        tick(500);
        fixture.detectChanges();
    }));

    it('should enable upload button on error', (done) => {
        spyOn(component, 'canUpload').and.returnValue(true);
        component.error.subscribe(() => {
            expect(component.disabled).toEqual(false);
            done();
        });
        component.onError({} as any);
        fixture.detectChanges();
    });

    it('should enable upload button on success', (done) => {
        spyOn(component, 'canUpload').and.returnValue(true);
        component.success.subscribe(() => {
            expect(component.disabled).toEqual(false);
            done();
        });
        component.onSuccess(true);
        fixture.detectChanges();
    });

    it('should update next major version', () => {
        let majorVersion = component.getNextMajorVersion('1.0');
        expect(majorVersion).toEqual('2.0');
        majorVersion = component.getNextMajorVersion('10.0');
        expect(majorVersion).toEqual('11.0');
    });

    it('should update next minor version', () => {
        let minorVersion = component.getNextMinorVersion('1.0');
        expect(minorVersion).toEqual('1.1');
        minorVersion = component.getNextMinorVersion('1.10');
        expect(minorVersion).toEqual('1.11');
    });
});

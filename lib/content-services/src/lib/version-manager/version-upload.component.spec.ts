/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VersionUploadComponent } from './version-upload.component';
import { ContentTestingModule } from '../testing/content.testing.module';
import { Node } from '@alfresco/js-api';
import { UploadService } from '../common/services/upload.service';
import { ContentService } from '../common/services/content.service';
import { Subject } from 'rxjs';
import { FileUploadErrorEvent, FileUploadEvent, UploadVersionButtonComponent } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';

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

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule],
            providers: [UploadService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        fixture = TestBed.createComponent(VersionUploadComponent);
        component = fixture.componentInstance;
        uploadService = TestBed.inject(UploadService);
        contentService = TestBed.inject(ContentService);
        spyOn(contentService, 'hasAllowableOperations').and.returnValue(true);
        component.node = node;
    });

    afterEach(() => {
        fixture.destroy();
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

    describe('Upload version button', () => {
        let uploadVersionButtonComponent: UploadVersionButtonComponent;
        let upload$: Subject<FileUploadEvent>;
        let uploadEvent: FileUploadEvent;

        beforeEach(() => {
            upload$ = new Subject<FileUploadEvent>();
            uploadService.fileUploadStarting = upload$;
            fixture.detectChanges();
            uploadVersionButtonComponent = fixture.debugElement.query(By.directive(UploadVersionButtonComponent)).componentInstance;
            uploadEvent = {
                file: {
                    name: 'some file'
                }
            } as FileUploadEvent;
            spyOn(component.uploadStarted, 'emit');
            upload$.next(uploadEvent);
            fixture.detectChanges();
        });

        it('should be disabled when uploading', () => {
            expect(uploadVersionButtonComponent.disabled).toBeTrue();
        });

        it('should be disabled when uploading is successful', () => {
            uploadVersionButtonComponent.success.next({});
            fixture.detectChanges();
            expect(uploadVersionButtonComponent.disabled).toBeTrue();
        });

        it('should be enabled when uploading is failed', () => {
            uploadVersionButtonComponent.error.next({} as FileUploadErrorEvent);
            fixture.detectChanges();
            expect(uploadVersionButtonComponent.disabled).toBeFalse();
        });

        it('should be emitted uploadStarted when started uploading', () => {
            expect(component.uploadStarted.emit).toHaveBeenCalledWith(uploadEvent);
        });

        it('should be emitted success when uploading is successful', () => {
            spyOn(component.success, 'emit');

            uploadVersionButtonComponent.success.next({});
            fixture.detectChanges();
            expect(component.success.emit).toHaveBeenCalledWith({});
        });

        it('should be emitted error when uploading is failed', () => {
            spyOn(component.error, 'emit');
            const errorEvent = {
                error: 'Some error'
            } as FileUploadErrorEvent;

            uploadVersionButtonComponent.error.next(errorEvent);
            fixture.detectChanges();
            expect(component.error.emit).toHaveBeenCalledWith(errorEvent);
        });
    });
});

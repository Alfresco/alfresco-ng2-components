/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mockFile, mockNode } from '../mock';
import { ContentTestingModule } from '../testing/content.testing.module';
import { NewVersionUploaderDataAction } from './models';
import { NewVersionUploaderDialogComponent } from './new-version-uploader.dialog';
import { By } from '@angular/platform-browser';

describe('NewVersionUploaderDialog', () => {
    let component: NewVersionUploaderDialogComponent;
    let fixture: ComponentFixture<NewVersionUploaderDialogComponent>;
    let nativeElement: HTMLElement;

    const cssSelectors = {
        adfVersionUploadButton: '#adf-version-upload-button',
        adfVersionComparison: '#adf-version-comparison',
        adfVersionList: '.adf-version-list',
        title: '[data-automation-id="new-version-uploader-dialog-title"]'
    };

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
        open: jasmine.createSpy('open')
    };
    const showVersionsOnly = true;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, NewVersionUploaderDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { node: mockNode, showVersionsOnly, file: mockFile } },
                {
                    provide: MatDialogRef,
                    useValue: mockDialogRef
                }
            ]
        });
        fixture = TestBed.createComponent(NewVersionUploaderDialogComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.debugElement.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Upload New Version', () => {
        const expectedUploadNewVersionTitle = 'ADF-NEW-VERSION-UPLOADER.DIALOG_UPLOAD.TITLE';

        it('should display adf version upload button if showVersionsOnly is passed as false from parent component', () => {
            component.data.showVersionsOnly = false;
            fixture.detectChanges();
            const adfVersionComponent = nativeElement.querySelector(cssSelectors.adfVersionUploadButton);
            expect(adfVersionComponent).not.toEqual(null);
        });

        it('should display adf version comparison if showVersionsOnly is passed as false from parent component', () => {
            component.data.showVersionsOnly = false;
            fixture.detectChanges();
            const adfVersionComparisonComponent = nativeElement.querySelector(cssSelectors.adfVersionComparison);
            expect(adfVersionComparisonComponent).not.toEqual(null);
        });

        it('should not display adf version list if showVersionsOnly is passed as false from parent component', () => {
            component.data.showVersionsOnly = false;
            fixture.detectChanges();
            const adfVersionComparisonComponent = nativeElement.querySelector(cssSelectors.adfVersionList);
            expect(adfVersionComparisonComponent).toEqual(null);
        });

        it('should show default title if title is not provided from parent component', () => {
            component.data.showVersionsOnly = false;
            fixture.detectChanges();
            const matDialogTitle = nativeElement.querySelector(cssSelectors.title);
            expect(matDialogTitle.innerHTML).toEqual(expectedUploadNewVersionTitle);
        });

        it('should show default title if title is provided as empty from parent component', () => {
            component.data.showVersionsOnly = false;
            component.data.title = '';
            fixture.detectChanges();
            const matDialogTitle = nativeElement.querySelector(cssSelectors.title);
            expect(matDialogTitle.innerHTML).toEqual(expectedUploadNewVersionTitle);
        });

        it('should not show Upload New Version default title if title is provided from parent component', () => {
            component.data.showVersionsOnly = false;
            component.data.title = 'TEST_TITLE';
            fixture.detectChanges();
            const matDialogTitle = nativeElement.querySelector(cssSelectors.title);
            expect(matDialogTitle.innerHTML).toEqual('TEST_TITLE');
        });

        it('should emit dialog action when upload a new file', () => {
            const spyOnDialogAction = spyOn(component.dialogAction, 'emit');
            component.data.showVersionsOnly = false;
            fixture.detectChanges();
            component.handleUpload(mockNode);
            const expectedEmittedValue: any = {
                action: NewVersionUploaderDataAction.upload,
                currentVersion: component.data.node,
                newVersion: mockNode
            };
            expect(spyOnDialogAction).toHaveBeenCalledWith(expectedEmittedValue);
        });

        it('should close dialog after file is uploaded', () => {
            component.data.showVersionsOnly = false;
            fixture.detectChanges();
            component.handleUpload(mockFile);
            expect(mockDialogRef.close).toHaveBeenCalled();
        });

        it('should close dialog after click on dialog cancel', () => {
            component.data.showVersionsOnly = false;
            fixture.detectChanges();
            component.handleCancel();
            expect(mockDialogRef.close).toHaveBeenCalled();
        });
    });

    describe('Manage Versions', () => {
        const expectedManageVersionsTitle = 'ADF-NEW-VERSION-UPLOADER.DIALOG_LIST.TITLE';

        it('should display adf version list if showVersionsOnly is passed as true from parent component', () => {
            component.data.showVersionsOnly = true;
            fixture.detectChanges();
            const adfVersionListComponent = document.querySelector(cssSelectors.adfVersionList);
            expect(adfVersionListComponent).not.toEqual(null);
        });

        it('should not display adf version upload button if showVersionsOnly is passed as true from parent component', () => {
            component.data.showVersionsOnly = true;
            fixture.detectChanges();
            const adfVersionComponent = nativeElement.querySelector(cssSelectors.adfVersionUploadButton);
            expect(adfVersionComponent).toEqual(null);
        });

        it('should not display adf version comparison if showVersionsOnly is passed as true from parent component', () => {
            component.data.showVersionsOnly = true;
            fixture.detectChanges();
            const adfVersionComponent = nativeElement.querySelector(cssSelectors.adfVersionComparison);
            expect(adfVersionComponent).toEqual(null);
        });

        it('should show Manage Versions default title if title is not provided from parent component', () => {
            component.data.showVersionsOnly = true;
            component.data.title = undefined;
            fixture.detectChanges();
            const matDialogTitle = nativeElement.querySelector(cssSelectors.title);
            expect(matDialogTitle.innerHTML).toEqual(expectedManageVersionsTitle);
        });

        it('should show Manage Versions default title if title is provided as empty from parent component', () => {
            component.data.showVersionsOnly = true;
            component.data.title = '';
            fixture.detectChanges();
            const matDialogTitle = nativeElement.querySelector(cssSelectors.title);
            expect(matDialogTitle.innerHTML).toEqual(expectedManageVersionsTitle);
        });

        it('should not show Manage Versions default title if title is provided from parent component', () => {
            component.data.showVersionsOnly = true;
            component.data.title = 'TEST_TITLE';
            fixture.detectChanges();
            const matDialogTitle = nativeElement.querySelector(cssSelectors.title);
            expect(matDialogTitle.innerHTML).toEqual('TEST_TITLE');
        });

        it('should have assigned allowViewVersions based on allowViewVersions from data', () => {
            component.data.showVersionsOnly = true;
            component.data.allowViewVersions = true;

            fixture.detectChanges();
            const adfVersionListComponent = fixture.debugElement.query(By.css(cssSelectors.adfVersionList));
            expect(adfVersionListComponent.componentInstance.allowViewVersions).toBeTrue();
        });
    });
});

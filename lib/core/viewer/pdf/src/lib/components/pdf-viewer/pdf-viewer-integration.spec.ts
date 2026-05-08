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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PDF_VIEWER_COMPONENT, ViewerRenderComponent, UnitTestingUtils } from '@alfresco/adf-core';
import { PdfViewerComponent, PDFJS_MODULE, PDFJS_VIEWER_MODULE } from './pdf-viewer.component';
import { providePdfViewer } from '../../provide-pdf-viewer';
import pdfjsLibraryMock from '../mock/pdfjs-lib.mock';

describe('PdfViewer Integration with ViewerRenderComponent', () => {
    let fixture: ComponentFixture<ViewerRenderComponent>;
    let component: ViewerRenderComponent;
    let testingUtils: UnitTestingUtils;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [ViewerRenderComponent],
            providers: [
                providePdfViewer(),
                { provide: PDFJS_MODULE, useValue: pdfjsLibraryMock },
                { provide: PDFJS_VIEWER_MODULE, useValue: class {} }
            ]
        });

        fixture = TestBed.createComponent(ViewerRenderComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should provide PdfViewerComponent via token', () => {
        const token = TestBed.inject(PDF_VIEWER_COMPONENT);
        expect(token).toBe(PdfViewerComponent);
    });

    it('should render real PdfViewerComponent for PDF files', async () => {
        component.urlFile = 'fake-test-file.pdf';
        component.ngOnChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component.viewerType).toBe('pdf');
        expect(testingUtils.getByCSS('adf-pdf-viewer')).not.toBeNull();
    });

    it('should pass inputs to real PdfViewerComponent', async () => {
        component.urlFile = 'fake-test-file.pdf';
        component.allowThumbnails = true;
        component.ngOnChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const pdfViewer = testingUtils.getByCSS('adf-pdf-viewer');
        expect(pdfViewer).not.toBeNull();
        expect(pdfViewer.componentInstance.urlFile).toBe('fake-test-file.pdf');
        expect(pdfViewer.componentInstance.allowThumbnails).toBe(true);
    });

    it('should show unknown format when token is not provided', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [ViewerRenderComponent],
            providers: [{ provide: PDF_VIEWER_COMPONENT, useValue: null }]
        });

        fixture = TestBed.createComponent(ViewerRenderComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);

        component.urlFile = 'fake-test-file.pdf';
        component.ngOnChanges();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component.viewerType).toBe('pdf');
        expect(testingUtils.getByCSS('adf-pdf-viewer')).toBeNull();
        expect(testingUtils.getByCSS('adf-viewer-unknown-format')).not.toBeNull();
    });
});

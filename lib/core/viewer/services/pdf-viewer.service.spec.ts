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

import { ReflectiveInjector } from '@angular/core';
import { PdfViewerService } from './pdf-viewer.service';

describe('PdfViewerService', () => {

    let service: PdfViewerService;
    let injector: ReflectiveInjector;
    const mockViewer = {
        currentPageNumber: null
    };

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            PdfViewerService
        ]);
    });

    beforeEach(() => {
        service = injector.get(PdfViewerService);
    });

    it('should set/get pdfViewer', () => {
        service.setViewer(mockViewer);

        expect(service.getViewer()).toBe(mockViewer);
    });

    it('should set pdfViewer page number', () => {
        service.setViewer(mockViewer);
        service.setPage(2);

        expect(mockViewer.currentPageNumber).toBe(2);
    });

    it('should emit event on toggle', () => {
        service.toggleThumbnails.subscribe((result) => {
            expect(result).toBe('value');
        });

        service.toggleThumbnails.next('value');
    });
});

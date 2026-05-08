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

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideCoreAuthTesting } from '@alfresco/adf-core';
import { PdfViewerComponent } from './pdf-viewer.component';
import { RenderingQueueServices } from '../../services/rendering-queue.services';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs';

const MINIMAL_PDF_BASE64 =
    'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
    'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
    'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
    'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
    'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
    'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
    'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
    'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
    'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
    'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
    'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
    'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
    'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';

/** @returns a Blob containing a minimal valid 1-page PDF */
function createRealPdfBlob(): Blob {
    const binaryString = atob(MINIMAL_PDF_BASE64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'application/pdf' });
}

@Component({
    imports: [PdfViewerComponent],
    template: `<adf-pdf-viewer [blobFile]="blobFile" />`
})
class RealPdfTestHostComponent {
    @ViewChild(PdfViewerComponent, { static: true })
    pdfViewerComponent: PdfViewerComponent;

    blobFile = createRealPdfBlob();
}

/**
 * @param predicate - condition to wait for
 * @param timeout - max wait time in ms
 * @returns a promise that resolves when the predicate returns true
 */
function waitFor(predicate: () => boolean, timeout = 5000): Promise<void> {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const check = () => {
            if (predicate()) {
                resolve();
            } else if (Date.now() - start > timeout) {
                reject(new Error('waitFor timed out'));
            } else {
                setTimeout(check, 50);
            }
        };
        check();
    });
}

describe('PdfViewerComponent with real pdfjs-dist', () => {
    let fixture: ComponentFixture<RealPdfTestHostComponent>;
    let component: PdfViewerComponent;

    beforeAll(async () => {
        const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs');
        (globalThis as any).pdfjsWorker = { WorkerMessageHandler: workerModule.WorkerMessageHandler };
    });

    afterAll(() => {
        delete (globalThis as any).pdfjsWorker;
    });

    beforeEach(async () => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';

        TestBed.configureTestingModule({
            imports: [RealPdfTestHostComponent],
            providers: [provideCoreAuthTesting(), { provide: MatDialog, useValue: { open: () => {} } }, RenderingQueueServices]
        });

        fixture = TestBed.createComponent(RealPdfTestHostComponent);
        component = fixture.componentInstance.pdfViewerComponent;

        spyOn(component as any, 'setupPdfJsWorker').and.resolveTo();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should load a real PDF blob and detect page count', async () => {
        fixture.detectChanges();
        await waitFor(() => component.totalPages > 0);
        expect(component.totalPages).toBe(1);
    });

    it('should emit pagesLoaded when a real PDF is rendered', async () => {
        const pagesLoadedSpy = spyOn(component.pagesLoaded, 'emit');
        fixture.detectChanges();
        await waitFor(() => pagesLoadedSpy.calls.count() > 0);
        expect(pagesLoadedSpy).toHaveBeenCalled();
    });
});

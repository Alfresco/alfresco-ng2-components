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

import { describe, expect, it, injectAsync, TestComponentBuilder, setBaseTestProviders } from 'angular2/testing';
import { TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS } from 'angular2/platform/testing/browser';
import { PdfViewerComponent } from './pdfViewer.component';
import { PDFJSmock } from './assets/PDFJS.mock';
import { PDFViewermock } from './assets/PDFViewer.mock';

describe('PdfViewer', () => {
    setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS);

    describe('View', () => {
        it('Canvas should be present', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;

                    fixture.detectChanges();

                    expect(element.querySelector('#viewer-viewerPdf')).not.toBeNull();
                    expect(element.querySelector('#viewer-pdf-container')).not.toBeNull();
                });
        }));

        it('Total number of pages should be showed', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;

                    component.urlFile = 'fake-url-file';
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());

                    component.ngOnChanges().then(() => {
                        expect(element.querySelector('#viewer-total-pages').innerHTML).toEqual('/10');
                    });
                });
        }));
    });

    describe('User interaction', () => {
        it('Click on next page should move to the next page', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    component.pdfViewer = new PDFViewermock();
                    component.urlFile = 'fake-url-file';

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('#viewer-pagenumber-input').value).toBe('1');
                        element.querySelector('#viewer-next-page-button').click();
                        fixture.detectChanges();
                        expect(element.querySelector('#viewer-pagenumber-input').value).toBe('2');
                    });
                });
        }));

        it('Click on previous page should move to the previous page', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    component.pdfViewer = new PDFViewermock();
                    component.urlFile = 'fake-url-file';

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('#viewer-pagenumber-input').value).toBe('1');
                        element.querySelector('#viewer-next-page-button').click();
                        element.querySelector('#viewer-next-page-button').click();
                        element.querySelector('#viewer-previous-page-button').click();
                        fixture.detectChanges();
                        expect(element.querySelector('#viewer-pagenumber-input').value).toBe('2');
                    });
                });
        }));

        /* tslint:disable:max-line-length */
        it('Click on previous page should not move to the previous page if is page 1', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    component.pdfViewer = new PDFViewermock();
                    component.urlFile = 'fake-url-file';

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('#viewer-pagenumber-input').value).toBe('1');
                        element.querySelector('#viewer-previous-page-button').click();
                        fixture.detectChanges();
                        expect(element.querySelector('#viewer-pagenumber-input').value).toBe('1');
                    });
                });
        }));
    });
});

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

import {describe, expect, it, inject, beforeEachProviders, beforeEach} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';

import {PdfViewerComponent} from './pdfViewer.component';
import {PDFJSmock} from './assets/PDFJS.mock';
import {PDFViewermock} from './assets/PDFViewer.mock';
import {EventMock} from './assets/event.mock';

import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';

describe('PdfViewer', () => {

    let pdfComponentFixture, element, component;


    beforeEachProviders(() => {
        return [
            AlfrescoSettingsService,
            AlfrescoAuthenticationService
        ];
    });

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(PdfViewerComponent)
            .then(fixture => {
                pdfComponentFixture = fixture;
                element = fixture.nativeElement;
                component = fixture.componentInstance;

                spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                spyOn(component, 'initPDFViewer').and.callFake(() => {
                    component.pdfViewer = new PDFViewermock();
                });

                component.showToolbar = true;
                component.urlFile = 'fake-url-file';
                pdfComponentFixture.detectChanges();
            });
    }));

    describe('View', () => {
        it('Canvas should be present', () => {
            expect(element.querySelector('#viewer-viewerPdf')).not.toBeNull();
            expect(element.querySelector('#viewer-pdf-container')).not.toBeNull();
        });

        it('Loader should be present', () => {
            pdfComponentFixture.detectChanges();

            expect(element.querySelector('#loader-container')).not.toBeNull();

        });

        it('Next an Previous Buttons should be present', () => {
            pdfComponentFixture.detectChanges();

            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });


        it('Input Page elements should be present', () => {
            pdfComponentFixture.detectChanges();

            expect(element.querySelector('#viewer-pagenumber-input')).toBeDefined();
            expect(element.querySelector('#viewer-total-pages')).toBeDefined();

            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });

        it('Toolbar should be hide if showToolbar is false', () => {
            component.showToolbar = false;

            pdfComponentFixture.detectChanges();

            expect(element.querySelector('#viewer-toolbar-command')).toBeNull();
            expect(element.querySelector('#viewer-toolbar-pagination')).toBeNull();
        });
    });

    describe('User interaction', () => {

        beforeEach(() => {
            component.inputPage(1);
        });

        it('Total number of pages should be loaded', () => {
            component.ngOnChanges().then(() => {
                expect(component.totalPages).toEqual('10');
            });
        });

        it('right arrow should move to the next page', (done) => {
            component.ngOnChanges().then(() => {
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(1);
                EventMock.keyDown(39);
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        });

        it('nextPage should move to the next page', (done) => {
            let nextPageButton = element.querySelector('#viewer-next-page-button');

            component.ngOnChanges().then(() => {
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(1);
                nextPageButton.click();
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        });

        it('left arrow should move to the previous page', (done) => {
            component.ngOnChanges().then(() => {
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(1);
                EventMock.keyDown(39);
                EventMock.keyDown(39);
                EventMock.keyDown(37);
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        });

        it('previous page should move to the previous page', (done) => {
            let previousPageButton = element.querySelector('#viewer-previous-page-button');
            let nextPageButton = element.querySelector('#viewer-next-page-button');

            component.ngOnChanges().then(() => {
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(1);
                nextPageButton.click();
                nextPageButton.click();
                previousPageButton.click();
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        });

        /* tslint:disable:max-line-length */
        it('previous page should not move to the previous page if is page 1', (done) => {
            component.ngOnChanges().then(() => {
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(1);
                component.previousPage();
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(1);
                done();
            });
        });

        it('Input page should move to the inserted page', (done) => {
            component.ngOnChanges().then(() => {
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(1);
                component.inputPage('4');
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(4);
                done();
            });
        });

        /* tslint:disable:max-line-length */
        it('zoomIn should increment the scale value', (done) => {
            component.currentScale = 1;

            let zoomInButton = element.querySelector('#viewer-zoom-in-button');

            component.ngOnChanges().then(() => {
                pdfComponentFixture.detectChanges();
                zoomInButton.click();
                expect(component.currentScaleMode).toBe('auto');
                expect(component.currentScale).toBe(1.1);
                done();
            });
        });

        it('zoomOut should decrement the scale value', (done) => {
            component.currentScale = 1;

            let zoomOutButton = element.querySelector('#viewer-zoom-out-button');

            component.ngOnChanges().then(() => {
                pdfComponentFixture.detectChanges();
                zoomOutButton.click();
                expect(component.currentScaleMode).toBe('auto');
                expect(component.currentScale).toBe(0.9);
                done();
            });
        });

        it('fit in button should toggle page-fit and auto scale mode', (done) => {
            component.currentScale = 1;

            let fitPage = element.querySelector('#viewer-scale-page-button');

            component.ngOnChanges().then(() => {
                pdfComponentFixture.detectChanges();
                expect(component.currentScaleMode).toBe('auto');
                fitPage.click();
                expect(component.currentScaleMode).toBe('page-fit');
                fitPage.click();
                expect(component.currentScaleMode).toBe('auto');
                done();
            });
        });
    });

    describe('Resize interaction', () => {
        it('resize event should trigger setScaleUpdatePages', () => {
            spyOn(component, 'setScaleUpdatePages');

            component.documentContainer = element.querySelector('#viewer-pdf-container');
            component.pdfViewer = new PDFViewermock();
            component.urlFile = 'fake-url-file';

            EventMock.resizeMobileView();

            expect(component.setScaleUpdatePages).toHaveBeenCalled();
        });
    });

    describe('scroll interaction', () => {
        it('scroll page should return the current page', (done) => {
            component.ngOnChanges().then(() => {
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(1);
                component.inputPage('4');
                pdfComponentFixture.detectChanges();
                expect(component.displayPage).toBe(4);
                component.watchScroll({scrollTop: 10000});
                expect(component.displayPage).toBe(4);
                done();
            });
        });
    });
});

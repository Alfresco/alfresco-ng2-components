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

import { describe, expect, it, inject, setBaseTestProviders } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import {
    TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
    TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
} from '@angular/platform-browser-dynamic/testing';
import { PdfViewerComponent } from './pdfViewer.component';
import { PDFJSmock } from './assets/PDFJS.mock';
import { PDFViewermock } from './assets/PDFViewer.mock';
import { EventMock } from './assets/event.mock';

describe('PdfViewer', () => {
    setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
        TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

    describe('View', () => {
        it('Canvas should be present', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;

                    fixture.detectChanges();

                    expect(element.querySelector('#viewer-viewerPdf')).not.toBeNull();
                    expect(element.querySelector('#viewer-pdf-container')).not.toBeNull();
                });
        }));

        it('Loader should be present', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;

                    fixture.detectChanges();

                    expect(element.querySelector('#loader-container')).not.toBeNull();
                });
        }));

        it('Next an Previous Buttons should be present', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;

                    fixture.detectChanges();

                    expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
                    expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
                });
        }));

        it('Input Page elements should be present', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;

                    fixture.detectChanges();

                    expect(element.querySelector('#viewer-pagenumber-input')).toBeDefined();
                    expect(element.querySelector('#viewer-total-pages')).toBeDefined();

                    expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
                    expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
                });
        }));
    });

    describe('User interaction', () => {
        it('Total number of pages should be loaded', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.urlFile = 'fake-url-file';
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    spyOn(component, 'initPDFViewer').and.callFake(() => {
                        component.pdfViewer = new PDFViewermock();
                    });

                    component.ngOnChanges().then(() => {
                        expect(component.totalPages).toEqual('10');
                    });
                });
        }));


        it('right arrow should move to the next page', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    spyOn(component, 'initPDFViewer').and.callFake(() => {
                        component.pdfViewer = new PDFViewermock();
                    });

                    component.urlFile = 'fake-url-file';

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(1);
                        EventMock.keyDown(39);
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(2);
                    }).catch((error) => {
                        expect(error).toBeUndefined();
                    });
                });
        }));

        it('nextPage should move to the next page', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    let element = fixture.nativeElement;

                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    spyOn(component, 'initPDFViewer').and.callFake(() => {
                        component.pdfViewer = new PDFViewermock();
                    });

                    component.urlFile = 'fake-url-file';

                    let nextPageButton = element.querySelector('#viewer-next-page-button');

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(1);
                        nextPageButton.click();
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(2);
                    }).catch((error) => {
                        expect(error).toBeUndefined();
                    });
                });
        }));

        it('left arrow should move to the previous page', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    spyOn(component, 'initPDFViewer').and.callFake(() => {
                        component.pdfViewer = new PDFViewermock();
                    });

                    component.urlFile = 'fake-url-file';

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(1);
                        EventMock.keyDown(39);
                        EventMock.keyDown(39);
                        EventMock.keyDown(37);
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(2);
                    }).catch((error) => {
                        expect(error).toBeUndefined();
                    });
                });
        }));

        it('previous page should move to the previous page', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    let element = fixture.nativeElement;

                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    spyOn(component, 'initPDFViewer').and.callFake(() => {
                        component.pdfViewer = new PDFViewermock();
                    });

                    component.urlFile = 'fake-url-file';
                    let previousPageButton = element.querySelector('#viewer-previous-page-button');
                    let nextPageButton = element.querySelector('#viewer-next-page-button');

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(1);
                        nextPageButton.click();
                        nextPageButton.click();
                        previousPageButton.click();
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(2);
                    }).catch((error) => {
                        expect(error).toBeUndefined();
                    });
                });
        }));

        /* tslint:disable:max-line-length */
        it('previous page should not move to the previous page if is page 1', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    spyOn(component, 'initPDFViewer').and.callFake(() => {
                        component.pdfViewer = new PDFViewermock();
                    });

                    component.urlFile = 'fake-url-file';

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(1);
                        component.previousPage();
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(1);
                    }).catch((error) => {
                        expect(error).toBeUndefined();
                    });
                });
        }));

        it('Input page should move to the inserted page', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;

                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    spyOn(component, 'initPDFViewer').and.callFake(() => {
                        component.pdfViewer = new PDFViewermock();
                    });

                    component.urlFile = 'fake-url-file';

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(1);
                        component.inputPage('4');
                        fixture.detectChanges();
                        expect(component.displayPage).toBe(4);
                    }).catch((error) => {
                        expect(error).toBeUndefined();
                    });
                });
        }));
    });

    describe('Rezize interaction', () => {

        it('resize event should trigger setScaleUpdatePages', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(PdfViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    let element = fixture.nativeElement;

                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    spyOn(component, 'initPDFViewer');
                    spyOn(component, 'setScaleUpdatePages');

                    component.documentContainer = element.querySelector('#viewer-pdf-container');
                    component.pdfViewer = new PDFViewermock();
                    component.urlFile = 'fake-url-file';

                    EventMock.resizeMobileView();

                    expect(component.setScaleUpdatePages).toHaveBeenCalled();
                });
        }));

    });

});

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

import { describe, expect, it, inject, beforeEachProviders } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';

import { PdfViewerComponent } from './pdfViewer.component';
import { PDFJSmock } from './assets/PDFJS.mock';
import { PDFViewermock } from './assets/PDFViewer.mock';
import { EventMock } from './assets/event.mock';

import { HTTP_PROVIDERS } from '@angular/http';
import { AlfrescoSettingsServiceMock } from '../src/assets/AlfrescoSettingsService.service.mock';
import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';

describe('PdfViewer', () => {

    beforeEachProviders(() => {
        return [
            HTTP_PROVIDERS,
            {provide: AlfrescoSettingsService, useClass: AlfrescoSettingsServiceMock},
            {provide: AlfrescoAuthenticationService, useClass: AlfrescoAuthenticationService}
        ];
    });

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

        /* tslint:disable:max-line-length */
        it('zoomIn should increment the scale value', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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
                    component.currentScale = 1;

                    let zoomInButton = element.querySelector('#viewer-zoom-in-button');

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        zoomInButton.click();
                        expect(component.currentScaleMode).toBe('auto');
                        expect(component.currentScale).toBe(1.1);
                    }).catch((error) => {
                        expect(error).toBeUndefined();
                    });
                });
        }));

        it('zoomOut should decrement the scale value', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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
                    component.currentScale = 1;

                    let zoomOutButton = element.querySelector('#viewer-zoom-out-button');

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        zoomOutButton.click();
                        expect(component.currentScaleMode).toBe('auto');
                        expect(component.currentScale).toBe(0.9);
                    }).catch((error) => {
                        expect(error).toBeUndefined();
                    });
                });
        }));

        it('fit in button should toggle page-fit and auto scale mode', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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
                    component.currentScale = 1;

                    let fitPage = element.querySelector('#viewer-scale-page-button');

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(component.currentScaleMode).toBe('auto');
                        fitPage.click();
                        expect(component.currentScaleMode).toBe('page-fit');
                        fitPage.click();
                        expect(component.currentScaleMode).toBe('auto');
                    }).catch((error) => {
                        expect(error).toBeUndefined();
                    });
                });
        }));
    });

    describe('Resize interaction', () => {
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

    describe('scroll interaction', () => {
        it('scroll page should return the current page', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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
                        component.watchScroll({scrollTop: 10000});
                        expect(component.displayPage).toBe(4);
                    }).catch((error) => {
                        expect(error).toBeUndefined();
                    });
                });
        }));
    });

});

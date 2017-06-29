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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RenderingQueueServices } from '../services/rendering-queue.services';
import { PdfViewerComponent } from './pdfViewer.component';
import { EventMock } from '../assets/event.mock';
import { DebugElement }    from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    CoreModule
} from 'ng2-alfresco-core';

describe('Test ng2-alfresco-viewer PdfViewer component', () => {

    let component: PdfViewerComponent;
    let fixture: ComponentFixture<PdfViewerComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [PdfViewerComponent],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService,
                RenderingQueueServices
            ]
        }).compileComponents();
    }));

    function createFakeBlob(): Blob {
        let pdfData = atob(
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
            'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');
        return new Blob([pdfData], {type: 'application/pdf'});
    }

    beforeEach(() => {
        fixture = TestBed.createComponent(PdfViewerComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;

        component.showToolbar = true;

    });

    describe('View with url file', () => {
        beforeEach(() => {
            component.urlFile = require('../assets/fake-test-file.pdf');
            fixture.detectChanges();
        });

        it('should thrown an error If urlfile is not present', () => {
            component.urlFile = undefined;

            fixture.detectChanges();

            expect(() => {
                component.ngOnChanges(null);
            }).toThrow(new Error('Attribute urlFile or blobFile is required'));
        });

        it('should Canvas be present', () => {
            expect(element.querySelector('#viewer-viewerPdf')).not.toBeNull();
            expect(element.querySelector('#viewer-pdf-container')).not.toBeNull();
        });

        it('should Loader be present', () => {
            expect(element.querySelector('#loader-container')).not.toBeNull();
        });

        it('should Next an Previous Buttons be present', () => {
            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });

        it('should Input Page elements be present', () => {
            expect(element.querySelector('#viewer-pagenumber-input')).toBeDefined();
            expect(element.querySelector('#viewer-total-pages')).toBeDefined();

            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });

        it('should Toolbar be hide if showToolbar is false', () => {
            component.showToolbar = false;

            fixture.detectChanges();

            expect(element.querySelector('#viewer-toolbar-command')).toBeNull();
            expect(element.querySelector('#viewer-toolbar-pagination')).toBeNull();
        });
    });

    describe('View with blob file', () => {

        beforeEach(() => {
            component.urlFile = undefined;
            component.blobFile = createFakeBlob();

            fixture.detectChanges();
        });

        it('should If blobFile is not present thrown an error ', () => {
            component.blobFile = undefined;
            expect(() => {
                component.ngOnChanges(null);
            }).toThrow(new Error('Attribute urlFile or blobFile is required'));
        });

        it('should Canvas be present', () => {
            expect(element.querySelector('#viewer-viewerPdf')).not.toBeNull();
            expect(element.querySelector('#viewer-pdf-container')).not.toBeNull();
        });

        it('should Loader be present', () => {
            expect(element.querySelector('#loader-container')).not.toBeNull();
        });

        it('should Next an Previous Buttons be present', () => {
            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });

        it('should Input Page elements be present', () => {
            expect(element.querySelector('#viewer-pagenumber-input')).toBeDefined();
            expect(element.querySelector('#viewer-total-pages')).toBeDefined();

            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });

        it('should Toolbar be hide if showToolbar is false', () => {
            component.showToolbar = false;

            fixture.detectChanges();

            expect(element.querySelector('#viewer-toolbar-command')).toBeNull();
            expect(element.querySelector('#viewer-toolbar-pagination')).toBeNull();
        });
    });

    describe('User interaction', () => {

        beforeEach(() => {
            component.urlFile = require('../assets/fake-test-file.pdf');
            fixture.detectChanges();
            component.inputPage('1');
        });

        it('should Total number of pages be loaded', (done) => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.totalPages).toEqual(6);
                    done();
                });
            });
        }, 5000);

        it('should right arrow move to the next page', (done) => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(component.displayPage).toBe(1);
                    EventMock.keyDown(39);
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);
                    done();
                });

            });
        }, 5000);

        it('should nextPage move to the next page', (done) => {
            let nextPageButton: any = element.querySelector('#viewer-next-page-button');

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);
                    nextPageButton.click();
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);
                    done();
                });
            });
        });

        it('should left arrow move to the previous page', (done) => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);
                    EventMock.keyDown(39);
                    EventMock.keyDown(39);
                    EventMock.keyDown(37);
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);
                    done();
                });
            });
        });

        it('should previous page move to the previous page', (done) => {
            let previousPageButton: any = element.querySelector('#viewer-previous-page-button');
            let nextPageButton: any = element.querySelector('#viewer-next-page-button');

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);
                    nextPageButton.click();
                    nextPageButton.click();
                    previousPageButton.click();
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);
                    done();
                });
            });
        });

        it('should previous page not move to the previous page if is page 1', (done) => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);
                    component.previousPage();
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(1);
                    done();
                });
            });
        });

        it('should Input page move to the inserted page', (done) => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);
                    component.inputPage('2');
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);
                    done();
                });
            });
        });

        describe('Zoom', () => {

            beforeEach(() => {
                component.currentScale = 1;
                fixture.detectChanges();
            });

            it('should zoom in increment the scale value', (done) => {
                let zoomInButton: any = element.querySelector('#viewer-zoom-in-button');

                component.ngOnChanges(null).then(() => {
                    let zoomBefore = component.currentScale;
                    zoomInButton.click();
                    expect(component.currentScaleMode).toBe('auto');
                    let currentZoom = component.currentScale;
                    expect(zoomBefore < currentZoom).toBe(true);
                    done();
                });
            });

            it('should zoom out decrement the scale value', (done) => {
                let zoomOutButton: any = element.querySelector('#viewer-zoom-out-button');

                component.ngOnChanges(null).then(() => {
                    let zoomBefore = component.currentScale;
                    zoomOutButton.click();
                    expect(component.currentScaleMode).toBe('auto');
                    let currentZoom = component.currentScale;
                    expect(zoomBefore > currentZoom).toBe(true);
                    done();
                });
            });

            it('should fit-in button toggle page-fit and auto scale mode', (done) => {
                let fitPage: any = element.querySelector('#viewer-scale-page-button');

                component.ngOnChanges(null).then(() => {
                    expect(component.currentScaleMode).toBe('auto');
                    fitPage.click();
                    expect(component.currentScaleMode).toBe('page-fit');
                    fitPage.click();
                    expect(component.currentScaleMode).toBe('auto');
                    done();
                });
            }, 5000);
        });
    });

    describe('Resize interaction', () => {

        beforeEach(() => {
            component.urlFile = require('../assets/fake-test-file.pdf');
            fixture.detectChanges();
            component.inputPage('1');
        });
        it('should resize event trigger setScaleUpdatePages', (done) => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    spyOn(component, 'onResize');
                    EventMock.resizeMobileView();
                    expect(component.onResize).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    describe('scroll interaction', () => {

        beforeEach(() => {
            component.urlFile = require('../assets/fake-test-file.pdf');
            fixture.detectChanges();
        });
        it('should scroll page return the current page', (done) => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);
                    component.inputPage('2');
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);
                    let documentContainer = element.querySelector('#viewer-pdf-container');
                    documentContainer.scrollTop = 100000;
                    component.watchScroll(documentContainer);
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(6);
                    done();
                });
            });
        });
    });
});

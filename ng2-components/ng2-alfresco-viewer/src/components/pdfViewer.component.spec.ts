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

    let component: any;
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

    beforeEach(() => {
        fixture = TestBed.createComponent(PdfViewerComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;

        component.showToolbar = true;
        component.urlFile = 'base/src/assets/fake-test-file.pdf';

        fixture.detectChanges();
    });

    describe('View', () => {

        it('If urlfile is not present should not be thrown any error ', () => {
            component.urlFile = undefined;

            fixture.detectChanges();

            expect(() => {
                component.ngOnChanges();
            }).toThrow();
        });

        it('Canvas should be present', () => {
            expect(element.querySelector('#viewer-viewerPdf')).not.toBeNull();
            expect(element.querySelector('#viewer-pdf-container')).not.toBeNull();
        });

        it('Loader should be present', () => {
            expect(element.querySelector('#loader-container')).not.toBeNull();
        });

        it('Next an Previous Buttons should be present', () => {
            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });

        it('Input Page elements should be present', () => {
            expect(element.querySelector('#viewer-pagenumber-input')).toBeDefined();
            expect(element.querySelector('#viewer-total-pages')).toBeDefined();

            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });

        it('Toolbar should be hide if showToolbar is false', () => {
            component.showToolbar = false;

            fixture.detectChanges();

            expect(element.querySelector('#viewer-toolbar-command')).toBeNull();
            expect(element.querySelector('#viewer-toolbar-pagination')).toBeNull();
        });
    });

    describe('User interaction', () => {

        beforeEach(() => {
            component.inputPage(1);
        });

        it('Total number of pages should be loaded', (done) => {
            component.ngOnChanges().then(() => {
                fixture.detectChanges();
                expect(component.totalPages).toEqual(6);
                done();
            });
        }, 5000);

        it('right arrow should move to the next page', (done) => {
            component.ngOnChanges().then(() => {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                EventMock.keyDown(39);
                fixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        }, 5000);

        it('nextPage should move to the next page', (done) => {
            let nextPageButton: any = element.querySelector('#viewer-next-page-button');

            component.ngOnChanges().then(() => {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                nextPageButton.click();
                fixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        });

        it('left arrow should move to the previous page', (done) => {
            component.ngOnChanges().then(() => {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                EventMock.keyDown(39);
                EventMock.keyDown(39);
                EventMock.keyDown(37);
                fixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        });

        it('previous page should move to the previous page', (done) => {
            let previousPageButton: any = element.querySelector('#viewer-previous-page-button');
            let nextPageButton: any = element.querySelector('#viewer-next-page-button');

            component.ngOnChanges().then(() => {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                nextPageButton.click();
                nextPageButton.click();
                previousPageButton.click();
                fixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        });

        it('previous page should not move to the previous page if is page 1', (done) => {
            component.ngOnChanges().then(() => {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                component.previousPage();
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                done();
            });
        });

        it('Input page should move to the inserted page', (done) => {
            component.ngOnChanges().then(() => {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                component.inputPage('2');
                fixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        });

        describe('Zoom', () => {

            beforeEach(() => {
                component.currentScale = 1;
                fixture.detectChanges();
            });

            it('In should increment the scale value', (done) => {
                let zoomInButton: any = element.querySelector('#viewer-zoom-in-button');

                component.ngOnChanges().then(() => {
                    let zoomBefore = component.currentScale;
                    zoomInButton.click();
                    expect(component.currentScaleMode).toBe('auto');
                    let currentZoom = component.currentScale;
                    expect(zoomBefore < currentZoom).toBe(true);
                    done();
                });
            });

            it('Out should decrement the scale value', (done) => {
                let zoomOutButton: any = element.querySelector('#viewer-zoom-out-button');

                component.ngOnChanges().then(() => {
                    let zoomBefore = component.currentScale;
                    zoomOutButton.click();
                    expect(component.currentScaleMode).toBe('auto');
                    let currentZoom = component.currentScale;
                    expect(zoomBefore > currentZoom).toBe(true);
                    done();
                });
            });

            it('fit-in button should toggle page-fit and auto scale mode', (done) => {
                let fitPage: any = element.querySelector('#viewer-scale-page-button');

                component.ngOnChanges().then(() => {
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
        it('resize event should trigger setScaleUpdatePages', (done) => {
            component.ngOnChanges().then(() => {
                fixture.detectChanges();
                spyOn(component, 'onResize');
                component.documentContainer = element.querySelector('#viewer-pdf-container');
                EventMock.resizeMobileView();
                expect(component.onResize).toHaveBeenCalled();
                done();
            }, 5000);
        });
    });

    describe('scroll interaction', () => {
        it('scroll page should return the current page', (done) => {
            component.ngOnChanges().then(() => {
                fixture.detectChanges();
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

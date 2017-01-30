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
"use strict";
var testing_1 = require("@angular/core/testing");
var rendering_queue_services_1 = require("../services/rendering-queue.services");
var pdfViewer_component_1 = require("./pdfViewer.component");
var event_mock_1 = require("../assets/event.mock");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
describe('Test ng2-alfresco-viewer PdfViewer component', function () {
    var component;
    var fixture;
    var debug;
    var element;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule
            ],
            declarations: [pdfViewer_component_1.PdfViewerComponent],
            providers: [
                ng2_alfresco_core_1.AlfrescoSettingsService,
                ng2_alfresco_core_1.AlfrescoAuthenticationService,
                ng2_alfresco_core_1.AlfrescoApiService,
                rendering_queue_services_1.RenderingQueueServices
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(pdfViewer_component_1.PdfViewerComponent);
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.showToolbar = true;
        component.urlFile = 'base/src/assets/fake-test-file.pdf';
        fixture.detectChanges();
    });
    describe('View', function () {
        it('If urlfile is not present should not be thrown any error ', function () {
            component.urlFile = undefined;
            fixture.detectChanges();
            expect(function () {
                component.ngOnChanges();
            }).toThrow();
        });
        it('Canvas should be present', function () {
            expect(element.querySelector('#viewer-viewerPdf')).not.toBeNull();
            expect(element.querySelector('#viewer-pdf-container')).not.toBeNull();
        });
        it('Loader should be present', function () {
            expect(element.querySelector('#loader-container')).not.toBeNull();
        });
        it('Next an Previous Buttons should be present', function () {
            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });
        it('Input Page elements should be present', function () {
            expect(element.querySelector('#viewer-pagenumber-input')).toBeDefined();
            expect(element.querySelector('#viewer-total-pages')).toBeDefined();
            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });
        it('Toolbar should be hide if showToolbar is false', function () {
            component.showToolbar = false;
            fixture.detectChanges();
            expect(element.querySelector('#viewer-toolbar-command')).toBeNull();
            expect(element.querySelector('#viewer-toolbar-pagination')).toBeNull();
        });
    });
    describe('User interaction', function () {
        beforeEach(function () {
            component.inputPage(1);
        });
        it('Total number of pages should be loaded', function (done) {
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(component.totalPages).toEqual(6);
                done();
            });
        }, 5000);
        it('right arrow should move to the next page', function (done) {
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                event_mock_1.EventMock.keyDown(39);
                fixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        }, 5000);
        it('nextPage should move to the next page', function (done) {
            var nextPageButton = element.querySelector('#viewer-next-page-button');
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                nextPageButton.click();
                fixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        });
        it('left arrow should move to the previous page', function (done) {
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                event_mock_1.EventMock.keyDown(39);
                event_mock_1.EventMock.keyDown(39);
                event_mock_1.EventMock.keyDown(37);
                fixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        });
        it('previous page should move to the previous page', function (done) {
            var previousPageButton = element.querySelector('#viewer-previous-page-button');
            var nextPageButton = element.querySelector('#viewer-next-page-button');
            component.ngOnChanges().then(function () {
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
        it('previous page should not move to the previous page if is page 1', function (done) {
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                component.previousPage();
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                done();
            });
        });
        it('Input page should move to the inserted page', function (done) {
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                component.inputPage('2');
                fixture.detectChanges();
                expect(component.displayPage).toBe(2);
                done();
            });
        });
        describe('Zoom', function () {
            beforeEach(function () {
                component.currentScale = 1;
                fixture.detectChanges();
            });
            it('In should increment the scale value', function (done) {
                var zoomInButton = element.querySelector('#viewer-zoom-in-button');
                component.ngOnChanges().then(function () {
                    var zoomBefore = component.currentScale;
                    zoomInButton.click();
                    expect(component.currentScaleMode).toBe('auto');
                    var currentZoom = component.currentScale;
                    expect(zoomBefore < currentZoom).toBe(true);
                    done();
                });
            });
            it('Out should decrement the scale value', function (done) {
                var zoomOutButton = element.querySelector('#viewer-zoom-out-button');
                component.ngOnChanges().then(function () {
                    var zoomBefore = component.currentScale;
                    zoomOutButton.click();
                    expect(component.currentScaleMode).toBe('auto');
                    var currentZoom = component.currentScale;
                    expect(zoomBefore > currentZoom).toBe(true);
                    done();
                });
            });
            it('fit-in button should toggle page-fit and auto scale mode', function (done) {
                var fitPage = element.querySelector('#viewer-scale-page-button');
                component.ngOnChanges().then(function () {
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
    describe('Resize interaction', function () {
        it('resize event should trigger setScaleUpdatePages', function (done) {
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                spyOn(component, 'onResize');
                component.documentContainer = element.querySelector('#viewer-pdf-container');
                event_mock_1.EventMock.resizeMobileView();
                expect(component.onResize).toHaveBeenCalled();
                done();
            }, 5000);
        });
    });
    describe('scroll interaction', function () {
        it('scroll page should return the current page', function (done) {
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(component.displayPage).toBe(1);
                component.inputPage('2');
                fixture.detectChanges();
                expect(component.displayPage).toBe(2);
                var documentContainer = element.querySelector('#viewer-pdf-container');
                documentContainer.scrollTop = 100000;
                component.watchScroll(documentContainer);
                fixture.detectChanges();
                expect(component.displayPage).toBe(6);
                done();
            });
        });
    });
});
//# sourceMappingURL=pdfViewer.component.spec.js.map
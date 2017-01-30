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
var pdfViewer_component_1 = require("./pdfViewer.component");
var notSupportedFormat_component_1 = require("./notSupportedFormat.component");
var mediaPlayer_component_1 = require("./mediaPlayer.component");
var imgViewer_component_1 = require("./imgViewer.component");
var rendering_queue_services_1 = require("../services/rendering-queue.services");
var viewer_component_1 = require("./viewer.component");
var event_mock_1 = require("../assets/event.mock");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
describe('Test ng2-alfresco-viewer ViewerComponent', function () {
    var component;
    var fixture;
    var debug;
    var element;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule
            ],
            declarations: [
                viewer_component_1.ViewerComponent,
                pdfViewer_component_1.PdfViewerComponent,
                notSupportedFormat_component_1.NotSupportedFormat,
                mediaPlayer_component_1.MediaPlayerComponent,
                imgViewer_component_1.ImgViewerComponent
            ],
            providers: [
                ng2_alfresco_core_1.AlfrescoSettingsService,
                ng2_alfresco_core_1.AlfrescoAuthenticationService,
                ng2_alfresco_core_1.AlfrescoApiService,
                rendering_queue_services_1.RenderingQueueServices
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(viewer_component_1.ViewerComponent);
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        jasmine.Ajax.install();
        component.showToolbar = true;
        component.urlFile = 'base/src/assets/fake-test-file.pdf';
        fixture.detectChanges();
        fixture.detectChanges();
    });
    afterEach(function () {
        jasmine.Ajax.uninstall();
    });
    describe('View', function () {
        describe('Overlay mode true', function () {
            beforeEach(function () {
                component.overlayMode = true;
                fixture.detectChanges();
            });
            it('shadow overlay should be present if is overlay mode', function () {
                expect(element.querySelector('#viewer-shadow-transparent')).not.toBeNull();
            });
            it('header should be present if is overlay mode', function () {
                expect(element.querySelector('header')).not.toBeNull();
            });
            it('Name File should be present if is overlay mode ', function () {
                component.ngOnChanges().then(function () {
                    fixture.detectChanges();
                    expect(element.querySelector('#viewer-name-file').innerHTML).toEqual('fake-test-file.pdf');
                });
            });
            it('Close button should be present if overlay mode', function () {
                expect(element.querySelector('#viewer-close-button')).not.toBeNull();
            });
            it('Click on close button should hide the viewer', function () {
                var closebutton = element.querySelector('#viewer-close-button');
                closebutton.click();
                fixture.detectChanges();
                expect(element.querySelector('#viewer-main-container')).toBeNull();
            });
            it('Esc button should hide the viewer', function () {
                event_mock_1.EventMock.keyDown(27);
                fixture.detectChanges();
                expect(element.querySelector('#viewer-main-container')).toBeNull();
            });
            it('all-space class should not be present if is in overlay mode', function () {
                expect(element.querySelector('#viewer').getAttribute('class')).toEqual('');
            });
        });
        describe('Overlay mode false', function () {
            beforeEach(function () {
                component.overlayMode = false;
                fixture.detectChanges();
            });
            it('header should be NOT be present if is not overlay mode', function () {
                expect(element.querySelector('header')).toBeNull();
            });
            it('Close button should be not present if is not overlay mode', function () {
                expect(element.querySelector('#viewer-close-button')).toBeNull();
            });
            it('Esc button should not  hide the viewer if is not overlay mode', function () {
                event_mock_1.EventMock.keyDown(27);
                fixture.detectChanges();
                expect(element.querySelector('#viewer-main-container')).not.toBeNull();
            });
            it('all-space class should be present if is not overlay mode', function () {
                expect(element.querySelector('#viewer').getAttribute('class')).toEqual('all-space');
            });
        });
    });
    describe('Attribute', function () {
        it('Url or fileNodeId File should be mandatory', function () {
            component.showViewer = true;
            component.fileNodeId = undefined;
            component.urlFile = undefined;
            expect(function () {
                component.ngOnChanges();
            }).toThrow();
        });
        it('If FileNodeId is present should not be thrown any error ', function () {
            component.showViewer = true;
            component.fileNodeId = 'file-node-id';
            component.urlFile = undefined;
            expect(function () {
                component.ngOnChanges();
            }).not.toThrow();
        });
        it('If urlFile is present should not be thrown any error ', function () {
            component.showViewer = true;
            component.fileNodeId = undefined;
            expect(function () {
                component.ngOnChanges();
            }).not.toThrow();
        });
        it('showViewer default value should be true', function () {
            expect(component.showViewer).toBe(true);
        });
        it('if showViewer value is false the viewer should be hide', function () {
            component.showViewer = false;
            fixture.detectChanges();
            expect(element.querySelector('#viewer-main-container')).toBeNull();
        });
    });
    describe('Extension Type Test', function () {
        it('if extension file is a pdf the pdf viewer should be loaded', function (done) {
            component.urlFile = 'base/src/assets/fake-test-file.pdf';
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(element.querySelector('pdf-viewer')).not.toBeNull();
                done();
            });
        });
        it('if extension file is a image the img viewer should be loaded', function (done) {
            component.urlFile = 'fake-url-file.png';
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });
        it('if extension file is a video the the media player should be loaded', function (done) {
            component.urlFile = 'fake-url-file.mp4';
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(element.querySelector('media-player')).not.toBeNull();
                done();
            });
        });
        it('if extension file is a not supported the not supported div should be loaded', function (done) {
            component.urlFile = 'fake-url-file.unsupported';
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(element.querySelector('not-supported-format')).not.toBeNull();
                done();
            });
        });
    });
    describe('MimeType handling', function () {
        it('should display a PDF file identified by mimetype when the filename has no extension', function (done) {
            component.urlFile = 'content';
            component.mimeType = 'application/pdf';
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(element.querySelector('pdf-viewer')).not.toBeNull();
                done();
            });
        });
        it('should display a PDF file identified by mimetype when the file extension is wrong', function (done) {
            component.urlFile = 'content.bin';
            component.mimeType = 'application/pdf';
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(element.querySelector('pdf-viewer')).not.toBeNull();
                done();
            });
        });
        it('should display an image file identified by mimetype when the filename has no extension', function (done) {
            component.urlFile = 'content';
            component.mimeType = 'image/png';
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });
        it('should display a image file identified by mimetype when the file extension is wrong', function (done) {
            component.urlFile = 'content.bin';
            component.mimeType = 'image/png';
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });
        it('should display the media player if the file identified by mimetype is a media when the filename has wrong extension', function (done) {
            component.urlFile = 'content.bin';
            component.mimeType = 'video/mp4';
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(element.querySelector('media-player')).not.toBeNull();
                done();
            });
        });
        it('should display the media player if the file identified by mimetype is a media when the filename has no extension', function (done) {
            component.urlFile = 'content';
            component.mimeType = 'video/mp4';
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(element.querySelector('media-player')).not.toBeNull();
                done();
            });
        });
        it('should not display the media player if the file identified by mimetype is a media but with not supported extension', function (done) {
            component.urlFile = 'content';
            component.mimeType = 'video/avi';
            component.ngOnChanges().then(function () {
                fixture.detectChanges();
                expect(element.querySelector('media-player')).toBeNull();
                done();
            });
        });
    });
});
//# sourceMappingURL=viewer.component.spec.js.map
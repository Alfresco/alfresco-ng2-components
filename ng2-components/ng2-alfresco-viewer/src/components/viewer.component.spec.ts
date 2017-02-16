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
import { PdfViewerComponent } from './pdfViewer.component';
import { NotSupportedFormat } from './notSupportedFormat.component';
import { MediaPlayerComponent } from './mediaPlayer.component';
import { ImgViewerComponent } from './imgViewer.component';
import { RenderingQueueServices } from '../services/rendering-queue.services';
import { ViewerComponent } from './viewer.component';
import { EventMock } from '../assets/event.mock';
import { DebugElement }    from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    CoreModule
} from 'ng2-alfresco-core';

declare let jasmine: any;

describe('Test ng2-alfresco-viewer ViewerComponent', () => {

    let component: ViewerComponent;
    let fixture: ComponentFixture<ViewerComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                ViewerComponent,
                PdfViewerComponent,
                NotSupportedFormat,
                MediaPlayerComponent,
                ImgViewerComponent
            ],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService,
                RenderingQueueServices
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewerComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;

        jasmine.Ajax.install();

        component.showToolbar = true;
        component.urlFile = 'base/src/assets/fake-test-file.pdf';
        fixture.detectChanges();

        fixture.detectChanges();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('View', () => {

        describe('Overlay mode true', () => {

            beforeEach(() => {
                component.overlayMode = true;
                fixture.detectChanges();
            });

            it('shadow overlay should be present if is overlay mode', () => {
                expect(element.querySelector('#viewer-shadow-transparent')).not.toBeNull();
            });

            it('header should be present if is overlay mode', () => {
                expect(element.querySelector('header')).not.toBeNull();
            });

            it('Name File should be present if is overlay mode ', () => {
                component.ngOnChanges(null).then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#viewer-name-file').innerHTML).toEqual('fake-test-file.pdf');
                });
            });

            it('Close button should be present if overlay mode', () => {
                expect(element.querySelector('#viewer-close-button')).not.toBeNull();
            });

            it('Click on close button should hide the viewer', () => {
                let closebutton: any = element.querySelector('#viewer-close-button');
                closebutton.click();
                fixture.detectChanges();
                expect(element.querySelector('#viewer-main-container')).toBeNull();
            });

            it('Esc button should hide the viewer', () => {
                EventMock.keyDown(27);
                fixture.detectChanges();
                expect(element.querySelector('#viewer-main-container')).toBeNull();
            });

            it('all-space class should not be present if is in overlay mode', () => {
                expect(element.querySelector('#viewer').getAttribute('class')).toEqual('');
            });
        });

        describe('Overlay mode false', () => {

            beforeEach(() => {
                component.overlayMode = false;
                fixture.detectChanges();
            });

            it('header should be NOT be present if is not overlay mode', () => {
                expect(element.querySelector('header')).toBeNull();
            });

            it('Close button should be not present if is not overlay mode', () => {
                expect(element.querySelector('#viewer-close-button')).toBeNull();
            });

            it('Esc button should not  hide the viewer if is not overlay mode', () => {
                EventMock.keyDown(27);
                fixture.detectChanges();
                expect(element.querySelector('#viewer-main-container')).not.toBeNull();
            });

            it('all-space class should be present if is not overlay mode', () => {
                expect(element.querySelector('#viewer').getAttribute('class')).toEqual('all-space');
            });
        });
    });

    describe('Attribute', () => {
        it('Url or fileNodeId File should be mandatory', () => {
            component.showViewer = true;
            component.fileNodeId = undefined;
            component.urlFile = undefined;

            expect(() => {
                component.ngOnChanges(null);
            }).toThrow();
        });

        it('If FileNodeId is present should not be thrown any error ', () => {
            component.showViewer = true;
            component.fileNodeId = 'file-node-id';
            component.urlFile = undefined;

            expect(() => {
                component.ngOnChanges(null);
            }).not.toThrow();
        });

        it('If urlFile is present should not be thrown any error ', () => {
            component.showViewer = true;
            component.fileNodeId = undefined;

            expect(() => {
                component.ngOnChanges(null);
            }).not.toThrow();
        });

        it('showViewer default value should be true', () => {
            expect(component.showViewer).toBe(true);
        });

        it('if showViewer value is false the viewer should be hide', () => {
            component.showViewer = false;

            fixture.detectChanges();
            expect(element.querySelector('#viewer-main-container')).toBeNull();
        });
    });

    describe('Extension Type Test', () => {
        it('if extension file is a pdf the pdf viewer should be loaded', (done) => {
            component.urlFile = 'base/src/assets/fake-test-file.pdf';

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                expect(element.querySelector('pdf-viewer')).not.toBeNull();
                done();
            });
        });

        it('if extension file is a image the img viewer should be loaded', (done) => {
            component.urlFile = 'fake-url-file.png';

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });

        it('if extension file is a video the the media player should be loaded', (done) => {
            component.urlFile = 'fake-url-file.mp4';

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                expect(element.querySelector('media-player')).not.toBeNull();
                done();
            });
        });

        it('if extension file is a not supported the not supported div should be loaded', (done) => {
            component.urlFile = 'fake-url-file.unsupported';

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                expect(element.querySelector('not-supported-format')).not.toBeNull();
                done();
            });
        });
    });

    describe('MimeType handling', () => {
        it('should display a PDF file identified by mimetype when the filename has no extension', (done) => {
            component.urlFile = 'content';
            component.mimeType = 'application/pdf';

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                expect(element.querySelector('pdf-viewer')).not.toBeNull();
                done();
            });

        });

        it('should display a PDF file identified by mimetype when the file extension is wrong', (done) => {
            component.urlFile = 'content.bin';
            component.mimeType = 'application/pdf';

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                expect(element.querySelector('pdf-viewer')).not.toBeNull();
                done();
            });
        });

        it('should display an image file identified by mimetype when the filename has no extension', (done) => {
            component.urlFile = 'content';
            component.mimeType = 'image/png';

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });

        it('should display a image file identified by mimetype when the file extension is wrong', (done) => {
            component.urlFile = 'content.bin';
            component.mimeType = 'image/png';

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });

        it('should display the media player if the file identified by mimetype is a media when the filename has wrong extension', (done) => {
            component.urlFile = 'content.bin';
            component.mimeType = 'video/mp4';

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                expect(element.querySelector('media-player')).not.toBeNull();
                done();
            });
        });

        it('should display the media player if the file identified by mimetype is a media when the filename has no extension', (done) => {
            component.urlFile = 'content';
            component.mimeType = 'video/mp4';

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                expect(element.querySelector('media-player')).not.toBeNull();
                done();
            });
        });

        it('should not display the media player if the file identified by mimetype is a media but with not supported extension', (done) => {
            component.urlFile = 'content';
            component.mimeType = 'video/avi';

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                expect(element.querySelector('media-player')).toBeNull();
                done();
            });
        });
    });

    describe('Events', () => {
        it('if extension change exextensionChange event should be fired ', (done) => {

            component.extensionChange.subscribe((fileExtension) => {
                expect(fileExtension).toEqual('png');
                done();
            });

            component.urlFile = 'fake-url-file.png';

            component.ngOnChanges(null);
        });
    });
});

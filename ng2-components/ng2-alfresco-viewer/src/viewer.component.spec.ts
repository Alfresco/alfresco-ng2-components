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
import {ViewerComponent} from './viewer.component';
import {EventMock} from './assets/event.mock';
import {AlfrescoAuthenticationService, AlfrescoSettingsService} from 'ng2-alfresco-core';

describe('ViewerComponent', () => {

    let viewerComponentFixture, element, component;

    beforeEachProviders(() => {
        return [
            AlfrescoSettingsService,
            AlfrescoAuthenticationService
        ];
    });

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(ViewerComponent)
            .then(fixture => {
                viewerComponentFixture = fixture;
                element = viewerComponentFixture.nativeElement;
                component = viewerComponentFixture.componentInstance;

                component.urlFile = 'fake-url-file';
                component.overlayMode = true;

                viewerComponentFixture.detectChanges();
            });
    }));

    describe('View', () => {
        it('shadow overlay should be present if is overlay mode', () => {
            expect(element.querySelector('#viewer-shadow-transparent')).not.toBeNull();
        });

        it('header should be present if is overlay mode', () => {
            expect(element.querySelector('header')).not.toBeNull();
        });

        it('header should be NOT be present if is not overlay mode', () => {
            component.overlayMode = false;

            viewerComponentFixture.detectChanges();

            expect(element.querySelector('header')).toBeNull();
        });

        it('Name File should be present if is overlay mode ', () => {
            component.urlFile = 'http://localhost:9876/fake-url-file.pdf';
            component.overlayMode = true;

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('#viewer-name-file').innerHTML).toEqual('fake-url-file.pdf');
            });
        });

        it('Close button should be present if overlay mode', () => {
            component.urlFile = 'fake-url-file';
            component.overlayMode = true;

            viewerComponentFixture.detectChanges();

            expect(element.querySelector('#viewer-close-button')).not.toBeNull();
        });

        it('Close button should be not present if is not overlay mode', () => {
            component.urlFile = 'fake-url-file';
            component.overlayMode = false;

            viewerComponentFixture.detectChanges();

            expect(element.querySelector('#viewer-close-button')).toBeNull();
        });

        it('Click on close button should hide the viewer', () => {
            component.urlFile = 'fake-url-file';
            component.overlayMode = true;

            viewerComponentFixture.detectChanges();
            element.querySelector('#viewer-close-button').click();
            viewerComponentFixture.detectChanges();
            expect(element.querySelector('#viewer-main-container')).toBeNull();

        });

        it('Esc button should not  hide the viewerls if is not overlay mode', () => {
            component.overlayMode = false;

            component.urlFile = 'fake-url-file';

            viewerComponentFixture.detectChanges();
            EventMock.keyDown(27);
            viewerComponentFixture.detectChanges();
            expect(element.querySelector('#viewer-main-container')).not.toBeNull();
        });

        it('Esc button should hide the viewer', () => {
            component.urlFile = 'fake-url-file';
            component.overlayMode = true;

            viewerComponentFixture.detectChanges();
            EventMock.keyDown(27);
            viewerComponentFixture.detectChanges();
            expect(element.querySelector('#viewer-main-container')).toBeNull();
        });

    });

    describe('Attribute', () => {
        it('Url File should be mandatory', () => {
            component.showViewer = true;
            component.urlFile = undefined;

            expect(() => {
                component.ngOnChanges();
            }).toThrow();
        });

        it('showViewer default value should be true', () => {
            expect(component.showViewer).toBe(true);
        });

        it('if showViewer value is false the viewer should be hide', () => {
            component.urlFile = 'fake-url-file';
            component.showViewer = false;

            viewerComponentFixture.detectChanges();
            expect(element.querySelector('#viewer-main-container')).toBeNull();
        });
    });

    describe('Extension Type Test', () => {
        it('if extension file is a pdf the pdf viewer should be loaded', (done) => {
            component.urlFile = 'fake-url-file.pdf';

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('pdf-viewer')).not.toBeNull();
                done();
            });
        });

        it('if extension file is a image the img viewer should be loaded', (done) => {
            component.urlFile = 'fake-url-file.png';

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });

        it('if extension file is a not supported the not supported div should be loaded', (done) => {
            component.urlFile = 'fake-url-file.unsupported';

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('not-supported-format')).not.toBeNull();
                done();
            });
        });
    });

    describe('MimeType handling', () => {
        it('should display a PDF file identified by mimetype when the filename has no extension', (done) => {
            component.urlFile = 'content';
            component.mimeType = 'application/pdf';

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('pdf-viewer')).not.toBeNull();
                done();
            });

        });

        it('should display a PDF file identified by mimetype when the file extension is wrong', (done) => {
            component.urlFile = 'content.bin';
            component.mimeType = 'application/pdf';

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('pdf-viewer')).not.toBeNull();
                done();
            });
        });

        it('should display an image file identified by mimetype when the filename has no extension', (done) => {
            component.urlFile = 'content';
            component.mimeType = 'image/png';

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });

        it('should display a image file identified by mimetype when the file extension is wrong', (done) => {
            component.urlFile = 'content.bin';
            component.mimeType = 'image/png';

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });
    });
});

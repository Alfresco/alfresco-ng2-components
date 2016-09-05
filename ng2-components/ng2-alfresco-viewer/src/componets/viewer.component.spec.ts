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

import { describe, expect, it, inject, beforeEachProviders, beforeEach, afterEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { ViewerComponent } from './viewer.component';
import { EventMock } from '../assets/event.mock';
import { AlfrescoAuthenticationService, AlfrescoSettingsService, AlfrescoApiService } from 'ng2-alfresco-core';
import { RenderingQueueServices } from '../services/rendering-queue.services';

declare let jasmine: any;

describe('ViewerComponent', () => {

    let viewerComponentFixture, element, component;

    beforeEachProviders(() => {
        return [
            AlfrescoApiService,
            AlfrescoSettingsService,
            AlfrescoAuthenticationService,
            RenderingQueueServices
        ];
    });

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(ViewerComponent)
            .then(fixture => {
                viewerComponentFixture = fixture;
                element = viewerComponentFixture.nativeElement;
                component = viewerComponentFixture.componentInstance;

                jasmine.Ajax.install();

                component.urlFile = 'base/src/assets/fake-test-file.pdf';

                component.overlayMode = true;

                viewerComponentFixture.detectChanges();
            });
    }));

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

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
            component.overlayMode = true;

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('#viewer-name-file').innerHTML).toEqual('fake-test-file.pdf');
            });
        });

        it('Close button should be present if overlay mode', () => {
            component.overlayMode = true;

            viewerComponentFixture.detectChanges();

            expect(element.querySelector('#viewer-close-button')).not.toBeNull();
        });

        it('Close button should be not present if is not overlay mode', () => {
            component.overlayMode = false;

            viewerComponentFixture.detectChanges();

            expect(element.querySelector('#viewer-close-button')).toBeNull();
        });

        it('Click on close button should hide the viewer', () => {
            component.overlayMode = true;

            viewerComponentFixture.detectChanges();
            element.querySelector('#viewer-close-button').click();
            viewerComponentFixture.detectChanges();
            expect(element.querySelector('#viewer-main-container')).toBeNull();

        });

        it('Esc button should not  hide the viewerls if is not overlay mode', () => {
            component.overlayMode = false;

            viewerComponentFixture.detectChanges();
            EventMock.keyDown(27);
            viewerComponentFixture.detectChanges();
            expect(element.querySelector('#viewer-main-container')).not.toBeNull();
        });

        it('Esc button should hide the viewer', () => {
            component.overlayMode = true;

            viewerComponentFixture.detectChanges();
            EventMock.keyDown(27);
            viewerComponentFixture.detectChanges();
            expect(element.querySelector('#viewer-main-container')).toBeNull();
        });

    });

    describe('Attribute', () => {
        it('Url or fileNodeId File should be mandatory', () => {
            component.showViewer = true;
            component.fileNodeId = undefined;
            component.urlFile = undefined;

            expect(() => {
                component.ngOnChanges();
            }).toThrow();
        });

        it('If FileNodeId is present should not be thrown any error ', () => {
            component.showViewer = true;
            component.fileNodeId = 'file-node-id';
            component.urlFile = undefined;

            expect(() => {
                component.ngOnChanges();
            }).not.toThrow();
        });

        it('If urlFile is present should not be thrown any error ', () => {
            component.showViewer = true;
            component.fileNodeId = undefined;

            expect(() => {
                component.ngOnChanges();
            }).not.toThrow();
        });

        it('If FileNodeId is present the node api should be called', (done) => {
            component.showViewer = true;
            component.fileNodeId = 'file-node-id';
            component.urlFile = undefined;

            jasmine.Ajax.stubRequest(
                'http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/file-node-id'
            ).andReturn({
                status: 200,
                responseText: '{"entry":{"isFile":true,"createdByUser":{"id":"admin","displayName":"Administrator"},' +
                '"modifiedAt":"2016-08-05T23:08:22.730+0000","nodeType":"cm:content","content":' +
                '{"mimeType":"application/pdf","mimeTypeName":"Adobe PDF Document","sizeInBytes":' +
                '381778,"encoding":"UTF-8"},"parentId":"8f2105b4-daaf-4874-9e8a-2152569d109b","createdAt":"2016-08-05T23:08:22.730+0000","isFolder":false,' +
                '"modifiedByUser":{"id":"admin","displayName":"Administrator"},"name":"content.pdf","id":' +
                '"b8bd4c81-6f2e-4ec2-9c4d-30c97cf42bc8"}}'
            });

            component.ngOnChanges().then(() => {
                expect(jasmine.Ajax.requests.mostRecent().url.endsWith('nodes/file-node-id')).toBe(true);
                done();
            });
        });

        it('showViewer default value should be true', () => {
            expect(component.showViewer).toBe(true);
        });

        it('if showViewer value is false the viewer should be hide', () => {
            component.showViewer = false;

            viewerComponentFixture.detectChanges();
            expect(element.querySelector('#viewer-main-container')).toBeNull();
        });
    });

    describe('Extension Type Test', () => {
        it('if extension file is a pdf the pdf viewer should be loaded', (done) => {
            component.urlFile = 'base/src/assets/fake-test-file.pdf';

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

        it('if extension file is a video the the media player should be loaded', (done) => {
            component.urlFile = 'fake-url-file.mp4';

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('media-player')).not.toBeNull();
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

        it('should display the media player if the file identified by mimetype is a media when the filename has wrong extension', (done) => {
            component.urlFile = 'content.bin';
            component.mimeType = 'video/mp4';

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('media-player')).not.toBeNull();
                done();
            });
        });

        it('should display the media player if the file identified by mimetype is a media when the filename has no extension', (done) => {
            component.urlFile = 'content';
            component.mimeType = 'video/mp4';

            component.ngOnChanges().then(() => {
                viewerComponentFixture.detectChanges();
                expect(element.querySelector('media-player')).not.toBeNull();
                done();
            });
        });
    });
});

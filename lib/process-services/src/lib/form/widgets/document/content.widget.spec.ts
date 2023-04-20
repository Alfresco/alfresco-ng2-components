/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
    ContentLinkModel,
    CoreTestingModule,
    setupTestBed,
    DownloadService
} from '@alfresco/adf-core';
import { of } from 'rxjs';
import { ContentWidgetComponent } from './content.widget';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessContentService } from '../../services/process-content.service';

declare let jasmine: any;

describe('ContentWidgetComponent', () => {

    let component: ContentWidgetComponent;
    let fixture: ComponentFixture<ContentWidgetComponent>;
    let element: HTMLElement;

    let processContentService: ProcessContentService;
    let downloadService: DownloadService;

    const createFakeImageBlob = () => {
        const data = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        return new Blob([data], {type: 'image/png'});
    };

    const createFakePdfBlob = (): Blob => {
        const pdfData = atob(
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
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        downloadService = TestBed.inject(DownloadService);
        processContentService = TestBed.inject(ProcessContentService);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentWidgetComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('Rendering tests', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should display content thumbnail', () => {
            component.showDocumentContent = true;
            component.content = new ContentLinkModel();
            fixture.detectChanges();

            const content = fixture.debugElement.query(By.css('div.upload-widget__content-thumbnail'));
            expect(content).toBeDefined();
        });

        it('should load the thumbnail preview of the png image', fakeAsync(() => {
            const blob = createFakeImageBlob();
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(blob));

            component.thumbnailLoaded.subscribe((res) => {
                fixture.detectChanges();
                expect(res).toBeDefined();
                expect(res.changingThisBreaksApplicationSecurity).toBeDefined();
                expect(res.changingThisBreaksApplicationSecurity).toContain('blob');

                const thumbnailPreview: any = element.querySelector('#thumbnailPreview');
                expect(thumbnailPreview.src).toContain('blob');
            });

            const contentId = 1;
            const change = new SimpleChange(null, contentId, true);
            component.ngOnChanges({id: change});

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    id: 4004,
                    name: 'Useful expressions - Email_English.png',
                    created: 1490354907883,
                    createdBy: {
                        id: 2,
                        firstName: 'admin', lastName: 'admin', email: 'administrator@admin.com'
                    },
                    relatedContent: false,
                    contentAvailable: true,
                    link: false,
                    mimeType: 'image/png',
                    simpleType: 'image',
                    previewStatus: 'unsupported',
                    thumbnailStatus: 'unsupported'
                }
            });
        }));

        it('should load the thumbnail preview of a pdf', fakeAsync(() => {
            const blob = createFakePdfBlob();
            spyOn(processContentService, 'getContentThumbnail').and.returnValue(of(blob));

            component.thumbnailLoaded.subscribe((res) => {
                fixture.detectChanges();
                expect(res).toBeDefined();
                expect(res.changingThisBreaksApplicationSecurity).toBeDefined();
                expect(res.changingThisBreaksApplicationSecurity).toContain('blob');

                const thumbnailPreview: any = element.querySelector('#thumbnailPreview');
                expect(thumbnailPreview.src).toContain('blob');
            });

            const contentId = 1;
            const change = new SimpleChange(null, contentId, true);
            component.ngOnChanges({id: change});

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    id: 4004,
                    name: 'FakeBlob.pdf',
                    created: 1490354907883,
                    createdBy: {
                        id: 2,
                        firstName: 'admin', lastName: 'admin', email: 'administrator@admin.com'
                    },
                    relatedContent: false,
                    contentAvailable: true,
                    link: false,
                    mimeType: 'application/pdf',
                    simpleType: 'pdf',
                    previewStatus: 'created',
                    thumbnailStatus: 'created'
                }
            });
        }));

        it('should show unsupported preview with unsupported file', fakeAsync(() => {

            const contentId = 1;
            const change = new SimpleChange(null, contentId, true);
            component.ngOnChanges({id: change});

            component.contentLoaded.subscribe(() => {
                fixture.detectChanges();
                const thumbnailPreview: any = element.querySelector('#unsupported-thumbnail');
                expect(thumbnailPreview).toBeDefined();
                expect(element.querySelector('div.upload-widget__content-text').innerHTML).toEqual('FakeBlob.zip');
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    id: 4004,
                    name: 'FakeBlob.zip',
                    created: 1490354907883,
                    createdBy: {
                        id: 2,
                        firstName: 'admin', lastName: 'admin', email: 'administrator@admin.com'
                    },
                    relatedContent: false,
                    contentAvailable: false,
                    link: false,
                    mimeType: 'application/zip',
                    simpleType: 'zip',
                    previewStatus: 'unsupported',
                    thumbnailStatus: 'unsupported'
                }
            });
        }));

        it('should open the viewer when the view button is clicked', () => {
            const blob = createFakePdfBlob();
            spyOn(processContentService, 'getContentPreview').and.returnValue(of(blob));
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(blob));

            component.content = new ContentLinkModel({
                id: 4004,
                name: 'FakeBlob.pdf',
                created: 1490354907883,
                createdBy: {
                    id: 2,
                    firstName: 'admin', lastName: 'admin', email: 'administrator@admin.com'
                },
                relatedContent: false,
                contentAvailable: true,
                link: false,
                mimeType: 'application/pdf',
                simpleType: 'pdf',
                previewStatus: 'created',
                thumbnailStatus: 'created'
            });

            component.content.thumbnailUrl = '/alfresco-logo.svg';

            component.contentClick.subscribe((content) => {
                expect(content.contentBlob).toBe(blob);
                expect(content.mimeType).toBe('application/pdf');
                expect(content.name).toBe('FakeBlob.pdf');
            });

            fixture.detectChanges();
            const viewButton: any = element.querySelector('#view');
            viewButton.click();
        });

        it('should download the pdf when the download button is clicked', () => {
            const blob = createFakePdfBlob();
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(blob));
            spyOn(downloadService, 'downloadBlob').and.callThrough();

            component.content = new ContentLinkModel({
                id: 4004,
                name: 'FakeBlob.pdf',
                created: 1490354907883,
                createdBy: {
                    id: 2,
                    firstName: 'admin', lastName: 'admin', email: 'administrator@admin.com'
                },
                relatedContent: false,
                contentAvailable: true,
                link: false,
                mimeType: 'application/pdf',
                simpleType: 'pdf',
                previewStatus: 'created',
                thumbnailStatus: 'created'
            });

            component.content.thumbnailUrl = '/alfresco-logo.svg';

            fixture.detectChanges();
            const downloadButton: any = element.querySelector('#download');
            downloadButton.click();

            expect(downloadService.downloadBlob).toHaveBeenCalledWith(blob, 'FakeBlob.pdf');
        });
    });
});

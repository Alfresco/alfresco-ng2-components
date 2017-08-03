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

import { DebugElement, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdTabsModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { AlfrescoTranslationService, ContentService, CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';

import { EcmModelService } from '../../../services/ecm-model.service';
import { FormService } from '../../../services/form.service';
import { ContentLinkModel } from '../index';
import { ContentWidgetComponent } from './content.widget';

declare let jasmine: any;

describe('ContentWidgetComponent', () => {

    let component: ContentWidgetComponent;
    let fixture: ComponentFixture<ContentWidgetComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    let serviceForm: FormService;
    let serviceContent: ContentService;

    function createFakeImageBlob() {
        let data = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        return new Blob([data], {type: 'image/png'});
    }

    function createFakePdfBlob(): Blob {
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MdTabsModule,
                CoreModule.forRoot()
            ],
            declarations: [
                ContentWidgetComponent
            ],
            providers: [
                FormService,
                EcmModelService,
                ContentService
            ]
        }).compileComponents();

        serviceForm = TestBed.get(FormService);
        serviceContent = TestBed.get(ContentService);

        let translateService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService, 'get').and.callFake((key) => {
            return Observable.of(key);
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentWidgetComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
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

            let content = fixture.debugElement.query(By.css('div.upload-widget__content-thumbnail'));
            expect(content).toBeDefined();
        });

        it('should load the thumbnail preview of the png image', (done) => {
            let blob = createFakeImageBlob();
            spyOn(serviceForm, 'getFileRawContent').and.returnValue(Observable.of(blob));

            component.thumbnailLoaded.subscribe((res) => {
                fixture.detectChanges();
                expect(res).toBeDefined();
                expect(res.changingThisBreaksApplicationSecurity).toBeDefined();
                expect(res.changingThisBreaksApplicationSecurity).toContain('blob');
                fixture.whenStable()
                    .then(() => {
                        let thumbnailPreview: any = element.querySelector('#thumbnailPreview');
                        expect(thumbnailPreview.src).toContain('blob');
                    });
                done();
            });

            let contentId = 1;
            let change = new SimpleChange(null, contentId, true);
            component.ngOnChanges({ 'id': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    id: 4004,
                    name: 'Useful expressions - Email_English.png',
                    created: 1490354907883,
                    createdBy: {
                        id: 2,
                        firstName: 'dasdas', 'lastName': 'dasads', 'email': 'administrator@admin.com'
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
        });

        it('should load the thumbnail preview of a pdf', (done) => {
            let blob = createFakePdfBlob();
            spyOn(serviceForm, 'getContentThumbnailUrl').and.returnValue(Observable.of(blob));

            component.thumbnailLoaded.subscribe((res) => {
                fixture.detectChanges();
                expect(res).toBeDefined();
                expect(res.changingThisBreaksApplicationSecurity).toBeDefined();
                expect(res.changingThisBreaksApplicationSecurity).toContain('blob');
                fixture.whenStable()
                    .then(() => {
                        let thumbnailPreview: any = element.querySelector('#thumbnailPreview');
                        expect(thumbnailPreview.src).toContain('blob');
                    });
                done();
            });

            let contentId = 1;
            let change = new SimpleChange(null, contentId, true);
            component.ngOnChanges({'id': change});

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    id: 4004,
                    name: 'FakeBlob.pdf',
                    created: 1490354907883,
                    createdBy: {
                        id: 2,
                        firstName: 'dasdas', 'lastName': 'dasads', 'email': 'administrator@admin.com'
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
        });

        it('should show unsupported preview with unsupported file', (done) => {

            let contentId = 1;
            let change = new SimpleChange(null, contentId, true);
            component.ngOnChanges({'id': change});

            component.contentLoaded.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        let thumbnailPreview: any = element.querySelector('#unsupported-thumbnail');
                        expect(thumbnailPreview).toBeDefined();
                        expect(element.querySelector('div.upload-widget__content-text').innerHTML).toEqual('FakeBlob.zip');
                    });
                done();
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
                        firstName: 'dasdas', 'lastName': 'dasads', 'email': 'administrator@admin.com'
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
        });

        it('should open the viewer when the view button is clicked', (done) => {
            let blob = createFakePdfBlob();
            spyOn(serviceForm, 'getFileRawContent').and.returnValue(Observable.of(blob));

            component.content = new ContentLinkModel({
                id: 4004,
                name: 'FakeBlob.pdf',
                created: 1490354907883,
                createdBy: {
                    id: 2,
                    firstName: 'dasdas', 'lastName': 'dasads', 'email': 'administrator@admin.com'
                },
                relatedContent: false,
                contentAvailable: true,
                link: false,
                mimeType: 'application/pdf',
                simpleType: 'pdf',
                previewStatus: 'created',
                thumbnailStatus: 'created'
            });

            component.contentClick.subscribe((content) => {
                expect(content.contentBlob).toBe(blob);
                expect(content.mimeType).toBe('application/pdf');
                expect(content.name).toBe('FakeBlob.pdf');
                done();
            });

            fixture.detectChanges();
            let viewButton: any = element.querySelector('#view');
            viewButton.click();
        });

        it('should download the pdf when the download button is clicked', () => {
            let blob = createFakePdfBlob();
            spyOn(serviceForm, 'getFileRawContent').and.returnValue(Observable.of(blob));
            spyOn(serviceContent, 'downloadBlob').and.callThrough();

            component.content = new ContentLinkModel({
                id: 4004,
                name: 'FakeBlob.pdf',
                created: 1490354907883,
                createdBy: {
                    id: 2,
                    firstName: 'dasdas', 'lastName': 'dasads', 'email': 'administrator@admin.com'
                },
                relatedContent: false,
                contentAvailable: true,
                link: false,
                mimeType: 'application/pdf',
                simpleType: 'pdf',
                previewStatus: 'created',
                thumbnailStatus: 'created'
            });

            fixture.detectChanges();
            let downloadButton: any = element.querySelector('#download');
            downloadButton.click();

            fixture.whenStable()
                .then(() => {
                    expect(serviceContent.downloadBlob).toHaveBeenCalledWith(blob, 'FakeBlob.pdf');
                });
        });
    });
});

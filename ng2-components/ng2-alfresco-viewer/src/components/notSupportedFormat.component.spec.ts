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
import { NotSupportedFormat } from './notSupportedFormat.component';
import { PdfViewerComponent } from './pdfViewer.component';
import { DebugElement }    from '@angular/core';
import { MdIconModule, MdButtonModule, MdProgressSpinnerModule } from '@angular/material';
import { Subject } from 'rxjs';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    CoreModule,
    ContentService,
    AlfrescoApiService,
    LogService,
    RenditionsService
} from 'ng2-alfresco-core';

type RenditionResponse = {
    entry: {
        status: string
    }
};

describe('Test ng2-alfresco-viewer Not Supported Format View component', () => {

    const nodeId = 'not-supported-node-id';

    let component: NotSupportedFormat;
    let service: ContentService;
    let fixture: ComponentFixture<NotSupportedFormat>;
    let debug: DebugElement;
    let element: HTMLElement;
    let renditionsService: RenditionsService;

    let renditionSubject: Subject<RenditionResponse>,
        conversionSubject: Subject<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                MdIconModule,
                MdButtonModule,
                MdProgressSpinnerModule
            ],
            declarations: [
                NotSupportedFormat,
                PdfViewerComponent
            ],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService,
                ContentService,
                RenditionsService,
                LogService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NotSupportedFormat);
        service = fixture.debugElement.injector.get(ContentService);
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.nodeId = nodeId;

        renditionSubject = new Subject<RenditionResponse>();
        conversionSubject = new Subject<any>();
        renditionsService = TestBed.get(RenditionsService);
        spyOn(renditionsService, 'getRendition').and.returnValue(renditionSubject);
        spyOn(renditionsService, 'convert').and.returnValue(conversionSubject);
    });

    describe('View', () => {

        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should be present Download button', () => {
            expect(element.querySelector('#viewer-download-button')).not.toBeNull();
        });

        it('should display the name of the file', () => {
            component.nameFile = 'Example Content.xls';
            fixture.detectChanges();
            expect(element.querySelector('h4 span').innerHTML).toEqual('Example Content.xls');
        });

        it('should NOT show loading spinner by default', () => {
            expect(element.querySelector('#conversion-spinner')).toBeNull('Conversion spinner should NOT be shown by default');
        });
    });

    describe('Convertibility to pdf', () => {

        it('should not show the "Convert to PDF" button by default', () => {
            fixture.detectChanges();
            expect(element.querySelector('#viewer-convert-button')).toBeNull();
        });

        it('should be checked on ngInit', () => {
            fixture.detectChanges();
            expect(renditionsService.getRendition).toHaveBeenCalledWith(nodeId, 'pdf');
        });

        it('should NOT be checked on ngInit if nodeId is not set', () => {
            component.nodeId = null;
            fixture.detectChanges();
            expect(renditionsService.getRendition).not.toHaveBeenCalled();
        });

        it('should show the "Convert to PDF" button if the node is convertible', async(() => {
            fixture.detectChanges();
            renditionSubject.next({ entry: { status: 'NOT_CREATED' } });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-convert-button')).not.toBeNull();
            });
        }));

        it('should NOT show the "Convert to PDF" button if the node is NOT convertible', async(() => {
            component.convertible = true;
            fixture.detectChanges();
            renditionSubject.error(new Error('Mocked error'));

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-convert-button')).toBeNull();
            });
        }));

        it('should NOT show the "Convert to PDF" button if the node is already converted', async(() => {
            renditionSubject.next({ entry: { status: 'CREATED' } });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-convert-button')).toBeNull();
            });
        }));
    });

    describe('User Interaction', () => {

        beforeEach(() => {
            fixture.detectChanges();
        });

        describe('Download', () => {

            it('should call download method if Click on Download button', () => {
                spyOn(window, 'open');
                component.urlFile = 'test';

                let downloadButton: any = element.querySelector('#viewer-download-button');
                downloadButton.click();

                expect(window.open).toHaveBeenCalled();
            });

            it('should call content service download method if Click on Download button', () => {
                spyOn(service, 'downloadBlob');

                component.blobFile = new Blob();

                let downloadButton: any = element.querySelector('#viewer-download-button');
                downloadButton.click();

                expect(service.downloadBlob).toHaveBeenCalled();
            });
        });

        describe('Conversion', () => {

            function clickOnConvertButton() {
                renditionSubject.next({ entry: { status: 'NOT_CREATED' } });
                fixture.detectChanges();

                let convertButton: any = element.querySelector('#viewer-convert-button');
                convertButton.click();
                fixture.detectChanges();
            }

            it('should show loading spinner and disable the "Convert to PDF button" after the button was clicked', () => {
                clickOnConvertButton();

                let convertButton: any = element.querySelector('#viewer-convert-button');
                expect(element.querySelector('#conversion-spinner')).not.toBeNull('Conversion spinner should be shown');
                expect(convertButton.disabled).toBe(true);
            });

            it('should re-enable the "Convert to PDF button" and hide spinner after unsuccessful conversion and hide loading spinner', () => {
                clickOnConvertButton();

                conversionSubject.error(new Error());
                fixture.detectChanges();

                let convertButton: any = element.querySelector('#viewer-convert-button');
                expect(element.querySelector('#conversion-spinner')).toBeNull('Conversion spinner should be shown');
                expect(convertButton.disabled).toBe(false);
            });

            it('should show the pdf rendition after successful conversion', () => {
                clickOnConvertButton();

                conversionSubject.next();
                conversionSubject.complete();
                fixture.detectChanges();
                fixture.detectChanges();

                expect(element.querySelector('#pdf-rendition-viewer')).not.toBeNull('Pdf rendition should be shown.');
            });
        });
    });
});

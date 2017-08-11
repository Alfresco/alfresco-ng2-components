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

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContentService, CoreModule, RenditionsService } from 'ng2-alfresco-core';
import { Subject } from 'rxjs/Subject';
import { MaterialModule } from './../material.module';
import { NotSupportedFormatComponent } from './notSupportedFormat.component';
import { PdfViewerComponent } from './pdfViewer.component';

interface RenditionResponse {
    entry: {
        status: string
    };
}

describe('NotSupportedFormatComponent', () => {

    const nodeId = 'not-supported-node-id';

    let component: NotSupportedFormatComponent;
    let service: ContentService;
    let fixture: ComponentFixture<NotSupportedFormatComponent>;
    let debug: DebugElement;
    let element: HTMLElement;
    let renditionsService: RenditionsService;

    let renditionSubject: Subject<RenditionResponse>;
    let conversionSubject: Subject<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                MaterialModule
            ],
            declarations: [
                NotSupportedFormatComponent,
                PdfViewerComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NotSupportedFormatComponent);
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

        it('should display the Download button', () => {
            expect(element.querySelector('[data-automation-id="viewer-download-button"]')).not.toBeNull();
        });

        it('should display the name of the file', () => {
            component.nameFile = 'Example Content.xls';
            fixture.detectChanges();
            expect(element.querySelector('h4 span').innerHTML).toEqual('Example Content.xls');
        });

        it('should NOT show loading spinner by default', () => {
            expect(element.querySelector('[data-automation-id="viewer-conversion-spinner"]')).toBeNull('Conversion spinner should NOT be shown by default');
        });
    });

    describe('Convertibility to pdf', () => {

        it('should not show the "Convert to PDF" button by default', () => {
            fixture.detectChanges();
            expect(element.querySelector('[data-automation-id="viewer-convert-button"]')).toBeNull();
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
                expect(element.querySelector('[data-automation-id="viewer-convert-button"]')).not.toBeNull();
            });
        }));

        it('should NOT show the "Convert to PDF" button if the node is NOT convertible', async(() => {
            component.convertible = true;
            fixture.detectChanges();
            renditionSubject.error(new Error('Mocked error'));

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('[data-automation-id="viewer-convert-button"]')).toBeNull();
            });
        }));

        it('should NOT show the "Convert to PDF" button if the node is already converted', async(() => {
            renditionSubject.next({ entry: { status: 'CREATED' } });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('[data-automation-id="viewer-convert-button"]')).toBeNull();
            });
        }));

        it('should start the conversion when clicking on the "Convert to PDF" button', () => {
            component.convertible = true;
            fixture.detectChanges();

            const convertButton = debug.query(By.css('[data-automation-id="viewer-convert-button"]'));
            convertButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            const conversionSpinner = debug.query(By.css('[data-automation-id="viewer-conversion-spinner"]'));
            expect(renditionsService.convert).toHaveBeenCalled();
            expect(conversionSpinner).not.toBeNull();
        });

        it('should remove the spinner if an error happens during conversion', () => {
            component.convertToPdf();

            conversionSubject.error('whatever');
            fixture.detectChanges();

            const conversionSpinner = debug.query(By.css('[data-automation-id="viewer-conversion-spinner"]'));
            expect(conversionSpinner).toBeNull();
        });

        it('should remove the spinner and show the pdf if conversion has finished', () => {
            component.convertToPdf();

            conversionSubject.complete();
            fixture.detectChanges();

            const conversionSpinner = debug.query(By.css('[data-automation-id="viewer-conversion-spinner"]'));
            const pdfRenditionViewer = debug.query(By.css('[data-automation-id="pdf-rendition-viewer"]'));
            expect(conversionSpinner).toBeNull();
            expect(pdfRenditionViewer).not.toBeNull();
        });

        it('should unsubscribe from the conversion subscription on ngOnDestroy', () => {
            component.convertToPdf();

            component.ngOnDestroy();
            conversionSubject.complete();
            fixture.detectChanges();

            const pdfRenditionViewer = debug.query(By.css('[data-automation-id="pdf-rendition-viewer"]'));
            expect(pdfRenditionViewer).toBeNull();
        });

        it('should not throw error on ngOnDestroy if the conversion hasn\'t started at all' , () => {
            const callNgOnDestroy = () => {
                component.ngOnDestroy();
            };

            expect(callNgOnDestroy).not.toThrowError();
        });
    });

    describe('User Interaction', () => {

        beforeEach(() => {
            fixture.detectChanges();
        });

        describe('Download', () => {

            it('should call download method if Click on Download button', () => {
                spyOn(window, 'open');
                component.urlFile = 'test';

                let downloadButton: any = element.querySelector('[data-automation-id="viewer-download-button"]');
                downloadButton.click();

                expect(window.open).toHaveBeenCalled();
            });

            it('should call content service download method if Click on Download button', () => {
                spyOn(service, 'downloadBlob');

                component.blobFile = new Blob();

                let downloadButton: any = element.querySelector('[data-automation-id="viewer-download-button"]');
                downloadButton.click();

                expect(service.downloadBlob).toHaveBeenCalled();
            });
        });

        describe('Conversion', () => {

            function clickOnConvertButton() {
                renditionSubject.next({ entry: { status: 'NOT_CREATED' } });
                fixture.detectChanges();

                let convertButton: any = element.querySelector('[data-automation-id="viewer-convert-button"]');
                convertButton.click();
                fixture.detectChanges();
            }

            it('should show loading spinner and disable the "Convert to PDF button" after the button was clicked', () => {
                clickOnConvertButton();

                let convertButton: any = element.querySelector('[data-automation-id="viewer-convert-button"]');
                expect(element.querySelector('[data-automation-id="viewer-conversion-spinner"]')).not.toBeNull('Conversion spinner should be shown');
                expect(convertButton.disabled).toBe(true);
            });

            it('should re-enable the "Convert to PDF button" and hide spinner after unsuccessful conversion and hide loading spinner', () => {
                clickOnConvertButton();

                conversionSubject.error(new Error());
                fixture.detectChanges();

                let convertButton: any = element.querySelector('[data-automation-id="viewer-convert-button"]');
                expect(element.querySelector('[data-automation-id="viewer-conversion-spinner"]')).toBeNull('Conversion spinner should be shown');
                expect(convertButton.disabled).toBe(false);
            });

            it('should show the pdf rendition after successful conversion', () => {
                clickOnConvertButton();

                conversionSubject.next();
                conversionSubject.complete();
                fixture.detectChanges();
                fixture.detectChanges();

                expect(element.querySelector('[data-automation-id="pdf-rendition-viewer"]')).not.toBeNull('Pdf rendition should be shown.');
            });
        });
    });
});

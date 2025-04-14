/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Component, SimpleChange, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AppConfigService } from '../../../app-config';
import { EventMock } from '../../../mock';
import { NoopAuthModule, NoopTranslateModule, UnitTestingUtils } from '../../../testing';
import { RenderingQueueServices } from '../../services/rendering-queue.services';
import { PdfThumbListComponent } from '../pdf-viewer-thumbnails/pdf-viewer-thumbnails.component';
import { PDFJS_VIEWER_MODULE, PdfViewerComponent } from './pdf-viewer.component';

declare const pdfjsLib: any;

@Component({
    selector: 'adf-url-test-component',
    standalone: true,
    imports: [PdfViewerComponent],
    template: ` <adf-pdf-viewer [allowThumbnails]="true" [showToolbar]="true" [urlFile]="urlFile" /> `
})
class UrlTestComponent {
    @ViewChild(PdfViewerComponent, { static: true })
    pdfViewerComponent: PdfViewerComponent;

    urlFile: any;

    constructor() {
        this.urlFile = './fake-test-file.pdf';
    }
}

@Component({
    selector: 'adf-url-test-password-component',
    standalone: true,
    imports: [PdfViewerComponent],
    template: ` <adf-pdf-viewer [allowThumbnails]="true" [showToolbar]="true" [urlFile]="urlFile" /> `
})
class UrlTestPasswordComponent {
    @ViewChild(PdfViewerComponent, { static: true })
    pdfViewerComponent: PdfViewerComponent;

    urlFile: any;

    constructor() {
        this.urlFile = './fake-test-password-file.pdf';
    }
}

@Component({
    standalone: true,
    imports: [PdfViewerComponent],
    template: ` <adf-pdf-viewer [allowThumbnails]="true" [showToolbar]="true" [blobFile]="blobFile" /> `
})
class BlobTestComponent {
    @ViewChild(PdfViewerComponent, { static: true })
    pdfViewerComponent: PdfViewerComponent;

    blobFile: any;

    constructor() {
        this.blobFile = this.createFakeBlob();
    }

    createFakeBlob(): Blob {
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
                'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G'
        );
        return new Blob([pdfData], { type: 'application/pdf' });
    }
}
//eslint-disable-next-line
fdescribe('Test PdfViewer component', () => {
    let component: PdfViewerComponent;
    let fixture: ComponentFixture<PdfViewerComponent>;
    let change: any;
    let dialog: MatDialog;
    let testingUtils: UnitTestingUtils;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, NoopTranslateModule, PdfViewerComponent],
            providers: [
                {
                    provide: MatDialog,
                    useValue: {
                        open: () => {}
                    }
                },
                RenderingQueueServices
            ]
        });
        fixture = TestBed.createComponent(PdfViewerComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        dialog = TestBed.inject(MatDialog);

        component = fixture.componentInstance;
        component.showToolbar = true;
        component.inputPage('1');

        fixture.detectChanges();
        await fixture.whenStable();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should Loader be present', () => {
        expect(testingUtils.getByCSS('.adf-loader-container')).not.toBeNull();
    });

    describe('Required values', () => {
        it('should thrown an error If urlFile is not present', () => {
            change = new SimpleChange(null, null, true);

            expect(() => {
                component.ngOnChanges({ urlFile: change });
            }).toThrow(new Error('Attribute urlFile or blobFile is required'));
        });

        it('should If blobFile is not present thrown an error ', () => {
            change = new SimpleChange(null, null, true);

            expect(() => {
                component.ngOnChanges({ blobFile: change });
            }).toThrow(new Error('Attribute urlFile or blobFile is required'));
        });
    });

    describe('View with url file', () => {
        let fixtureUrlTestComponent: ComponentFixture<UrlTestComponent>;
        let elementUrlTestComponent: HTMLElement;

        beforeEach(async () => {
            fixtureUrlTestComponent = TestBed.createComponent(UrlTestComponent);
            elementUrlTestComponent = fixtureUrlTestComponent.nativeElement;
            testingUtils.setDebugElement(fixtureUrlTestComponent.debugElement);

            fixtureUrlTestComponent.detectChanges();
            await fixtureUrlTestComponent.whenStable();
        });

        afterEach(() => {
            document.body.removeChild(elementUrlTestComponent);
            fixture.destroy();
        });

        it('should Canvas be present', async () => {
            fixtureUrlTestComponent.detectChanges();
            await fixtureUrlTestComponent.whenStable();

            expect(testingUtils.getByCSS('.adf-pdfViewer')).not.toBeNull();
            expect(testingUtils.getByCSS('.adf-viewer-pdf-viewer')).not.toBeNull();
        });

        it('should Input Page elements be present', async () => {
            fixtureUrlTestComponent.detectChanges();
            await fixtureUrlTestComponent.whenStable();
            expect(testingUtils.getByCSS('.viewer-pagenumber-input')).toBeDefined();
            expect(testingUtils.getByCSS('.viewer-total-pages')).toBeDefined();

            expect(testingUtils.getByCSS('#viewer-previous-page-button')).not.toBeNull();
            expect(testingUtils.getByCSS('#viewer-next-page-button')).not.toBeNull();
        });

        it('should Toolbar be hide if showToolbar is false', async () => {
            component.showToolbar = false;

            fixtureUrlTestComponent.detectChanges();
            await fixtureUrlTestComponent.whenStable();
            expect(testingUtils.getByCSS('.viewer-toolbar-command')).toBeNull();
            expect(testingUtils.getByCSS('.viewer-toolbar-pagination')).toBeNull();
        });
    });

    describe('View with blob file', () => {
        let fixtureBlobTestComponent: ComponentFixture<BlobTestComponent>;
        let elementBlobTestComponent: HTMLElement;

        beforeEach(async () => {
            fixtureBlobTestComponent = TestBed.createComponent(BlobTestComponent);
            elementBlobTestComponent = fixtureBlobTestComponent.nativeElement;
            testingUtils.setDebugElement(fixtureBlobTestComponent.debugElement);

            fixtureBlobTestComponent.detectChanges();
            await fixtureBlobTestComponent.whenStable();
        });

        afterEach(() => {
            document.body.removeChild(elementBlobTestComponent);
            fixture.destroy();
        });

        it('should Canvas be present', async () => {
            fixtureBlobTestComponent.detectChanges();
            await fixtureBlobTestComponent.whenStable();

            expect(testingUtils.getByCSS('.adf-pdfViewer')).not.toBeNull();
            expect(testingUtils.getByCSS('.adf-viewer-pdf-viewer')).not.toBeNull();
        });

        it('should Next an Previous Buttons be present', async () => {
            fixtureBlobTestComponent.detectChanges();
            await fixtureBlobTestComponent.whenStable();

            expect(testingUtils.getByCSS('#viewer-previous-page-button')).not.toBeNull();
            expect(testingUtils.getByCSS('#viewer-next-page-button')).not.toBeNull();
        });

        it('should Input Page elements be present', async () => {
            fixtureBlobTestComponent.detectChanges();
            await fixtureBlobTestComponent.whenStable();
            /* cspell:disable-next-line */
            expect(testingUtils.getByCSS('.adf-viewer-pagenumber-input')).toBeDefined();
            expect(testingUtils.getByCSS('.adf-viewer-total-pages')).toBeDefined();
            expect(testingUtils.getByCSS('#viewer-previous-page-button')).not.toBeNull();
            expect(testingUtils.getByCSS('#viewer-next-page-button')).not.toBeNull();
        });

        it('should Toolbar be hide if showToolbar is false', async () => {
            fixtureBlobTestComponent.componentInstance.pdfViewerComponent.showToolbar = false;

            fixtureBlobTestComponent.detectChanges();
            await fixtureBlobTestComponent.whenStable();

            expect(testingUtils.getByCSS('.viewer-toolbar-command')).toBeNull();
            expect(testingUtils.getByCSS('.viewer-toolbar-pagination')).toBeNull();
        });
    });

    describe('Password protection dialog', () => {
        let fixtureUrlTestPasswordComponent: ComponentFixture<UrlTestPasswordComponent>;
        let componentUrlTestPasswordComponent: UrlTestPasswordComponent;

        describe('Open password dialog', () => {
            beforeEach(async () => {
                fixtureUrlTestPasswordComponent = TestBed.createComponent(UrlTestPasswordComponent);
                componentUrlTestPasswordComponent = fixtureUrlTestPasswordComponent.componentInstance;

                spyOn(dialog, 'open').and.callFake((_: any, context: any) => {
                    if (context.data.reason === pdfjsLib.PasswordResponses.NEED_PASSWORD) {
                        return {
                            afterClosed: () => of('wrong_password')
                        } as any;
                    }

                    if (context.data.reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD) {
                        return {
                            afterClosed: () => of('password')
                        } as any;
                    }

                    return undefined;
                });

                fixtureUrlTestPasswordComponent.detectChanges();
                await fixtureUrlTestPasswordComponent.whenStable();
            });

            afterEach(() => {
                document.body.removeChild(fixtureUrlTestPasswordComponent.nativeElement);
            });

            it('should try to access protected pdf', async () => {
                componentUrlTestPasswordComponent.pdfViewerComponent.onPdfPassword(() => {}, pdfjsLib.PasswordResponses.NEED_PASSWORD);

                fixture.detectChanges();
                await fixture.whenStable();

                expect(dialog.open).toHaveBeenCalledTimes(1);
            });

            it('should raise dialog asking for password', async () => {
                componentUrlTestPasswordComponent.pdfViewerComponent.onPdfPassword(() => {}, pdfjsLib.PasswordResponses.NEED_PASSWORD);
                fixture.detectChanges();
                await fixture.whenStable();

                fixture.detectChanges();
                expect(dialog.open['calls'].all()[0].args[1].data).toEqual({
                    reason: pdfjsLib.PasswordResponses.NEED_PASSWORD
                });
            });

            it('it should raise dialog with incorrect password', async () => {
                componentUrlTestPasswordComponent.pdfViewerComponent.onPdfPassword(() => {}, pdfjsLib.PasswordResponses.INCORRECT_PASSWORD);
                fixture.detectChanges();
                await fixture.whenStable();
                expect(dialog.open['calls'].all()[0].args[1].data).toEqual({
                    reason: pdfjsLib.PasswordResponses.INCORRECT_PASSWORD
                });
            });
        });

        describe('Close password dialog ', () => {
            beforeEach(async () => {
                fixtureUrlTestPasswordComponent = TestBed.createComponent(UrlTestPasswordComponent);
                componentUrlTestPasswordComponent = fixtureUrlTestPasswordComponent.componentInstance;

                spyOn(dialog, 'open').and.callFake(
                    () =>
                        ({
                            afterClosed: () => of('')
                        } as any)
                );

                spyOn(componentUrlTestPasswordComponent.pdfViewerComponent.close, 'emit');

                fixtureUrlTestPasswordComponent.detectChanges();
                await fixtureUrlTestPasswordComponent.whenStable();
            });

            afterEach(() => {
                document.body.removeChild(fixtureUrlTestPasswordComponent.nativeElement);
            });

            it('should try to access protected pdf', async () => {
                componentUrlTestPasswordComponent.pdfViewerComponent.onPdfPassword(() => {}, pdfjsLib.PasswordResponses.NEED_PASSWORD);
                fixture.detectChanges();
                await fixture.whenStable();
                expect(componentUrlTestPasswordComponent.pdfViewerComponent.close.emit).toHaveBeenCalledWith();
            });
        });
    });
});
// eslint-disable-next-line
fdescribe('Test PdfViewer - Zoom customization', () => {
    let fixture: ComponentFixture<PdfViewerComponent>;
    let component: PdfViewerComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, NoopTranslateModule, PdfViewerComponent],
            providers: [
                {
                    provide: MatDialog,
                    useValue: {
                        open: () => {}
                    }
                },
                RenderingQueueServices
            ]
        });

        fixture = TestBed.createComponent(PdfViewerComponent);
        component = fixture.componentInstance;
    });

    it('should use the custom zoom if it is present in the app.config', () => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config['adf-viewer.pdf-viewer-scaling'] = 80;

        expect(component.getUserScaling()).toBe(0.8);
    });

    it('should use the minimum scale zoom if the value given in app.config is less than the minimum allowed scale', () => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config['adf-viewer.pdf-viewer-scaling'] = 10;

        fixture.detectChanges();

        expect(component.getUserScaling()).toBe(0.25);
    });

    it('should use the maximum scale zoom if the value given in app.config is greater than the maximum allowed scale', () => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config['adf-viewer.pdf-viewer-scaling'] = 5555;

        fixture.detectChanges();

        expect(component.getUserScaling()).toBe(10);
    });
});
// eslint-disable-next-line
fdescribe('Test PdfViewer - User interaction', () => {
    let fixture: ComponentFixture<PdfViewerComponent>;
    let component: PdfViewerComponent;
    let testingUtils: UnitTestingUtils;
    let pdfViewerSpy: jasmine.Spy;

    beforeEach(fakeAsync(() => {
        pdfViewerSpy = jasmine.createSpy('PDFViewer').and.returnValue({
            setDocument: jasmine.createSpy(),
            forceRendering: jasmine.createSpy(),
            update: jasmine.createSpy(),
            currentScaleValue: 1,
            _currentPageNumber: 1,
            _pages: [{ width: 100, height: 100, scale: 1 }]
        });

        TestBed.configureTestingModule({
            imports: [NoopAuthModule, NoopTranslateModule, PdfViewerComponent],
            providers: [
                {
                    provide: MatDialog,
                    useValue: {
                        open: () => {}
                    }
                },
                RenderingQueueServices,
                { provide: PDFJS_VIEWER_MODULE, useValue: pdfViewerSpy }
            ]
        });

        fixture = TestBed.createComponent(PdfViewerComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config['adf-viewer.pdf-viewer-scaling'] = 10;

        component.urlFile = './fake-test-file.pdf';
        fixture.detectChanges();
        component.ngOnChanges({ urlFile: { currentValue: './fake-test-file.pdf' } } as any);

        flush();
    }));

    it('should init the viewer with annotation mode disabled', () => {
        expect(pdfViewerSpy).toHaveBeenCalledWith(jasmine.objectContaining({ annotationMode: 0 }));
    });

    it('should Total number of pages be loaded', () => {
        fixture.detectChanges();

        expect(component.totalPages).toBe(6);
    });

    it('should nextPage move to the next page', () => {
        testingUtils.clickByCSS('#viewer-next-page-button');

        fixture.detectChanges();

        expect(component.displayPage).toBe(2);
    });

    it('should event RIGHT_ARROW keyboard change pages', fakeAsync(() => {
        fixture.detectChanges();
        EventMock.keyDown(RIGHT_ARROW);

        tick(250);

        expect(component.displayPage).toBe(2);
    }));

    it('should event LEFT_ARROW keyboard change pages', async () => {
        component.inputPage('2');

        fixture.detectChanges();

        await fixture.whenStable();
        EventMock.keyDown(LEFT_ARROW);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.displayPage).toBe(1);
    });

    it('should previous page move to the previous page', async () => {
        testingUtils.clickByCSS('#viewer-next-page-button');
        testingUtils.clickByCSS('#viewer-next-page-button');
        testingUtils.clickByCSS('#viewer-previous-page-button');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.displayPage).toBe(2);
    });

    it('should previous page not move to the previous page if is page 1', async () => {
        component.previousPage();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.displayPage).toBe(1);
    });

    it('should Input page move to the inserted page', async () => {
        component.inputPage('2');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.displayPage).toBe(2);
    });

    describe('Zoom', () => {
        it('should zoom in increment the scale value', async () => {
            const zoomBefore = component.pdfViewer.currentScaleValue;
            testingUtils.clickByCSS('#viewer-zoom-in-button');
            fixture.detectChanges();
            await fixture.whenRenderingDone();

            expect(component.currentScaleMode).toBe('auto');
            const currentZoom = component.pdfViewer.currentScaleValue;
            expect(zoomBefore < currentZoom).toBe(true);
        });

        it('should zoom out decrement the scale value', async () => {
            testingUtils.clickByCSS('#viewer-zoom-in-button');
            fixture.detectChanges();
            const zoomBefore = component.pdfViewer.currentScaleValue;

            testingUtils.clickByCSS('#viewer-zoom-out-button');
            fixture.detectChanges();
            await fixture.whenRenderingDone();

            expect(component.currentScaleMode).toBe('auto');
            const currentZoom = component.pdfViewer.currentScaleValue;
            expect(zoomBefore > currentZoom).toBe(true);
        });

        it('should it-in button toggle page-fit and auto scale mode', fakeAsync(() => {
            tick(250);

            expect(component.currentScaleMode).toBe('init');
            testingUtils.clickByCSS('#viewer-scale-page-button');
            expect(component.currentScaleMode).toBe('page-fit');
            testingUtils.clickByCSS('#viewer-scale-page-button');
            expect(component.currentScaleMode).toBe('auto');
            testingUtils.clickByCSS('#viewer-scale-page-button');
            expect(component.currentScaleMode).toBe('page-fit');
        }), 300);
    });

    describe('Resize interaction', () => {
        it('should resize event trigger setScaleUpdatePages', async () => {
            spyOn(component, 'onResize');
            EventMock.resizeMobileView();
            await fixture.whenStable();

            expect(component.onResize).toHaveBeenCalled();
        });
    });

    describe('Thumbnails', () => {
        it('should have own context', async () => {
            fixture.detectChanges();

            await fixture.whenStable();
            expect(component.pdfThumbnailsContext.viewer).not.toBeNull();
        });

        it('should open thumbnails panel', async () => {
            expect(testingUtils.getByCSS('.adf-pdf-viewer__thumbnails')).toBeNull();

            component.toggleThumbnails();

            fixture.detectChanges();
            await fixture.whenStable();
            expect(testingUtils.getByCSS('.adf-pdf-viewer__thumbnails')).not.toBeNull();
        });

        it('should not render PdfThumbListComponent during initialization of new pdfViewer', () => {
            component.toggleThumbnails();
            component.urlFile = 'file.pdf';
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.directive(PdfThumbListComponent))).toBeNull();
        });
    });

    describe('Viewer events', () => {
        it('should react on the emit of pageChange event', () => {
            const args = {
                pageNumber: 6,
                source: {
                    container: document.getElementById(`${component.randomPdfId}-viewer-pdf-viewer`)
                }
            };

            component.onPageChange(args);
            expect(component.displayPage).toBe(6);
            expect(component.page).toBe(6);
        });

        it('should react on the emit of pagesLoaded event', () => {
            expect(component.isPanelDisabled).toBe(true);

            component.onPagesLoaded();

            expect(component.isPanelDisabled).toBe(false);
        });
    });
});

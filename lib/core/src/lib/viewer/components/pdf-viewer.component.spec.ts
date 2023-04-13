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

import { Component, SimpleChange, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EventMock } from '../../mock/event.mock';
import { RenderingQueueServices } from '../services/rendering-queue.services';
import { PdfViewerComponent } from './pdf-viewer.component';
import { RIGHT_ARROW, LEFT_ARROW } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { setupTestBed } from '../../testing/setup-test-bed';
import { take } from 'rxjs/operators';
import { AppConfigService } from '../../app-config/app-config.service';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare const pdfjsLib: any;

@Component({
    selector: 'adf-test-dialog-component',
    template: ''
})
class TestDialogComponent {
}

@Component({
    template: `
        <adf-pdf-viewer [allowThumbnails]="true"
                        [showToolbar]="true"
                        [urlFile]="urlFile">
        </adf-pdf-viewer>
    `
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
    template: `
        <adf-pdf-viewer [allowThumbnails]="true"
                        [showToolbar]="true"
                        [urlFile]="urlFile">
        </adf-pdf-viewer>
    `
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
    template: `
        <adf-pdf-viewer [allowThumbnails]="true"
                        [showToolbar]="true"
                        [blobFile]="blobFile">
        </adf-pdf-viewer>
    `
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
            'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');
        return new Blob([pdfData], { type: 'application/pdf' });
    }

}
// eslint-disable-next-line
xdescribe('Test PdfViewer component', () => {

    let component: PdfViewerComponent;
    let fixture: ComponentFixture<PdfViewerComponent>;
    let element: HTMLElement;
    let change: any;
    let dialog: MatDialog;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        declarations: [
            TestDialogComponent,
            UrlTestComponent,
            UrlTestPasswordComponent,
            BlobTestComponent
        ],
        providers: [
            {
                provide: MatDialog, useValue: {
                    open: () => {
                    }
                }
            },
            RenderingQueueServices
        ]
    });

    beforeEach((done) => {
        fixture = TestBed.createComponent(PdfViewerComponent);
        dialog = TestBed.inject(MatDialog);

        element = fixture.nativeElement;
        component = fixture.componentInstance;

        component.showToolbar = true;
        component.inputPage('1');
        component.pdfViewer.currentScale = 1;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            done();
        });
    });

    describe('User interaction', () => {

        let fixtureUrlTestComponent: ComponentFixture<UrlTestComponent>;
        let componentUrlTestComponent: UrlTestComponent;
        let elementUrlTestComponent: HTMLElement;

        beforeEach((done) => {
            fixtureUrlTestComponent = TestBed.createComponent(UrlTestComponent);
            componentUrlTestComponent = fixtureUrlTestComponent.componentInstance;
            elementUrlTestComponent = fixtureUrlTestComponent.nativeElement;

            fixtureUrlTestComponent.detectChanges();

            componentUrlTestComponent.pdfViewerComponent.rendered
                .pipe(take(1))
                .subscribe(() => {
                    done();
                });
        });

        afterEach(() => {
            document.body.removeChild(elementUrlTestComponent);
        });

        it('should Total number of pages be loaded', (done) => {
            fixtureUrlTestComponent.detectChanges();

            fixtureUrlTestComponent.whenStable().then(() => {
                expect(componentUrlTestComponent.pdfViewerComponent.totalPages).toBe(6);
                done();
            });
        }, 55000);

        it('should nextPage move to the next page', (done) => {
            const nextPageButton: any = elementUrlTestComponent.querySelector('#viewer-next-page-button');
            nextPageButton.click();

            fixtureUrlTestComponent.detectChanges();

            fixtureUrlTestComponent.whenStable().then(() => {
                expect(componentUrlTestComponent.pdfViewerComponent.displayPage).toBe(2);
                done();
            });
        }, 55000);

        it('should event RIGHT_ARROW keyboard change pages', fakeAsync(() => {
            fixtureUrlTestComponent.whenStable();
            fixtureUrlTestComponent.detectChanges();
            EventMock.keyDown(RIGHT_ARROW);

            tick(250);

            expect(componentUrlTestComponent.pdfViewerComponent.displayPage).toBe(2);
        }));

        it('should event LEFT_ARROW keyboard change pages', (done) => {
            component.inputPage('2');

            fixtureUrlTestComponent.detectChanges();

            fixtureUrlTestComponent.whenStable().then(() => {
                EventMock.keyDown(LEFT_ARROW);

                fixtureUrlTestComponent.detectChanges();

                fixtureUrlTestComponent.whenStable().then(() => {
                    expect(componentUrlTestComponent.pdfViewerComponent.displayPage).toBe(1);
                    done();
                });
            });
        }, 55000);

        it('should previous page move to the previous page', (done) => {
            const previousPageButton: any = elementUrlTestComponent.querySelector('#viewer-previous-page-button');
            const nextPageButton: any = elementUrlTestComponent.querySelector('#viewer-next-page-button');

            nextPageButton.click();
            nextPageButton.click();
            previousPageButton.click();
            fixtureUrlTestComponent.detectChanges();

            fixtureUrlTestComponent.whenStable().then(() => {
                expect(componentUrlTestComponent.pdfViewerComponent.displayPage).toBe(2);
                done();
            });
        }, 55000);

        it('should previous page not move to the previous page if is page 1', (done) => {
            component.previousPage();
            fixtureUrlTestComponent.detectChanges();

            fixtureUrlTestComponent.whenStable().then(() => {
                expect(componentUrlTestComponent.pdfViewerComponent.displayPage).toBe(1);
                done();
            });
        }, 55000);

        it('should Input page move to the inserted page', (done) => {
            componentUrlTestComponent.pdfViewerComponent.inputPage('2');
            fixtureUrlTestComponent.detectChanges();

            fixtureUrlTestComponent.whenStable().then(() => {
                expect(componentUrlTestComponent.pdfViewerComponent.displayPage).toBe(2);
                done();
            });
        }, 55000);

        describe('Zoom', () => {

            it('should zoom in increment the scale value', fakeAsync(() => {
                spyOn(componentUrlTestComponent.pdfViewerComponent.pdfViewer, 'forceRendering').and.callFake(() => {
                });

                const zoomInButton: any = elementUrlTestComponent.querySelector('#viewer-zoom-in-button');

                tick(250);

                const zoomBefore = componentUrlTestComponent.pdfViewerComponent.pdfViewer.currentScale;
                zoomInButton.click();
                expect(componentUrlTestComponent.pdfViewerComponent.currentScaleMode).toBe('auto');
                const currentZoom = componentUrlTestComponent.pdfViewerComponent.pdfViewer.currentScale;
                expect(zoomBefore < currentZoom).toBe(true);
            }), 55000);

            it('should zoom out decrement the scale value', fakeAsync(() => {
                spyOn(componentUrlTestComponent.pdfViewerComponent.pdfViewer, 'forceRendering').and.callFake(() => {
                });
                const zoomOutButton: any = elementUrlTestComponent.querySelector('#viewer-zoom-out-button');

                tick(250);

                const zoomBefore = componentUrlTestComponent.pdfViewerComponent.pdfViewer.currentScale;
                zoomOutButton.click();
                expect(componentUrlTestComponent.pdfViewerComponent.currentScaleMode).toBe('auto');
                const currentZoom = componentUrlTestComponent.pdfViewerComponent.pdfViewer.currentScale;
                expect(zoomBefore > currentZoom).toBe(true);
            }), 55000);

            it('should it-in button toggle page-fit and auto scale mode', fakeAsync(() => {
                spyOn(componentUrlTestComponent.pdfViewerComponent.pdfViewer, 'forceRendering').and.callFake(() => {
                });

                const itPage: any = elementUrlTestComponent.querySelector('#viewer-scale-page-button');

                tick(250);

                expect(componentUrlTestComponent.pdfViewerComponent.currentScaleMode).toBe('init');
                itPage.click();
                expect(componentUrlTestComponent.pdfViewerComponent.currentScaleMode).toBe('page-fit');
                itPage.click();
                expect(componentUrlTestComponent.pdfViewerComponent.currentScaleMode).toBe('auto');
                itPage.click();
                expect(componentUrlTestComponent.pdfViewerComponent.currentScaleMode).toBe('page-fit');
            }), 55000);
        });

        describe('Resize interaction', () => {

            it('should resize event trigger setScaleUpdatePages', (done) => {
                spyOn(componentUrlTestComponent.pdfViewerComponent, 'onResize');
                EventMock.resizeMobileView();

                fixtureUrlTestComponent.whenStable().then(() => {
                    expect(componentUrlTestComponent.pdfViewerComponent.onResize).toHaveBeenCalled();
                    done();
                });

            }, 55000);
        });

        describe('Thumbnails', () => {

            it('should have own context', (done) => {
                fixtureUrlTestComponent.detectChanges();

                fixtureUrlTestComponent.whenStable().then(() => {
                    expect(componentUrlTestComponent.pdfViewerComponent.pdfThumbnailsContext.viewer).not.toBeNull();
                    done();
                });
            }, 55000);

            it('should open thumbnails panel', (done) => {
                expect(elementUrlTestComponent.querySelector('.adf-pdf-viewer__thumbnails')).toBeNull();

                componentUrlTestComponent.pdfViewerComponent.toggleThumbnails();

                fixtureUrlTestComponent.detectChanges();

                fixtureUrlTestComponent.whenStable().then(() => {
                    expect(elementUrlTestComponent.querySelector('.adf-pdf-viewer__thumbnails')).not.toBeNull();
                    done();
                });
            }, 55000);
        });

        describe('Viewer events', () => {

            it('should react on the emit of pageChange event', (done) => {
                fixtureUrlTestComponent.detectChanges();
                fixtureUrlTestComponent.whenStable().then(() => {
                    const args = {
                        pageNumber: 6,
                        source: {
                            container: document.getElementById(`${componentUrlTestComponent.pdfViewerComponent.randomPdfId}-viewer-pdf-viewer`)
                        }
                    };

                    /* cspell:disable-next-line */
                    componentUrlTestComponent.pdfViewerComponent.pdfViewer.eventBus.dispatch('pagechanging', args);
                    fixtureUrlTestComponent.detectChanges();

                    fixtureUrlTestComponent.whenStable().then(() => {
                        expect(componentUrlTestComponent.pdfViewerComponent.displayPage).toBe(6);
                        expect(componentUrlTestComponent.pdfViewerComponent.page).toBe(6);
                        done();
                    });
                });
            }, 55000);

            it('should react on the emit of pagesLoaded event', (done) => {
                fixtureUrlTestComponent.detectChanges();
                fixtureUrlTestComponent.whenStable().then(() => {
                    expect(componentUrlTestComponent.pdfViewerComponent.isPanelDisabled).toBeFalsy();

                    const args = {
                        pagesCount: 10,
                        source: {
                            container: document.getElementById(`${componentUrlTestComponent.pdfViewerComponent.randomPdfId}-viewer-pdf-viewer`)
                        }
                    };

                    /* cspell:disable-next-line */
                    componentUrlTestComponent.pdfViewerComponent.pdfViewer.eventBus.dispatch('pagesloaded', args);
                    fixtureUrlTestComponent.detectChanges();

                    fixtureUrlTestComponent.whenStable().then(() => {
                        expect(componentUrlTestComponent.pdfViewerComponent.isPanelDisabled).toBe(false);
                        done();
                    });
                });
            }, 55000);

            it('should check if page fits to documentContainer', (done) => {
                spyOn(componentUrlTestComponent.pdfViewerComponent, 'checkPageFitInContainer');
                componentUrlTestComponent.pdfViewerComponent.scalePage('auto');

                fixtureUrlTestComponent.detectChanges();
                fixtureUrlTestComponent.whenStable().then(() => {
                    expect(componentUrlTestComponent.pdfViewerComponent.checkPageFitInContainer).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    it('should Loader be present', () => {
        expect(element.querySelector('.adf-loader-container')).not.toBeNull();
    });

    describe('Zoom customization', () => {

        describe('custom value', () => {

            let fixtureUrlTestComponent: ComponentFixture<UrlTestComponent>;
            let componentUrlTestComponent: UrlTestComponent;
            let elementUrlTestComponent: HTMLElement;

            beforeEach((done) => {
                const appConfig: AppConfigService = TestBed.inject(AppConfigService);
                appConfig.config['adf-viewer.pdf-viewer-scaling'] = 80;

                fixtureUrlTestComponent = TestBed.createComponent(UrlTestComponent);
                componentUrlTestComponent = fixtureUrlTestComponent.componentInstance;
                elementUrlTestComponent = fixtureUrlTestComponent.nativeElement;

                fixtureUrlTestComponent.detectChanges();

                componentUrlTestComponent.pdfViewerComponent.rendered
                    .pipe(take(1))
                    .subscribe(() => {
                        done();
                    });
            });

            afterEach(() => {
                document.body.removeChild(elementUrlTestComponent);
            });

            it('should use the custom zoom if it is present in the app.config', (done) => {
                spyOn(componentUrlTestComponent.pdfViewerComponent.pdfViewer, 'forceRendering').and.callFake(() => {
                });

                fixtureUrlTestComponent.detectChanges();
                fixtureUrlTestComponent.whenStable().then(() => {
                    expect(componentUrlTestComponent.pdfViewerComponent.pdfViewer.currentScale).toBe(0.8);
                    done();
                });
            });
        });

        describe('less than the minimum allowed value', () => {

            let fixtureUrlTestComponent: ComponentFixture<UrlTestComponent>;
            let componentUrlTestComponent: UrlTestComponent;
            let elementUrlTestComponent: HTMLElement;

            beforeEach((done) => {
                const appConfig: AppConfigService = TestBed.inject(AppConfigService);
                appConfig.config['adf-viewer.pdf-viewer-scaling'] = 10;

                fixtureUrlTestComponent = TestBed.createComponent(UrlTestComponent);
                componentUrlTestComponent = fixtureUrlTestComponent.componentInstance;
                elementUrlTestComponent = fixtureUrlTestComponent.nativeElement;

                fixtureUrlTestComponent.detectChanges();

                componentUrlTestComponent.pdfViewerComponent.rendered
                    .pipe(take(1))
                    .subscribe(() => {
                        done();
                    });
            });

            afterEach(() => {
                document.body.removeChild(elementUrlTestComponent);
            });

            it('should use the minimum scale zoom if the value given in app.config is less than the minimum allowed scale', (done) => {
                spyOn(componentUrlTestComponent.pdfViewerComponent.pdfViewer, 'forceRendering').and.callFake(() => {
                });

                fixtureUrlTestComponent.detectChanges();

                fixtureUrlTestComponent.whenStable().then(() => {
                    expect(componentUrlTestComponent.pdfViewerComponent.pdfViewer.currentScale).toBe(0.25);
                    done();
                });
            });

        });

        describe('greater than the maximum allowed value', () => {

            let fixtureUrlTestComponent: ComponentFixture<UrlTestComponent>;
            let componentUrlTestComponent: UrlTestComponent;
            let elementUrlTestComponent: HTMLElement;

            beforeEach((done) => {
                const appConfig: AppConfigService = TestBed.inject(AppConfigService);
                appConfig.config['adf-viewer.pdf-viewer-scaling'] = 55555;

                fixtureUrlTestComponent = TestBed.createComponent(UrlTestComponent);
                componentUrlTestComponent = fixtureUrlTestComponent.componentInstance;
                elementUrlTestComponent = fixtureUrlTestComponent.nativeElement;

                fixtureUrlTestComponent.detectChanges();

                componentUrlTestComponent.pdfViewerComponent.rendered
                    .pipe(take(1))
                    .subscribe(() => {
                        done();
                    });
            });

            afterEach(() => {
                document.body.removeChild(elementUrlTestComponent);
            });

            it('should use the maximum scale zoom if the value given in app.config is greater than the maximum allowed scale', (done) => {
                spyOn(componentUrlTestComponent.pdfViewerComponent.pdfViewer, 'forceRendering').and.callFake(() => {
                });

                fixtureUrlTestComponent.detectChanges();
                fixtureUrlTestComponent.whenStable().then(() => {
                    expect(componentUrlTestComponent.pdfViewerComponent.pdfViewer.currentScale).toBe(10);
                    done();

                });

            });
        });
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

        beforeEach((done) => {
            fixtureUrlTestComponent = TestBed.createComponent(UrlTestComponent);
            elementUrlTestComponent = fixtureUrlTestComponent.nativeElement;

            fixtureUrlTestComponent.detectChanges();

            fixtureUrlTestComponent.whenStable().then(() => {
                done();
            });
        });

        afterEach(() => {
            document.body.removeChild(elementUrlTestComponent);
            fixture.destroy();
        });

        it('should Canvas be present', (done) => {
            fixtureUrlTestComponent.detectChanges();

            fixtureUrlTestComponent.whenStable().then(() => {
                expect(elementUrlTestComponent.querySelector('.adf-pdfViewer')).not.toBeNull();
                expect(elementUrlTestComponent.querySelector('.adf-viewer-pdf-viewer')).not.toBeNull();
                done();
            });
        }, 55000);

        it('should Input Page elements be present', (done) => {

            fixtureUrlTestComponent.detectChanges();
            fixtureUrlTestComponent.whenStable().then(() => {
                /* cspell:disable-next-line */
                expect(elementUrlTestComponent.querySelector('.viewer-pagenumber-input')).toBeDefined();
                expect(elementUrlTestComponent.querySelector('.viewer-total-pages')).toBeDefined();

                expect(elementUrlTestComponent.querySelector('#viewer-previous-page-button')).not.toBeNull();
                expect(elementUrlTestComponent.querySelector('#viewer-next-page-button')).not.toBeNull();
                done();
            });
        }, 55000);

        it('should Toolbar be hide if showToolbar is false', (done) => {
            component.showToolbar = false;

            fixtureUrlTestComponent.detectChanges();
            fixtureUrlTestComponent.whenStable().then(() => {
                expect(elementUrlTestComponent.querySelector('.viewer-toolbar-command')).toBeNull();
                expect(elementUrlTestComponent.querySelector('.viewer-toolbar-pagination')).toBeNull();
                done();
            });
        }, 55000);
    });

    describe('View with blob file', () => {

        let fixtureBlobTestComponent: ComponentFixture<BlobTestComponent>;
        let componentBlobTestComponent: BlobTestComponent;
        let elementBlobTestComponent: HTMLElement;

        beforeEach((done) => {
            fixtureBlobTestComponent = TestBed.createComponent(BlobTestComponent);
            componentBlobTestComponent = fixtureBlobTestComponent.componentInstance;
            elementBlobTestComponent = fixtureBlobTestComponent.nativeElement;

            fixtureBlobTestComponent.detectChanges();

            componentBlobTestComponent.pdfViewerComponent.rendered
                .pipe(take(1))
                .subscribe(() => {
                    done();
                });
        });

        afterEach(() => {
            document.body.removeChild(elementBlobTestComponent);
            fixture.destroy();
        });

        it('should Canvas be present', () => {
            fixtureBlobTestComponent.detectChanges();

            fixtureBlobTestComponent.whenStable().then(() => {
                expect(elementBlobTestComponent.querySelector('.adf-pdfViewer')).not.toBeNull();
                expect(elementBlobTestComponent.querySelector('.adf-viewer-pdf-viewer')).not.toBeNull();
            });
        });

        it('should Next an Previous Buttons be present', (done) => {
            fixtureBlobTestComponent.detectChanges();

            fixtureBlobTestComponent.whenStable().then(() => {
                expect(elementBlobTestComponent.querySelector('#viewer-previous-page-button')).not.toBeNull();
                expect(elementBlobTestComponent.querySelector('#viewer-next-page-button')).not.toBeNull();
                done();
            });
        }, 55000);

        it('should Input Page elements be present', (done) => {
            fixtureBlobTestComponent.detectChanges();

            fixtureBlobTestComponent.whenStable().then(() => {
                /* cspell:disable-next-line */
                expect(elementBlobTestComponent.querySelector('.adf-viewer-pagenumber-input')).toBeDefined();
                expect(elementBlobTestComponent.querySelector('.adf-viewer-total-pages')).toBeDefined();

                expect(elementBlobTestComponent.querySelector('#viewer-previous-page-button')).not.toBeNull();
                expect(elementBlobTestComponent.querySelector('#viewer-next-page-button')).not.toBeNull();
                done();
            });
        }, 55000);

        it('should Toolbar be hide if showToolbar is false', (done) => {
            componentBlobTestComponent.pdfViewerComponent.showToolbar = false;

            fixtureBlobTestComponent.detectChanges();

            fixtureBlobTestComponent.whenStable().then(() => {
                expect(elementBlobTestComponent.querySelector('.viewer-toolbar-command')).toBeNull();
                expect(elementBlobTestComponent.querySelector('.viewer-toolbar-pagination')).toBeNull();
                done();
            });
        }, 55000);
    });

    describe('Password protection dialog', () => {

        let fixtureUrlTestPasswordComponent: ComponentFixture<UrlTestPasswordComponent>;
        let componentUrlTestPasswordComponent: UrlTestPasswordComponent;

        describe('Open password dialog', () => {
            beforeEach((done) => {
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

                componentUrlTestPasswordComponent.pdfViewerComponent.rendered.subscribe(() => {
                    done();
                });
            });

            afterEach(() => {
                document.body.removeChild(fixtureUrlTestPasswordComponent.nativeElement);
            });

            it('should try to access protected pdf', (done) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();

                    expect(dialog.open).toHaveBeenCalledTimes(2);
                    done();
                });
            });

            it('should raise dialog asking for password', (done) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(dialog.open['calls'].all()[0].args[1].data).toEqual({
                        reason: pdfjsLib.PasswordResponses.NEED_PASSWORD
                    });
                    done();
                });
            });

            it('it should raise dialog with incorrect password', (done) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(dialog.open['calls'].all()[1].args[1].data).toEqual({
                        reason: pdfjsLib.PasswordResponses.INCORRECT_PASSWORD
                    });
                    done();
                });
            });
        });

        describe('Close password dialog ', () => {
            beforeEach((done) => {
                fixtureUrlTestPasswordComponent = TestBed.createComponent(UrlTestPasswordComponent);
                componentUrlTestPasswordComponent = fixtureUrlTestPasswordComponent.componentInstance;

                spyOn(dialog, 'open').and.callFake(() => ({
                    afterClosed: () => {
                        done();
                        return of('');
                    }
                } as any));

                spyOn(componentUrlTestPasswordComponent.pdfViewerComponent.close, 'emit');

                fixtureUrlTestPasswordComponent.detectChanges();

                componentUrlTestPasswordComponent.pdfViewerComponent.rendered.subscribe(() => {
                    done();
                });
            });

            afterEach(() => {
                document.body.removeChild(fixtureUrlTestPasswordComponent.nativeElement);
            });

            it('should try to access protected pdf', (done) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();

                    expect(componentUrlTestPasswordComponent.pdfViewerComponent.close.emit).toHaveBeenCalledWith();
                    done();
                });
            });
        });
    });
});

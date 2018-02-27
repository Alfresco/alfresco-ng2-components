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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    AlfrescoApiService,
    AuthenticationService,
    SettingsService
} from '../../services';
import { MaterialModule } from '../../material.module';
import { ToolbarModule } from '../../toolbar/toolbar.module';
import { EventMock } from '../../mock/event.mock';
import { RenderingQueueServices } from '../services/rendering-queue.services';
import { PdfViewerComponent } from './pdfViewer.component';
import { PdfThumbListComponent } from './pdfViewer-thumbnails.component';
import { PdfThumbComponent } from './pdfViewer-thumb.component';

declare var require: any;

describe('Test PdfViewer component', () => {

    let component: PdfViewerComponent;
    let fixture: ComponentFixture<PdfViewerComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ToolbarModule,
                MaterialModule
            ],
            declarations: [
                PdfViewerComponent,
                PdfThumbListComponent,
                PdfThumbComponent
            ],
            providers: [
                SettingsService,
                AuthenticationService,
                AlfrescoApiService,
                RenderingQueueServices
            ]
        }).compileComponents();
    }));

    function createFakeBlob(): Blob {
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
        return new Blob([pdfData], { type: 'application/pdf' });
    }

    beforeEach(() => {
        fixture = TestBed.createComponent(PdfViewerComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;

        component.showToolbar = true;

    });

    describe('View with url file', () => {
        beforeEach(() => {
            component.urlFile = require('../assets/fake-test-file.pdf');
            fixture.detectChanges();
        });

        it('should thrown an error If urlfile is not present', () => {
            component.urlFile = undefined;

            fixture.detectChanges();

            expect(() => {
                component.ngOnChanges(null);
            }).toThrow(new Error('Attribute urlFile or blobFile is required'));
        });

        it('should Canvas be present', () => {
            expect(element.querySelector('.pdfViewer')).not.toBeNull();
            expect(element.querySelector('.viewer-pdf-viewer')).not.toBeNull();
        });

        it('should Loader be present', () => {
            expect(element.querySelector('.loader-container')).not.toBeNull();
        });

        it('should Next an Previous Buttons be present', () => {
            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });

        it('should Input Page elements be present', () => {
            expect(element.querySelector('.viewer-pagenumber-input')).toBeDefined();
            expect(element.querySelector('.viewer-total-pages')).toBeDefined();

            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });

        it('should Toolbar be hide if showToolbar is false', () => {
            component.showToolbar = false;

            fixture.detectChanges();

            expect(element.querySelector('.viewer-toolbar-command')).toBeNull();
            expect(element.querySelector('.viewer-toolbar-pagination')).toBeNull();
        });
    });

    describe('View with blob file', () => {

        beforeEach(() => {
            component.urlFile = undefined;
            component.blobFile = createFakeBlob();

            fixture.detectChanges();
        });

        it('should If blobFile is not present thrown an error ', () => {
            component.blobFile = undefined;
            expect(() => {
                component.ngOnChanges(null);
            }).toThrow(new Error('Attribute urlFile or blobFile is required'));
        });

        it('should Canvas be present', () => {
            expect(element.querySelector('.pdfViewer')).not.toBeNull();
            expect(element.querySelector('.viewer-pdf-viewer')).not.toBeNull();
        });

        it('should Loader be present', () => {
            expect(element.querySelector('.loader-container')).not.toBeNull();
        });

        it('should Next an Previous Buttons be present', () => {
            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });

        it('should Input Page elements be present', () => {
            expect(element.querySelector('.viewer-pagenumber-input')).toBeDefined();
            expect(element.querySelector('.viewer-total-pages')).toBeDefined();

            expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
            expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
        });

        it('should Toolbar be hide if showToolbar is false', () => {
            component.showToolbar = false;

            fixture.detectChanges();

            expect(element.querySelector('.viewer-toolbar-command')).toBeNull();
            expect(element.querySelector('.viewer-toolbar-pagination')).toBeNull();
        });
    });

    describe('User interaction', () => {

        beforeEach(async(async(() => {
            component.urlFile = require('../assets/fake-test-file.pdf');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.inputPage('1');
            });
        })));

        it('should Total number of pages be loaded', async(() => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(component.totalPages).toEqual(6);
                });
            });
        }));

        it('should right arrow move to the next page', async(() => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(component.displayPage).toBe(1);
                    EventMock.keyDown(39);
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);
                });
            });
        }));

        it('should nextPage move to the next page', async(() => {
            let nextPageButton: any = element.querySelector('#viewer-next-page-button');

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);
                    nextPageButton.click();
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);
                });
            });
        }));

        it('should event keyboard change pages', async(() => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);
                    EventMock.keyDown(39);
                    EventMock.keyDown(39);
                    EventMock.keyDown(37);
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);
                });
            });
        }));

        it('should previous page move to the previous page', async(() => {
            let previousPageButton: any = element.querySelector('#viewer-previous-page-button');
            let nextPageButton: any = element.querySelector('#viewer-next-page-button');

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);
                    nextPageButton.click();
                    nextPageButton.click();
                    previousPageButton.click();
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);
                });
            });
        }));

        it('should previous page not move to the previous page if is page 1', async(() => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);
                    component.previousPage();
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(1);
                });
            });
        }));

        it('should Input page move to the inserted page', async(() => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);
                    component.inputPage('2');
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);
                });
            });
        }));
    });

    describe('Zoom', () => {

        beforeEach(async(() => {
            component.urlFile = require('../assets/fake-test-file.pdf');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.inputPage('1');
                component.currentScale = 1;
            });
        }));

        it('should zoom in increment the scale value', async(() => {
            let zoomInButton: any = element.querySelector('#viewer-zoom-in-button');

            component.ngOnChanges(null).then(() => {
                let zoomBefore = component.currentScale;
                zoomInButton.click();
                expect(component.currentScaleMode).toBe('auto');
                let currentZoom = component.currentScale;
                expect(zoomBefore < currentZoom).toBe(true);
            });
        }));

        it('should zoom out decrement the scale value', async(() => {
            let zoomOutButton: any = element.querySelector('#viewer-zoom-out-button');

            component.ngOnChanges(null).then(() => {
                let zoomBefore = component.currentScale;
                zoomOutButton.click();
                expect(component.currentScaleMode).toBe('auto');
                let currentZoom = component.currentScale;
                expect(zoomBefore > currentZoom).toBe(true);
            });
        }));

        it('should fit-in button toggle page-fit and auto scale mode', async(() => {
            let fitPage: any = element.querySelector('#viewer-scale-page-button');

            component.ngOnChanges(null).then(() => {
                expect(component.currentScaleMode).toBe('auto');
                fitPage.click();
                expect(component.currentScaleMode).toBe('page-fit');
                fitPage.click();
                expect(component.currentScaleMode).toBe('auto');
            });
        }));
    });

    describe('Resize interaction', () => {

        beforeEach(async(() => {
            component.urlFile = require('../assets/fake-test-file.pdf');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.inputPage('1');
                component.currentScale = 1;
            });
        }));

        it('should resize event trigger setScaleUpdatePages', async(() => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    spyOn(component, 'onResize');
                    EventMock.resizeMobileView();
                    expect(component.onResize).toHaveBeenCalled();
                });
            });
        }));
    });

    describe('scroll interaction', () => {

        beforeEach(async(() => {
            component.urlFile = require('../assets/fake-test-file.pdf');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.inputPage('1');
                component.currentScale = 1;
            });
        }));

        it('should scroll page return the current page', async(() => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(component.displayPage).toBe(1);

                    component.inputPage('2');
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(2);

                    component.pdfViewer.currentPageNumber = 6;
                    fixture.detectChanges();
                    expect(component.displayPage).toBe(6);
                    expect(component.page).toBe(6);
                });
            });
        }));
    });

    describe('Thumbnails', () => {
        beforeEach(async () => {
            component.urlFile = require('../assets/fake-test-file.pdf');
            component.showThumbnails = false;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.inputPage('1');
            });
        });

        it('should have own context', async(() => {
            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                return fixture.whenStable().then(() => {
                    expect(component.pdfThumbnailsContext.viewer).not.toBeNull();
                });
            });
        }));

        it('should open thumbnails panel', async(() => {
            expect(element.querySelector('.adf-pdf-viewer__thumbnails')).toBeNull();

            component.ngOnChanges(null).then(() => {
                fixture.detectChanges();
                return fixture.whenStable().then(() => {
                    component.toggleThumbnails();
                    fixture.detectChanges();

                    expect(element.querySelector('.adf-pdf-viewer__thumbnails')).not.toBeNull();
                });
            });
        }));
    });
});

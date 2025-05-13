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

import { AppExtensionService, ViewerExtensionRef } from '@alfresco/adf-extensions';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopTranslateModule, UnitTestingUtils } from '../../../testing';
import { RenderingQueueServices } from '../../services/rendering-queue.services';
import { ViewerRenderComponent } from './viewer-render.component';
import { ImgViewerComponent, MediaPlayerComponent, PdfViewerComponent, ViewerExtensionDirective } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    selector: 'adf-double-viewer',
    standalone: true,
    imports: [ViewerExtensionDirective, ViewerRenderComponent],
    template: `
        <adf-viewer-render [urlFile]="urlFileViewer1" [viewerTemplateExtensions]="viewerTemplateExtensions" #viewer1 />
        <adf-viewer-render [urlFile]="urlFileViewer2" #viewer2 />
        <ng-template #viewerExtension>
            <adf-viewer-extension [supportedExtensions]="['json']">
                <ng-template>
                    <h1>JSON Viewer</h1>
                </ng-template>
            </adf-viewer-extension>
            <adf-viewer-extension [supportedExtensions]="['test']">
                <ng-template>
                    <h1>Test Viewer</h1>
                </ng-template>
            </adf-viewer-extension>
        </ng-template>
    `
})
class DoubleViewerComponent {
    @ViewChild('viewer1')
    viewer1: ViewerRenderComponent;

    @ViewChild('viewer2')
    viewer2: ViewerRenderComponent;

    @ViewChild('viewerExtension', { static: true })
    viewerTemplateExtensions: TemplateRef<any>;

    urlFileViewer1: string;
    urlFileViewer2: string;
}

describe('ViewerComponent', () => {
    let component: ViewerRenderComponent;
    let fixture: ComponentFixture<ViewerRenderComponent>;
    let extensionService: AppExtensionService;
    let testingUtils: UnitTestingUtils;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, NoopAnimationsModule, MatDialogModule, ViewerRenderComponent, DoubleViewerComponent],
            providers: [RenderingQueueServices, { provide: Location, useClass: SpyLocation }, MatDialog],
            deferBlockBehavior: DeferBlockBehavior.Playthrough
        });
        fixture = TestBed.createComponent(ViewerRenderComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        component = fixture.componentInstance;

        extensionService = TestBed.inject(AppExtensionService);

        await fixture.whenStable();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Double viewer Test', () => {
        it('should not reload the content of all the viewer after type change', async () => {
            const fixtureDouble = TestBed.createComponent(DoubleViewerComponent);

            fixtureDouble.componentInstance.urlFileViewer1 = 'fake-test-file.pdf';
            fixtureDouble.componentInstance.urlFileViewer2 = 'fake-test-file-two.xls';

            fixtureDouble.detectChanges();
            await fixtureDouble.whenStable();

            fixtureDouble.componentInstance.viewer1.ngOnChanges();
            fixtureDouble.componentInstance.viewer2.ngOnChanges();

            fixtureDouble.detectChanges();
            await fixtureDouble.whenStable();

            expect(fixtureDouble.componentInstance.viewer1.viewerType).toBe('pdf');
            expect(fixtureDouble.componentInstance.viewer2.viewerType).toBe('unknown');

            fixtureDouble.componentInstance.urlFileViewer1 = 'fake-test-file.pdf';
            fixtureDouble.componentInstance.urlFileViewer2 = 'fake-test-file-two.png';

            fixtureDouble.detectChanges();
            await fixtureDouble.whenStable();

            fixtureDouble.componentInstance.viewer1.ngOnChanges();
            fixtureDouble.componentInstance.viewer2.ngOnChanges();

            expect(fixtureDouble.componentInstance.viewer1.viewerType).toBe('pdf');
            expect(fixtureDouble.componentInstance.viewer2.viewerType).toBe('image');
        });
    });

    describe('Extension Type Test', () => {
        it('should display pdf external viewer via wildcard notation', async () => {
            const extension: ViewerExtensionRef = {
                component: 'custom.component',
                id: 'custom.component.id',
                fileExtension: '*'
            };
            spyOn(extensionService, 'getViewerExtensions').and.returnValue([extension]);

            fixture = TestBed.createComponent(ViewerRenderComponent);
            testingUtils.setDebugElement(fixture.debugElement);
            component = fixture.componentInstance;

            component.urlFile = 'fake-test-file.pdf';
            component.ngOnChanges();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.externalExtensions.includes('*')).toBe(true);
            expect(component.externalViewer).toBe(extension);
            expect(component.viewerType).toBe('external');
            expect(testingUtils.getByDataAutomationId('custom.component')).not.toBeNull();
        });

        it('should display pdf with the first external viewer provided', async () => {
            const extensions: ViewerExtensionRef[] = [
                {
                    component: 'custom.component.1',
                    id: 'custom.component.id',
                    fileExtension: '*'
                },
                {
                    component: 'custom.component.2',
                    id: 'custom.component.id',
                    fileExtension: '*'
                }
            ];
            spyOn(extensionService, 'getViewerExtensions').and.returnValue(extensions);

            fixture = TestBed.createComponent(ViewerRenderComponent);
            testingUtils.setDebugElement(fixture.debugElement);
            component = fixture.componentInstance;

            component.urlFile = 'fake-test-file.pdf';
            component.ngOnChanges();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByDataAutomationId('custom.component.1')).not.toBeNull();
            expect(testingUtils.getByDataAutomationId('custom.component.2')).toBeNull();
        });

        it('should display url with the external viewer provided', async () => {
            const extension: ViewerExtensionRef = {
                component: 'custom.component',
                id: 'custom.component.id',
                fileExtension: '*'
            };
            spyOn(extensionService, 'getViewerExtensions').and.returnValue([extension]);

            fixture = TestBed.createComponent(ViewerRenderComponent);
            testingUtils.setDebugElement(fixture.debugElement);
            component = fixture.componentInstance;

            component.urlFile = 'http://localhost:4200/alfresco';
            component.ngOnChanges();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.externalExtensions.includes('*')).toBe(true);
            expect(component.externalViewer).toBe(extension);
            expect(component.viewerType).toBe('external');
            expect(testingUtils.getByDataAutomationId('custom.component')).not.toBeNull();
        });

        it('should  extension file pdf  be loaded', (done) => {
            component.urlFile = 'fake-test-file.pdf';
            fixture.detectChanges();
            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('adf-pdf-viewer')).not.toBeNull();
                done();
            });
        });

        it('should  extension file png be loaded', (done) => {
            component.urlFile = 'fake-url-file.png';
            fixture.detectChanges();
            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('#viewer-image')).not.toBeNull();
                done();
            });
        });

        it('should extension file mp4 be loaded', (done) => {
            component.urlFile = 'fake-url-file.mp4';
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('adf-media-player')).not.toBeNull();
                done();
            });
        });

        it('should extension file txt be loaded', (done) => {
            component.urlFile = 'fake-test-file.txt';
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('adf-txt-viewer')).not.toBeNull();
                done();
            });
        });

        it('should display [unknown format] for unsupported extensions', (done) => {
            component.urlFile = 'fake-url-file.unsupported';
            component.mimeType = '';
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('adf-viewer-unknown-format')).toBeDefined();
                done();
            });
        });
    });

    describe('Custom viewer extension template', () => {
        const getCustomViewerContent = (customFixture: ComponentFixture<DoubleViewerComponent>): HTMLHeadingElement => {
            testingUtils.setDebugElement(customFixture.debugElement);
            return testingUtils.getByCSS('.adf-viewer-render-custom-content h1').nativeElement;
        };

        it('should render provided custom template when file type matches supported extensions', async () => {
            const fixtureCustom = TestBed.createComponent(DoubleViewerComponent);
            fixtureCustom.detectChanges();
            await fixtureCustom.whenStable();

            const customComponent = fixtureCustom.componentInstance.viewer1;
            fixtureCustom.componentInstance.urlFileViewer1 = 'fake-url-file.json';
            customComponent.ngOnChanges();

            fixtureCustom.detectChanges();
            await fixtureCustom.whenStable();

            let customContent = getCustomViewerContent(fixtureCustom);
            expect(customComponent.extensionsSupportedByTemplates).toEqual(['json', 'test']);
            expect(customComponent.extensionTemplates.length).toBe(2);
            expect(customComponent.extensionTemplates[0].isVisible).toBeTrue();
            expect(customComponent.extensionTemplates[1].isVisible).toBeFalse();
            expect(customContent.innerText).toBe('JSON Viewer');

            fixtureCustom.componentInstance.urlFileViewer1 = 'fake-url-file.test';
            customComponent.ngOnChanges();

            fixtureCustom.detectChanges();
            await fixtureCustom.whenStable();

            customContent = getCustomViewerContent(fixtureCustom);
            expect(customComponent.extensionTemplates[0].isVisible).toBeFalse();
            expect(customComponent.extensionTemplates[1].isVisible).toBeTrue();
            expect(customContent.innerText).toBe('Test Viewer');
        });
    });

    describe('MimeType handling', () => {
        it('should display an image file identified by mimetype when the filename has no extension', (done) => {
            component.urlFile = 'fake-content-img';
            component.mimeType = 'image/png';
            fixture.detectChanges();
            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('#viewer-image')).not.toBeNull();
                done();
            });
        });

        it('should display a image file identified by mimetype when the file extension is wrong', (done) => {
            component.urlFile = 'fake-content-img.bin';
            component.mimeType = 'image/png';
            fixture.detectChanges();
            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('#viewer-image')).not.toBeNull();
                done();
            });
        });

        it('should display the txt viewer if the file identified by mimetype is a txt when the filename has wrong extension', (done) => {
            component.urlFile = 'fake-content-txt.bin';
            component.mimeType = 'text/plain';
            fixture.detectChanges();
            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('adf-txt-viewer')).not.toBeNull();
                done();
            });
        });

        it('should display the media player if the file identified by mimetype is a media when the filename has wrong extension', (done) => {
            component.urlFile = 'fake-content-video.bin';
            component.mimeType = 'video/mp4';
            fixture.detectChanges();
            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('adf-media-player')).not.toBeNull();
                done();
            });
        }, 25000);

        it('should display the media player if the file identified by mimetype is a media when the filename has no extension', (done) => {
            component.urlFile = 'fake-content-video';
            component.mimeType = 'video/mp4';
            fixture.detectChanges();
            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('adf-media-player')).not.toBeNull();
                done();
            });
        }, 25000);

        it('should display a PDF file identified by mimetype when the filename has no extension', (done) => {
            component.urlFile = 'fake-content-pdf';
            component.mimeType = 'application/pdf';
            fixture.detectChanges();
            component.ngOnChanges();

            fixture.getDeferBlocks().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('adf-pdf-viewer')).not.toBeNull();
                done();
            });
        }, 25000);

        it('should display a PDF file identified by mimetype when the file extension is wrong', (done) => {
            component.urlFile = 'fake-content-pdf.bin';
            component.mimeType = 'application/pdf';
            fixture.detectChanges();
            component.ngOnChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByCSS('adf-pdf-viewer')).not.toBeNull();
                done();
            });
        }, 25000);
    });

    describe('Base component', () => {
        beforeEach(() => {
            component.urlFile = 'fake-test-file.pdf';
            component.mimeType = 'application/pdf';

            fixture.detectChanges();
        });

        it('should emit new value when isSaving emits new event', () => {
            spyOn(component.isSaving, 'emit');
            component.urlFile = 'fake-url-file.png';
            component.ngOnChanges();
            fixture.detectChanges();

            const imgViewer = testingUtils.getByCSS('adf-img-viewer');
            imgViewer.triggerEventHandler('isSaving', true);

            expect(component.isSaving.emit).toHaveBeenCalledWith(true);
        });

        describe('Attribute', () => {
            it('should  urlFile present not thrown any error ', () => {
                expect(() => {
                    component.ngOnChanges();
                }).not.toThrow();
            });
        });

        describe('error handling', () => {
            it('should switch to the unknown template if the type specific viewers throw an error', (done) => {
                component.urlFile = 'fake-url-file.icns';
                component.mimeType = 'image/png';
                component.ngOnChanges();
                fixture.detectChanges();

                component.onUnsupportedFile();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(testingUtils.getByCSS('adf-viewer-unknown-format')).toBeDefined();
                    done();
                });
            });
        });

        describe('Events', () => {
            it('should if the extension change extension Change event be fired ', (done) => {
                component.extensionChange.subscribe((fileExtension) => {
                    expect(fileExtension).toEqual('png');
                    done();
                });

                component.urlFile = 'fake-url-file.png';

                component.ngOnChanges();
            });
        });

        describe('display name property override by urlFile', () => {
            it('should fileName override the default name if is present and urlFile is set', () => {
                component.urlFile = 'fake-test-file.pdf';
                component.fileName = 'test name';
                fixture.detectChanges();
                component.ngOnChanges();

                expect(component.internalFileName).toEqual('test name');
            });

            it('should use the urlFile name if fileName is NOT set and urlFile is set', () => {
                component.urlFile = 'fake-test-file.pdf';
                component.fileName = '';
                fixture.detectChanges();
                component.ngOnChanges();

                expect(component.internalFileName).toEqual('fake-test-file.pdf');
            });
        });

        describe('display name property override by blobFile', () => {
            it('should fileName override the name if is present and blobFile is set', () => {
                component.fileName = 'blob file display name';
                component.blobFile = new Blob(['This is my blob content'], { type: 'text/plain' });
                fixture.detectChanges();
                component.ngOnChanges();

                expect(component.internalFileName).toEqual('blob file display name');
            });
        });
    });

    describe('Spinner', () => {
        const getMainLoader = (): DebugElement => testingUtils.getByCSS('.adf-viewer-render-main-loader');

        it('should show spinner when isLoading is true', () => {
            component.isLoading = true;
            fixture.detectChanges();
            expect(getMainLoader()).not.toBeNull();
        });

        it('should show spinner until content is ready when viewerType is media', () => {
            component.isLoading = false;
            component.urlFile = 'some-file.mp4';

            component.ngOnChanges();
            fixture.detectChanges();

            expect(getMainLoader()).not.toBeNull();

            const mediaViewer = testingUtils.getByDirective(MediaPlayerComponent);
            mediaViewer.triggerEventHandler('canPlay', null);
            fixture.detectChanges();

            expect(getMainLoader()).toBeNull();
            expect(component.viewerType).toBe('media');
            expect(component.isContentReady).toBeTrue();
        });

        it('should show spinner until content is ready when viewerType is pdf', () => {
            component.isLoading = false;
            component.urlFile = 'some-url.pdf';
            expect(getMainLoader()).toBeNull();

            component.ngOnChanges();
            fixture.detectChanges();

            const imgViewer = testingUtils.getByDirective(PdfViewerComponent);
            imgViewer.triggerEventHandler('pagesLoaded', null);
            fixture.detectChanges();

            expect(component.viewerType).toBe('pdf');
            expect(component.isContentReady).toBeTrue();
        });

        it('should show spinner until content is ready when viewerType is image', () => {
            component.isLoading = false;
            component.urlFile = 'some-url.png';

            component.ngOnChanges();
            fixture.detectChanges();
            expect(getMainLoader()).not.toBeNull();

            const imgViewer = testingUtils.getByDirective(ImgViewerComponent);
            imgViewer.triggerEventHandler('imageLoaded', null);
            fixture.detectChanges();

            expect(getMainLoader()).toBeNull();
            expect(component.viewerType).toBe('image');
            expect(component.isContentReady).toBeTrue();
        });

        it('should not show spinner and set isContentReady = true for other viewer types different than media/pdf/image', () => {
            component.isLoading = false;
            component.urlFile = 'some-url.txt';

            component.ngOnChanges();
            fixture.detectChanges();

            expect(getMainLoader()).toBeNull();
            expect(component.isContentReady).toBeTrue();
        });
    });
});

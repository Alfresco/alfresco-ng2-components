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

import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AlfrescoApiService, RenditionsService } from '../../services';

import { CoreModule } from '../../core.module';

import { throwError } from 'rxjs';
import { EventMock } from '../../mock/event.mock';
import { RenderingQueueServices } from '../services/rendering-queue.services';
import { ViewerComponent } from './viewer.component';
import { setupTestBed } from '../../testing/setupTestBed';
import { AlfrescoApiServiceMock } from '../../mock/alfresco-api.service.mock';

@Component({
    selector: 'adf-viewer-container-toolbar',
    template: `
        <adf-viewer>
            <adf-viewer-toolbar>
                <div class="custom-toolbar-element"></div>
            </adf-viewer-toolbar>
        </adf-viewer>
    `
})
class ViewerWithCustomToolbarComponent {
}

@Component({
    selector: 'adf-viewer-container-toolbar-actions',
    template: `
        <adf-viewer>
            <adf-viewer-toolbar-actions>
                <button mat-icon-button id="custom-button">
                    <mat-icon>alarm</mat-icon>
                </button>
            </adf-viewer-toolbar-actions>
        </adf-viewer>
    `
})
class ViewerWithCustomToolbarActionsComponent {
}

@Component({
    selector: 'adf-viewer-container-sidebar',
    template: `
        <adf-viewer>
            <adf-viewer-sidebar>
                <div class="custom-sidebar"></div>
            </adf-viewer-sidebar>
        </adf-viewer>
    `
})
class ViewerWithCustomSidebarComponent {
}

@Component({
    selector: 'adf-viewer-container-open-with',
    template: `
        <adf-viewer>
            <adf-viewer-open-with>
                <button mat-menu-item>
                    <mat-icon>dialpad</mat-icon>
                    <span>Option 1</span>
                </button>
                <button mat-menu-item disabled>
                    <mat-icon>voicemail</mat-icon>
                    <span>Option 2</span>
                </button>
                <button mat-menu-item>
                    <mat-icon>notifications_off</mat-icon>
                    <span>Option 3</span>
                </button>
            </adf-viewer-open-with>
        </adf-viewer>
    `
})
class ViewerWithCustomOpenWithComponent {
}

@Component({
    selector: 'adf-viewer-container-more-actions',
    template: `
        <adf-viewer>
            <adf-viewer-more-actions>
                <button mat-menu-item>
                    <mat-icon>dialpad</mat-icon>
                    <span>Action One</span>
                </button>
                <button mat-menu-item disabled>
                    <mat-icon>voicemail</mat-icon>
                    <span>Action Two</span>
                </button>
                <button mat-menu-item>
                    <mat-icon>notifications_off</mat-icon>
                    <span>Action Three</span>
                </button>
            </adf-viewer-more-actions>
        </adf-viewer>
    `
})
class ViewerWithCustomMoreActionsComponent {
}

describe('ViewerComponent', () => {

    let component: ViewerComponent;
    let fixture: ComponentFixture<ViewerComponent>;
    let alfrescoApiService: AlfrescoApiService;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        declarations: [
            ViewerWithCustomToolbarComponent,
            ViewerWithCustomSidebarComponent,
            ViewerWithCustomOpenWithComponent,
            ViewerWithCustomMoreActionsComponent,
            ViewerWithCustomToolbarActionsComponent
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
            {
                provide: RenditionsService, useValue: {
                    getRendition: () => {
                        return throwError('thrown');
                    }
                }
            },
            RenderingQueueServices,
            { provide: Location, useClass: SpyLocation }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewerComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;

        alfrescoApiService = TestBed.get(AlfrescoApiService);
    });

    describe('Extension Type Test', () => {

        it('should  extension file pdf  be loaded', (done) => {
            component.urlFile = 'fake-test-file.pdf';
            component.ngOnChanges(null);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-pdf-viewer')).not.toBeNull();
                done();
            });
        });

        it('should  extension file png be loaded', (done) => {
            component.urlFile = 'fake-url-file.png';
            component.ngOnChanges(null);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });

        it('should extension file mp4 be loaded', (done) => {
            component.urlFile = 'fake-url-file.mp4';
            component.ngOnChanges(null);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-media-player')).not.toBeNull();
                done();
            });
        });

        xit('should extension file mp3 be loaded', (done) => {
            component.urlFile = 'fake-url-file.mp3';
            component.ngOnChanges(null);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-media-player')).not.toBeNull();
                done();
            });
        });

        xit('should extension file wav be loaded', (done) => {
            component.urlFile = 'fake-url-file.wav';
            component.ngOnChanges(null);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-media-player')).not.toBeNull();
                done();
            });
        });

        it('should extension file txt be loaded', (done) => {
            component.urlFile = 'fake-test-file.txt';
            component.ngOnChanges(null);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-txt-viewer')).not.toBeNull();
                done();
            });
        });

        it('should display [unknown format] for unsupported extensions', (done) => {
            component.urlFile = 'fake-url-file.unsupported';
            component.mimeType = '';
            component.ngOnChanges(null);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-viewer-unknown-format')).toBeDefined();
                done();
            });
        });
    });

    describe('MimeType handling', () => {

        it('should display a PDF file identified by mimetype when the filename has no extension', (done) => {
            component.urlFile = 'content';
            component.mimeType = 'application/pdf';
            fixture.detectChanges();
            component.ngOnChanges(null);

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-pdf-viewer')).not.toBeNull();
                done();
            });

        });

        it('should display a PDF file identified by mimetype when the file extension is wrong', (done) => {
            component.urlFile = 'content.bin';
            component.mimeType = 'application/pdf';
            component.ngOnChanges(null);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-pdf-viewer')).not.toBeNull();
                done();
            });
        });

        it('should display an image file identified by mimetype when the filename has no extension', (done) => {
            component.urlFile = 'content';
            component.mimeType = 'image/png';
            fixture.detectChanges();
            component.ngOnChanges(null);

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });

        it('should display a image file identified by mimetype when the file extension is wrong', (done) => {
            component.urlFile = 'content.bin';
            component.mimeType = 'image/png';
            fixture.detectChanges();
            component.ngOnChanges(null);

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#viewer-image')).not.toBeNull();
                done();
            });
        });

        it('should display the media player if the file identified by mimetype is a media when the filename has wrong extension', (done) => {
            component.urlFile = 'content.bin';
            component.mimeType = 'video/mp4';
            fixture.detectChanges();
            component.ngOnChanges(null);

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-media-player')).not.toBeNull();
                done();
            });
        });

        it('should display the txt viewer if the file identified by mimetype is a txt when the filename has wrong extension', (done) => {
            component.urlFile = 'content.bin';
            component.mimeType = 'text/plain';
            fixture.detectChanges();
            component.ngOnChanges(null);

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-txt-viewer')).not.toBeNull();
                done();
            });
        });

        xit('should display the media player if the file identified by mimetype is a media when the filename has no extension', (done) => {
            component.urlFile = 'content';
            component.mimeType = 'video/mp4';
            fixture.detectChanges();
            component.ngOnChanges(null);

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-media-player')).not.toBeNull();
                done();
            });
        });

        it('should node without content show unkonwn', (done) => {
            const displayName = 'the-name';
            const nodeDetails = { name: displayName, id: '12' };
            const contentUrl = '/content/url/path';
            const alfrescoApiInstanceMock = {
                nodes: { getNodeInfo: () => Promise.resolve(nodeDetails) },
                content: { getContentUrl: () => contentUrl }
            };

            component.fileNodeId = '12';
            component.urlFile = null;
            component.displayName = null;
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(alfrescoApiInstanceMock);

            component.ngOnChanges(null);
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-viewer-unknown-format')).toBeDefined();
                done();
            });
        });

    });

    it('should change display name every time node changes', fakeAsync(() => {
        spyOn(alfrescoApiService.nodesApi, 'getNodeInfo').and.returnValues(
            Promise.resolve({ name: 'file1', content: {} }),
            Promise.resolve({ name: 'file2', content: {} })
        );

        component.urlFile = null;
        component.displayName = null;
        component.blobFile = null;
        component.showViewer = true;

        component.fileNodeId = 'id1';
        component.ngOnChanges({});
        tick();

        expect(alfrescoApiService.nodesApi.getNodeInfo).toHaveBeenCalledWith('id1', { include: ['allowableOperations'] });
        expect(component.fileTitle).toBe('file1');

        component.fileNodeId = 'id2';
        component.ngOnChanges({});
        tick();

        expect(alfrescoApiService.nodesApi.getNodeInfo).toHaveBeenCalledWith('id2', { include: ['allowableOperations'] });
        expect(component.fileTitle).toBe('file2');
    }));

    describe('Viewer Example Component Rendering', () => {

        it('should use custom toolbar', (done) => {
            let customFixture = TestBed.createComponent(ViewerWithCustomToolbarComponent);
            let customElement: HTMLElement = customFixture.nativeElement;

            customFixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(customElement.querySelector('.custom-toolbar-element')).toBeDefined();
                done();
            });
        });

        it('should use custom toolbar actions', (done) => {
            let customFixture = TestBed.createComponent(ViewerWithCustomToolbarActionsComponent);
            let customElement: HTMLElement = customFixture.nativeElement;

            customFixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(customElement.querySelector('#custom-button')).toBeDefined();
                done();
            });
        });

        it('should use custom info drawer', (done) => {
            let customFixture = TestBed.createComponent(ViewerWithCustomSidebarComponent);
            let customElement: HTMLElement = customFixture.nativeElement;

            customFixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(customElement.querySelector('.custom-info-drawer-element')).toBeDefined();
                done();
            });
        });

        it('should use custom open with menu', (done) => {
            let customFixture = TestBed.createComponent(ViewerWithCustomOpenWithComponent);
            let customElement: HTMLElement = customFixture.nativeElement;

            customFixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(customElement.querySelector('.adf-viewer-container-open-with')).toBeDefined();
                done();
            });
        });

        it('should use custom more actions menu', (done) => {
            let customFixture = TestBed.createComponent(ViewerWithCustomMoreActionsComponent);
            let customElement: HTMLElement = customFixture.nativeElement;

            customFixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(customElement.querySelector('.adf-viewer-container-more-actions')).toBeDefined();
                done();
            });

        });
    });

    describe('Base component', () => {

        beforeEach(() => {
            component.showToolbar = true;
            component.urlFile = 'fake-test-file.pdf';
            component.mimeType = 'application/pdf';

            fixture.detectChanges();
        });

        describe('SideBar Test', () => {

            it('should NOT display sidebar if is not allowed', (done) => {
                component.showSidebar = true;
                component.allowSidebar = false;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    let sidebar = element.querySelector('#adf-right-sidebar');
                    expect(sidebar).toBeNull();
                    done();
                });
            });

            it('should display sidebar on the right side', (done) => {
                component.allowSidebar = true;
                component.showSidebar = true;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    let sidebar = element.querySelector('#adf-right-sidebar');
                    expect(getComputedStyle(sidebar).order).toEqual('4');
                    done();
                });
            });

            it('should NOT display left sidebar if is not allowed', (done) => {
                component.showLeftSidebar = true;
                component.allowLeftSidebar = false;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    let sidebar = element.querySelector('#adf-left-sidebar');
                    expect(sidebar).toBeNull();
                    done();
                });

            });

            it('should display sidebar on the left side', (done) => {
                component.allowLeftSidebar = true;
                component.showLeftSidebar = true;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    let sidebar = element.querySelector('#adf-left-sidebar');
                    expect(getComputedStyle(sidebar).order).toEqual('1');
                    done();
                });
            });
        });

        describe('Toolbar', () => {

            it('should render fullscreen button', () => {
                expect(element.querySelector('[data-automation-id="adf-toolbar-fullscreen"]')).toBeDefined();
            });

            it('should not render fullscreen button', (done) => {
                component.allowFullScreen = false;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(element.querySelector('[data-automation-id="adf-toolbar-fullscreen"]')).toBeNull();
                    done();
                });
            });

            it('should render default download button', (done) => {
                component.allowDownload = true;

                fixture.whenStable().then(() => {
                    expect(element.querySelector('[data-automation-id="adf-toolbar-download"]')).toBeDefined();
                    done();
                });
            });

            it('should not render default download button', (done) => {
                component.allowDownload = false;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(element.querySelector('[data-automation-id="adf-toolbar-download"]')).toBeNull();
                    done();
                });
            });

            it('should invoke download action with the toolbar button', (done) => {
                component.allowDownload = true;
                spyOn(component, 'downloadContent').and.stub();
                fixture.detectChanges();

                const button: HTMLButtonElement = element.querySelector('[data-automation-id="adf-toolbar-download"]') as HTMLButtonElement;
                button.click();

                fixture.whenStable().then(() => {
                    expect(component.downloadContent).toHaveBeenCalled();
                    done();
                });
            });

            it('should raise download event with the toolbar button', (done) => {
                component.allowDownload = true;
                component.downloadUrl  = 'URL';
                component.fileName = 'fileName';
                fixture.detectChanges();

                component.download.subscribe(e => {
                    expect(e).not.toBeNull();
                    done();
                });

                const button: HTMLButtonElement = element.querySelector('[data-automation-id="adf-toolbar-download"]') as HTMLButtonElement;
                button.click();
            });

            it('should render default print button', (done) => {
                component.allowPrint = true;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(element.querySelector('[data-automation-id="adf-toolbar-print"]')).toBeDefined();
                    done();
                });
            });

            it('should not render default print button', (done) => {
                component.allowPrint = false;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(element.querySelector('[data-automation-id="adf-toolbar-print"]')).toBeNull();
                    done();
                });
            });

            it('should invoke print action with the toolbar button', (done) => {
                component.allowPrint = true;
                fixture.detectChanges();

                spyOn(component, 'printContent').and.stub();

                const button: HTMLButtonElement = element.querySelector('[data-automation-id="adf-toolbar-print"]') as HTMLButtonElement;
                button.click();

                fixture.whenStable().then(() => {
                    expect(component.printContent).toHaveBeenCalled();
                    done();
                });
            });

            it('should raise the print event with the toolbar button', (done) => {
                component.allowPrint = true;
                fixture.detectChanges();

                component.print.subscribe(e => {
                    expect(e).not.toBeNull();
                    done();
                });

                const button: HTMLButtonElement = element.querySelector('[data-automation-id="adf-toolbar-print"]') as HTMLButtonElement;
                button.click();
            });

            it('should render default share button', (done) => {
                component.allowShare = true;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(element.querySelector('[data-automation-id="adf-toolbar-share"]')).toBeDefined();
                    done();
                });
            });

            it('should not render default share button', (done) => {
                component.allowShare = false;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(element.querySelector('[data-automation-id="adf-toolbar-share"]')).toBeNull();
                    done();
                });
            });

            it('should invoke share action with the toolbar button', (done) => {
                component.allowShare = true;
                fixture.detectChanges();

                spyOn(component, 'shareContent').and.stub();

                const button: HTMLButtonElement = element.querySelector('[data-automation-id="adf-toolbar-share"]') as HTMLButtonElement;
                button.click();

                fixture.whenStable().then(() => {
                    expect(component.shareContent).toHaveBeenCalled();
                    done();
                });
            });

            it('should raise share event with the toolbar button', (done) => {
                component.allowShare = true;
                fixture.detectChanges();

                component.share.subscribe(e => {
                    expect(e).not.toBeNull();
                    done();
                });

                const button: HTMLButtonElement = element.querySelector('[data-automation-id="adf-toolbar-share"]') as HTMLButtonElement;
                button.click();
            });

        });

        describe('View', () => {

            describe('Overlay mode true', () => {

                beforeEach(() => {
                    component.overlayMode = true;
                    fixture.detectChanges();
                });

                it('should header be present if is overlay mode', () => {
                    expect(element.querySelector('.adf-viewer-toolbar')).not.toBeNull();
                });

                it('should Name File be present if is overlay mode ', (done) => {
                    component.ngOnChanges(null);
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('#adf-viewer-display-name').textContent).toEqual('fake-test-file.pdf');
                        done();
                    });
                });

                it('should Close button be present if overlay mode', (done) => {
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('.adf-viewer-close-button')).not.toBeNull();
                        done();
                    });
                });

                it('should Click on close button hide the viewer', (done) => {
                    let closebutton: any = element.querySelector('.adf-viewer-close-button');
                    closebutton.click();
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expect(element.querySelector('.adf-viewer-content')).toBeNull();
                        done();
                    });
                });

                it('should Esc button hide the viewer', (done) => {
                    EventMock.keyUp(27);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expect(element.querySelector('.adf-viewer-content')).toBeNull();
                        done();
                    });
                });
            });

            describe('Overlay mode false', () => {

                beforeEach(() => {
                    component.overlayMode = false;
                    fixture.detectChanges();
                });

                it('should Esc button not hide the viewer if is not overlay mode', (done) => {
                    EventMock.keyDown(27);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expect(element.querySelector('.adf-viewer-content')).not.toBeNull();
                        done();
                    });
                });
            });
        });

        describe('Attribute', () => {

            it('should Url or fileNodeId be mandatory', () => {
                component.showViewer = true;
                component.fileNodeId = undefined;
                component.urlFile = undefined;

                expect(() => {
                    component.ngOnChanges(null);
                }).toThrow();
            });

            it('should FileNodeId present not thrown any error ', () => {
                component.showViewer = true;
                component.fileNodeId = 'file-node-id';
                component.urlFile = undefined;

                expect(() => {
                    component.ngOnChanges(null);
                }).not.toThrow();
            });

            it('should  urlFile present not thrown any error ', () => {
                component.showViewer = true;
                component.fileNodeId = undefined;

                expect(() => {
                    component.ngOnChanges(null);
                }).not.toThrow();
            });

            it('should showViewer default value  be true', () => {
                expect(component.showViewer).toBe(true);
            });

            it('should viewer be hide if showViewer value is false', () => {
                component.showViewer = false;

                fixture.detectChanges();
                expect(element.querySelector('.adf-viewer-content')).toBeNull();
            });
        });

        describe('error handling', () => {

            it('should show unknown view when node file not found', (done) => {
                spyOn(alfrescoApiService.getInstance().nodes, 'getNodeInfo')
                    .and.returnValue(Promise.reject({}));

                component.nodeId = 'the-node-id-of-the-file-to-preview';
                component.urlFile = null;
                component.mimeType = null;

                component.ngOnChanges(null);
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('adf-viewer-unknown-format')).not.toBeNull();
                    done();
                });
            });

            it('should show unknown view when sharedLink file not found', (done) => {
                spyOn(alfrescoApiService.getInstance().core.sharedlinksApi, 'getSharedLink')
                    .and.returnValue(Promise.reject({}));

                component.sharedLinkId = 'the-Shared-Link-id';
                component.urlFile = null;
                component.mimeType = null;

                component.ngOnChanges(null);
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('adf-viewer-unknown-format')).not.toBeNull();
                    done();
                });

            });

            it('should raise an event when the shared link is invalid', (done) => {
                spyOn(alfrescoApiService.getInstance().core.sharedlinksApi, 'getSharedLink')
                    .and.returnValue(Promise.reject({}));

                component.invalidSharedLink.subscribe(() => {
                    done();
                });

                component.sharedLinkId = 'the-Shared-Link-id';
                component.urlFile = null;
                component.mimeType = null;

                component.ngOnChanges(null);
            });

        });

        describe('Events', () => {

            it('should if the extension change extension Change event be fired ', (done) => {

                component.extensionChange.subscribe((fileExtension) => {
                    expect(fileExtension).toEqual('png');
                    done();
                });

                component.urlFile = 'fake-url-file.png';

                component.ngOnChanges(null);
            });
        });

        describe('display name property override by urlFile', () => {

            it('should displayName override the default name if is present and urlFile is set', (done) => {
                component.urlFile = 'fake-test-file.pdf';
                component.displayName = 'test name';
                fixture.detectChanges();
                component.ngOnChanges(null);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#adf-viewer-display-name').textContent).toEqual('test name');
                    done();
                });
            });

            it('should use the urlFile name if displayName is NOT set and urlFile is set', (done) => {
                component.urlFile = 'fake-test-file.pdf';
                component.displayName = null;
                fixture.detectChanges();
                component.ngOnChanges(null);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#adf-viewer-display-name').textContent).toEqual('fake-test-file.pdf');
                    done();
                });
            });
        });

        describe('display name property override by blobFile', () => {

            it('should displayName override the name if is present and blobFile is set', (done) => {
                component.displayName = 'blob file display name';
                component.blobFile = new Blob(['This is my blob content'], { type: 'text/plain' });
                fixture.detectChanges();
                component.ngOnChanges(null);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#adf-viewer-display-name').textContent).toEqual('blob file display name');
                    done();
                });
            });

            it('should show uknownn name if displayName is NOT set and blobFile is set', (done) => {
                component.displayName = null;
                component.blobFile = new Blob(['This is my blob content'], { type: 'text/plain' });
                fixture.detectChanges();
                component.ngOnChanges(null);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#adf-viewer-display-name').textContent).toEqual('Unknown');
                    done();
                });
            });
        });

        describe('display name property override by nodeId', () => {

            const displayName = 'the-name';
            const nodeDetails = { name: displayName, id: '12', content: { mimeType: 'txt' } };
            const contentUrl = '/content/url/path';
            const alfrescoApiInstanceMock = {
                nodes: { getNodeInfo: () => Promise.resolve(nodeDetails) },
                content: { getContentUrl: () => contentUrl }
            };

            it('should use the node name if displayName is NOT set and fileNodeId is set', (done) => {
                component.fileNodeId = '12';
                component.urlFile = null;
                component.displayName = null;
                spyOn(alfrescoApiService, 'getInstance').and.returnValue(alfrescoApiInstanceMock);

                component.ngOnChanges(null);
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#adf-viewer-display-name').textContent).toEqual(displayName);
                    done();
                });
            });
        });

    });

    describe('Viewer component - Full Screen Mode - Mocking fixture element', () => {

        beforeEach(() => {
            fixture = TestBed.createComponent(ViewerComponent);
            element = fixture.nativeElement;
            component = fixture.componentInstance;

            component.showToolbar = true;
            component.urlFile = 'fake-test-file.pdf';
            component.mimeType = 'application/pdf';
            fixture.detectChanges();
        });

        it('should request only if enabled', () => {
            const domElement = jasmine.createSpyObj('el', ['requestFullscreen']);
            spyOn(fixture.nativeElement, 'querySelector').and.returnValue(domElement);

            component.allowFullScreen = false;
            component.enterFullScreen();

            expect(domElement.requestFullscreen).not.toHaveBeenCalled();
        });

        it('should use standard mode', () => {
            const domElement = jasmine.createSpyObj('el', ['requestFullscreen']);
            spyOn(fixture.nativeElement, 'querySelector').and.returnValue(domElement);

            component.enterFullScreen();
            expect(domElement.requestFullscreen).toHaveBeenCalled();
        });

        it('should use webkit prefix', () => {
            const domElement = jasmine.createSpyObj('el', ['webkitRequestFullscreen']);
            spyOn(fixture.nativeElement, 'querySelector').and.returnValue(domElement);

            component.enterFullScreen();
            expect(domElement.webkitRequestFullscreen).toHaveBeenCalled();
        });

        it('should use moz prefix', () => {
            const domElement = jasmine.createSpyObj('el', ['mozRequestFullScreen']);
            spyOn(fixture.nativeElement, 'querySelector').and.returnValue(domElement);

            component.enterFullScreen();
            expect(domElement.mozRequestFullScreen).toHaveBeenCalled();
        });

        it('should use ms prefix', () => {
            const domElement = jasmine.createSpyObj('el', ['msRequestFullscreen']);
            spyOn(fixture.nativeElement, 'querySelector').and.returnValue(domElement);

            component.enterFullScreen();
            expect(domElement.msRequestFullscreen).toHaveBeenCalled();
        });

    });

});

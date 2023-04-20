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

import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppExtensionService, ViewerExtensionRef } from '@alfresco/adf-extensions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NodeEntry, VersionEntry } from '@alfresco/js-api';
import { AlfrescoViewerComponent, NodeActionsService, RenditionService } from '@alfresco/adf-content-services';
import {
    CoreTestingModule,
    setupTestBed,
    EventMock,
    ViewUtilService, ViewerComponent
} from '@alfresco/adf-core';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { UploadService } from '../../common/services/upload.service';
import { FileModel } from '../../common/models/file.model';
import { throwError } from 'rxjs';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ESCAPE } from '@angular/cdk/keycodes';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'adf-viewer-container-toolbar',
    template: `
        <adf-alfresco-viewer>
            <adf-viewer-toolbar>
                <div class="custom-toolbar-element"></div>
            </adf-viewer-toolbar>
        </adf-alfresco-viewer>
    `
})
class ViewerWithCustomToolbarComponent {
}

@Component({
    selector: 'adf-viewer-container-toolbar-actions',
    template: `
        <adf-alfresco-viewer>
            <adf-viewer-toolbar-actions>
                <button mat-icon-button id="custom-button">
                    <mat-icon>alarm</mat-icon>
                </button>
            </adf-viewer-toolbar-actions>
        </adf-alfresco-viewer>
    `
})
class ViewerWithCustomToolbarActionsComponent {
}

@Component({
    selector: 'adf-viewer-container-sidebar',
    template: `
        <adf-alfresco-viewer>
            <adf-viewer-sidebar>
                <div class="custom-sidebar"></div>
            </adf-viewer-sidebar>
        </adf-alfresco-viewer>
    `
})
class ViewerWithCustomSidebarComponent {
}

@Component({
    selector: 'adf-dialog-dummy',
    template: ``
})
class DummyDialogComponent {
}

@Component({
    selector: 'adf-viewer-container-open-with',
    template: `
        <adf-alfresco-viewer>
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
        </adf-alfresco-viewer>
    `
})
class ViewerWithCustomOpenWithComponent {
}

@Component({
    selector: 'adf-viewer-container-more-actions',
    template: `
        <adf-alfresco-viewer>
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
        </adf-alfresco-viewer>
    `
})
class ViewerWithCustomMoreActionsComponent {
}


describe('AlfrescoViewerComponent', () => {

    let component: AlfrescoViewerComponent;
    let fixture: ComponentFixture<AlfrescoViewerComponent>;
    let element: HTMLElement;

    let nodesApiService: NodesApiService;
    let dialog: MatDialog;
    let uploadService: UploadService;
    let extensionService: AppExtensionService;
    let renditionService: RenditionService;
    let viewUtilService: ViewUtilService;
    let nodeActionsService: NodeActionsService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            TranslateModule.forRoot(),
            CoreTestingModule,
            MatButtonModule,
            MatIconModule
        ],
        declarations: [
            ViewerWithCustomToolbarComponent,
            ViewerWithCustomSidebarComponent,
            ViewerWithCustomOpenWithComponent,
            ViewerWithCustomMoreActionsComponent,
            ViewerWithCustomToolbarActionsComponent
        ],
        providers: [
            {
                provide: RenditionService, useValue: {
                    getNodeRendition: () => throwError('thrown'),
                    generateMediaTracksRendition: () => {}
                }
            },
            {provide: Location, useClass: SpyLocation},
            MatDialog
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AlfrescoViewerComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;

        uploadService = TestBed.inject(UploadService);
        nodesApiService = TestBed.inject(NodesApiService);
        dialog = TestBed.inject(MatDialog);
        extensionService = TestBed.inject(AppExtensionService);
        renditionService = TestBed.inject(RenditionService);
        viewUtilService = TestBed.inject(ViewUtilService);
        nodeActionsService = TestBed.inject(NodeActionsService);
    });

    afterEach(() => {
        fixture.destroy();
    });


    describe('Extension Type Test', () => {


       it('should use external viewer to display node by id', fakeAsync(() => {
            const extension: ViewerExtensionRef = {
                component: 'custom.component',
                id: 'custom.component.id',
                fileExtension: '*'
            };
            spyOn(extensionService, 'getViewerExtensions').and.returnValue([extension]);
            spyOn(renditionService, 'getNodeRendition');
            spyOn(renditionService, 'generateMediaTracksRendition');
            spyOn(viewUtilService, 'getViewerType').and.returnValue('external');

            fixture = TestBed.createComponent(AlfrescoViewerComponent);
            element = fixture.nativeElement;
            component = fixture.componentInstance;

            spyOn(component.nodesApi, 'getNode').and.callFake(() => Promise.resolve(new NodeEntry({entry: {}})));

            component.nodeId = '37f7f34d-4e64-4db6-bb3f-5c89f7844251';
            component.ngOnChanges();

            fixture.detectChanges();
            tick(100);

            expect(component.nodesApi.getNode).toHaveBeenCalled();
            expect(renditionService.getNodeRendition).not.toHaveBeenCalled();
            expect(renditionService.generateMediaTracksRendition).not.toHaveBeenCalled();
            expect(element.querySelector('[data-automation-id="custom.component"]')).not.toBeNull();
        }));


    });

    describe('MimeType handling', () => {

        it('should node without content show unkonwn', (done) => {
            const displayName = 'the-name';
            const contentUrl = '/content/url/path';

            component.nodeId = '12';
            spyOn(component['nodesApi'], 'getNode').and.returnValue(Promise.resolve(new NodeEntry({
                entry: {content: {name: displayName, id: '12'}}
            })));

            spyOn(component['contentApi'], 'getContentUrl').and.returnValue(contentUrl);

            component.ngOnChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-viewer-unknown-format')).toBeDefined();
                done();
            });
        });
    });

    it('should change display name every time node changes', fakeAsync(() => {
        spyOn(component['nodesApi'], 'getNode').and.returnValues(
            Promise.resolve(new NodeEntry({entry: {name: 'file1', content: {}}})),
            Promise.resolve(new NodeEntry({entry: {name: 'file2', content: {}}}))
        );

        component.showViewer = true;

        component.nodeId = 'id1';
        component.ngOnChanges();
        tick();

        expect(component.fileName).toBe('file1');

        component.nodeId = 'id2';
        component.ngOnChanges();
        tick();

        expect(component.fileName).toBe('file2');
    }));

    it('should append version of the file to the file content URL', fakeAsync(() => {
        spyOn(component['nodesApi'], 'getNode').and.returnValue(
            Promise.resolve(new NodeEntry({
                entry: {
                    name: 'file1.pdf',
                    content: {},
                    properties: {'cm:versionLabel': '10'}
                }
            }))
        );
        spyOn(component['versionsApi'], 'getVersion').and.returnValue(Promise.resolve(undefined));

        component.nodeId = 'id1';
        component.showViewer = true;

        component.versionId = null;
        component.ngOnChanges();
        tick();

        expect(component.fileName).toBe('file1.pdf');
        expect(component.urlFileContent).toContain('/public/alfresco/versions/1/nodes/id1/content?attachment=false&10');
    }));

    it('should change display name every time node\`s version changes', fakeAsync(() => {
        spyOn(component['nodesApi'], 'getNode').and.returnValue(
            Promise.resolve(new NodeEntry({entry: {name: 'node1', content: {}}}))
        );

        spyOn(component['versionsApi'], 'getVersion').and.returnValues(
            Promise.resolve(new VersionEntry({entry: {name: 'file1', content: {}}})),
            Promise.resolve(new VersionEntry({entry: {name: 'file2', content: {}}}))
        );

        component.nodeId = 'id1';
        component.showViewer = true;

        component.versionId = '1.0';
        component.ngOnChanges();
        tick();

        expect(component.fileName).toBe('file1');

        component.versionId = '1.1';
        component.ngOnChanges();
        tick();

        expect(component.fileName).toBe('file2');
    }));

    it('should update node only if node name changed', fakeAsync(() => {
        spyOn(component['nodesApi'], 'getNode').and.returnValues(
            Promise.resolve(new NodeEntry({entry: {name: 'file1', content: {}}}))
        );

        component.showViewer = true;

        component.nodeId = 'id1';
        fixture.detectChanges();
        component.ngOnChanges();
        tick();

        expect(component.fileName).toBe('file1');

        nodesApiService.nodeUpdated.next({id: 'id1', name: 'file2'} as any);
        fixture.detectChanges();
        expect(component.fileName).toBe('file2');

        nodesApiService.nodeUpdated.next({id: 'id1', name: 'file3'} as any);
        fixture.detectChanges();
        expect(component.fileName).toBe('file3');

        nodesApiService.nodeUpdated.next({id: 'id2', name: 'file4'} as any);
        fixture.detectChanges();
        expect(component.fileName).toBe('file3');
        expect(component.nodeId).toBe('id1');
    }));

    it('should download file when downloadFile event is emitted', () => {
        spyOn(nodeActionsService, 'downloadNode');
        const viewerComponent = fixture.debugElement.query(By.directive(ViewerComponent));
        viewerComponent.triggerEventHandler('downloadFile');

        fixture.detectChanges();
        expect(nodeActionsService.downloadNode).toHaveBeenCalled();
    });

    describe('Viewer Example Component Rendering', () => {

        it('should use custom toolbar', (done) => {
            const customFixture = TestBed.createComponent(ViewerWithCustomToolbarComponent);
            const customElement: HTMLElement = customFixture.nativeElement;

            customFixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(customElement.querySelector('.custom-toolbar-element')).toBeDefined();
                done();
            });
        });

        it('should use custom toolbar actions', (done) => {
            const customFixture = TestBed.createComponent(ViewerWithCustomToolbarActionsComponent);
            const customElement: HTMLElement = customFixture.nativeElement;

            customFixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(customElement.querySelector('#custom-button')).toBeDefined();
                done();
            });
        });

        it('should use custom info drawer', (done) => {
            const customFixture = TestBed.createComponent(ViewerWithCustomSidebarComponent);
            const customElement: HTMLElement = customFixture.nativeElement;

            customFixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(customElement.querySelector('.custom-info-drawer-element')).toBeDefined();
                done();
            });
        });

        it('should use custom open with menu', (done) => {
            const customFixture = TestBed.createComponent(ViewerWithCustomOpenWithComponent);
            const customElement: HTMLElement = customFixture.nativeElement;

            customFixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(customElement.querySelector('.adf-viewer-container-open-with')).toBeDefined();
                done();
            });
        });

        it('should use custom more actions menu', (done) => {
            const customFixture = TestBed.createComponent(ViewerWithCustomMoreActionsComponent);
            const customElement: HTMLElement = customFixture.nativeElement;

            customFixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(customElement.querySelector('.adf-viewer-container-more-actions')).toBeDefined();
                done();
            });

        });

        it('should stop propagation on sidebar keydown event [keydown]', fakeAsync(() => {
            const customFixture = TestBed.createComponent(ViewerWithCustomSidebarComponent);
            const customElement: HTMLElement = customFixture.nativeElement;
            const escapeKeyboardEvent = new KeyboardEvent('keydown', { key: ESCAPE.toString() });
            const stopPropagationSpy = spyOn(escapeKeyboardEvent, 'stopPropagation');

            customFixture.detectChanges();
            const viewerSidebarElement = customElement.querySelector('adf-viewer-sidebar');

            viewerSidebarElement.dispatchEvent(escapeKeyboardEvent);

            expect(stopPropagationSpy).toHaveBeenCalled();
        }));

        it('should stop propagation on sidebar keyup event [keyup]', fakeAsync(() => {
            const customFixture = TestBed.createComponent(ViewerWithCustomSidebarComponent);
            const customElement: HTMLElement = customFixture.nativeElement;
            const escapeKeyboardEvent = new KeyboardEvent('keyup', { key: ESCAPE.toString() });
            const stopPropagationSpy = spyOn(escapeKeyboardEvent, 'stopPropagation');

            customFixture.detectChanges();
            const viewerSidebarElement = customElement.querySelector('adf-viewer-sidebar');

            viewerSidebarElement.dispatchEvent(escapeKeyboardEvent);

            expect(stopPropagationSpy).toHaveBeenCalled();
        }));
    });

    describe('error handling', () => {

        it('should show unknown view when node file not found', (done) => {
            spyOn(component['nodesApi'], 'getNode')
                .and.returnValue(Promise.reject({}));

            component.nodeId = 'the-node-id-of-the-file-to-preview';
            component.mimeType = null;

            component.ngOnChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-viewer-unknown-format')).not.toBeNull();
                done();
            });
        });

        it('should show unknown view when sharedLink file not found', (done) => {
            spyOn(component['sharedLinksApi'], 'getSharedLink')
                .and.returnValue(Promise.reject({}));

            component.sharedLinkId = 'the-Shared-Link-id';
            component.mimeType = null;
            component.nodeId = null;

            component.ngOnChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('adf-viewer-unknown-format')).not.toBeNull();
                done();
            });

        });

        it('should raise an event when the shared link is invalid', fakeAsync(() => {
            spyOn(component['sharedLinksApi'], 'getSharedLink')
                .and.returnValue(Promise.reject({}));

            component.sharedLinkId = 'the-Shared-Link-id';
            component.mimeType = null;
            component.nodeId = null;

            component.invalidSharedLink.subscribe((emittedValue) => {
                expect(emittedValue).toBeUndefined();
            });

            component.ngOnChanges();
        }));
//
    });

    describe('Toolbar', () => {

        it('should show only next file button', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = false;
            component.canNavigateNext = true;

            fixture.detectChanges();
            await fixture.whenStable();

            const nextButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-next-file"]');
            expect(nextButton).not.toBeNull();

            const prevButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-pref-file"]');
            expect(prevButton).toBeNull();
        });

        it('should provide tooltip for next file button', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = false;
            component.canNavigateNext = true;

            fixture.detectChanges();
            await fixture.whenStable();

            const nextButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-next-file"]');
            expect(nextButton.title).toBe('ADF_VIEWER.ACTIONS.NEXT_FILE');
        });

        it('should show only previous file button', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = true;
            component.canNavigateNext = false;

            fixture.detectChanges();
            await fixture.whenStable();

            const nextButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-next-file"]');
            expect(nextButton).toBeNull();

            const prevButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-pref-file"]');
            expect(prevButton).not.toBeNull();
        });

        it('should provide tooltip for the previous file button', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = true;
            component.canNavigateNext = false;

            fixture.detectChanges();
            await fixture.whenStable();

            const prevButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-pref-file"]');
            expect(prevButton.title).toBe('ADF_VIEWER.ACTIONS.PREV_FILE');
        });

        it('should show both file navigation buttons', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = true;
            component.canNavigateNext = true;

            fixture.detectChanges();
            await fixture.whenStable();

            const nextButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-next-file"]');
            expect(nextButton).not.toBeNull();

            const prevButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-pref-file"]');
            expect(prevButton).not.toBeNull();
        });

        it('should not show navigation buttons', async () => {
            component.allowNavigate = false;

            fixture.detectChanges();
            await fixture.whenStable();

            const nextButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-next-file"]');
            expect(nextButton).toBeNull();

            const prevButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-pref-file"]');
            expect(prevButton).toBeNull();
        });

        it('should now show navigation buttons even if navigation enabled', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = false;
            component.canNavigateNext = false;

            fixture.detectChanges();
            await fixture.whenStable();

            const nextButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-next-file"]');
            expect(nextButton).toBeNull();

            const prevButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-toolbar-pref-file"]');
            expect(prevButton).toBeNull();
        });

        it('should render fullscreen button', () => {
            expect(element.querySelector('[data-automation-id="adf-toolbar-fullscreen"]')).toBeDefined();
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

            spyOn(component, 'onPrintContent').and.stub();

            const button: HTMLButtonElement = element.querySelector('[data-automation-id="adf-toolbar-print"]') as HTMLButtonElement;
            button.click();

            fixture.whenStable().then(() => {
                expect(component.onPrintContent).toHaveBeenCalled();
                done();
            });
        });

        it('should get and assign node for download', (done) => {
            component.nodeId = '12';
            const displayName = 'the-name';
            const nodeDetails = {
                entry: {name: displayName, id: '12', content: {mimeType: 'txt'}}
            };

            const contentUrl = '/content/url/path';

            const node = new NodeEntry(nodeDetails);

            spyOn(component['nodesApi'], 'getNode').and.returnValue(Promise.resolve(node));
            spyOn(component['contentApi'], 'getContentUrl').and.returnValue(contentUrl);

            component.ngOnChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(component.nodeEntry).toBe(node);
                done();
            });
        });

        it('should render close viewer button if it is not a shared link', (done) => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('[data-automation-id="adf-toolbar-back"]')).toBeDefined();
                expect(element.querySelector('[data-automation-id="adf-toolbar-back"]')).not.toBeNull();
                done();
            });
        });

        it('should not render close viewer button if it is a shared link', (done) => {
            spyOn(component['sharedLinksApi'], 'getSharedLink')
                .and.returnValue(Promise.reject({}));

            component.sharedLinkId = 'the-Shared-Link-id';
            component.mimeType = null;

            component.ngOnChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('[data-automation-id="adf-toolbar-back"]')).toBeNull();
                done();
            });
        });

    });

    describe('Base component', () => {

        beforeEach(() => {
            component.mimeType = 'application/pdf';
            component.nodeId = 'id1';

            fixture.detectChanges();
        });

        describe('SideBar Test', () => {

            it('should NOT display sidebar if is not allowed', (done) => {
                component.showRightSidebar = true;
                component.allowRightSidebar = false;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    const sidebar = element.querySelector('#adf-right-sidebar');
                    expect(sidebar).toBeNull();
                    done();
                });
            });

            it('should display sidebar on the right side', (done) => {
                component.allowRightSidebar = true;
                component.showRightSidebar = true;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    const sidebar = element.querySelector('#adf-right-sidebar');
                    expect(getComputedStyle(sidebar).order).toEqual('4');
                    done();
                });
            });

            it('should NOT display left sidebar if is not allowed', (done) => {
                component.showLeftSidebar = true;
                component.allowLeftSidebar = false;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    const sidebar = element.querySelector('#adf-left-sidebar');
                    expect(sidebar).toBeNull();
                    done();
                });

            });

            it('should display sidebar on the left side', (done) => {
                component.allowLeftSidebar = true;
                component.showLeftSidebar = true;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    const sidebar = element.querySelector('#adf-left-sidebar');
                    expect(getComputedStyle(sidebar).order).toEqual('1');
                    done();
                });
            });
        });

        describe('View', () => {

            describe('Overlay mode true', () => {

                beforeEach(() => {
                    component.overlayMode = true;
                    component.fileName = 'fake-test-file.pdf';
                    fixture.detectChanges();
                });

                it('should header be present if is overlay mode', () => {
                    expect(element.querySelector('.adf-viewer-toolbar')).not.toBeNull();
                });

                it('should Name File be present if is overlay mode ', (done) => {
                    component.ngOnChanges();
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
                    const closeButton: any = element.querySelector('.adf-viewer-close-button');
                    closeButton.click();
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expect(element.querySelector('.adf-viewer-content')).toBeNull();
                        done();
                    });
                });

                it('should Esc button hide the viewer', (done) => {
                    EventMock.keyDown(27);

                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expect(element.querySelector('.adf-viewer-content')).toBeNull();
                        done();
                    });
                });

                it('should not close the viewer on Escape event if dialog was opened', (done) => {
                    const event = new KeyboardEvent('keydown', {
                        bubbles: true,
                        keyCode: 27
                    } as KeyboardEventInit);

                    const dialogRef = dialog.open(DummyDialogComponent);

                    dialogRef.afterClosed().subscribe(() => {
                        EventMock.keyDown(27);
                        fixture.detectChanges();
                        expect(element.querySelector('.adf-viewer-content')).toBeNull();
                        done();
                    });

                    fixture.detectChanges();

                    document.body.dispatchEvent(event);
                    fixture.detectChanges();
                    expect(element.querySelector('.adf-viewer-content')).not.toBeNull();
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

            it('should FileNodeId present not thrown any error ', () => {
                component.showViewer = true;
                component.nodeId = 'file-node-id';

                expect(() => {
                    component.ngOnChanges();
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

        describe('Events', () => {

            it('should update version when emitted by image-viewer and user has update permissions', () => {
                spyOn(uploadService, 'uploadFilesInTheQueue').and.callFake(() => {
                });
                spyOn(uploadService, 'addToQueue');
                component.readOnly = false;
                component.nodeEntry = new NodeEntry({
                    entry: {
                        name: 'fakeImage.png',
                        id: '12',
                        content: {mimeType: 'img/png'}
                    }
                });
                const data = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
                const fakeBlob = new Blob([data], {type: 'image/png'});
                const newImageFile: File = new File([fakeBlob], component?.nodeEntry?.entry?.name, {type: component?.nodeEntry?.entry?.content?.mimeType});
                const newFile = new FileModel(
                    newImageFile,
                    {
                        majorVersion: false,
                        newVersion: true,
                        parentId: component?.nodeEntry?.entry?.parentId,
                        nodeType: component?.nodeEntry?.entry?.content?.mimeType
                    },
                    component.nodeEntry.entry?.id
                );
                component.onSubmitFile(fakeBlob);
                fixture.detectChanges();

                expect(uploadService.addToQueue).toHaveBeenCalledWith(...[newFile]);
                expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalled();
            });

            it('should not update version when emitted by image-viewer and user doesn`t have update permissions', () => {
                spyOn(uploadService, 'uploadFilesInTheQueue').and.callFake(() => {
                });
                component.readOnly = true;
                component.nodeEntry = new NodeEntry({
                    entry: {
                        name: 'fakeImage.png',
                        id: '12',
                        content: {mimeType: 'img/png'}
                    }
                });
                const data = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
                const fakeBlob = new Blob([data], {type: 'image/png'});
                component.onSubmitFile(fakeBlob);
                fixture.detectChanges();

                expect(uploadService.uploadFilesInTheQueue).not.toHaveBeenCalled();
            });
        });

    });
});

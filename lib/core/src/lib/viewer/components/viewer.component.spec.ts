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

import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
    CoreTestingModule,
    EventMock,
    ViewerComponent,
    ViewUtilService,
    AppConfigService,
    DownloadPromptDialogComponent,
    DownloadPromptActions
} from '@alfresco/adf-core';
import { Component } from '@angular/core';
import { of } from 'rxjs';

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
    selector: 'adf-dialog-dummy',
    template: ``
})
class DummyDialogComponent {
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

    let component: ViewerComponent<any>;
    let fixture: ComponentFixture<ViewerComponent<any>>;
    let element: HTMLElement;
    let dialog: MatDialog;
    let viewUtilService: ViewUtilService;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
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
                MatDialog,
                { provide: DownloadPromptDialogComponent, useClass: DummyDialogComponent}
            ]
        });

        fixture = TestBed.createComponent(ViewerComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;

        dialog = TestBed.inject(MatDialog);
        viewUtilService = TestBed.inject(ViewUtilService);
        appConfigService = TestBed.inject(AppConfigService);
        component.fileName = 'test-file.pdf';

        appConfigService.config = {
            ...appConfigService.config,
            viewer: {
                enableDownloadPrompt:  false,
                enableDownloadPromptReminder: false,
                downloadPromptDelay: 3,
                downloadPromptReminderDelay: 2
            }
        };
    });

    afterEach(() => {
        fixture.destroy();
    });


    describe('Mime Type Test', () => {

        it('should mimeType change when blobFile changes', () => {
            const mockSimpleChanges: any = {  blobFile: {currentValue: { type: 'image/png'}}};

            component.ngOnChanges(mockSimpleChanges);

            expect(component.mimeType).toBe('image/png');
        });

    });

    describe('File Name Test', () => {

        it('should fileName be set by urlFile input if the fileName is not provided as Input', () => {
            component.fileName = '';
            spyOn(viewUtilService, 'getFilenameFromUrl').and.returnValue('fakeFileName.jpeg');
            const mockSimpleChanges: any = {  urlFile: {currentValue: 'https://fakefile.url/fakeFileName.jpeg'}};

            component.ngOnChanges(mockSimpleChanges);
            fixture.detectChanges();

            expect(element.querySelector('#adf-viewer-display-name').textContent).toEqual('fakeFileName.jpeg');
        });

        it('should set fileName providing fileName input', () => {
            component.fileName = 'testFileName.jpg';
            spyOn(viewUtilService, 'getFilenameFromUrl').and.returnValue('fakeFileName.jpeg');
            const mockSimpleChanges: any = {  urlFile: {currentValue: 'https://fakefile.url/fakeFileName.jpeg'}};

            component.ngOnChanges(mockSimpleChanges);
            fixture.detectChanges();fixture.detectChanges();

            expect(element.querySelector('#adf-viewer-display-name').textContent).toEqual('testFileName.jpg');
        });

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

        it('should render close viewer button if it is not a shared link', (done) => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('[data-automation-id="adf-toolbar-back"]')).toBeDefined();
                expect(element.querySelector('[data-automation-id="adf-toolbar-back"]')).not.toBeNull();
                done();
            });
        });

    });

    describe('Base component', () => {

        beforeEach(() => {
            component.mimeType = 'application/pdf';

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

                it('should file name be present if is overlay mode ', async () => {
                    const mockSimpleChanges: any = { blobFile: {currentValue: { type: 'image/png'}}};
                    component.ngOnChanges(mockSimpleChanges);
                    fixture.detectChanges();
                    await fixture.whenStable();
                    expect(element.querySelector('#adf-viewer-display-name').textContent).toEqual('fake-test-file.pdf');
                });

                it('should Close button be present if overlay mode', async () => {
                    fixture.detectChanges();
                    await fixture.whenStable();
                    expect(element.querySelector('.adf-viewer-close-button')).not.toBeNull();
                });

                it('should Click on close button hide the viewer', async () => {
                    const closeButton: any = element.querySelector('.adf-viewer-close-button');
                    closeButton.click();
                    fixture.detectChanges();

                    await fixture.whenStable();
                    expect(element.querySelector('.adf-viewer-content')).toBeNull();
                });

                it('should Esc button hide the viewer', async () => {
                    EventMock.keyDown(27);

                    fixture.detectChanges();

                    await fixture.whenStable();
                    expect(element.querySelector('.adf-viewer-content')).toBeNull();
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

            it('should showViewer default value  be true', () => {
                expect(component.showViewer).toBe(true);
            });

            it('should viewer be hide if showViewer value is false', () => {
                component.showViewer = false;

                fixture.detectChanges();
                expect(element.querySelector('.adf-viewer-content')).toBeNull();
            });
        });

        describe('Viewer component - Full Screen Mode - Mocking fixture element', () => {

            beforeEach(() => {
                fixture = TestBed.createComponent(ViewerComponent);
                element = fixture.nativeElement;
                component = fixture.componentInstance;

                component.showToolbar = true;
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

    describe('Download Prompt Dialog',() => {

        let dialogOpenSpy: jasmine.Spy;

        beforeEach(() => {
            appConfigService.config = {
                ...appConfigService.config,
                viewer: {
                    enableDownloadPrompt:  true,
                    enableDownloadPromptReminder: true,
                    downloadPromptDelay: 3,
                    downloadPromptReminderDelay: 2
                }
            };
            dialogOpenSpy = spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(null)} as any);
            component.urlFile = undefined;
            component.clearDownloadPromptTimeouts();
        });

        it('should configure initial timeout to display non responsive dialog when initialising component', (() => {
            fixture.detectChanges();
            expect(component.downloadPromptTimer).toBeDefined();
        }));

        it('should configure reminder timeout to display non responsive dialog after initial dialog', fakeAsync( () => {
            dialogOpenSpy.and.returnValue({ afterClosed: () => of(DownloadPromptActions.WAIT) } as any);
            fixture.detectChanges();
            tick(3000);
            expect(component.downloadPromptReminderTimer).toBeDefined();
            dialogOpenSpy.and.returnValue({ afterClosed: () => of(null) } as any);
            flush();
            discardPeriodicTasks();
        }));

        it('should show initial non responsive dialog after initial timeout', fakeAsync(  () => {
            fixture.detectChanges();
            tick(3000);
            fixture.detectChanges();
            expect(dialogOpenSpy).toHaveBeenCalled();
        }));

        it('should show reminder non responsive dialog after initial dialog', fakeAsync( () => {
            dialogOpenSpy.and.returnValue({ afterClosed: () => of(DownloadPromptActions.WAIT) } as any);
            fixture.detectChanges();
            tick(3000);
            expect(dialogOpenSpy).toHaveBeenCalled();

            dialogOpenSpy.and.returnValue({ afterClosed: () => of(null) } as any);
            tick(2000);
            expect(dialogOpenSpy).toHaveBeenCalledTimes(2);

            flush();
            discardPeriodicTasks();
        }));

        it('should emit downloadFileEvent when DownloadPromptDialog return DownloadPromptActions.DOWNLOAD on close', fakeAsync( () => {
            dialogOpenSpy.and.returnValue({ afterClosed: () => of(DownloadPromptActions.DOWNLOAD) } as any);
            spyOn(component.downloadFile, 'emit');
            fixture.detectChanges();
            tick(3000);
            fixture.detectChanges();

            expect(component.downloadFile.emit).toHaveBeenCalled();
        }));
    });
});

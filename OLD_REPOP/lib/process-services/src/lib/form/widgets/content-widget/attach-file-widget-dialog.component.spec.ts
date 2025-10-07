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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContentNodeSelectorPanelComponent, DocumentListService, SitesService, NodesApiService } from '@alfresco/adf-content-services';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { AttachFileWidgetDialogComponent } from './attach-file-widget-dialog.component';
import { AuthenticationService, NoopAuthModule } from '@alfresco/adf-core';
import { AttachFileWidgetDialogComponentData } from './attach-file-widget-dialog-component.interface';
import { of, Subject, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Node, SiteEntry, NodeEntry, SitePaging, SitePagingList } from '@alfresco/js-api';

describe('AttachFileWidgetDialogComponent', () => {
    let widget: AttachFileWidgetDialogComponent;
    let fixture: ComponentFixture<AttachFileWidgetDialogComponent>;
    const data: AttachFileWidgetDialogComponentData = {
        title: 'Choose along citizen...',
        actionName: 'Choose',
        currentFolderId: '-my-',
        selected: new EventEmitter<any>(),
        ecmHost: 'https://fakeUrl.com',
        isSelectionValid: (entry: Node) => entry.isFile
    };
    let element: HTMLInputElement;
    let siteService: SitesService;
    let nodeService: NodesApiService;
    let documentListService: DocumentListService;
    let isLoggedInSpy: jasmine.Spy;
    let authService: AuthenticationService;
    let closeSpy: jasmine.Spy;

    const fakeSite = new SiteEntry({ entry: { id: 'fake-site', guid: 'fake-site', title: 'fake-site', visibility: 'visible' } });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, AttachFileWidgetDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: { close: () => of() } }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(AttachFileWidgetDialogComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        siteService = fixture.debugElement.injector.get(SitesService);
        nodeService = fixture.debugElement.injector.get(NodesApiService);
        documentListService = fixture.debugElement.injector.get(DocumentListService);

        const matDialogRef = fixture.debugElement.injector.get(MatDialogRef);
        closeSpy = spyOn(matDialogRef, 'close');

        authService = fixture.debugElement.injector.get(AuthenticationService);
        spyOn(authService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket' }));
        authService.onLogin = new Subject<any>();

        spyOn(documentListService, 'getFolderNode').and.returnValue(of({ entry: { path: { elements: [] } } } as NodeEntry));
        spyOn(documentListService, 'getFolder').and.returnValue(throwError('No results for test'));
        spyOn(nodeService, 'getNode').and.returnValue(
            of(new Node({ id: 'fake-node', path: { elements: [{ nodeType: 'st:site', name: 'fake-site' }] } }))
        );

        spyOn(siteService, 'getSite').and.returnValue(of(fakeSite));
        spyOn(siteService, 'getSites').and.returnValue(of(new SitePaging({ list: new SitePagingList({ entries: [] }) })));
        isLoggedInSpy = spyOn(widget, 'isLoggedIn').and.returnValue(false);
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('When is not logged in', () => {
        beforeEach(() => {
            isLoggedInSpy.and.returnValue(false);
            fixture.detectChanges();
        });

        it('should show the login form', () => {
            expect(element.querySelector('#attach-file-login-panel')).not.toBeNull();
            expect(element.querySelector('#username')).not.toBeNull();
            expect(element.querySelector('#password')).not.toBeNull();
            expect(element.querySelector('[data-automation-id="attach-file-dialog-actions-login"]')).not.toBeNull();
        });

        it('should be able to login', (done) => {
            isLoggedInSpy.and.returnValue(true);
            let loginButton: HTMLButtonElement = element.querySelector('[data-automation-id="attach-file-dialog-actions-login"]');
            const usernameInput: HTMLInputElement = element.querySelector('#username');
            const passwordInput: HTMLInputElement = element.querySelector('#password');
            usernameInput.value = 'fakse-user';
            passwordInput.value = 'fakse-user';
            usernameInput.dispatchEvent(new Event('input'));
            passwordInput.dispatchEvent(new Event('input'));
            loginButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#attach-file-content-node')).not.toBeNull();
                loginButton = element.querySelector('[data-automation-id="attach-file-dialog-actions-login"]');
                const chooseButton = element.querySelector('[data-automation-id="attach-file-dialog-actions-choose"]');
                expect(loginButton).toBeNull();
                expect(chooseButton).not.toBeNull();
                done();
            });
        });
    });

    describe('When is logged in', () => {
        let contentNodePanel;

        beforeEach(() => {
            isLoggedInSpy.and.returnValue(true);
            fixture.detectChanges();
            contentNodePanel = fixture.debugElement.query(By.directive(ContentNodeSelectorPanelComponent));
        });

        it('should show the content node selector', () => {
            expect(element.querySelector('#attach-file-content-node')).not.toBeNull();
            expect(element.querySelector('#username')).toBeNull();
            expect(element.querySelector('#password')).toBeNull();
            expect(element.querySelector('[data-automation-id="attach-file-dialog-actions-choose"]')).not.toBeNull();
        });

        it('should be able to choose a file', (done) => {
            data.selected.subscribe((nodeList: Node[]) => {
                expect(nodeList[0].id).toBe('fake');
                expect(nodeList[0].isFile).toBeTruthy();
                done();
            });
            const fakeNode: Node = new Node({ id: 'fake', isFile: true });
            contentNodePanel.componentInstance.select.emit([fakeNode]);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chooseButton: HTMLButtonElement = element.querySelector('[data-automation-id="attach-file-dialog-actions-choose"]');
                chooseButton.click();
            });
        });

        it('[C594015] should not be able to choose a folder', () => {
            spyOn(widget, 'onSelect');
            const fakeFolderNode: Node = new Node({ id: 'fakeFolder', isFile: false, isFolder: true });

            contentNodePanel.componentInstance.onCurrentSelection([{ entry: fakeFolderNode }]);
            fixture.detectChanges();

            const chooseButton: HTMLButtonElement = element.querySelector('[data-automation-id="attach-file-dialog-actions-choose"]');
            expect(chooseButton.disabled).toBe(true);
            expect(widget.onSelect).toHaveBeenCalledOnceWith([]);
        });

        it('should update the title when a site is selected', () => {
            const fakeSiteTitle = 'My fake site';
            contentNodePanel.componentInstance.siteChange.emit(fakeSiteTitle);
            fixture.detectChanges();

            const titleElement = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-title"]'));
            expect(titleElement).not.toBeNull();
            expect(titleElement.nativeElement.innerText).toBe('ATTACH-FILE.ACTIONS.CHOOSE_ITEM');
        });
    });

    describe('login only', () => {
        beforeEach(() => {
            widget.data = {
                ...widget.data,
                loginOnly: true,
                registerExternalHost: () => {}
            };
        });

        it('should close the dialog once user loggedIn', async () => {
            isLoggedInSpy.and.returnValue(false);
            fixture.detectChanges();

            authService.onLogin.next('logged-in');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(closeSpy).toHaveBeenCalled();
        });

        it('should close the dialog immediately if user already loggedIn', () => {
            isLoggedInSpy.and.returnValue(true);
            fixture.detectChanges();
            fixture.componentInstance.ngOnInit();
            expect(closeSpy).toHaveBeenCalled();
        });
    });

    describe('Attach button', () => {
        beforeEach(() => {
            isLoggedInSpy.and.returnValue(true);
        });

        it('should be disabled by default', () => {
            fixture.detectChanges();
            const actionButton = fixture.debugElement.query(By.css('[data-automation-id="attach-file-dialog-actions-choose"]'));

            expect(actionButton.nativeElement.disabled).toBeTruthy();
        });

        it('should be enabled when a node is chosen', () => {
            widget.onSelect([new Node({ id: 'fake' })]);
            fixture.detectChanges();
            const actionButton = fixture.debugElement.query(By.css('[data-automation-id="attach-file-dialog-actions-choose"]'));

            expect(actionButton.nativeElement.disabled).toBeFalsy();
        });

        it('should be disabled when no node chosen', () => {
            widget.onSelect([new Node({ id: 'fake' })]);
            fixture.detectChanges();

            const actionButtonWithNodeSelected = fixture.debugElement.query(By.css('[data-automation-id="attach-file-dialog-actions-choose"]'));

            expect(actionButtonWithNodeSelected.nativeElement.disabled).toBe(false);

            widget.onSelect([]);
            fixture.detectChanges();

            const actionButtonWithoutNodeSelected = fixture.debugElement.query(By.css('[data-automation-id="attach-file-dialog-actions-choose"]'));

            expect(actionButtonWithoutNodeSelected.nativeElement.disabled).toBe(true);
        });
    });
});

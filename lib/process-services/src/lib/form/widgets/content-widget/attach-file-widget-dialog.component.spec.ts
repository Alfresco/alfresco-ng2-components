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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContentModule, ContentNodeSelectorPanelComponent, DocumentListService, SitesService, NodesApiService } from '@alfresco/adf-content-services';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessTestingModule } from '../../../testing/process.testing.module';
import { AttachFileWidgetDialogComponent } from './attach-file-widget-dialog.component';
import { setupTestBed, AuthenticationService, AlfrescoApiService } from '@alfresco/adf-core';
import { AttachFileWidgetDialogComponentData } from './attach-file-widget-dialog-component.interface';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Node, SiteEntry, NodeEntry, SitePaging } from '@alfresco/js-api';
import { TranslateModule } from '@ngx-translate/core';

describe('AttachFileWidgetDialogComponent', () => {

    let widget: AttachFileWidgetDialogComponent;
    let fixture: ComponentFixture<AttachFileWidgetDialogComponent>;
    const data: AttachFileWidgetDialogComponentData = {
        title: 'Choose along citizen...',
        actionName: 'Choose',
        currentFolderId: '-my-',
        selected: new EventEmitter<any>(),
        ecmHost: 'http://fakeUrl.com'
    };
    let element: HTMLInputElement;
    let authService: AuthenticationService;
    let siteService: SitesService;
    let nodeService: NodesApiService;
    let documentListService: DocumentListService;
    let apiService: AlfrescoApiService;
    let matDialogRef: MatDialogRef<AttachFileWidgetDialogComponent>;

    let isLogged = false;
    const fakeSite = new SiteEntry({ entry: { id: 'fake-site', guid: 'fake-site', title: 'fake-site', visibility: 'visible' } });

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentModule.forRoot(),
            ProcessTestingModule
        ],
        providers: [
            { provide: MAT_DIALOG_DATA, useValue: data },
            { provide: MatDialogRef, useValue: { close: () => of() } }
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AttachFileWidgetDialogComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        authService = fixture.debugElement.injector.get(AuthenticationService);
        siteService = fixture.debugElement.injector.get(SitesService);
        nodeService = fixture.debugElement.injector.get(NodesApiService);
        documentListService = fixture.debugElement.injector.get(DocumentListService);
        matDialogRef = fixture.debugElement.injector.get(MatDialogRef);
        apiService = fixture.debugElement.injector.get(AlfrescoApiService);

        spyOn(documentListService, 'getFolderNode').and.returnValue(of({ entry: { path: { elements: [] } } } as NodeEntry));
        spyOn(documentListService, 'getFolder').and.returnValue(throwError('No results for test'));
        spyOn(nodeService, 'getNode').and.returnValue(of(new Node({ id: 'fake-node', path: { elements: [{ nodeType: 'st:site', name: 'fake-site'}] } })));

        spyOn(siteService, 'getSite').and.returnValue(of(fakeSite));
        spyOn(siteService, 'getSites').and.returnValue(of(new SitePaging({ list: { entries: [] } })));
        spyOn(widget, 'isLoggedIn').and.callFake(() => isLogged);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should be able to create the widget', () => {
        fixture.detectChanges();
        expect(widget).not.toBeNull();
    });

    describe('When is not logged in', () => {

        beforeEach(() => {
            fixture.detectChanges();
            isLogged = false;
        });

        it('should show the login form', () => {
            expect(element.querySelector('#attach-file-login-panel')).not.toBeNull();
            expect(element.querySelector('#username')).not.toBeNull();
            expect(element.querySelector('#password')).not.toBeNull();
            expect(element.querySelector('button[data-automation-id="attach-file-dialog-actions-login"]')).not.toBeNull();
        });

        it('should be able to login', (done) => {
            spyOn(authService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket'}));
            isLogged = true;
            let loginButton: HTMLButtonElement = element.querySelector('button[data-automation-id="attach-file-dialog-actions-login"]');
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
                loginButton = element.querySelector('button[data-automation-id="attach-file-dialog-actions-login"]');
                const chooseButton = element.querySelector('button[data-automation-id="attach-file-dialog-actions-choose"]');
                expect(loginButton).toBeNull();
                expect(chooseButton).not.toBeNull();
                done();
            });
        });
   });

    describe('When is logged in', () => {

        let contentNodePanel;

        beforeEach(() => {
            isLogged = true;
            fixture.detectChanges();
            contentNodePanel = fixture.debugElement.query(By.directive(ContentNodeSelectorPanelComponent));
        });

        it('should show the content node selector', () => {
            expect(element.querySelector('#attach-file-content-node')).not.toBeNull();
            expect(element.querySelector('#username')).toBeNull();
            expect(element.querySelector('#password')).toBeNull();
            expect(element.querySelector('button[data-automation-id="attach-file-dialog-actions-choose"]')).not.toBeNull();
        });

        it('should be able to select a file', (done) => {
            data.selected.subscribe((nodeList: Node[]) => {
                expect(nodeList[0].id).toBe('fake');
                expect(nodeList[0].isFile).toBeTruthy();
                done();
            });
            const fakeNode: Node = new Node({ id: 'fake', isFile: true});
            contentNodePanel.componentInstance.select.emit([fakeNode]);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chooseButton: HTMLButtonElement = element.querySelector('button[data-automation-id="attach-file-dialog-actions-choose"]');
                chooseButton.click();
            });
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
            spyOn(authService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket'}));
            spyOn(matDialogRef, 'close').and.callThrough();
            fixture.detectChanges();
            widget.data.loginOnly = true;
            widget.data.registerExternalHost = () => {};
            isLogged = false;
        });

        it('should close the dialog once user loggedIn', () => {
            fixture.detectChanges();
            isLogged = true;
            const loginButton = element.querySelector<HTMLButtonElement>('button[data-automation-id="attach-file-dialog-actions-login"]');
            const usernameInput = element.querySelector<HTMLInputElement>('#username');
            const passwordInput = element.querySelector<HTMLInputElement>('#password');
            usernameInput.value = 'fake-user';
            passwordInput.value = 'fake-user';
            usernameInput.dispatchEvent(new Event('input'));
            passwordInput.dispatchEvent(new Event('input'));
            loginButton.click();
            authService.onLogin.next('logged In');
            fixture.detectChanges();
            expect(matDialogRef.close).toHaveBeenCalled();
        });

        it('should close the dialog immediately if user already loggedIn', () => {
            isLogged = true;
            fixture.detectChanges();
            spyOn(apiService, 'getInstance').and.returnValue({ isLoggedIn: () => true } as any);
            widget.updateExternalHost();
            expect(matDialogRef.close).toHaveBeenCalled();
        });
    });

    describe('Attach button', () => {

        beforeEach(() => {
           isLogged = true;
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

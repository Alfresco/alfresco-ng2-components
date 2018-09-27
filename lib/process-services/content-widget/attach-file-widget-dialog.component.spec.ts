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
import { MAT_DIALOG_DATA } from '@angular/material';
import { ContentModule, ContentNodeSelectorPanelComponent } from '@alfresco/adf-content-services';
import { EventEmitter } from '@angular/core';
import { ProcessTestingModule } from '../testing/process.testing.module';
import { AttachFileWidgetDialogComponent } from './attach-file-widget-dialog.component';
import { setupTestBed, AuthenticationService, SitesService } from '@alfresco/adf-core';
import { AttachFileWidgetDialogComponentData } from './attach-file-widget-dialog-component.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

describe('AttachFileWidgetDialogComponent', () => {

    let widget: AttachFileWidgetDialogComponent;
    let fixture: ComponentFixture<AttachFileWidgetDialogComponent>;
    let data: AttachFileWidgetDialogComponentData = {
        title: 'Move along citizen...',
        actionName: 'move',
        selected: new EventEmitter<any>(),
        ecmHost: 'http://fakeUrl.com/'
    };
    let element: HTMLInputElement;
    let authService: AuthenticationService;
    let siteService: SitesService;

    let isLogged = false;

    setupTestBed({
        imports: [
            ProcessTestingModule,
            ContentModule.forRoot(),
            RouterTestingModule
        ],
        providers: [
            { provide: MAT_DIALOG_DATA, useValue: data }
        ]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(AttachFileWidgetDialogComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        authService = fixture.debugElement.injector.get(AuthenticationService);
        siteService = fixture.debugElement.injector.get(SitesService);
        spyOn(siteService, 'getSites').and.returnValue(of({ list: { entries: [] } }));
        spyOn(widget, 'isLoggedIn').and.callFake(() => {
            return isLogged;
        });
    }));

    afterEach(() => {
        fixture.destroy();
    });

    it('should be able to create the widget', () => {
        expect(widget).not.toBeNull();
    });

    describe('When is not logged in', () => {

        beforeEach(async(() => {
            fixture.detectChanges();
            isLogged = false;
        }));

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
            let usernameInput: HTMLInputElement = element.querySelector('#username');
            let passwordInput: HTMLInputElement = element.querySelector('#password');
            usernameInput.value = 'fakse-user';
            passwordInput.value = 'fakse-user';
            usernameInput.dispatchEvent(new Event('input'));
            passwordInput.dispatchEvent(new Event('input'));
            loginButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#attach-file-content-node')).not.toBeNull();
                loginButton = element.querySelector('button[data-automation-id="attach-file-dialog-actions-login"]');
                let chooseButton = element.querySelector('button[data-automation-id="attach-file-dialog-actions-choose"]');
                expect(loginButton).toBeNull();
                expect(chooseButton).not.toBeNull();
                done();
            });
        });

    });

    describe('When is logged in', () => {

        let contentNodePanel;

        beforeEach(async(() => {
            isLogged = true;
            fixture.detectChanges();
            contentNodePanel = fixture.debugElement.query(By.directive(ContentNodeSelectorPanelComponent));
        }));

        it('should show the content node selector', () => {
            expect(element.querySelector('#attach-file-content-node')).not.toBeNull();
            expect(element.querySelector('#username')).toBeNull();
            expect(element.querySelector('#password')).toBeNull();
            expect(element.querySelector('button[data-automation-id="attach-file-dialog-actions-choose"]')).not.toBeNull();
        });

        it('should be able to select a file', (done) => {
            data.selected.subscribe((nodeList: MinimalNodeEntryEntity[]) => {
                expect(nodeList[0].id).toBe('fake');
                expect(nodeList[0].isFile).toBeTruthy();
                done();
            });
            let fakeNode: MinimalNodeEntryEntity = { id: 'fake', isFile: true};
            contentNodePanel.componentInstance.select.emit([fakeNode]);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let chooseButton: HTMLButtonElement = element.querySelector('button[data-automation-id="attach-file-dialog-actions-choose"]');
                chooseButton.click();
            });
        });

    });

});

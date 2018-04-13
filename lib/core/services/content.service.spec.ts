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

import { TestBed } from '@angular/core/testing';
import { CookieServiceMock } from '../mock/cookie.service.mock';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { AppConfigService } from '../app-config/app-config.service';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';
import { StorageService } from './storage.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { AlfrescoApiService } from './alfresco-api.service';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';
import { TranslationService } from './translation.service';
import { TranslationMock } from '../mock/translation.service.mock';

declare let jasmine: any;

describe('ContentService', () => {

    let contentService: ContentService;
    let authService: AuthenticationService;
    let settingsService: SettingsService;
    let storage: StorageService;
    let node: any;

    const nodeId = 'fake-node-id';

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
            { provide: TranslationService, useClass: TranslationMock },
            { provide: CookieService, useClass: CookieServiceMock }
        ]
    });

    beforeEach(() => {
        authService = TestBed.get(AuthenticationService);
        settingsService = TestBed.get(SettingsService);
        contentService = TestBed.get(ContentService);
        storage = TestBed.get(StorageService);
        storage.clear();

        node = {
            entry: {
                id: nodeId
            }
        };

        jasmine.Ajax.install();

        let appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config = {
            ecmHost: 'http://localhost:9876/ecm'
        };
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    beforeEach(() => {
        settingsService.setProviders('ECM');
    });

    it('should return a valid content URL', (done) => {
        authService.login('fake-username', 'fake-password').subscribe(() => {
            expect(contentService.getContentUrl(node)).toBe('http://localhost:9876/ecm/alfresco/api/' +
                '-default-/public/alfresco/versions/1/nodes/fake-node-id/content?attachment=false&alf_ticket=fake-post-ticket');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 201,
            contentType: 'application/json',
            responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
        });
    });

    it('should return a valid thumbnail URL', (done) => {
        authService.login('fake-username', 'fake-password').subscribe(() => {
            expect(contentService.getDocumentThumbnailUrl(node))
                .toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco' +
                    '/versions/1/nodes/fake-node-id/renditions/doclib/content?attachment=false&alf_ticket=fake-post-ticket');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 201,
            contentType: 'application/json',
            responseText: JSON.stringify({'entry': {'id': 'fake-post-ticket', 'userId': 'admin'}})
        });
    });

    it('should havePermission be false if allowableOperation is not present in the node', () => {
        let permissionNode = {};
        expect(contentService.hasPermission(permissionNode, 'create')).toBeFalsy();
    });

    it('should havePermission be true if allowableOperation is present and you have the permission for the request operation', () => {
        let permissionNode = {allowableOperations: ['delete', 'update', 'create', 'updatePermissions']};

        expect(contentService.hasPermission(permissionNode, 'create')).toBeTruthy();
    });

    it('should havePermission be false if allowableOperation is present but you don\'t have the permission for the request operation', () => {
        let permissionNode = {allowableOperations: ['delete', 'update', 'updatePermissions']};
        expect(contentService.hasPermission(permissionNode, 'create')).toBeFalsy();
    });

    it('should havePermission works in the opposite way with negate value', () => {
        let permissionNode = {allowableOperations: ['delete', 'update', 'updatePermissions']};
        expect(contentService.hasPermission(permissionNode, '!create')).toBeTruthy();
    });

    it('should havePermission return false id no permission parameter are passed', () => {
        let permissionNode = {allowableOperations: ['delete', 'update', 'updatePermissions']};
        expect(contentService.hasPermission(permissionNode, null)).toBeFalsy();
    });

    it('should havePermission return true if permission parameter is copy', () => {
        let permissionNode = null;
        expect(contentService.hasPermission(permissionNode, 'copy')).toBeTruthy();
    });

    describe('Download blob', () => {

        it('Should use native msSaveOrOpenBlob if the browser is IE', (done) => {

            let navigatorAny: any = window.navigator;

            navigatorAny.__defineGetter__('msSaveOrOpenBlob', () => {
                done();
            });

            let blob = new Blob([''], {type: 'text/html'});
            contentService.downloadBlob(blob, 'test_ie');
        });
    });
});

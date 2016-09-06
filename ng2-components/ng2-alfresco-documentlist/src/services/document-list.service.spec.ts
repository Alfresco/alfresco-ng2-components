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

import { it, describe, expect, beforeEach, afterEach } from '@angular/core/testing';
import { AlfrescoSettingsService, AlfrescoAuthenticationService, AlfrescoContentService , AlfrescoApiService} from 'ng2-alfresco-core';
import { FileNode } from '../assets/document-library.model.mock';
import { ReflectiveInjector } from '@angular/core';
import { DocumentListService } from './document-list.service';
import { HTTP_PROVIDERS } from '@angular/http';

declare let jasmine: any;

describe('DocumentListService', () => {

    let injector;
    let service: DocumentListService;
    let settingsService: AlfrescoSettingsService;
    let authService: AlfrescoAuthenticationService;
    let contentService: AlfrescoContentService;

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            HTTP_PROVIDERS,
            AlfrescoApiService,
            AlfrescoAuthenticationService,
            AlfrescoSettingsService
        ]);

        settingsService = injector.get(AlfrescoSettingsService);
        authService = injector.get(AlfrescoAuthenticationService);
        contentService = new AlfrescoContentService(authService);
        service = new DocumentListService(authService, contentService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should require node to get thumbnail url', () => {
        expect(service.getDocumentThumbnailUrl(null)).toBeNull();
    });

    it('should require content service to get thumbnail url', () => {
        service = new DocumentListService(authService, null);
        let file = new FileNode();
        expect(service.getDocumentThumbnailUrl(file)).toBeNull();
    });

    it('should resolve thumbnail url via content service', () => {
        let url = 'http://<address>';
        spyOn(contentService, 'getDocumentThumbnailUrl').and.returnValue(url);

        let file = new FileNode();
        let thumbnailUrl = service.getDocumentThumbnailUrl(file);

        expect(thumbnailUrl).toBe(url);
        expect(contentService.getDocumentThumbnailUrl).toHaveBeenCalledWith(file);
    });

    it('should resolve fallback icon for mime type', () => {
        let icon = service.getMimeTypeIcon('image/png');
        expect(icon).toBe(service.mimeTypeIcons['image/png']);
    });

    it('should resolve default icon for mime type', () => {
        expect(service.getMimeTypeIcon(null)).toBe(DocumentListService.DEFAULT_MIME_TYPE_ICON);
        expect(service.getMimeTypeIcon('')).toBe(DocumentListService.DEFAULT_MIME_TYPE_ICON);
        expect(service.getMimeTypeIcon('missing/type')).toBe(DocumentListService.DEFAULT_MIME_TYPE_ICON);
    });

    it('Delete node should perform request against the server', (done) => {
        service.deleteNode('fake-node-id').subscribe(e => {
            expect(jasmine.Ajax.requests.mostRecent().url)
                .toBe('http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/fake-node-id');
            expect(jasmine.Ajax.requests.mostRecent().method)
                .toBe('DELETE');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200
        });
    });

    it('Get folder should perform request against the server', (done) => {
        service.getFolder('fake-node-id').subscribe(e => {
            expect(jasmine.Ajax.requests.mostRecent().url)
                .toBe('http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/' +
                    'children?include=path%2Cproperties&relativePath=fake-node-id');
            expect(jasmine.Ajax.requests.mostRecent().method)
                .toBe('GET');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200
        });
    });

    it('Get folder should perform request against the server with options', (done) => {
        service.getFolder('fake-node-id', {maxItems: 10}).subscribe(e => {
            expect(jasmine.Ajax.requests.mostRecent().url)
                .toBe('http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/' +
                    'children?maxItems=10&include=path%2Cproperties&relativePath=fake-node-id');
            expect(jasmine.Ajax.requests.mostRecent().method)
                .toBe('GET');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200
        });
    });

    it('Get folder should perform error catch', (done) => {
        service.getFolder('fake-node-id', {maxItems: 10}).subscribe(() => {
            },
            () => {
                done();
            });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 403
        });
    });
});

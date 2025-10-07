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

import { AppExtensionService } from '@alfresco/adf-extensions';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ViewUtilService } from './view-util.service';

describe('ViewUtilService', () => {
    let viewUtilService: ViewUtilService;
    let appExtensionService: AppExtensionService;
    const extensionsSupportedByTemplates = ['dmn', 'txt'];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AppExtensionService]
        });

        viewUtilService = TestBed.inject(ViewUtilService);
        appExtensionService = TestBed.inject(AppExtensionService);
    });

    it('should extract file name from url', () => {
        expect(viewUtilService.getFilenameFromUrl('http://localhost/test.jpg?cache=1000')).toBe('test.jpg');
        expect(viewUtilService.getFilenameFromUrl('http://localhost:4200/test-path/test2.json#cache=1000')).toBe('test2.json');
    });

    it('should extract file extension from url', () => {
        expect(viewUtilService.getFileExtension('http://localhost/test.jpg?cache=1000')).toBe('jpg');
        expect(viewUtilService.getFileExtension('http://localhost:4200/test-path/test2.json#cache=1000')).toBe('json');
    });

    it('should return correct viewer type based on file mime type', () => {
        expect(viewUtilService.getViewerTypeByMimeType('text/plain')).toBe('text');
        expect(viewUtilService.getViewerTypeByMimeType('application/pdf')).toBe('pdf');
        expect(viewUtilService.getViewerTypeByMimeType('image/gif')).toBe('image');
        expect(viewUtilService.getViewerTypeByMimeType('video/webm')).toBe('media');
        expect(viewUtilService.getViewerTypeByMimeType('image/test')).toBe('unknown');
    });

    it('should check if extension is custom one added either by extension service or by a template in viewer renderer', () => {
        spyOn(appExtensionService, 'getViewerExtensions').and.returnValue([{ fileExtension: 'json', component: 'test', id: 'test' }]);
        expect(viewUtilService.isCustomViewerExtension('pdf')).toBeFalse();
        expect(viewUtilService.isCustomViewerExtension('txt')).toBeFalse();
        expect(viewUtilService.isCustomViewerExtension('json')).toBeTrue();
        expect(viewUtilService.isCustomViewerExtension('docx', extensionsSupportedByTemplates)).toBeFalse();
        expect(viewUtilService.isCustomViewerExtension('dmn', extensionsSupportedByTemplates)).toBeTrue();
        expect(viewUtilService.isCustomViewerExtension('txt', extensionsSupportedByTemplates)).toBeTrue();
    });

    it('should return correct viewer type based on extension and mime type', () => {
        spyOn(appExtensionService, 'getViewerExtensions').and.returnValue([{ fileExtension: '*', component: 'test', id: 'test' }]);
        expect(viewUtilService.getViewerType('pdf', 'application/pdf')).toBe('external');

        appExtensionService.getViewerExtensions = jasmine.createSpy().and.returnValue([{ fileExtension: 'json', component: 'test', id: 'test' }]);
        expect(viewUtilService.getViewerType('json', '')).toBe('custom');
        expect(viewUtilService.getViewerType('dmn', '')).toBe('unknown');
        expect(viewUtilService.getViewerType('dmn', '', extensionsSupportedByTemplates)).toBe('custom');

        expect(viewUtilService.getViewerType('pdf', '')).toBe('pdf');
        expect(viewUtilService.getViewerType('', 'application/pdf')).toBe('pdf');
    });
});

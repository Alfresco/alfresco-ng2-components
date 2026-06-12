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

import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlService } from './url.service';

describe('UrlService', () => {
    const fakeObjectUrl = 'blob:http://localhost/fake-object-url';
    const fakeSafeUrl = { __safe: 'safe-url' } as unknown as string;

    let service: UrlService;
    let sanitizer: DomSanitizer;
    let createObjectURLSpy: jasmine.Spy;

    beforeEach(() => {
        const mockSanitizer = {
            bypassSecurityTrustUrl: jasmine.createSpy('bypassSecurityTrustUrl').and.returnValue(fakeSafeUrl)
        };

        TestBed.configureTestingModule({
            providers: [{ provide: DomSanitizer, useValue: mockSanitizer }]
        });

        service = TestBed.inject(UrlService);
        sanitizer = TestBed.inject(DomSanitizer);
        createObjectURLSpy = spyOn(window.URL, 'createObjectURL').and.returnValue(fakeObjectUrl);
    });

    describe('createObjectUrl', () => {
        it('should delegate to window.URL.createObjectURL and return the raw url', () => {
            const blob = new Blob(['test'], { type: 'text/plain' });

            const result = service.createObjectUrl(blob);

            expect(createObjectURLSpy).toHaveBeenCalledOnceWith(blob);
            expect(result).toBe(fakeObjectUrl);
        });

        it('should not invoke the sanitizer', () => {
            service.createObjectUrl(new Blob(['test']));

            expect(sanitizer.bypassSecurityTrustUrl).not.toHaveBeenCalled();
        });
    });

    describe('trustUrl', () => {
        it('should wrap the url with bypassSecurityTrustUrl', () => {
            const result = service.trustUrl(fakeObjectUrl);

            expect(sanitizer.bypassSecurityTrustUrl).toHaveBeenCalledOnceWith(fakeObjectUrl);
            expect(result).toBe(fakeSafeUrl);
        });

        it('should not create an object url', () => {
            service.trustUrl(fakeObjectUrl);

            expect(createObjectURLSpy).not.toHaveBeenCalled();
        });
    });

    describe('createTrustedUrl', () => {
        it('should create an object url from the blob and pass it to the sanitizer', () => {
            const blob = new Blob(['test'], { type: 'text/plain' });

            const result = service.createTrustedUrl(blob);

            expect(createObjectURLSpy).toHaveBeenCalledOnceWith(blob);
            expect(sanitizer.bypassSecurityTrustUrl).toHaveBeenCalledOnceWith(fakeObjectUrl);
            expect(result).toBe(fakeSafeUrl);
        });
    });
});

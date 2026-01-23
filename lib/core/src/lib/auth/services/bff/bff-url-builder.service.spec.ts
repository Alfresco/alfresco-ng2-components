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

import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { BffUrlBuilder } from './bff-url-builder.service';

describe('BffUrlBuilder', () => {
    let service: BffUrlBuilder;
    let mockDocument: Document;

    // eslint-disable-next-line jsdoc/require-jsdoc
    function setFakeDocumentLocation(pathname: string, protocol = 'https:', host = 'hawkins-lab:1983') {
        mockDocument.location = { protocol, host, pathname } as any;
    }

    beforeEach(() => {
        mockDocument = {
            location: { protocol: 'https:', host: 'hawkins-lab:1983', pathname: '/' }
        } as any;
        TestBed.configureTestingModule({
            providers: [BffUrlBuilder, { provide: DOCUMENT, useValue: mockDocument }]
        });
        service = TestBed.inject(BffUrlBuilder);
    });

    describe('getUserUrl', () => {
        it('should build user url with valid path segment', () => {
            setFakeDocumentLocation('/app1');
            expect(service.getUserUrl()).toBe('https://hawkins-lab:1983/app1/bff/user');
        });
        it('should build user url without path segment if invalid', () => {
            setFakeDocumentLocation('/');
            expect(service.getUserUrl()).toBe('https://hawkins-lab:1983/bff/user');
        });
        it('should build user url without path segment if segment is invalid', () => {
            setFakeDocumentLocation('/123bad');
            expect(service.getUserUrl()).toBe('https://hawkins-lab:1983/bff/user');
        });
    });

    describe('getLoginUrl', () => {
        it('should build login url with valid path segment and no returnUrl', () => {
            setFakeDocumentLocation('/app1');
            expect(service.getLoginUrl()).toBe('https://hawkins-lab:1983/app1/bff/login');
        });
        it('should build login url without path segment if invalid and no returnUrl', () => {
            setFakeDocumentLocation('/');
            expect(service.getLoginUrl()).toBe('https://hawkins-lab:1983/bff/login');
        });
        it('should build login url with valid path segment and returnUrl', () => {
            setFakeDocumentLocation('/app1');
            expect(service.getLoginUrl('/dashboard')).toBe('https://hawkins-lab:1983/app1/bff/login?returnUrl=%2Fdashboard');
        });
        it('should build login url without path segment if invalid and with returnUrl', () => {
            setFakeDocumentLocation('/');
            expect(service.getLoginUrl('/dashboard')).toBe('https://hawkins-lab:1983/bff/login?returnUrl=%2Fdashboard');
        });
    });

    describe('getLogoutUrl', () => {
        it('should build logout url with valid path segment', () => {
            setFakeDocumentLocation('/app1');
            expect(service.getLogoutUrl()).toBe('https://hawkins-lab:1983/app1/bff/logout');
        });
        it('should build logout url without path segment if invalid', () => {
            setFakeDocumentLocation('/');
            expect(service.getLogoutUrl()).toBe('https://hawkins-lab:1983/bff/logout');
        });
    });

    describe('edge cases for path segment', () => {
        it('should ignore path segment with special characters', () => {
            setFakeDocumentLocation('/app$1');
            expect(service.getUserUrl()).toBe('https://hawkins-lab:1983/bff/user');
        });
        it('should ignore path segment with spaces', () => {
            setFakeDocumentLocation('/app 1');
            expect(service.getUserUrl()).toBe('https://hawkins-lab:1983/bff/user');
        });
        it('should ignore empty path segment', () => {
            setFakeDocumentLocation('');
            expect(service.getUserUrl()).toBe('https://hawkins-lab:1983/bff/user');
        });
    });
});

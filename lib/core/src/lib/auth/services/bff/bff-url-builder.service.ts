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

import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class BffUrlBuilder {
    constructor(@Inject(DOCUMENT) private document: Document) {}

    private getValidPathSegment(pathname: string): string {
        if (!pathname || pathname === '/') return '';
        const segment = pathname.split('/')[1] || '';
        if (/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(segment)) {
            return segment;
        }
        return '';
    }

    private getProtocolHost(): { protocol: string; host: string; pathname: string } {
        const { protocol, host, pathname } = this.document.location;
        return { protocol, host, pathname };
    }

    /**
     * Constructs and returns the URL for the BFF user endpoint.
     *
     * The URL is built using the protocol, host, and pathname obtained from `getProtocolHost()`.
     * If a valid path segment is present (determined by `getValidPathSegment(pathname)`), it is included in the URL path.
     * Otherwise, the URL is constructed without the path segment.
     *
     * @returns The fully constructed BFF user endpoint URL.
     */
    getUserUrl(): string {
        const { protocol, host, pathname } = this.getProtocolHost();
        const pathSegment = this.getValidPathSegment(pathname);
        return pathSegment ? `${protocol}//${host}/${pathSegment}/bff/user` : `${protocol}//${host}/bff/user`;
    }

    /**
     * Constructs the login URL for the BFF (Backend For Frontend) authentication service.
     *
     * If `currentUrl` is not provided or is `'/'`, returns the login URL without a `returnUrl` query parameter.
     * Otherwise, appends the encoded `currentUrl` as the `returnUrl` query parameter to the login URL.
     *
     * The URL is built using the protocol, host, and an optional path segment derived from the current location.
     *
     * @param currentUrl - The URL to redirect to after successful login. If omitted or `'/'`, no redirect is specified.
     * @returns The constructed login URL as a string.
     */
    getLoginUrl(currentUrl?: string): string {
        const { protocol, host, pathname } = this.getProtocolHost();
        const pathSegment = this.getValidPathSegment(pathname);
        if (!currentUrl || currentUrl === '/') {
            return pathSegment ? `${protocol}//${host}/${pathSegment}/bff/login` : `${protocol}//${host}/bff/login`;
        }
        const returnUrl = encodeURIComponent(currentUrl ?? '');
        return pathSegment
            ? `${protocol}//${host}/${pathSegment}/bff/login?returnUrl=${returnUrl}`
            : `${protocol}//${host}/bff/login?returnUrl=${returnUrl}`;
    }

    /**
     * Constructs and returns the logout URL for the BFF (Backend For Frontend) service.
     * The URL is built using the protocol, host, and an optional valid path segment
     * obtained from the current location. If a valid path segment exists, it is included
     * in the URL path before `/bff/logout`; otherwise, the URL defaults to `/bff/logout`.
     *
     * @returns The fully qualified logout URL for the BFF service.
     */
    getLogoutUrl(): string {
        const { protocol, host, pathname } = this.getProtocolHost();
        const pathSegment = this.getValidPathSegment(pathname);
        return pathSegment ? `${protocol}//${host}/${pathSegment}/bff/logout` : `${protocol}//${host}/bff/logout`;
    }
}

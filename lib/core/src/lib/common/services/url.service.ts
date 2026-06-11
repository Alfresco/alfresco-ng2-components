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

import { Injectable, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class UrlService {
    private readonly sanitizer = inject(DomSanitizer);

    /**
     * Creates a trusted object URL from the Blob.
     * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
     *
     * @param  blob Data to wrap into object URL
     * @returns URL string
     */
    createTrustedUrl(blob: Blob): string {
        return this.trustUrl(this.createObjectUrl(blob));
    }

    /**
     * Creates a raw object URL from the Blob without Angular sanitization. Use this for
     * non-Angular consumers (third-party DOM APIs, libraries) that need a real URL string.
     *
     * @param  blob Data to wrap into object URL
     * @returns Raw object URL string
     */
    createObjectUrl(blob: Blob): string {
        return window.URL.createObjectURL(blob);
    }

    /**
     * Wraps a URL string with Angular's bypassSecurityTrustUrl so it can be used in template bindings.
     * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
     *
     * @param  url URL to mark as safe
     * @returns SafeUrl wrapper cast to string for template binding
     */
    trustUrl(url: string): string {
        return this.sanitizer.bypassSecurityTrustUrl(url) as string;
    }
}

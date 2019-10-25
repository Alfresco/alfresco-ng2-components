/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { CookieService } from '../services/cookie.service';

export class CookieServiceMock extends CookieService {

    /** @override */
    isEnabled(): boolean {
        return true;
    }

    /** @override */
    getItem(key: string): string | null {
        return this[key] && this[key].data || null;
    }

    /** @override */
    setItem(key: string, data: string, expiration: Date | null, path: string | null): void {
        this[key] = {data, expiration, path};
    }

    /** @override */
    clear() {
        Object.keys(this).forEach((key) => {
            if (this.hasOwnProperty(key) && typeof(this[key]) !== 'function') {
                this[key] = undefined;
            }
        });
    }
}

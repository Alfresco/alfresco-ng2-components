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

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JwtHelperService {

    static USER_NAME = 'name';
    static FAMILY_NAME = 'family_name';
    static GIVEN_NAME = 'given_name';
    static USER_EMAIL = 'email';
    static USER_ACCESS_TOKEN = 'access_token';
    static USER_PREFERRED_USERNAME = 'preferred_username';

    constructor() {
    }

    /**
     * Decodes a JSON web token into a JS object.
     * @param token Token in encoded form
     * @returns Decoded token data object
     */
    decodeToken(token): Object {
        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return JSON.parse(decoded);
    }

    private urlBase64Decode(token): string {
        let output = token.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw new Error('Illegal base64url string!');
            }
        }
        return decodeURIComponent(escape(window.atob(output)));
    }

    /**
     * Gets a named value from the user access token.
     * @param key Key name of the field to retrieve
     * @returns Value from the token
     */
    getValueFromLocalAccessToken<T>(key: string): T {
        return this.getValueFromToken(this.getAccessToken(), key);
    }

    /**
     * Gets access token
     * @returns access token
     */
    getAccessToken(): string {
        return localStorage.getItem(JwtHelperService.USER_ACCESS_TOKEN);
    }

    /**
     * Gets a named value from the user access token.
     * @param key accessToken
     * @param key Key name of the field to retrieve
     * @returns Value from the token
     */
    getValueFromToken<T>(accessToken: string, key: string): T {
        let value;
        if (accessToken) {
            const tokenPayload = this.decodeToken(accessToken);
            value = tokenPayload[key];
        }
        return <T> value;
    }
}

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

export class StringUtil {

    /**
     * Generates a random string.
     *
     * @param length If this parameter is not provided the length is set to 8 by default.
     * @method generateRandomString
     */
    static generateRandomString(length: number = 8): string {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    /**
     * Generates a random email address following the format: abcdef@activiti.test.com
     *
     * @param length
     * @method generateRandomEmail
     */
    static generateRandomEmail(domain: string, length: number = 5): string {
        let email = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            email += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        email += domain;
        return email.toLowerCase();
    }

}

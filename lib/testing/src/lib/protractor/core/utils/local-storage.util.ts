/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { browser } from 'protractor';

export class LocalStorageUtil {

    static async getConfigField(field: string): Promise<any> {
        return browser.executeScript(
            'return window.adf ? window.adf.getConfigField(`' + field + '`) : null;'
        );
    }

    static async setConfigField(field: string, value: string): Promise<void> {
        await browser.executeScript(
            'window.adf.setConfigField(`' + field + '`, `' + value + '`);'
        );
    }

    static async setStorageItem(field: string, value: string): Promise<void> {
        await browser.executeScript(
            'window.adf.setStorageItem(`' + field + '`, `' + value + '`);'
        );
    }

    static async removeStorageItem(field: string): Promise<void> {
        await browser.executeScript(
            'window.adf.removeStorageItem(`' + field + '`);'
        );
    }

    static async getStorageItem(field: string): Promise<any> {
        return browser.executeScript(
            'return window.adf ? window.adf.getStorageItem(`' + field + '`) : null;'
        );
    }

    static async setUserPreference(field: string, value: any): Promise<void> {
        await browser.executeScript(
            'window.adf.setUserPreference(`' + field + '`, `' + value + '`);'
        );
    }

    static async clearStorage(): Promise<void> {
        await browser.executeScript(
            'window.adf.clearStorage();'
        );
    }

    static async apiReset(): Promise<void> {
        await browser.executeScript(
            `window.adf.apiReset();`
        );
    }

}

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

import { ADFPage } from '../../page';

export class LocalStorageUtil extends ADFPage {

    async getConfigField(field: string): Promise<any> {
        return this.page.evaluate(() =>
            window.adf ? window.adf.getConfigField(field) : null
        );
    }

    async setConfigField(field: string, value: string): Promise<void> {
        await this.page.evaluate(() =>
            window.adf.setConfigField(field, value)
        );
    }

    async setStorageItem(field: string, value: string): Promise<void> {
        await this.page.evaluate(() =>
            window.adf.setStorageItem(field, value)
        );
    }

    async removeStorageItem(field: string): Promise<void> {
        await this.page.evaluate(() =>
            window.adf.removeStorageItem(field)
        );
    }

    async getStorageItem(field: string): Promise<any> {
        return this.page.evaluate(() =>
            window.adf ? window.adf.getStorageItem(field) : null
        );
    }

    async setUserPreference(field: string, value: any): Promise<void> {
        await this.page.evaluate(() =>
            window.adf.setUserPreference(field, value)
        );
    }

    async clearStorage(): Promise<void> {
        await this.page.evaluate(() =>
            window.adf.clearStorage()
        );
    }

    async apiReset(): Promise<void> {
        await this.page.evaluate(() =>
            window.adf.apiReset()
        );
    }

}

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

import * as path from 'path';
import * as fs from 'fs';
import { browser } from 'protractor';

const DEFAULT_ROOT_PATH = browser.params.testConfig ? browser.params.testConfig.main.rootPath : __dirname;

export class FileBrowserUtil {

    static async isFileDownloaded(fileName: string): Promise<boolean> {

        const file = await browser.driver.wait(() => {
            return fs.existsSync(path.join(DEFAULT_ROOT_PATH, 'downloads', fileName));
        }, 30000);

        await expect(file).toBe(true);

        return !!file;
    }

}

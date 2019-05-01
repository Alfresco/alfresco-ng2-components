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
import fs = require('fs');
import { browser } from 'protractor';

export class FileUtil {

    static async isFileDownloaded(fileName) {
        return await this.fileExists(path.join(global['TestConfig'].main.rootPath, 'downloads', fileName));
    }

    static async isFileNotDownloaded(fileName) {
        return await this.fileNotExists(path.join(global['TestConfig'].main.rootPath, 'downloads', fileName));
    }

    static fileExists(filePath) {
        browser.driver.wait(() => {
            return fs.existsSync(filePath);
        }, 30000).then((file) => {
            expect(file).toBe(true);
        }, (error) => {
            throw error;
        });
    }

    static fileNotExists(filePath) {
        browser.driver.wait(() => {
            return fs.existsSync(filePath);
        }, 30000).then((file) => {
            expect(file).toBe(false);
        }, (file) => {
            expect(file).toBe(false);
        });
    }

}

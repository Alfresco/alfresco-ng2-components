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

export class FileBrowserUtil {

    static async isFileDownloaded(fileName: string) {
        const config = await browser.getProcessedConfig();
        const filePath = path.join(config.params.downloadFolder, fileName);

        let tries = 15;

        return new Promise(function(resolve) {
          const checkExist = setInterval(() => {
            const exists = fs.existsSync(filePath);
            tries--;
            if (exists) {
                clearInterval(checkExist);
                resolve(true);
            } else if (tries === 0) {
                clearInterval(checkExist);
                resolve(false);
            }
          }, 1000);
        });
    }

}

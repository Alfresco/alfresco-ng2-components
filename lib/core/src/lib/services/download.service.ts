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
export class DownloadService {
    private saveData: Function;

    constructor() {
        this.saveData = (function() {
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';

            return function(fileData, format, fileName) {
                let blob = null;

                if (format === 'blob' || format === 'data') {
                    blob = new Blob([fileData], { type: 'octet/stream' });
                }

                if (format === 'object' || format === 'json') {
                    const json = JSON.stringify(fileData);
                    blob = new Blob([json], { type: 'octet/stream' });
                }

                if (blob) {
                    if (
                        typeof window.navigator !== 'undefined' &&
                        window.navigator.msSaveOrOpenBlob
                    ) {
                        navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        const url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName;
                        a.click();

                        window.URL.revokeObjectURL(url);
                    }
                }
            };
        })();
    }

    /**
     * Invokes content download for a Blob with a file name.
     * @param blob Content to download.
     * @param fileName Name of the resulting file.
     */
    downloadBlob(blob: Blob, fileName: string): void {
        this.saveData(blob, 'blob', fileName);
    }

    /**
     * Invokes content download for a data array with a file name.
     * @param data Data to download.
     * @param fileName Name of the resulting file.
     */
    downloadData(data: any, fileName: string): void {
        this.saveData(data, 'data', fileName);
    }

    /**
     * Invokes content download for a JSON object with a file name.
     * @param json JSON object to download.
     * @param fileName Name of the resulting file.
     */
    downloadJSON(json: any, fileName: string): void {
        this.saveData(json, 'json', fileName);
    }

    /**
     * Invokes the download of the file by its URL address.
     * @param url Url address pointing to the file.
     * @param fileName Name of the file download.
     */
    downloadUrl(url: string, fileName: string): void {
        if (url && fileName) {
            const link = document.createElement('a');

            link.style.display = 'none';
            link.download = fileName;
            link.href = url;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

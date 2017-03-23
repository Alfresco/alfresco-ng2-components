/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class ContentService {

    private saveData: Function;

    constructor(private sanitizer: DomSanitizer ) {
        this.saveData = (function () {
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';

            return function (data, format, fileName) {
                let blob = null;

                if (format === 'blob') {
                    blob = data;
                }

                if (format === 'data') {
                    blob = new Blob([data], {type: 'octet/stream'});
                }

                if (format === 'object' || format === 'json') {
                    let json = JSON.stringify(data);
                    blob = new Blob([json], {type: 'octet/stream'});
                }

                if (blob) {
                    let url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = fileName;
                    a.click();

                    window.URL.revokeObjectURL(url);
                }
            };
        }());
    }

    /**
     * Invokes content download for a Blob with a file name.
     *
     * @param {Blob} blob Content to download.
     * @param {string} fileName Name of the resulting file.
     *
     * @memberOf ContentService
     */
    downloadBlob(blob: Blob, fileName: string): void {
        this.saveData(blob, 'blob', fileName);
    }

    /**
     * Invokes content download for a data array with a file name.
     *
     * @param {*} data Data to download.
     * @param {string} fileName Name of the resulting file.
     *
     * @memberOf ContentService
     */
    downloadData(data: any, fileName: string): void {
        this.saveData(data, 'data', fileName);
    }

    /**
     * Invokes content download for a JSON object with a file name.
     *
     * @param {*} json JSON object to download.
     * @param {any} fileName Name of the resulting file.
     *
     * @memberOf ContentService
     */
    downloadJSON(json: any, fileName): void {
        this.saveData(json, 'json', fileName);
    }

    /**
     * Creates a trusted object URL from the Blob.
     * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
     * @param {Blob} blob Data to wrap into object URL
     * @returns {string} Object URL content.
     *
     * @memberOf ContentService
     */
    createTrustedUrl(blob: Blob): string {
        let url = window.URL.createObjectURL(blob);
        return <string> this.sanitizer.bypassSecurityTrustUrl(url);
    }

}

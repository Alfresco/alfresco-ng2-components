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

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    moduleId: module.id,
    selector: 'img-viewer',
    templateUrl: './imgViewer.component.html',
    styleUrls: ['./imgViewer.component.css']
})
export class ImgViewerComponent implements OnChanges {

    @Input()
    urlFile: string;

    @Input()
    blobFile: any;

    @Input()
    nameFile: string;

    constructor(private sanitizer: DomSanitizer ) {}

    ngOnChanges(changes: SimpleChanges) {
        let blobFile = changes['blobFile'];
        if (blobFile && blobFile.currentValue) {
            this.urlFile = this.createTrustedUrl(this.blobFile);
            return;
        }
        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    }

    /**
     * Creates a trusted object URL from the Blob.
     * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
     * @param {Blob} blob Data to wrap into object URL
     * @returns {string} Object URL content.
     *
     * @memberOf ContentService
     */
    private createTrustedUrl(blob: Blob): string {
        let url = window.URL.createObjectURL(blob);
        return <string> this.sanitizer.bypassSecurityTrustUrl(url);
    }
}

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

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ContentService, RenditionsService } from 'ng2-alfresco-core';

const DEFAULT_CONVERSION_ENCODING = 'pdf';

@Component({
    selector: 'not-supported-format',
    templateUrl: './notSupportedFormat.component.html',
    styleUrls: ['./notSupportedFormat.component.css']
})
export class NotSupportedFormat implements OnInit {

    @Input()
    nameFile: string;

    @Input()
    urlFile: string;

    @Input()
    blobFile: Blob;

    @Input()
    nodeId: string|null = null;

    @Output()
    conversionRequest: EventEmitter<string> = new EventEmitter<string>();

    convertible: boolean = false;
    isConversionStarted: boolean = false;

    constructor(
        private contentService: ContentService,
        private renditionsService: RenditionsService
    ) {}

    /**
     * Download file opening it in a new window
     */
    download() {
        if (this.urlFile) {
            window.open(this.urlFile);
        } else {
            this.contentService.downloadBlob(this.blobFile, this.nameFile);
        }
    }

    ngOnInit() {
        if (this.nodeId) {
            this.checkRendition();
        }
    }

    /**
     * Update component's button according to the given rendition's availability
     *
     * @param {string} encoding - the rendition id
     */
    checkRendition(encoding: string = DEFAULT_CONVERSION_ENCODING): void {
        this.renditionsService.getRendition(this.nodeId, encoding)
            .subscribe(
                (response: any) => {
                    if (response.entry.status === 'NOT_CREATED') {
                        this.convertible = true;
                    }
                },
                () => { this.convertible = false; }
            );
    }

    /**
     * Set the component to loading state and send the conversion starting signal to parent component
     *
     * @param {string} encoding - the rendition id
     */
    convert(encoding: string = DEFAULT_CONVERSION_ENCODING): void {
        this.isConversionStarted = true;
        this.conversionRequest.emit(encoding);
    }
}

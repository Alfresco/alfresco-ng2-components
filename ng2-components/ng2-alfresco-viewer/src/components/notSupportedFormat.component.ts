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

import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ContentService, RenditionsService } from 'ng2-alfresco-core';
import { AlfrescoApiService } from 'ng2-alfresco-core';

const DEFAULT_CONVERSION_ENCODING = 'pdf';

@Component({
    selector: 'adf-not-supported-format',
    templateUrl: './notSupportedFormat.component.html',
    styleUrls: ['./notSupportedFormat.component.scss'],
    host: { 'class': 'adf-not-supported-format' },
    encapsulation: ViewEncapsulation.None
})
export class NotSupportedFormatComponent implements OnInit, OnDestroy {

    @Input()
    nameFile: string;

    @Input()
    urlFile: string;

    @Input()
    blobFile: Blob;

    @Input()
    nodeId: string|null = null;

    @Input()
    showToolbar: boolean = true;

    convertible: boolean = false;
    displayable: boolean = false;
    isConversionStarted: boolean = false;
    isConversionFinished: boolean = false;
    renditionUrl: string|null = null;
    conversionsubscription: any = null;

    constructor(
        private contentService: ContentService,
        private renditionsService: RenditionsService,
        private apiService: AlfrescoApiService
    ) {}

    /**
     * Checks for available renditions if the nodeId is present
     */
    ngOnInit() {
        if (this.nodeId) {
            this.checkRendition();
        }
    }

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
                        this.displayable = false;
                    } else if (response.entry.status === 'CREATED') {
                        this.convertible = false;
                        this.displayable = true;
                    }
                },
                () => {
                    this.convertible = false;
                    this.displayable = false;
                }
            );
    }

    /**
     * Set the component to loading state and send the conversion starting signal to parent component
     */
    convertToPdf(): void {
        this.isConversionStarted = true;

        this.conversionsubscription = this.renditionsService.convert(this.nodeId, DEFAULT_CONVERSION_ENCODING)
            .subscribe({
                error: (error) => { this.isConversionStarted = false; },
                complete: () => { this.showPDF(); }
            });
    }

    /**
     * Show the PDF rendition of the node
     */
    showPDF(): void {
        this.renditionUrl = this.apiService.getInstance().content.getRenditionUrl(this.nodeId, DEFAULT_CONVERSION_ENCODING);
        this.isConversionStarted = false;
        this.isConversionFinished = true;
    }

    /**
     * Kills the subscription polling if it has been started
     */
    ngOnDestroy(): void {
        if (this.isConversionStarted) {
            this.conversionsubscription.unsubscribe();
        }
    }
}

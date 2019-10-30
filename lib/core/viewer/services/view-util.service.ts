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
import { RenditionEntry, RenditionPaging } from '@alfresco/js-api';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';

@Injectable({
    providedIn: 'root'
})
export class ViewUtilService {
    static TARGET = '_new';

    /**
     * Content groups based on categorization of files that can be viewed in the web browser. This
     * implementation or grouping is tied to the definition the ng component: ViewerComponent
     */
        // tslint:disable-next-line:variable-name
    static ContentGroup = {
        IMAGE: 'image',
        MEDIA: 'media',
        PDF: 'pdf',
        TEXT: 'text'
    };

    /**
     * Based on ViewerComponent Implementation, this value is used to determine how many times we try
     * to get the rendition of a file for preview, or printing.
     */
    maxRetries = 5;

    /**
     * Mime-type grouping based on the ViewerComponent.
     */
    private mimeTypes = {
        text: ['text/plain', 'text/csv', 'text/xml', 'text/html', 'application/x-javascript'],
        pdf: ['application/pdf'],
        image: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/svg+xml'],
        media: ['video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/ogg', 'audio/wav']
    };

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * This method takes a url to trigger the print dialog against, and the type of artifact that it
     * is.
     * This URL should be one that can be rendered in the browser, for example PDF, Image, or Text
     */
    printFile(url: string, type: string): void {
        const pwa = window.open(url, ViewUtilService.TARGET);
        if (pwa) {
            // Because of the way chrome focus and close image window vs. pdf preview window
            if (type === ViewUtilService.ContentGroup.IMAGE) {
                pwa.onfocus = () => {
                    setTimeout(() => {
                        pwa.close();
                    }, 500);
                };
            }

            pwa.onload = () => {
                pwa.print();
            };
        }
    }

    /**
     * Launch the File Print dialog from anywhere other than the preview service, which resolves the
     * rendition of the object that can be printed from a web browser.
     * These are: images, PDF files, or PDF rendition of files.
     * We also force PDF rendition for TEXT type objects, otherwise the default URL is to download.
     * TODO there are different TEXT type objects, (HTML, plaintext, xml, etc. we should determine how these are handled)
     */
    printFileGeneric(objectId: string, mimeType: string): void {
        const nodeId = objectId;
        const type: string = this.getViewerTypeByMimeType(mimeType);

        this.getRendition(nodeId, ViewUtilService.ContentGroup.PDF)
            .then((value) => {
                const url: string = this.getRenditionUrl(nodeId, type, (value ? true : false));
                const printType = (type === ViewUtilService.ContentGroup.PDF
                    || type === ViewUtilService.ContentGroup.TEXT)
                    ? ViewUtilService.ContentGroup.PDF : type;
                this.printFile(url, printType);
            })
            .catch((err) => {
                this.logService.error('Error with Printing');
                this.logService.error(err);
            });
    }

    getRenditionUrl(nodeId: string, type: string, renditionExists: boolean): string {
        return (renditionExists && type !== ViewUtilService.ContentGroup.IMAGE) ?
            this.apiService.contentApi.getRenditionUrl(nodeId, ViewUtilService.ContentGroup.PDF) :
            this.apiService.contentApi.getContentUrl(nodeId, false);
    }

    private async waitRendition(nodeId: string, renditionId: string, retries: number): Promise<RenditionEntry> {
        const rendition = await this.apiService.renditionsApi.getRendition(nodeId, renditionId);

        if (this.maxRetries < retries) {
            const status = rendition.entry.status.toString();

            if (status === 'CREATED') {
                return rendition;
            } else {
                retries += 1;
                await this.wait(1000);
                return this.waitRendition(nodeId, renditionId, retries);
            }
        }

        return Promise.resolve(null);
    }

    getViewerTypeByMimeType(mimeType: string): string {
        if (mimeType) {
            mimeType = mimeType.toLowerCase();

            const editorTypes = Object.keys(this.mimeTypes);
            for (const type of editorTypes) {
                if (this.mimeTypes[type].indexOf(mimeType) >= 0) {
                    return type;
                }
            }
        }
        return 'unknown';
    }

    wait(ms: number): Promise<any> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async getRendition(nodeId: string, renditionId: string): Promise<RenditionEntry> {
        const renditionPaging: RenditionPaging = await this.apiService.renditionsApi.getRenditions(nodeId);
        let rendition: RenditionEntry = renditionPaging.list.entries.find((renditionEntry: RenditionEntry) => renditionEntry.entry.id.toLowerCase() === renditionId);

        if (rendition) {
            const status = rendition.entry.status.toString();

            if (status === 'NOT_CREATED') {
                try {
                    await this.apiService.renditionsApi.createRendition(nodeId, { id: renditionId });
                    rendition = await this.waitRendition(nodeId, renditionId, 0);
                } catch (err) {
                    this.logService.error(err);
                }
            }
        }
        return new Promise<RenditionEntry>((resolve) => resolve(rendition));
    }

}

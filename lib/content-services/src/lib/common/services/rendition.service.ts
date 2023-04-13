/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ContentApi, RenditionEntry, RenditionPaging, RenditionsApi, VersionsApi } from '@alfresco/js-api';
import { AlfrescoApiService , LogService, Track,TranslationService, ViewUtilService } from '@alfresco/adf-core';

@Injectable({
    providedIn: 'root'
})
export class RenditionService {

    static TARGET = '_new';

    /**
     * Content groups based on categorization of files that can be viewed in the web browser. This
     * implementation or grouping is tied to the definition the ng component: ViewerRenderComponent
     */
    static ContentGroup = {
        IMAGE: 'image',
        MEDIA: 'media',
        PDF: 'pdf',
        TEXT: 'text'
    };

    /**
     * The name of the rendition with the media subtitles in the supported format
     */
    static SUBTITLES_RENDITION_NAME = 'webvtt';

    /**
     * Based on ViewerRenderComponent Implementation, this value is used to determine how many times we try
     * to get the rendition of a file for preview, or printing.
     */
    maxRetries = 5;

    /**
     * Timeout used for setInterval.
     */
    private TRY_TIMEOUT: number = 10000;


    _renditionsApi: RenditionsApi;
    get renditionsApi(): RenditionsApi {
        this._renditionsApi = this._renditionsApi ?? new RenditionsApi(this.apiService.getInstance());
        return this._renditionsApi;
    }

    _contentApi: ContentApi;
    get contentApi(): ContentApi {
        this._contentApi = this._contentApi ?? new ContentApi(this.apiService.getInstance());
        return this._contentApi;
    }

    _versionsApi: VersionsApi;
    private DEFAULT_RENDITION: string = 'imgpreview';

    get versionsApi(): VersionsApi {
        this._versionsApi = this._versionsApi ?? new VersionsApi(this.apiService.getInstance());
        return this._versionsApi;
    }

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService,
                private translateService: TranslationService,
                private viewUtilsService: ViewUtilService) {
    }


    getRenditionUrl(nodeId: string, type: string, renditionExists: boolean): string {
        return (renditionExists && type !== RenditionService.ContentGroup.IMAGE) ?
            this.contentApi.getRenditionUrl(nodeId, RenditionService.ContentGroup.PDF) :
            this.contentApi.getContentUrl(nodeId, false);
    }

    private async waitRendition(nodeId: string, renditionId: string, retries: number): Promise<RenditionEntry> {
        const rendition = await this.renditionsApi.getRendition(nodeId, renditionId);

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

    private wait(ms: number): Promise<any> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async getRendition(nodeId: string, renditionId: string): Promise<RenditionEntry> {
        const renditionPaging: RenditionPaging = await this.renditionsApi.listRenditions(nodeId);
        let rendition: RenditionEntry = renditionPaging.list.entries.find((renditionEntry: RenditionEntry) => renditionEntry.entry.id.toLowerCase() === renditionId);

        if (rendition) {
            const status = rendition.entry.status.toString();

            if (status === 'NOT_CREATED') {
                try {
                    await this.renditionsApi.createRendition(nodeId, {id: renditionId});
                    rendition = await this.waitRendition(nodeId, renditionId, 0);
                } catch (err) {
                    this.logService.error(err);
                }
            }
        }
        return new Promise<RenditionEntry>((resolve) => resolve(rendition));
    }

    async getNodeRendition(nodeId: string, versionId?: string): Promise<{ url: string; mimeType: string }> {
        try {
            return versionId ? await this.resolveNodeRendition(nodeId, 'pdf', versionId) :
                await this.resolveNodeRendition(nodeId, 'pdf');
        } catch (err) {
            this.logService.error(err);
            return null;
        }
    }

    private async resolveNodeRendition(nodeId: string, renditionId: string, versionId?: string): Promise<{ url: string; mimeType: string }> {
        renditionId = renditionId.toLowerCase();

        const supportedRendition: RenditionPaging = versionId ? await this.versionsApi.listVersionRenditions(nodeId, versionId) :
            await this.renditionsApi.listRenditions(nodeId);

        let rendition = this.findRenditionById(supportedRendition, renditionId);
        if (!rendition) {
            renditionId = this.DEFAULT_RENDITION;
            rendition = this.findRenditionById(supportedRendition, this.DEFAULT_RENDITION);
        }

        if (rendition) {
            const status: string = rendition.entry.status.toString();
            const mimeType: string = rendition.entry.content.mimeType;

            if (status === 'NOT_CREATED') {
                return {url: await this.requestCreateRendition(nodeId, renditionId, versionId), mimeType};
            } else {
                return {url: await this.handleNodeRendition(nodeId, renditionId, versionId), mimeType};
            }
        }

        return null;
    }

    private async requestCreateRendition(nodeId: string, renditionId: string, versionId: string): Promise<string> {
        try {
            if (versionId) {
                await this.versionsApi.createVersionRendition(nodeId, versionId, {id: renditionId});
            } else {
                await this.renditionsApi.createRendition(nodeId, {id: renditionId});
            }
            try {
                return versionId ? await this.waitNodeRendition(nodeId, renditionId, versionId) : await this.waitNodeRendition(nodeId, renditionId);
            } catch (e) {
                return null;
            }

        } catch (err) {
            this.logService.error(err);
            return null;
        }
    }

    private findRenditionById(supportedRendition: RenditionPaging, renditionId: string) {
        const rendition: RenditionEntry = supportedRendition.list.entries.find((renditionEntry: RenditionEntry) => renditionEntry.entry.id.toLowerCase() === renditionId);
        return rendition;
    }

    private async waitNodeRendition(nodeId: string, renditionId: string, versionId?: string): Promise<string> {
        let currentRetry: number = 0;
        return new Promise<string>((resolve, reject) => {
            const intervalId = setInterval(() => {
                currentRetry++;
                if (this.maxRetries >= currentRetry) {
                    if (versionId) {
                        this.versionsApi.getVersionRendition(nodeId, versionId, renditionId).then((rendition: RenditionEntry) => {
                            const status: string = rendition.entry.status.toString();

                            if (status === 'CREATED') {
                                clearInterval(intervalId);
                                return resolve(this.handleNodeRendition(nodeId, rendition.entry.content.mimeType, versionId));
                            }
                        }, () => reject());
                    } else {
                        this.renditionsApi.getRendition(nodeId, renditionId).then((rendition: RenditionEntry) => {
                            const status: string = rendition.entry.status.toString();

                            if (status === 'CREATED') {
                                clearInterval(intervalId);
                                return resolve(this.handleNodeRendition(nodeId, renditionId, versionId));
                            }
                        }, () => reject());
                    }
                } else {
                    clearInterval(intervalId);
                    return reject();
                }
            }, this.TRY_TIMEOUT);
        });
    }

    private async handleNodeRendition(nodeId: string, renditionId: string, versionId?: string): Promise<string> {

        const url = versionId ? this.contentApi.getVersionRenditionUrl(nodeId, versionId, renditionId) :
            this.contentApi.getRenditionUrl(nodeId, renditionId);

        return url;
    }

    async generateMediaTracksRendition(nodeId: string): Promise<Track[]> {
        return this.isRenditionAvailable(nodeId, RenditionService.SUBTITLES_RENDITION_NAME)
            .then((value) => {
                const tracks = [];
                if (value) {
                    tracks.push({
                        kind: 'subtitles',
                        src: this.contentApi.getRenditionUrl(nodeId, RenditionService.SUBTITLES_RENDITION_NAME),
                        label: this.translateService.instant('ADF_VIEWER.SUBTITLES')
                    });
                }
                return tracks;
            })
            .catch((err) => {
                this.logService.error('Error while retrieving ' + RenditionService.SUBTITLES_RENDITION_NAME + ' rendition');
                this.logService.error(err);
                return [];
            });
    }

    private async isRenditionAvailable(nodeId: string, renditionId: string): Promise<boolean> {
        const renditionPaging: RenditionPaging = await this.renditionsApi.listRenditions(nodeId);
        const rendition: RenditionEntry = renditionPaging.list.entries.find((renditionEntry: RenditionEntry) => renditionEntry.entry.id.toLowerCase() === renditionId);

        return rendition?.entry?.status?.toString() === 'CREATED' || false;
    }

    /**
     * This method takes a url to trigger the print dialog against, and the type of artifact that it
     * is.
     * This URL should be one that can be rendered in the browser, for example PDF, Image, or Text
     */
    printFile(url: string, type: string): void {
        const pwa = window.open(url, RenditionService.TARGET);
        if (pwa) {
            // Because of the way chrome focus and close image window vs. pdf preview window
            if (type === RenditionService.ContentGroup.IMAGE) {
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
        const type: string = this.viewUtilsService.getViewerTypeByMimeType(mimeType);

        this.getRendition(nodeId, RenditionService.ContentGroup.PDF)
            .then((value) => {
                const url: string = this.getRenditionUrl(nodeId, type, (!!value));
                const printType = (type === RenditionService.ContentGroup.PDF
                    || type === RenditionService.ContentGroup.TEXT)
                    ? RenditionService.ContentGroup.PDF : type;
                this.printFile(url, printType);
            })
            .catch((err) => {
                this.logService.error('Error with Printing');
                this.logService.error(err);
            });
    }
}

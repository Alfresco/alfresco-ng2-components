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
import { RenditionEntry, RenditionPaging, RenditionsApi, VersionsApi } from '@alfresco/js-api';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { Subject } from 'rxjs';
import { Track } from '../models/viewer.model';
import { TranslationService } from '../../services/translation.service';
import { ApiClientsService } from '@alfresco/adf-core/api';

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
     * The name of the rendition with the media subtitles in the supported format
     */
    /* tslint:disable-next-line */
    static SUBTITLES_RENDITION_NAME = 'webvtt';

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

    /**
     * Timeout used for setInterval.
     */
    TRY_TIMEOUT: number = 10000;

    /**
     * Subscribers needed for ViewerComponent to update the viewerType and urlFileContent.
     */
    viewerTypeChange: Subject<string> = new Subject<string>();
    urlFileContentChange: Subject<string> = new Subject<string>();

    _renditionsApi: RenditionsApi;
    get renditionsApi(): RenditionsApi {
        this._renditionsApi = this._renditionsApi ?? new RenditionsApi(this.apiService.getInstance());
        return this._renditionsApi;
    }

    get contentApi() {
        return this.apiClientsService.get('ContentCustomClient.content');
    }

    _versionsApi: VersionsApi;
    get versionsApi(): VersionsApi {
        this._versionsApi = this._versionsApi ?? new VersionsApi(this.apiService.getInstance());
        return this._versionsApi;
    }

    constructor(
        private apiService: AlfrescoApiService,
        private logService: LogService,
        private translateService: TranslationService,
        private apiClientsService: ApiClientsService
    ) {}

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
                const url: string = this.getRenditionUrl(nodeId, type, (!!value));
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
            this.contentApi.getRenditionUrl(nodeId, ViewUtilService.ContentGroup.PDF) :
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
        const renditionPaging: RenditionPaging = await this.renditionsApi.listRenditions(nodeId);
        let rendition: RenditionEntry = renditionPaging.list.entries.find((renditionEntry: RenditionEntry) => renditionEntry.entry.id.toLowerCase() === renditionId);

        if (rendition) {
            const status = rendition.entry.status.toString();

            if (status === 'NOT_CREATED') {
                try {
                    await this.renditionsApi.createRendition(nodeId, { id: renditionId });
                    rendition = await this.waitRendition(nodeId, renditionId, 0);
                } catch (err) {
                    this.logService.error(err);
                }
            }
        }
        return new Promise<RenditionEntry>((resolve) => resolve(rendition));
    }

    async displayNodeRendition(nodeId: string, versionId?: string) {
        try {
            const rendition = versionId ? await this.resolveNodeRendition(nodeId, 'pdf', versionId) :
                await this.resolveNodeRendition(nodeId, 'pdf');
            if (rendition) {
                const renditionId = rendition.entry.id;

                if (renditionId === 'pdf') {
                    this.viewerTypeChange.next('pdf');
                } else if (renditionId === 'imgpreview') {
                    this.viewerTypeChange.next('image');
                }

                const urlFileContent = versionId ? this.contentApi.getVersionRenditionUrl(nodeId, versionId, renditionId) :
                    this.contentApi.getRenditionUrl(nodeId, renditionId);
                this.urlFileContentChange.next(urlFileContent);
            }
        } catch (err) {
            this.logService.error(err);
        }
    }

    private async resolveNodeRendition(nodeId: string, renditionId: string, versionId?: string): Promise<RenditionEntry> {
        renditionId = renditionId.toLowerCase();

        const supportedRendition: RenditionPaging = versionId ? await this.versionsApi.listVersionRenditions(nodeId, versionId) :
            await this.renditionsApi.listRenditions(nodeId);

        let rendition: RenditionEntry = supportedRendition.list.entries.find((renditionEntry: RenditionEntry) => renditionEntry.entry.id.toLowerCase() === renditionId);
        if (!rendition) {
            renditionId = 'imgpreview';
            rendition = supportedRendition.list.entries.find((renditionEntry: RenditionEntry) => renditionEntry.entry.id.toLowerCase() === renditionId);
        }

        if (rendition) {
            const status: string = rendition.entry.status.toString();

            if (status === 'NOT_CREATED') {
                try {
                    if (versionId) {
                        await this.versionsApi.createVersionRendition(nodeId, versionId, { id: renditionId }).then(() => {
                            this.viewerTypeChange.next('in_creation');
                        });
                    } else {
                        await this.renditionsApi.createRendition(nodeId, { id: renditionId }).then(() => {
                            this.viewerTypeChange.next('in_creation');
                        });
                    }
                    try {
                        rendition = versionId ? await this.waitNodeRendition(nodeId, renditionId, versionId) : await this.waitNodeRendition(nodeId, renditionId);
                    } catch (e) {
                        this.viewerTypeChange.next('error_in_creation');
                        rendition = null;
                    }

                } catch (err) {
                    this.logService.error(err);
                }
            }
        }

        return rendition;
    }

    private async waitNodeRendition(nodeId: string, renditionId: string, versionId?: string): Promise<RenditionEntry> {
        let currentRetry: number = 0;
        return new Promise<RenditionEntry>((resolve, reject) => {
            const intervalId = setInterval(() => {
                currentRetry++;
                if (this.maxRetries >= currentRetry) {
                    if (versionId) {
                        this.versionsApi.getVersionRendition(nodeId, versionId, renditionId).then((rendition: RenditionEntry) => {
                            const status: string = rendition.entry.status.toString();

                            if (status === 'CREATED') {
                                this.handleNodeRendition(nodeId, renditionId, versionId);
                                clearInterval(intervalId);
                                return resolve(rendition);
                            }
                        }, () => reject());
                    } else {
                        this.renditionsApi.getRendition(nodeId, renditionId).then((rendition: RenditionEntry) => {
                            const status: string = rendition.entry.status.toString();

                            if (status === 'CREATED') {
                                this.handleNodeRendition(nodeId, renditionId);
                                clearInterval(intervalId);
                                return resolve(rendition);
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

    private async handleNodeRendition(nodeId: string, renditionId: string, versionId?: string) {
        if (renditionId === 'pdf') {
            this.viewerTypeChange.next('pdf');
        } else if (renditionId === 'imgpreview') {
            this.viewerTypeChange.next('image');
        }

        const urlFileContent = versionId ? this.contentApi.getVersionRenditionUrl(nodeId, versionId, renditionId) :
            this.contentApi.getRenditionUrl(nodeId, renditionId);
        this.urlFileContentChange.next(urlFileContent);
    }

    async generateMediaTracks(nodeId: string): Promise<Track[]> {
        return this.isRenditionAvailable(nodeId, ViewUtilService.SUBTITLES_RENDITION_NAME)
            .then((value) => {
                const tracks = [];
                if (value) {
                    tracks.push({
                        kind: 'subtitles',
                        src: this.contentApi.getRenditionUrl(nodeId, ViewUtilService.SUBTITLES_RENDITION_NAME),
                        label: this.translateService.instant('ADF_VIEWER.SUBTITLES')
                    });
                }
                return tracks;
            })
            .catch((err) => {
                this.logService.error('Error while retrieving ' + ViewUtilService.SUBTITLES_RENDITION_NAME + ' rendition');
                this.logService.error(err);
                return [];
            });
    }

    private async isRenditionAvailable(nodeId: string, renditionId: string): Promise<boolean> {
        const renditionPaging: RenditionPaging = await this.renditionsApi.listRenditions(nodeId);
        const rendition: RenditionEntry = renditionPaging.list.entries.find((renditionEntry: RenditionEntry) => renditionEntry.entry.id.toLowerCase() === renditionId);

        return rendition?.entry?.status?.toString() === 'CREATED' || false;
    }
}

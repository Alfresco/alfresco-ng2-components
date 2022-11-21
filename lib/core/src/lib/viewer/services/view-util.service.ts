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
import { LogService } from '../../services/log.service';
import { RenditionViewerService } from "../../../../../content-services/src/lib/viewer/services/rendition-viewer.service";
import { AppExtensionService, ViewerExtensionRef } from '@alfresco/adf-extensions';

@Injectable({
    providedIn: 'root'
})
export class ViewUtilService {
    static TARGET = '_new';

    // Extensions that are supported by the Viewer without conversion
    private extensions = {
        image: ['png', 'jpg', 'jpeg', 'gif', 'bpm', 'svg'],
        media: ['wav', 'mp4', 'mp3', 'webm', 'ogg'],
        text: ['txt', 'xml', 'html', 'json', 'ts', 'css', 'md'],
        pdf: ['pdf']
    };

    // Mime types that are supported by the Viewer without conversion
    private mimeTypes = {
        text: ['text/plain', 'text/csv', 'text/xml', 'text/html', 'application/x-javascript'],
        pdf: ['application/pdf'],
        image: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/svg+xml'],
        media: ['video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav']
    };

    /**
     * Returns a list of the active Viewer content extensions.
     */
    get viewerExtensions(): ViewerExtensionRef[] {
        return this.extensionService.getViewerExtensions();
    }

    /**
     * Provides a list of file extensions supported by external plugins.
     */
    get externalExtensions(): string[] {
        return this.viewerExtensions.map(ext => ext.fileExtension);
    }

    constructor(private renditionViewerService: RenditionViewerService,
                private extensionService: AppExtensionService,
                private logService: LogService) {
    }

    /**
     * get File name from url
     *
     * @param  url - url file
     */
    getFilenameFromUrl(url: string): string {
        const anchor = url.indexOf('#');
        const query = url.indexOf('?');
        const end = Math.min(
            anchor > 0 ? anchor : url.length,
            query > 0 ? query : url.length);
        return url.substring(url.lastIndexOf('/', end) + 1, end);
    }

    /**
     * Get file extension from the string.
     * Supports the URL formats like:
     * http://localhost/test.jpg?cache=1000
     * http://localhost/test.jpg#cache=1000
     *
     * @param fileName - file name
     */
    getFileExtension(fileName: string): string {
        if (fileName) {
            const match = fileName.match(/\.([^\./\?\#]+)($|\?|\#)/);
            return match ? match[1] : null;
        }
        return null;
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
            if (type === RenditionViewerService.ContentGroup.IMAGE) {
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
        const type: string = this.renditionViewerService.getViewerTypeByMimeType(mimeType);

        this.renditionViewerService.getRendition(nodeId, RenditionViewerService.ContentGroup.PDF)
            .then((value) => {
                const url: string = this.renditionViewerService.getRenditionUrl(nodeId, type, (!!value));
                const printType = (type === RenditionViewerService.ContentGroup.PDF
                    || type === RenditionViewerService.ContentGroup.TEXT)
                    ? RenditionViewerService.ContentGroup.PDF : type;
                this.printFile(url, printType);
            })
            .catch((err) => {
                this.logService.error('Error with Printing');
                this.logService.error(err);
            });
    }


     getViewerType(extension: string, mimeType: string): string {
        let viewerType = this.getViewerTypeByExtension(extension);

        if (viewerType === 'unknown') {
            viewerType = this.getViewerTypeByMimeType(mimeType);
        }

        return viewerType;
    }

    getViewerTypeByMimeType(mimeType: string) {
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

    private getViewerTypeByExtension(extension: string): string {
        if (extension) {
            extension = extension.toLowerCase();
        }

        if (this.isExternalViewer()) {
            return 'external';
        }

        if (this.isCustomViewerExtension(extension)) {
            return 'custom';
        }

        if (this.extensions.image.indexOf(extension) >= 0) {
            return 'image';
        }

        if (this.extensions.media.indexOf(extension) >= 0) {
            return 'media';
        }

        if (this.extensions.text.indexOf(extension) >= 0) {
            return 'text';
        }

        if (this.extensions.pdf.indexOf(extension) >= 0) {
            return 'pdf';
        }

        return 'unknown';
    }


    private isExternalViewer(): boolean {
        return !!this.viewerExtensions.find(ext => ext.fileExtension === '*');
    }

    isCustomViewerExtension(extension: string): boolean {
        const extensions = this.externalExtensions || [];

        if (extension && extensions.length > 0) {
            extension = extension.toLowerCase();
            return extensions.flat().indexOf(extension) >= 0;
        }

        return false;
    }


}

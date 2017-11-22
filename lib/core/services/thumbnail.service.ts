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
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentService } from './content.service';

@Injectable()
export class ThumbnailService {

    DEFAULT_ICON: string = './assets/images/ft_ic_miscellaneous.svg';

    mimeTypeIcons: any = {
        'image/png': './assets/images/ft_ic_raster_image.svg',
        'image/jpeg': './assets/images/ft_ic_raster_image.svg',
        'image/gif': './assets/images/ft_ic_raster_image.svg',
        'application/pdf': './assets/images/ft_ic_pdf.svg',
        'application/vnd.ms-excel': './assets/images/ft_ic_ms_excel.svg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': './assets/images/ft_ic_ms_excel.svg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template': './assets/images/ft_ic_ms_excel.svg',
        'application/msword': './assets/images/ft_ic_ms_word.svg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': './assets/images/ft_ic_ms_word.svg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template': './assets/images/ft_ic_ms_word.svg',
        'application/vnd.ms-powerpoint': './assets/images/ft_ic_ms_powerpoint.svg',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': './assets/images/ft_ic_ms_powerpoint.svg',
        'application/vnd.openxmlformats-officedocument.presentationml.template': './assets/images/ft_ic_ms_powerpoint.svg',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow': './assets/images/ft_ic_ms_powerpoint.svg',
        'video/mp4': './assets/images/ft_ic_video.svg',
        'text/plain': './assets/images/ft_ic_document.svg',
        'application/x-javascript': './assets/images/ft_ic_document.svg',
        'application/json': './assets/images/ft_ic_document.svg',
        'image/svg+xml': './assets/images/ft_ic_vector_image.svg',
        'text/html': './assets/images/ft_ic_website.svg',
        'application/x-compressed': './assets/images/ft_ic_archive.svg',
        'application/x-zip-compressed': './assets/images/ft_ic_archive.svg',
        'application/zip': './assets/images/ft_ic_archive.svg',
        'application/vnd.apple.keynote': './assets/images/ft_ic_presentation.svg',
        'application/vnd.apple.pages': './assets/images/ft_ic_document.svg',
        'application/vnd.apple.numbers': './assets/images/ft_ic_spreadsheet.svg',
        'folder': './assets/images/ft_ic_folder.svg',
        'disable/folder': './assets/images/ft_ic_folder_disable.svg',
        'selected': './assets/images/ft_ic_selected.svg'
    };

    constructor(public contentService: ContentService, matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        matIconRegistry.addSvgIcon('image/png',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_raster_image.svg'));
        matIconRegistry.addSvgIcon('image/jpeg',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_raster_image.svg'));
        matIconRegistry.addSvgIcon('image/gif',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_raster_image.svg'));
        matIconRegistry.addSvgIcon('application/pdf',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_pdf.svg'));
        matIconRegistry.addSvgIcon('application/vnd.ms-excel',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_ms_excel.svg'));
        matIconRegistry.addSvgIcon('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_ms_excel.svg'));
        matIconRegistry.addSvgIcon('application/vnd.openxmlformats-officedocument.spreadsheetml.template',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_ms_excel.svg'));
        matIconRegistry.addSvgIcon('application/msword',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_ms_word.svg'));
        matIconRegistry.addSvgIcon('application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_ms_word.svg'));
        matIconRegistry.addSvgIcon('application/vnd.openxmlformats-officedocument.wordprocessingml.template',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_ms_word.svg'));
        matIconRegistry.addSvgIcon('application/vnd.ms-powerpoint',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_ms_powerpoint.svg'));
        matIconRegistry.addSvgIcon('application/vnd.openxmlformats-officedocument.presentationml.presentation',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_ms_powerpoint.svg'));
        matIconRegistry.addSvgIcon('application/vnd.openxmlformats-officedocument.presentationml.template',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_ms_powerpoint.svg'));
        matIconRegistry.addSvgIcon('application/vnd.openxmlformats-officedocument.presentationml.slideshow',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_ms_powerpoint.svg'));
        matIconRegistry.addSvgIcon('video/mp4',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_video.svg'));
        matIconRegistry.addSvgIcon('text/plain',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_document.svg'));
        matIconRegistry.addSvgIcon('application/x-javascript',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_document.svg'));
        matIconRegistry.addSvgIcon('application/json',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_document.svg'));
        matIconRegistry.addSvgIcon('image/svg+xml',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_vector_image.svg'));
        matIconRegistry.addSvgIcon('text/html',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_website.svg'));
        matIconRegistry.addSvgIcon('application/x-compressed',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_archive.svg'));
        matIconRegistry.addSvgIcon('application/x-zip-compressed',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_archive.svg'));
        matIconRegistry.addSvgIcon('application/zip',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_archive.svg'));
        matIconRegistry.addSvgIcon('application/vnd.apple.keynote',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_presentation.svg'));
        matIconRegistry.addSvgIcon('application/vnd.apple.pages',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_document.svg'));
        matIconRegistry.addSvgIcon('application/vnd.apple.numbers',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_spreadsheet.svg'));
        matIconRegistry.addSvgIcon('folder',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_folder.svg'));
        matIconRegistry.addSvgIcon('disable/folder',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_folder_disable.svg'));
        matIconRegistry.addSvgIcon('selected',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_selected.svg'));
        matIconRegistry.addSvgIcon('default',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/images/ft_ic_miscellaneous.svg'));
    }

    /**
     * Get thumbnail URL for the given document node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    public getDocumentThumbnailUrl(document: any): string {
        let thumbnail = this.contentService.getDocumentThumbnailUrl(document);
        return thumbnail || this.DEFAULT_ICON;
    }

    /**
     * Get mimeType SVG
     * @param mimeType
     * @returns {string} URL SVG address.
     */
    public getMimeTypeIcon(mimeType: string): string {
        let icon = this.mimeTypeIcons[mimeType];
        return (icon || this.DEFAULT_ICON);
    }

    /**
     * Get default SVG
     * @returns {string} URL SVG default.
     */
    public getDefaultMimeTypeIcon(): string {
        return this.DEFAULT_ICON;
    }
}

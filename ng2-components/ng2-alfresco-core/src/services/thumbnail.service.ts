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
import { AlfrescoContentService } from './alfresco-content.service';

declare var require: any;

@Injectable()
export class ThumbnailService {

    DEFAULT_ICON: string = require('../assets/images/ft_ic_miscellaneous.svg');

    mimeTypeIcons: any = {
        'image/png': require('../assets/images/ft_ic_raster_image.svg'),
        'image/jpeg': require('../assets/images/ft_ic_raster_image.svg'),
        'image/gif': require('../assets/images/ft_ic_raster_image.svg'),
        'application/pdf': require('../assets/images/ft_ic_pdf.svg'),
        'application/vnd.ms-excel': require('../assets/images/ft_ic_ms_excel.svg'),
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': require('../assets/images/ft_ic_ms_excel.svg'),
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template': require('../assets/images/ft_ic_ms_excel.svg'),
        'application/msword': require('../assets/images/ft_ic_ms_word.svg'),
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': require('../assets/images/ft_ic_ms_word.svg'),
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template': require('../assets/images/ft_ic_ms_word.svg'),
        'application/vnd.ms-powerpoint': require('../assets/images/ft_ic_ms_powerpoint.svg'),
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': require('../assets/images/ft_ic_ms_powerpoint.svg'),
        'application/vnd.openxmlformats-officedocument.presentationml.template': require('../assets/images/ft_ic_ms_powerpoint.svg'),
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow': require('../assets/images/ft_ic_ms_powerpoint.svg'),
        'video/mp4': require('../assets/images/ft_ic_video.svg'),
        'text/plain': require('../assets/images/ft_ic_document.svg'),
        'application/x-javascript': require('../assets/images/ft_ic_document.svg'),
        'application/json': require('../assets/images/ft_ic_document.svg'),
        'image/svg+xml': require('../assets/images/ft_ic_vector_image.svg'),
        'text/html': require('../assets/images/ft_ic_website.svg'),
        'application/x-compressed': require('../assets/images/ft_ic_archive.svg'),
        'application/x-zip-compressed': require('../assets/images/ft_ic_archive.svg'),
        'application/zip': require('../assets/images/ft_ic_archive.svg'),
        'application/vnd.apple.keynote': require('../assets/images/ft_ic_presentation.svg'),
        'application/vnd.apple.pages': require('../assets/images/ft_ic_document.svg'),
        'application/vnd.apple.numbers': require('../assets/images/ft_ic_spreadsheet.svg'),
        'folder': require('../assets/images/ft_ic_folder.svg'),
        'disable/folder': require('../assets/images/ft_ic_folder_disable.svg')
    };

    constructor(public contentService: AlfrescoContentService) {
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

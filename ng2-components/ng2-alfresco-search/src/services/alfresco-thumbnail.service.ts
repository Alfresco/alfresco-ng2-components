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
import {
    AlfrescoContentService
} from 'ng2-alfresco-core';

declare let AlfrescoApi: any;

@Injectable()
export class AlfrescoThumbnailService {

    mimeTypeIcons: any = {
        'image/png': 'ft_ic_raster_image',
        'image/jpeg': 'ft_ic_raster_image',
        'image/gif': 'ft_ic_raster_image',
        'application/pdf': 'ft_ic_pdf',
        'application/vnd.ms-excel': 'ft_ic_ms_excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'ft_ic_ms_excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'ft_ic_ms_excel',
        'application/msword': 'ft_ic_ms_word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'ft_ic_ms_word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'ft_ic_ms_word',
        'application/vnd.ms-powerpoint': 'ft_ic_ms_powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ft_ic_ms_powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.template': 'ft_ic_ms_powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ft_ic_ms_powerpoint',
        'video/mp4': 'ft_ic_video',
        'text/plain': 'ft_ic_document',
        'application/x-javascript': 'ft_ic_document',
        'application/json': 'ft_ic_document',
        'image/svg+xml': 'ft_ic_vector_image',
        'text/html': 'ft_ic_website',
        'application/x-compressed': 'ft_ic_archive',
        'application/x-zip-compressed': 'ft_ic_archive',
        'application/zip': 'ft_ic_archive',
        'application/vnd.apple.keynote': 'ft_ic_presentation',
        'application/vnd.apple.pages': 'ft_ic_document',
        'application/vnd.apple.numbers': 'ft_ic_spreadsheet'
    };

    constructor(private contentService: AlfrescoContentService) {
    }

    /**
     * Get thumbnail URL for the given document node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    public getDocumentThumbnailUrl(document: any): string {
        return this.contentService.getDocumentThumbnailUrl(document);
    }

    public getMimeTypeKey(mimeType: string): string {
        let icon = this.mimeTypeIcons[mimeType];
        return icon || 'ft_ic_miscellaneous';
    }

    public getMimeTypeIcon(mimeType: string): string {
        return this.getMimeTypeKey(mimeType) + '.svg';
    }
}

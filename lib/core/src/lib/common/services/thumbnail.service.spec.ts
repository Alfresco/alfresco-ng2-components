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

import { TestBed } from '@angular/core/testing';
import { ThumbnailService } from './thumbnail.service';
import { Node } from '@alfresco/js-api';

describe('ThumbnailService', () => {
    let service: ThumbnailService;
    let node: Node;

    beforeEach(() => {
        service = TestBed.inject(ThumbnailService);
        node = {
            isFolder: true,
            isFile: false,
            createdByUser: { id: 'admin', displayName: 'Administrator' },
            modifiedAt: new Date('2017-05-24T15:08:55.640Z'),
            nodeType: 'cm:content',
            content: {
                mimeType: 'application/rtf',
                mimeTypeName: 'Rich Text Format',
                sizeInBytes: 14530
            },
            createdAt: new Date('2017-05-24T15:08:55.640Z'),
            modifiedByUser: { id: 'admin', displayName: 'Administrator' },
            name: 'b_txt_file.rtf',
            id: 'test node 1',
            aspectNames: ['']
        } as Node;
    });

    it('should return the correct icon for a PDF document', () => {
        expect(service.getMimeTypeIcon('application/pdf')).toContain('ft_ic_pdf');
    });

    it('should return the correct icon for a DOCX document', () => {
        expect(service.getMimeTypeIcon('application/msword')).toContain('ft_ic_ms_word');
    });

    it('should return the correct icon for a plain text file', () => {
        expect(service.getMimeTypeIcon('text/plain')).toContain('ft_ic_document');
    });

    it('should return the correct icon for a PNG file', () => {
        expect(service.getMimeTypeIcon('image/png')).toContain('ft_ic_raster_image');
    });

    it('should return the correct icon for a MP4 video file', () => {
        expect(service.getMimeTypeIcon('video/mp4')).toContain('ft_ic_video');
    });

    it('should return a generic icon for an unknown file', () => {
        expect(service.getMimeTypeIcon('x-unknown/yyy')).toContain('ft_ic_miscellaneous');
    });

    it('should return the correct icon for a mht file', () => {
        expect(service.getMimeTypeIcon('multipart/related')).toContain('ft_ic_website.svg');
    });

    it('should resolve folder icon', () => {
        expect(service.getNodeIcon(node)).toContain('assets/images/ft_ic_folder.svg');
    });

    it('should resolve link folder icon', () => {
        node.nodeType = 'app:folderlink';
        expect(service.getNodeIcon(node)).toContain('assets/images/ft_ic_folder_shortcut_link.svg');
    });

    it('should resolve smart folder icon', () => {
        node.aspectNames = ['smf:customConfigSmartFolder'];
        expect(service.getNodeIcon(node)).toContain('assets/images/ft_ic_smart_folder.svg');
    });

    it('should resolve file icon for content type', () => {
        node.isFolder = false;
        node.isFile = true;
        expect(service.getNodeIcon(node)).toContain('assets/images/ft_ic_ms_word.svg');
    });

    it('should resolve fallback file icon for unknown node', () => {
        node.isFolder = false;
        node.isFile = false;
        expect(service.getNodeIcon(node)).toContain('assets/images/ft_ic_miscellaneous');
    });
});

/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

describe('ThumbnailService', () => {

    let service: ThumbnailService;

    beforeEach(() => {
        service = TestBed.inject(ThumbnailService);
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
});

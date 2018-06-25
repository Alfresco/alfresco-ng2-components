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

import { TestBed } from '@angular/core/testing';
import { ThumbnailService } from './thumbnail.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

describe('ThumbnailService', () => {

    let service: ThumbnailService;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        service = TestBed.get(ThumbnailService);
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

    it('should return the thumbnail URL for a content item', () => {
        spyOn(service.contentService, 'getDocumentThumbnailUrl').and.returnValue('/fake-thumbnail.png');
        expect(service.getDocumentThumbnailUrl({})).toContain('/fake-thumbnail.png');
    });

});

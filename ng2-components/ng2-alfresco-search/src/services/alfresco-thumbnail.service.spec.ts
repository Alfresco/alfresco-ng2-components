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

import { TestBed, async } from '@angular/core/testing';
import { AlfrescoThumbnailService } from './alfresco-thumbnail.service';
import { CoreModule } from 'ng2-alfresco-core';

describe('AlfrescoThumbnailService', () => {

    let service: AlfrescoThumbnailService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                AlfrescoThumbnailService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(AlfrescoThumbnailService);
    });

    it('should return the correct icon for a plain text file', () => {
        expect(service.getMimeTypeIcon('text/plain')).toBe('ft_ic_document.svg');
    });

    it('should return the correct icon for a PNG file', () => {
        expect(service.getMimeTypeIcon('image/png')).toBe('ft_ic_raster_image.svg');
    });

    it('should return the correct icon for a MP4 video file', () => {
        expect(service.getMimeTypeIcon('video/mp4')).toBe('ft_ic_video.svg');
    });

    it('should return a generic icon for an unknown file', () => {
        expect(service.getMimeTypeIcon('x-unknown/yyy')).toBe('ft_ic_miscellaneous.svg');
    });

    it('should return the thumbnail URL for a content item', () => {
        spyOn(service.contentService, 'getDocumentThumbnailUrl').and.returnValue('/fake-thumbnail.png');
        expect(service.getDocumentThumbnailUrl({})).toBe('/fake-thumbnail.png');
    });

});

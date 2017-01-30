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
"use strict";
var core_1 = require("@angular/core");
var alfresco_thumbnail_service_1 = require("./alfresco-thumbnail.service");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
describe('AlfrescoThumbnailService', function () {
    var injector;
    var service;
    beforeEach(function () {
        injector = core_1.ReflectiveInjector.resolveAndCreate([
            ng2_alfresco_core_1.AlfrescoApiService,
            ng2_alfresco_core_1.AlfrescoAuthenticationService,
            ng2_alfresco_core_1.AlfrescoContentService,
            ng2_alfresco_core_1.AlfrescoSettingsService,
            alfresco_thumbnail_service_1.AlfrescoThumbnailService,
            ng2_alfresco_core_1.StorageService
        ]);
        service = injector.get(alfresco_thumbnail_service_1.AlfrescoThumbnailService);
    });
    it('should return the correct icon for a plain text file', function () {
        expect(service.getMimeTypeIcon('text/plain')).toBe('ft_ic_document.svg');
    });
    it('should return the correct icon for a PNG file', function () {
        expect(service.getMimeTypeIcon('image/png')).toBe('ft_ic_raster_image.svg');
    });
    it('should return the correct icon for a MP4 video file', function () {
        expect(service.getMimeTypeIcon('video/mp4')).toBe('ft_ic_video.svg');
    });
    it('should return a generic icon for an unknown file', function () {
        expect(service.getMimeTypeIcon('x-unknown/yyy')).toBe('ft_ic_miscellaneous.svg');
    });
    it('should return the thumbnail URL for a content item', function () {
        spyOn(service.contentService, 'getDocumentThumbnailUrl').and.returnValue('/fake-thumbnail.png');
        expect(service.getDocumentThumbnailUrl({})).toBe('/fake-thumbnail.png');
    });
});
//# sourceMappingURL=alfresco-thumbnail.service.spec.js.map
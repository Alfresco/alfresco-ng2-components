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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var AlfrescoThumbnailService = (function () {
    function AlfrescoThumbnailService(contentService) {
        this.contentService = contentService;
        this.mimeTypeIcons = {
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
    }
    AlfrescoThumbnailService.prototype.getDocumentThumbnailUrl = function (document) {
        return this.contentService.getDocumentThumbnailUrl(document);
    };
    AlfrescoThumbnailService.prototype.getMimeTypeKey = function (mimeType) {
        var icon = this.mimeTypeIcons[mimeType];
        return icon || 'ft_ic_miscellaneous';
    };
    AlfrescoThumbnailService.prototype.getMimeTypeIcon = function (mimeType) {
        return this.getMimeTypeKey(mimeType) + '.svg';
    };
    return AlfrescoThumbnailService;
}());
AlfrescoThumbnailService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoContentService])
], AlfrescoThumbnailService);
exports.AlfrescoThumbnailService = AlfrescoThumbnailService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL2FsZnJlc2NvLXRodW1ibmFpbC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkM7QUFDM0MsdURBQTJEO0FBRzNELElBQWEsd0JBQXdCO0lBK0JqQyxrQ0FBbUIsY0FBc0M7UUFBdEMsbUJBQWMsR0FBZCxjQUFjLENBQXdCO1FBN0J6RCxrQkFBYSxHQUFRO1lBQ2pCLFdBQVcsRUFBRSxvQkFBb0I7WUFDakMsWUFBWSxFQUFFLG9CQUFvQjtZQUNsQyxXQUFXLEVBQUUsb0JBQW9CO1lBQ2pDLGlCQUFpQixFQUFFLFdBQVc7WUFDOUIsMEJBQTBCLEVBQUUsZ0JBQWdCO1lBQzVDLG1FQUFtRSxFQUFFLGdCQUFnQjtZQUNyRixzRUFBc0UsRUFBRSxnQkFBZ0I7WUFDeEYsb0JBQW9CLEVBQUUsZUFBZTtZQUNyQyx5RUFBeUUsRUFBRSxlQUFlO1lBQzFGLHlFQUF5RSxFQUFFLGVBQWU7WUFDMUYsK0JBQStCLEVBQUUscUJBQXFCO1lBQ3RELDJFQUEyRSxFQUFFLHFCQUFxQjtZQUNsRyx1RUFBdUUsRUFBRSxxQkFBcUI7WUFDOUYsd0VBQXdFLEVBQUUscUJBQXFCO1lBQy9GLFdBQVcsRUFBRSxhQUFhO1lBQzFCLFlBQVksRUFBRSxnQkFBZ0I7WUFDOUIsMEJBQTBCLEVBQUUsZ0JBQWdCO1lBQzVDLGtCQUFrQixFQUFFLGdCQUFnQjtZQUNwQyxlQUFlLEVBQUUsb0JBQW9CO1lBQ3JDLFdBQVcsRUFBRSxlQUFlO1lBQzVCLDBCQUEwQixFQUFFLGVBQWU7WUFDM0MsOEJBQThCLEVBQUUsZUFBZTtZQUMvQyxpQkFBaUIsRUFBRSxlQUFlO1lBQ2xDLCtCQUErQixFQUFFLG9CQUFvQjtZQUNyRCw2QkFBNkIsRUFBRSxnQkFBZ0I7WUFDL0MsK0JBQStCLEVBQUUsbUJBQW1CO1NBQ3ZELENBQUM7SUFHRixDQUFDO0lBT00sMERBQXVCLEdBQTlCLFVBQStCLFFBQWE7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVNLGlEQUFjLEdBQXJCLFVBQXNCLFFBQWdCO1FBQ2xDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLElBQUksSUFBSSxxQkFBcUIsQ0FBQztJQUN6QyxDQUFDO0lBRU0sa0RBQWUsR0FBdEIsVUFBdUIsUUFBZ0I7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ2xELENBQUM7SUFDTCwrQkFBQztBQUFELENBbkRBLEFBbURDLElBQUE7QUFuRFksd0JBQXdCO0lBRHBDLGlCQUFVLEVBQUU7cUNBZ0MwQiwwQ0FBc0I7R0EvQmhELHdCQUF3QixDQW1EcEM7QUFuRFksNERBQXdCIiwiZmlsZSI6InNlcnZpY2VzL2FsZnJlc2NvLXRodW1ibmFpbC5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTYgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWxmcmVzY29Db250ZW50U2VydmljZSB9IGZyb20gJ25nMi1hbGZyZXNjby1jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEFsZnJlc2NvVGh1bWJuYWlsU2VydmljZSB7XG5cbiAgICBtaW1lVHlwZUljb25zOiBhbnkgPSB7XG4gICAgICAgICdpbWFnZS9wbmcnOiAnZnRfaWNfcmFzdGVyX2ltYWdlJyxcbiAgICAgICAgJ2ltYWdlL2pwZWcnOiAnZnRfaWNfcmFzdGVyX2ltYWdlJyxcbiAgICAgICAgJ2ltYWdlL2dpZic6ICdmdF9pY19yYXN0ZXJfaW1hZ2UnLFxuICAgICAgICAnYXBwbGljYXRpb24vcGRmJzogJ2Z0X2ljX3BkZicsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnOiAnZnRfaWNfbXNfZXhjZWwnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnOiAnZnRfaWNfbXNfZXhjZWwnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwudGVtcGxhdGUnOiAnZnRfaWNfbXNfZXhjZWwnLFxuICAgICAgICAnYXBwbGljYXRpb24vbXN3b3JkJzogJ2Z0X2ljX21zX3dvcmQnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnOiAnZnRfaWNfbXNfd29yZCcsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC50ZW1wbGF0ZSc6ICdmdF9pY19tc193b3JkJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JzogJ2Z0X2ljX21zX3Bvd2VycG9pbnQnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnByZXNlbnRhdGlvbic6ICdmdF9pY19tc19wb3dlcnBvaW50JyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC50ZW1wbGF0ZSc6ICdmdF9pY19tc19wb3dlcnBvaW50JyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5zbGlkZXNob3cnOiAnZnRfaWNfbXNfcG93ZXJwb2ludCcsXG4gICAgICAgICd2aWRlby9tcDQnOiAnZnRfaWNfdmlkZW8nLFxuICAgICAgICAndGV4dC9wbGFpbic6ICdmdF9pY19kb2N1bWVudCcsXG4gICAgICAgICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnOiAnZnRfaWNfZG9jdW1lbnQnLFxuICAgICAgICAnYXBwbGljYXRpb24vanNvbic6ICdmdF9pY19kb2N1bWVudCcsXG4gICAgICAgICdpbWFnZS9zdmcreG1sJzogJ2Z0X2ljX3ZlY3Rvcl9pbWFnZScsXG4gICAgICAgICd0ZXh0L2h0bWwnOiAnZnRfaWNfd2Vic2l0ZScsXG4gICAgICAgICdhcHBsaWNhdGlvbi94LWNvbXByZXNzZWQnOiAnZnRfaWNfYXJjaGl2ZScsXG4gICAgICAgICdhcHBsaWNhdGlvbi94LXppcC1jb21wcmVzc2VkJzogJ2Z0X2ljX2FyY2hpdmUnLFxuICAgICAgICAnYXBwbGljYXRpb24vemlwJzogJ2Z0X2ljX2FyY2hpdmUnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLmFwcGxlLmtleW5vdGUnOiAnZnRfaWNfcHJlc2VudGF0aW9uJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5hcHBsZS5wYWdlcyc6ICdmdF9pY19kb2N1bWVudCcsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQuYXBwbGUubnVtYmVycyc6ICdmdF9pY19zcHJlYWRzaGVldCdcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGNvbnRlbnRTZXJ2aWNlOiBBbGZyZXNjb0NvbnRlbnRTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRodW1ibmFpbCBVUkwgZm9yIHRoZSBnaXZlbiBkb2N1bWVudCBub2RlLlxuICAgICAqIEBwYXJhbSBkb2N1bWVudCBOb2RlIHRvIGdldCBVUkwgZm9yLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFVSTCBhZGRyZXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXREb2N1bWVudFRodW1ibmFpbFVybChkb2N1bWVudDogYW55KTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudFNlcnZpY2UuZ2V0RG9jdW1lbnRUaHVtYm5haWxVcmwoZG9jdW1lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRNaW1lVHlwZUtleShtaW1lVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGljb24gPSB0aGlzLm1pbWVUeXBlSWNvbnNbbWltZVR5cGVdO1xuICAgICAgICByZXR1cm4gaWNvbiB8fCAnZnRfaWNfbWlzY2VsbGFuZW91cyc7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1pbWVUeXBlSWNvbihtaW1lVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWltZVR5cGVLZXkobWltZVR5cGUpICsgJy5zdmcnO1xuICAgIH1cbn1cbiJdfQ==

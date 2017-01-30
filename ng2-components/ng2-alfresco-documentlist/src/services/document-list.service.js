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
var Rx_1 = require("rxjs/Rx");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var DocumentListService = DocumentListService_1 = (function () {
    function DocumentListService(authService, contentService, apiService) {
        this.authService = authService;
        this.contentService = contentService;
        this.apiService = apiService;
        this.mimeTypeIcons = {
            'image/png': 'ft_ic_raster_image.svg',
            'image/jpeg': 'ft_ic_raster_image.svg',
            'image/gif': 'ft_ic_raster_image.svg',
            'application/pdf': 'ft_ic_pdf.svg',
            'application/vnd.ms-excel': 'ft_ic_ms_excel.svg',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'ft_ic_ms_excel.svg',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'ft_ic_ms_excel.svg',
            'application/msword': 'ft_ic_ms_word.svg',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'ft_ic_ms_word.svg',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'ft_ic_ms_word.svg',
            'application/vnd.ms-powerpoint': 'ft_ic_ms_powerpoint.svg',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ft_ic_ms_powerpoint.svg',
            'application/vnd.openxmlformats-officedocument.presentationml.template': 'ft_ic_ms_powerpoint.svg',
            'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ft_ic_ms_powerpoint.svg',
            'video/mp4': 'ft_ic_video.svg',
            'text/plain': 'ft_ic_document.svg',
            'application/x-javascript': 'ft_ic_document.svg',
            'application/json': 'ft_ic_document.svg',
            'image/svg+xml': 'ft_ic_vector_image.svg',
            'text/html': 'ft_ic_website.svg',
            'application/x-compressed': 'ft_ic_archive.svg',
            'application/x-zip-compressed': 'ft_ic_archive.svg',
            'application/zip': 'ft_ic_archive.svg',
            'application/vnd.apple.keynote': 'ft_ic_presentation.svg',
            'application/vnd.apple.pages': 'ft_ic_document.svg',
            'application/vnd.apple.numbers': 'ft_ic_spreadsheet.svg'
        };
    }
    DocumentListService.prototype.getNodesPromise = function (folder, opts) {
        var rootNodeId = DocumentListService_1.ROOT_ID;
        if (opts && opts.rootFolderId) {
            rootNodeId = opts.rootFolderId;
        }
        var params = {
            includeSource: true,
            include: ['path', 'properties']
        };
        if (folder) {
            params.relativePath = folder;
        }
        if (opts) {
            if (opts.maxItems) {
                params.maxItems = opts.maxItems;
            }
            if (opts.skipCount) {
                params.skipCount = opts.skipCount;
            }
        }
        return this.apiService.getInstance().nodes.getNodeChildren(rootNodeId, params);
    };
    DocumentListService.prototype.deleteNode = function (nodeId) {
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().nodes.deleteNode(nodeId));
    };
    DocumentListService.prototype.createFolder = function (name, path) {
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().nodes.createFolder(name, path))
            .map(function (res) {
            return res;
        })
            .catch(this.handleError);
    };
    DocumentListService.prototype.getFolder = function (folder, opts) {
        return Rx_1.Observable.fromPromise(this.getNodesPromise(folder, opts))
            .map(function (res) { return res; })
            .catch(this.handleError);
    };
    DocumentListService.prototype.getDocumentThumbnailUrl = function (node) {
        if (node && this.contentService) {
            return this.contentService.getDocumentThumbnailUrl(node);
        }
        return null;
    };
    DocumentListService.prototype.getMimeTypeIcon = function (mimeType) {
        var icon = this.mimeTypeIcons[mimeType];
        return icon || DocumentListService_1.DEFAULT_MIME_TYPE_ICON;
    };
    DocumentListService.prototype.handleError = function (error) {
        console.error(error);
        return Rx_1.Observable.throw(error || 'Server error');
    };
    return DocumentListService;
}());
DocumentListService.DEFAULT_MIME_TYPE_ICON = 'ft_ic_miscellaneous.svg';
DocumentListService.ROOT_ID = '-root-';
DocumentListService = DocumentListService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoAuthenticationService, ng2_alfresco_core_1.AlfrescoContentService, ng2_alfresco_core_1.AlfrescoApiService])
], DocumentListService);
exports.DocumentListService = DocumentListService;
var DocumentListService_1;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL2RvY3VtZW50LWxpc3Quc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTJDO0FBRTNDLDhCQUFxQztBQUVyQyx1REFJMkI7QUFHM0IsSUFBYSxtQkFBbUI7SUFtQzVCLDZCQUFvQixXQUEwQyxFQUFVLGNBQXNDLEVBQVUsVUFBOEI7UUFBbEksZ0JBQVcsR0FBWCxXQUFXLENBQStCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQXdCO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUE3QnRKLGtCQUFhLEdBQVE7WUFDakIsV0FBVyxFQUFFLHdCQUF3QjtZQUNyQyxZQUFZLEVBQUUsd0JBQXdCO1lBQ3RDLFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsaUJBQWlCLEVBQUUsZUFBZTtZQUNsQywwQkFBMEIsRUFBRSxvQkFBb0I7WUFDaEQsbUVBQW1FLEVBQUUsb0JBQW9CO1lBQ3pGLHNFQUFzRSxFQUFFLG9CQUFvQjtZQUM1RixvQkFBb0IsRUFBRSxtQkFBbUI7WUFDekMseUVBQXlFLEVBQUUsbUJBQW1CO1lBQzlGLHlFQUF5RSxFQUFFLG1CQUFtQjtZQUM5RiwrQkFBK0IsRUFBRSx5QkFBeUI7WUFDMUQsMkVBQTJFLEVBQUUseUJBQXlCO1lBQ3RHLHVFQUF1RSxFQUFFLHlCQUF5QjtZQUNsRyx3RUFBd0UsRUFBRSx5QkFBeUI7WUFDbkcsV0FBVyxFQUFFLGlCQUFpQjtZQUM5QixZQUFZLEVBQUUsb0JBQW9CO1lBQ2xDLDBCQUEwQixFQUFFLG9CQUFvQjtZQUNoRCxrQkFBa0IsRUFBRSxvQkFBb0I7WUFDeEMsZUFBZSxFQUFFLHdCQUF3QjtZQUN6QyxXQUFXLEVBQUUsbUJBQW1CO1lBQ2hDLDBCQUEwQixFQUFFLG1CQUFtQjtZQUMvQyw4QkFBOEIsRUFBRSxtQkFBbUI7WUFDbkQsaUJBQWlCLEVBQUUsbUJBQW1CO1lBQ3RDLCtCQUErQixFQUFFLHdCQUF3QjtZ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QUVPLHlDQUFXLEdBQW5CLFVBQW9CLEtBQWU7UUFHL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixNQUFNLENBQUMsZUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksY0FBYyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNMLDBCQUFDO0FBQUQsQ0F4SEEsQUF3SEMsSUFBQTtBQXRIVSwwQ0FBc0IsR0FBVyx5QkFBeUIsQ0FBQztBQUUzRCwyQkFBTyxHQUFHLFFBQVEsQ0FBQztBQUpqQixtQkFBbUI7SUFEL0IsaUJBQVUsRUFBRTtxQ0FvQ3dCLGlEQUE2QixFQUEwQiwwQ0FBc0IsRUFBc0Isc0NBQWtCO0dBbkM3SSxtQkFBbUIsQ0F3SC9CO0FBeEhZLGtEQUFtQiIsImZpbGUiOiJzZXJ2aWNlcy9kb2N1bWVudC1saXN0LnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvUngnO1xuaW1wb3J0IHsgTm9kZVBhZ2luZywgTWluaW1hbE5vZGVFbnRpdHkgfSBmcm9tICdhbGZyZXNjby1qcy1hcGknO1xuaW1wb3J0IHtcbiAgICBBbGZyZXNjb0F1dGhlbnRpY2F0aW9uU2VydmljZSxcbiAgICBBbGZyZXNjb0NvbnRlbnRTZXJ2aWNlLFxuICAgIEFsZnJlc2NvQXBpU2VydmljZVxufSBmcm9tICduZzItYWxmcmVzY28tY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEb2N1bWVudExpc3RTZXJ2aWNlIHtcblxuICAgIHN0YXRpYyBERUZBVUxUX01JTUVfVFlQRV9JQ09OOiBzdHJpbmcgPSAnZnRfaWNfbWlzY2VsbGFuZW91cy5zdmcnO1xuXG4gICAgc3RhdGljIFJPT1RfSUQgPSAnLXJvb3QtJztcblxuICAgIG1pbWVUeXBlSWNvbnM6IGFueSA9IHtcbiAgICAgICAgJ2ltYWdlL3BuZyc6ICdmdF9pY19yYXN0ZXJfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL2pwZWcnOiAnZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS9naWYnOiAnZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi9wZGYnOiAnZnRfaWNfcGRmLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnOiAnZnRfaWNfbXNfZXhjZWwuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0JzogJ2Z0X2ljX21zX2V4Y2VsLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC50ZW1wbGF0ZSc6ICdmdF9pY19tc19leGNlbC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vbXN3b3JkJzogJ2Z0X2ljX21zX3dvcmQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50JzogJ2Z0X2ljX21zX3dvcmQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLnRlbXBsYXRlJzogJ2Z0X2ljX21zX3dvcmQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JzogJ2Z0X2ljX21zX3Bvd2VycG9pbnQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5wcmVzZW50YXRpb24nOiAnZnRfaWNfbXNfcG93ZXJwb2ludC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnRlbXBsYXRlJzogJ2Z0X2ljX21zX3Bvd2VycG9pbnQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5zbGlkZXNob3cnOiAnZnRfaWNfbXNfcG93ZXJwb2ludC5zdmcnLFxuICAgICAgICAndmlkZW8vbXA0JzogJ2Z0X2ljX3ZpZGVvLnN2ZycsXG4gICAgICAgICd0ZXh0L3BsYWluJzogJ2Z0X2ljX2RvY3VtZW50LnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnOiAnZnRfaWNfZG9jdW1lbnQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAnZnRfaWNfZG9jdW1lbnQuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL3N2Zyt4bWwnOiAnZnRfaWNfdmVjdG9yX2ltYWdlLnN2ZycsXG4gICAgICAgICd0ZXh0L2h0bWwnOiAnZnRfaWNfd2Vic2l0ZS5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24veC1jb21wcmVzc2VkJzogJ2Z0X2ljX2FyY2hpdmUuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3gtemlwLWNvbXByZXNzZWQnOiAnZnRfaWNfYXJjaGl2ZS5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vemlwJzogJ2Z0X2ljX2FyY2hpdmUuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5hcHBsZS5rZXlub3RlJzogJ2Z0X2ljX3ByZXNlbnRhdGlvbi5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLmFwcGxlLnBhZ2VzJzogJ2Z0X2ljX2RvY3VtZW50LnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQuYXBwbGUubnVtYmVycyc6ICdmdF9pY19zcHJlYWRzaGVldC5zdmcnXG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXV0aFNlcnZpY2U6IEFsZnJlc2NvQXV0aGVudGljYXRpb25TZXJ2aWNlLCBwcml2YXRlIGNvbnRlbnRTZXJ2aWNlOiBBbGZyZXNjb0NvbnRlbnRTZXJ2aWNlLCBwcml2YXRlIGFwaVNlcnZpY2U6IEFsZnJlc2NvQXBpU2VydmljZSkge1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Tm9kZXNQcm9taXNlKGZvbGRlcjogc3RyaW5nLCBvcHRzPzogYW55KTogUHJvbWlzZTxOb2RlUGFnaW5nPiB7XG5cbiAgICAgICAgbGV0IHJvb3ROb2RlSWQgPSBEb2N1bWVudExpc3RTZXJ2aWNlLlJPT1RfSUQ7XG4gICAgICAgIGlmIChvcHRzICYmIG9wdHMucm9vdEZvbGRlcklkKSB7XG4gICAgICAgICAgICByb290Tm9kZUlkID0gb3B0cy5yb290Rm9sZGVySWQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyYW1zOiBhbnkgPSB7XG4gICAgICAgICAgICBpbmNsdWRlU291cmNlOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZTogWydwYXRoJywgJ3Byb3BlcnRpZXMnXVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChmb2xkZXIpIHtcbiAgICAgICAgICAgIHBhcmFtcy5yZWxhdGl2ZVBhdGggPSBmb2xkZXI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0cykge1xuICAgICAgICAgICAgaWYgKG9wdHMubWF4SXRlbXMpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMubWF4SXRlbXMgPSBvcHRzLm1heEl0ZW1zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdHMuc2tpcENvdW50KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLnNraXBDb3VudCA9IG9wdHMuc2tpcENvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLm5vZGVzLmdldE5vZGVDaGlsZHJlbihyb290Tm9kZUlkLCBwYXJhbXMpO1xuICAgIH1cblxuICAgIGRlbGV0ZU5vZGUobm9kZUlkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tUHJvbWlzZSh0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5ub2Rlcy5kZWxldGVOb2RlKG5vZGVJZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBmb2xkZXIgaW4gdGhlIHBhdGguXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcGFyYW0gcGF0aFxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgY3JlYXRlRm9sZGVyKG5hbWU6IHN0cmluZywgcGF0aDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbVByb21pc2UodGhpcy5hcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkubm9kZXMuY3JlYXRlRm9sZGVyKG5hbWUsIHBhdGgpKVxuICAgICAgICAgICAgLm1hcChyZXMgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGZvbGRlciBub2RlIHdpdGggdGhlIHNwZWNpZmllZCByZWxhdGl2ZSBuYW1lIHBhdGggYmVsb3cgdGhlIHJvb3Qgbm9kZS5cbiAgICAgKiBAcGFyYW0gZm9sZGVyIFBhdGggdG8gZm9sZGVyLlxuICAgICAqIEBwYXJhbSBvcHRzIE9wdGlvbnMuXG4gICAgICogQHJldHVybnMge09ic2VydmFibGU8Tm9kZVBhZ2luZz59IEZvbGRlciBlbnRpdHkuXG4gICAgICovXG4gICAgZ2V0Rm9sZGVyKGZvbGRlcjogc3RyaW5nLCBvcHRzPzogYW55KSB7XG4gICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb21Qcm9taXNlKHRoaXMuZ2V0Tm9kZXNQcm9taXNlKGZvbGRlciwgb3B0cykpXG4gICAgICAgICAgICAubWFwKHJlcyA9PiA8Tm9kZVBhZ2luZz4gcmVzKVxuICAgICAgICAgICAgLy8gLmRvKGRhdGEgPT4gY29uc29sZS5sb2coJ05vZGUgZGF0YScsIGRhdGEpKSAvLyBleWViYWxsIHJlc3VsdHMgaW4gdGhlIGNvbnNvbGVcbiAgICAgICAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGh1bWJuYWlsIFVSTCBmb3IgdGhlIGdpdmVuIGRvY3VtZW50IG5vZGUuXG4gICAgICogQHBhcmFtIG5vZGUgTm9kZSB0byBnZXQgVVJMIGZvci5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBVUkwgYWRkcmVzcy5cbiAgICAgKi9cbiAgICBnZXREb2N1bWVudFRodW1ibmFpbFVybChub2RlOiBNaW5pbWFsTm9kZUVudGl0eSkge1xuICAgICAgICBpZiAobm9kZSAmJiB0aGlzLmNvbnRlbnRTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50U2VydmljZS5nZXREb2N1bWVudFRodW1ibmFpbFVybChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRNaW1lVHlwZUljb24obWltZVR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCBpY29uID0gdGhpcy5taW1lVHlwZUljb25zW21pbWVUeXBlXTtcbiAgICAgICAgcmV0dXJuIGljb24gfHwgRG9jdW1lbnRMaXN0U2VydmljZS5ERUZBVUxUX01JTUVfVFlQRV9JQ09OO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlRXJyb3IoZXJyb3I6IFJlc3BvbnNlKSB7XG4gICAgICAgIC8vIGluIGEgcmVhbCB3b3JsZCBhcHAsIHdlIG1heSBzZW5kIHRoZSBlcnJvciB0byBzb21lIHJlbW90ZSBsb2dnaW5nIGluZnJhc3RydWN0dXJlXG4gICAgICAgIC8vIGluc3RlYWQgb2YganVzdCBsb2dnaW5nIGl0IHRvIHRoZSBjb25zb2xlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvciB8fCAnU2VydmVyIGVycm9yJyk7XG4gICAgfVxufVxuIl19

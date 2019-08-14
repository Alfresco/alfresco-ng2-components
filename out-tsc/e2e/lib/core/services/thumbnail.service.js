"use strict";
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/* spellchecker: disable */
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var platform_browser_1 = require("@angular/platform-browser");
var alfresco_api_service_1 = require("./alfresco-api.service");
var ThumbnailService = /** @class */ (function () {
    function ThumbnailService(apiService, matIconRegistry, sanitizer) {
        var _this = this;
        this.apiService = apiService;
        this.DEFAULT_ICON = './assets/images/ft_ic_miscellaneous.svg';
        this.mimeTypeIcons = {
            'image/png': './assets/images/ft_ic_raster_image.svg',
            'image/jpeg': './assets/images/ft_ic_raster_image.svg',
            'image/gif': './assets/images/ft_ic_raster_image.svg',
            'image/bmp': './assets/images/ft_ic_raster_image.svg',
            'image/cgm': './assets/images/ft_ic_raster_image.svg',
            'image/ief': './assets/images/ft_ic_raster_image.svg',
            'image/jp2': './assets/images/ft_ic_raster_image.svg',
            'image/tiff': './assets/images/ft_ic_raster_image.svg',
            'image/vnd.adobe.photoshop': './assets/images/ft_ic_raster_image.svg',
            'image/vnd.adobe.premiere': './assets/images/ft_ic_raster_image.svg',
            'image/x-cmu-raster': './assets/images/ft_ic_raster_image.svg',
            'image/x-dwt': './assets/images/ft_ic_raster_image.svg',
            'image/x-portable-anymap': './assets/images/ft_ic_raster_image.svg',
            'image/x-portable-bitmap': './assets/images/ft_ic_raster_image.svg',
            'image/x-portable-graymap': './assets/images/ft_ic_raster_image.svg',
            'image/x-portable-pixmap': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-adobe': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-canon': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-fuji': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-hasselblad': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-kodak': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-leica': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-minolta': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-nikon': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-olympus': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-panasonic': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-pentax': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-red': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-sigma': './assets/images/ft_ic_raster_image.svg',
            'image/x-raw-sony': './assets/images/ft_ic_raster_image.svg',
            'image/x-xbitmap': './assets/images/ft_ic_raster_image.svg',
            'image/x-xpixmap': './assets/images/ft_ic_raster_image.svg',
            'image/x-xwindowdump': './assets/images/ft_ic_raster_image.svg',
            'image/svg+xml': './assets/images/ft_ic_vector_image.svg',
            'application/eps': './assets/images/ft_ic_raster_image.svg',
            'application/illustrator': './assets/images/ft_ic_raster_image.svg',
            'application/pdf': './assets/images/ft_ic_pdf.svg',
            'application/vnd.ms-excel': './assets/images/ft_ic_ms_excel.svg',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': './assets/images/ft_ic_ms_excel.svg',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.template': './assets/images/ft_ic_ms_excel.svg',
            'application/vnd.ms-excel.addin.macroenabled.12': './assets/images/ft_ic_ms_excel.svg',
            'application/vnd.ms-excel.sheet.binary.macroenabled.12': './assets/images/ft_ic_ms_excel.svg',
            'application/vnd.ms-excel.sheet.macroenabled.12': './assets/images/ft_ic_ms_excel.svg',
            'application/vnd.ms-excel.template.macroenabled.12': './assets/images/ft_ic_ms_excel.svg',
            'application/vnd.sun.xml.calc': './assets/images/ft_ic_ms_excel.svg',
            'application/vnd.sun.xml.calc.template': './assets/images/ft_ic_ms_excel.svg',
            'application/vnd.ms-outlook': './assets/images/ft_ic_document.svg',
            'application/msword': './assets/images/ft_ic_ms_word.svg',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': './assets/images/ft_ic_ms_word.svg',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.template': './assets/images/ft_ic_ms_word.svg',
            'application/vnd.ms-word.document.macroenabled.12': './assets/images/ft_ic_ms_word.svg',
            'application/vnd.ms-word.template.macroenabled.12': './assets/images/ft_ic_ms_word.svg',
            'application/vnd.sun.xml.writer': './assets/images/ft_ic_ms_word.svg',
            'application/vnd.sun.xml.writer.template': './assets/images/ft_ic_ms_word.svg',
            'application/rtf': './assets/images/ft_ic_ms_word.svg',
            'text/rtf': './assets/images/ft_ic_ms_word.svg',
            'application/vnd.ms-powerpoint': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.openxmlformats-officedocument.presentationml.template': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.openxmlformats-officedocument.presentationml.slideshow': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.oasis.opendocument.presentation': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.oasis.opendocument.presentation-template': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.openxmlformats-officedocument.presentationml.slide': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.sun.xml.impress': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.sun.xml.impress.template': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.oasis.opendocument.spreadsheet': './assets/images/ft_ic_ms_excel.svg',
            'application/vnd.oasis.opendocument.spreadsheet-template': './assets/images/ft_ic_ms_excel.svg',
            'application/vnd.ms-powerpoint.addin.macroenabled.12': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.ms-powerpoint.presentation.macroenabled.12': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.ms-powerpoint.slide.macroenabled.12': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.ms-powerpoint.slideshow.macroenabled.12': './assets/images/ft_ic_ms_powerpoint.svg',
            'application/vnd.ms-powerpoint.template.macroenabled.12': './assets/images/ft_ic_ms_powerpoint.svg',
            'video/mp4': './assets/images/ft_ic_video.svg',
            'video/3gpp': './assets/images/ft_ic_video.svg',
            'video/3gpp2': './assets/images/ft_ic_video.svg',
            'video/mp2t': './assets/images/ft_ic_video.svg',
            'video/mpeg': './assets/images/ft_ic_video.svg',
            'video/mpeg2': './assets/images/ft_ic_video.svg',
            'video/ogg': './assets/images/ft_ic_video.svg',
            'video/quicktime': './assets/images/ft_ic_video.svg',
            'video/webm': './assets/images/ft_ic_video.svg',
            'video/x-flv': './assets/images/ft_ic_video.svg',
            'video/x-m4v': './assets/images/ft_ic_video.svg',
            'video/x-ms-asf': './assets/images/ft_ic_video.svg',
            'video/x-ms-wmv': './assets/images/ft_ic_video.svg',
            'video/x-msvideo': './assets/images/ft_ic_video.svg',
            'video/x-rad-screenplay': './assets/images/ft_ic_video.svg',
            'video/x-sgi-movie': './assets/images/ft_ic_video.svg',
            'video/x-matroska': './assets/images/ft_ic_video.svg',
            'audio/mpeg': './assets/images/ft_ic_audio.svg',
            'audio/ogg': './assets/images/ft_ic_audio.svg',
            'audio/wav': './assets/images/ft_ic_audio.svg',
            'audio/basic': './assets/images/ft_ic_audio.svg',
            'audio/mp4': './assets/images/ft_ic_audio.svg',
            'audio/vnd.adobe.soundbooth': './assets/images/ft_ic_audio.svg',
            'audio/vorbis': './assets/images/ft_ic_audio.svg',
            'audio/x-aiff': './assets/images/ft_ic_audio.svg',
            'audio/x-flac': './assets/images/ft_ic_audio.svg',
            'audio/x-ms-wma': './assets/images/ft_ic_audio.svg',
            'audio/x-wav': './assets/images/ft_ic_audio.svg',
            'x-world/x-vrml': './assets/images/ft_ic_video.svg',
            'text/plain': './assets/images/ft_ic_document.svg',
            'application/vnd.oasis.opendocument.text': './assets/images/ft_ic_document.svg',
            'application/vnd.oasis.opendocument.text-template': './assets/images/ft_ic_document.svg',
            'application/x-javascript': './assets/images/ft_ic_document.svg',
            'application/json': './assets/images/ft_ic_document.svg',
            'text/csv': './assets/images/ft_ic_document.svg',
            'text/xml': './assets/images/ft_ic_document.svg',
            'text/html': './assets/images/ft_ic_website.svg',
            'application/x-compressed': './assets/images/ft_ic_archive.svg',
            'application/x-zip-compressed': './assets/images/ft_ic_archive.svg',
            'application/zip': './assets/images/ft_ic_archive.svg',
            'application/x-tar': './assets/images/ft_ic_archive.svg',
            'application/vnd.apple.keynote': './assets/images/ft_ic_presentation.svg',
            'application/vnd.apple.pages': './assets/images/ft_ic_document.svg',
            'application/vnd.apple.numbers': './assets/images/ft_ic_spreadsheet.svg',
            'application/vnd.visio': './assets/images/ft_ic_document.svg',
            'application/wordperfect': './assets/images/ft_ic_document.svg',
            'application/x-cpio': './assets/images/ft_ic_document.svg',
            'folder': './assets/images/ft_ic_folder.svg',
            'smartFolder': './assets/images/ft_ic_smart_folder.svg',
            'ruleFolder': './assets/images/ft_ic_folder_rule.svg',
            'linkFolder': './assets/images/ft_ic_folder_shortcut_link.svg',
            'disable/folder': './assets/images/ft_ic_folder_disable.svg',
            'selected': './assets/images/ft_ic_selected.svg'
        };
        Object.keys(this.mimeTypeIcons).forEach(function (key) {
            var url = sanitizer.bypassSecurityTrustResourceUrl(_this.mimeTypeIcons[key]);
            matIconRegistry.addSvgIcon(key, url);
            matIconRegistry.addSvgIconInNamespace('adf', key, url);
        });
    }
    /**
     * Gets a thumbnail URL for the given document node.
     * @param node Node or Node ID to get URL for.
     * @returns URL string
     */
    ThumbnailService.prototype.getDocumentThumbnailUrl = function (node, attachment, ticket) {
        var resultUrl;
        if (node) {
            var nodeId = void 0;
            if (typeof node === 'string') {
                nodeId = node;
            }
            else if (node.entry) {
                nodeId = node.entry.id;
            }
            resultUrl = this.apiService.contentApi.getDocumentThumbnailUrl(nodeId, attachment, ticket);
        }
        return resultUrl || this.DEFAULT_ICON;
    };
    /**
     * Gets a thumbnail URL for a MIME type.
     * @param mimeType MIME type for the thumbnail
     * @returns URL string
     */
    ThumbnailService.prototype.getMimeTypeIcon = function (mimeType) {
        var icon = this.mimeTypeIcons[mimeType];
        return (icon || this.DEFAULT_ICON);
    };
    /**
     * Gets a "miscellaneous" thumbnail URL for types with no other icon defined.
     * @returns URL string
     */
    ThumbnailService.prototype.getDefaultMimeTypeIcon = function () {
        return this.DEFAULT_ICON;
    };
    ThumbnailService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService, material_1.MatIconRegistry, platform_browser_1.DomSanitizer])
    ], ThumbnailService);
    return ThumbnailService;
}());
exports.ThumbnailService = ThumbnailService;
//# sourceMappingURL=thumbnail.service.js.map
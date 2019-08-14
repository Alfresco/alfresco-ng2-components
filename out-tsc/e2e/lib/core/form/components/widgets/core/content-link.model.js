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
Object.defineProperty(exports, "__esModule", { value: true });
var ContentLinkModel = /** @class */ (function () {
    function ContentLinkModel(obj) {
        this.contentAvailable = obj && obj.contentAvailable;
        this.created = obj && obj.created;
        this.createdBy = obj && obj.createdBy || {};
        this.id = obj && obj.id;
        this.link = obj && obj.link;
        this.mimeType = obj && obj.mimeType;
        this.name = obj && obj.name;
        this.previewStatus = obj && obj.previewStatus;
        this.relatedContent = obj && obj.relatedContent;
        this.simpleType = obj && obj.simpleType;
        this.thumbnailStatus = obj && obj.thumbnailStatus;
    }
    ContentLinkModel.prototype.hasPreviewStatus = function () {
        return this.previewStatus === 'supported' ? true : false;
    };
    ContentLinkModel.prototype.isTypeImage = function () {
        return this.simpleType === 'image' ? true : false;
    };
    ContentLinkModel.prototype.isTypePdf = function () {
        return this.simpleType === 'pdf' ? true : false;
    };
    ContentLinkModel.prototype.isTypeDoc = function () {
        return this.simpleType === 'word' || this.simpleType === 'content' ? true : false;
    };
    ContentLinkModel.prototype.isThumbnailReady = function () {
        return this.thumbnailStatus === 'created';
    };
    ContentLinkModel.prototype.isThumbnailSupported = function () {
        return this.isTypeImage() || ((this.isTypePdf() || this.isTypeDoc()) && this.isThumbnailReady());
    };
    return ContentLinkModel;
}());
exports.ContentLinkModel = ContentLinkModel;
//# sourceMappingURL=content-link.model.js.map
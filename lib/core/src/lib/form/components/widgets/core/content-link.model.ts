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

/* eslint-disable @angular-eslint/component-selector */

export class ContentLinkModel {
    contentAvailable: boolean;
    created: Date;
    createdBy: any;
    id: number;
    nodeId: string;
    link: boolean;
    mimeType: string;
    name: string;
    previewStatus: string;
    relatedContent: boolean;
    simpleType: string;
    thumbnailUrl: string;
    contentRawUrl: string;
    contentBlob: Blob;
    thumbnailStatus: string;
    sourceId: string;

    constructor(obj?: any) {
        this.contentAvailable = obj?.contentAvailable;
        this.created = obj?.created;
        this.createdBy = obj?.createdBy || {};
        this.id = obj?.id;
        this.link = obj?.link;
        this.mimeType = obj?.mimeType;
        this.name = obj?.name;
        this.previewStatus = obj?.previewStatus;
        this.relatedContent = obj?.relatedContent;
        this.simpleType = obj?.simpleType;
        this.thumbnailStatus = obj?.thumbnailStatus;
        this.nodeId = obj?.nodeId;
    }

    hasPreviewStatus(): boolean {
        return this.previewStatus === 'supported';
    }

    isTypeImage(): boolean {
        return this.simpleType === 'image';
    }

    isTypePdf(): boolean {
        return this.simpleType === 'pdf';
    }

    isTypeDoc(): boolean {
        return this.simpleType === 'word' || this.simpleType === 'content';
    }

    isThumbnailReady(): boolean {
        return this.thumbnailStatus === 'created';
    }

    isThumbnailSupported(): boolean {
        return this.isTypeImage() || ((this.isTypePdf() || this.isTypeDoc()) && this.isThumbnailReady());
    }
}

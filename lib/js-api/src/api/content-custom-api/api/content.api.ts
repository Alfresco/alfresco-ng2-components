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

import { BaseApi } from './base.api';

export class ContentApi extends BaseApi {

    /**
     * Get thumbnail URL for the given nodeId
     *
     * @param nodeId The ID of the document node
     * @param [attachment=false] Retrieve content as an attachment for download
     * @param [ticket] Custom ticket to use for authentication
     * @returns The URL address pointing to the content.
     */
    getDocumentThumbnailUrl(nodeId: string, attachment?: boolean, ticket?: string): string {
        return this.apiClient.basePath + '/nodes/' + nodeId +
            '/renditions/doclib/content' +
            '?attachment=' + (attachment ? 'true' : 'false') +
            this.apiClient.getAlfTicket(ticket);
    }

    /**
     * Get preview URL for the given nodeId
     *
     * @param nodeId The ID of the document node
     * @param  [attachment=false] Retrieve content as an attachment for download
     * @param [ticket] Custom ticket to use for authentication
     * @returns  The URL address pointing to the content.
     */
    getDocumentPreviewUrl(nodeId: string, attachment?: boolean, ticket?: string): string {
        return this.apiClient.basePath + '/nodes/' + nodeId +
            '/renditions/imgpreview/content' +
            '?attachment=' + (attachment ? 'true' : 'false') +
            this.apiClient.getAlfTicket(ticket);
    }

    /**
     * Get content URL for the given nodeId
     *
     * @param  nodeId The ID of the document node
     * @param  [attachment=false] Retrieve content as an attachment for download
     * @param  [ticket] Custom ticket to use for authentication
     * @returns The URL address pointing to the content.
     */
    getContentUrl(nodeId: string, attachment?: boolean, ticket?: string): string {
        return this.apiClient.basePath + '/nodes/' + nodeId +
            '/content' +
            '?attachment=' + (attachment ? 'true' : 'false') +
            this.apiClient.getAlfTicket(ticket);
    }

    /**
     * Get rendition URL for the given nodeId
     *
     * @param nodeId The ID of the document node
     * @param encoding of the document
     * @param [attachment=false] retrieve content as an attachment for download
     * @param [ticket] Custom ticket to use for authentication
     * @returns The URL address pointing to the content.
     */
    getRenditionUrl(nodeId: string, encoding: string, attachment?: boolean, ticket?: string): string {
        return this.apiClient.basePath + '/nodes/' + nodeId +
            '/renditions/' + encoding + '/content' +
            '?attachment=' + (attachment ? 'true' : 'false') +
            this.apiClient.getAlfTicket(ticket);
    }

    /**
     * Get version's rendition URL for the given nodeId
     *
     * @param nodeId The ID of the document node
     * @param versionId The ID of the version
     * @param encoding of the document
     * @param [attachment=false] retrieve content as an attachment for download
     * @param [ticket] Custom ticket to use for authentication
     * @returns The URL address pointing to the content.
     */
    getVersionRenditionUrl(nodeId: string, versionId: string, encoding: string, attachment?: boolean, ticket?: string): string {
        return this.apiClient.basePath + '/nodes/' + nodeId + '/versions/' + versionId +
            '/renditions/' + encoding + '/content' +
            '?attachment=' + (attachment ? 'true' : 'false') +
            this.apiClient.getAlfTicket(ticket);
    }

    /**
     * Get content URL for the given nodeId and versionId
     *
     * @param  nodeId The ID of the document node
     * @param versionId The ID of the version
     * @param  [attachment=false] Retrieve content as an attachment for download
     * @param  [ticket] Custom ticket to use for authentication
     * @returns The URL address pointing to the content.
     */
    getVersionContentUrl(nodeId: string, versionId: string, attachment?: boolean, ticket?: string): string {
        return this.apiClient.basePath + '/nodes/' + nodeId +
            '/versions/' + versionId + '/content' +
            '?attachment=' + (attachment ? 'true' : 'false') +
            this.apiClient.getAlfTicket(ticket);
    }

    /**
     * Get content url for the given shared link id
     *
     * @param linkId - The ID of the shared link
     * @param  [attachment=false] Retrieve content as an attachment for download
     * @returns  The URL address pointing to the content.
     */
    getSharedLinkContentUrl(linkId: string, attachment?: boolean): string {
        return this.apiClient.basePath + '/shared-links/' + linkId +
            '/content' +
            '?attachment=' + (attachment ? 'true' : 'false');
    }

    /**
     * Gets the rendition content for file with shared link identifier sharedId.
     *
     * @param  sharedId - The identifier of a shared link to a file.
     * @param  renditionId - The name of a thumbnail rendition, for example doclib, or pdf.
     * @param [attachment=false] Retrieve content as an attachment for download
     * @returns The URL address pointing to the content.
     */
    getSharedLinkRenditionUrl(sharedId: string, renditionId: string, attachment?: boolean): string {
        return this.apiClient.basePath + '/shared-links/' + sharedId +
            '/renditions/' + renditionId + '/content' +
            '?attachment=' + (attachment ? 'true' : 'false');
    }
}

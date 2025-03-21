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

import assert from 'assert';
import { AlfrescoApi, ContentApi } from '../src';
import { EcmAuthMock } from './mockObjects';

describe('AlfrescoContent', () => {
    const hostEcm = 'https://127.0.0.1:8080';
    const nodesUrl = hostEcm + '/alfresco/api/-default-/public/alfresco/versions/1/nodes/';
    const sharedLinksUrl = hostEcm + '/alfresco/api/-default-/public/alfresco/versions/1/shared-links/';
    const nodeId = '1a0b110f-1e09-4ca2-b367-fe25e4964a4';
    const versionId = '1.1';

    let authResponseMock: EcmAuthMock;
    let contentApi: ContentApi;

    beforeEach((done) => {
        authResponseMock = new EcmAuthMock(hostEcm);
        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        alfrescoJsApi.login('admin', 'admin').then(() => {
            contentApi = new ContentApi(alfrescoJsApi);
            done();
        });
    });

    it('outputs thumbnail url', () => {
        const thumbnailUrl = contentApi.getDocumentThumbnailUrl(nodeId);

        assert.equal(
            thumbnailUrl,
            nodesUrl + nodeId + '/renditions/doclib/content?attachment=false&' + 'alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
        );
    });

    it('outputs thumbnail url as attachment', () => {
        const thumbnailUrl = contentApi.getDocumentThumbnailUrl(nodeId, true);

        assert.equal(
            thumbnailUrl,
            nodesUrl + nodeId + '/renditions/doclib/content?attachment=true&' + 'alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
        );
    });

    it('outputs thumbnail url with custom ticket', () => {
        const thumbnailUrl = contentApi.getDocumentThumbnailUrl(nodeId, true, 'custom_ticket');

        assert.equal(thumbnailUrl, nodesUrl + nodeId + '/renditions/doclib/content?attachment=true&' + 'alf_ticket=custom_ticket');
    });

    it('outputs preview url', () => {
        const thumbnailUrl = contentApi.getDocumentPreviewUrl(nodeId);

        assert.equal(
            thumbnailUrl,
            nodesUrl + nodeId + '/renditions/imgpreview/content?attachment=false&' + 'alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
        );
    });

    it('outputs preview url as attachment', () => {
        const thumbnailUrl = contentApi.getDocumentPreviewUrl(nodeId, true);

        assert.equal(
            thumbnailUrl,
            nodesUrl + nodeId + '/renditions/imgpreview/content?attachment=true&' + 'alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
        );
    });

    it('outputs preview url with custom ticket', () => {
        const thumbnailUrl = contentApi.getDocumentPreviewUrl(nodeId, true, 'custom_ticket');

        assert.equal(thumbnailUrl, nodesUrl + nodeId + '/renditions/imgpreview/content?attachment=true&' + 'alf_ticket=custom_ticket');
    });

    it('outputs content url', () => {
        const contentUrl = contentApi.getContentUrl(nodeId);

        assert.equal(contentUrl, nodesUrl + nodeId + '/content?attachment=false' + '&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
    });

    it('outputs content url as attachment', () => {
        const contentUrl = contentApi.getContentUrl(nodeId, true);

        assert.equal(contentUrl, nodesUrl + nodeId + '/content?attachment=true' + '&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
    });

    it('outputs content url with custom ticket', () => {
        const contentUrl = contentApi.getContentUrl(nodeId, true, 'custom_ticket');

        assert.equal(contentUrl, nodesUrl + nodeId + '/content?attachment=true' + '&alf_ticket=custom_ticket');
    });

    it('outputs rendition url', () => {
        const encoding = 'pdf';
        const contentUrl = contentApi.getRenditionUrl(nodeId, encoding);

        assert.equal(
            contentUrl,
            nodesUrl +
                nodeId +
                '/renditions/' +
                encoding +
                '/content?attachment=false' +
                '&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
        );
    });

    it('outputs rendition url as attachment', () => {
        const encoding = 'pdf';
        const contentUrl = contentApi.getRenditionUrl(nodeId, encoding, true);

        assert.equal(
            contentUrl,
            nodesUrl + nodeId + '/renditions/' + encoding + '/content?attachment=true' + '&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
        );
    });

    it('outputs rendition url with custom ticket', () => {
        const encoding = 'pdf';
        const contentUrl = contentApi.getRenditionUrl(nodeId, encoding, true, 'custom_ticket');

        assert.equal(contentUrl, nodesUrl + nodeId + '/renditions/' + encoding + '/content?attachment=true' + '&alf_ticket=custom_ticket');
    });

    it('outputs version rendition url', () => {
        const encoding = 'pdf';
        const contentUrl = contentApi.getVersionRenditionUrl(nodeId, versionId, encoding);

        assert.equal(
            contentUrl,
            nodesUrl +
                nodeId +
                '/versions/' +
                versionId +
                '/renditions/' +
                encoding +
                '/content?attachment=false' +
                '&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
        );
    });

    it('outputs version rendition url as attachment', () => {
        const encoding = 'pdf';
        const contentUrl = contentApi.getVersionRenditionUrl(nodeId, versionId, encoding, true);

        assert.equal(
            contentUrl,
            nodesUrl +
                nodeId +
                '/versions/' +
                versionId +
                '/renditions/' +
                encoding +
                '/content?attachment=true' +
                '&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
        );
    });

    it('outputs version rendition url with custom ticket', () => {
        const encoding = 'pdf';
        const contentUrl = contentApi.getVersionRenditionUrl(nodeId, versionId, encoding, true, 'custom_ticket');

        assert.equal(
            contentUrl,
            nodesUrl + nodeId + '/versions/' + versionId + '/renditions/' + encoding + '/content?attachment=true' + '&alf_ticket=custom_ticket'
        );
    });

    it('outputs version content url', () => {
        const contentUrl = contentApi.getVersionContentUrl(nodeId, versionId);

        assert.equal(
            contentUrl,
            nodesUrl + nodeId + '/versions/' + versionId + '/content?attachment=false' + '&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
        );
    });

    it('outputs version content url as attachment', () => {
        const contentUrl = contentApi.getVersionContentUrl(nodeId, versionId, true);

        assert.equal(
            contentUrl,
            nodesUrl + nodeId + '/versions/' + versionId + '/content?attachment=true' + '&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
        );
    });

    it('outputs version content url with custom ticket', () => {
        const contentUrl = contentApi.getVersionContentUrl(nodeId, versionId, true, 'custom_ticket');
        assert.equal(contentUrl, nodesUrl + nodeId + '/versions/' + versionId + '/content?attachment=true' + '&alf_ticket=custom_ticket');
    });

    it('should output shared link content url', () => {
        const url = contentApi.getSharedLinkContentUrl(nodeId);
        assert.equal(url, sharedLinksUrl + nodeId + '/content?attachment=false');
    });

    it('should output shared link content as attachment', () => {
        const url = contentApi.getSharedLinkContentUrl(nodeId, true);
        assert.equal(url, sharedLinksUrl + nodeId + '/content?attachment=true');
    });

    it('should generate shared link rendition url', () => {
        const url = contentApi.getSharedLinkRenditionUrl(nodeId, 'pdf');
        assert.equal(url, sharedLinksUrl + nodeId + '/renditions/pdf/content?attachment=false');
    });

    it('should generate shared link rendition url for download', () => {
        const url = contentApi.getSharedLinkRenditionUrl(nodeId, 'pdf', true);
        assert.equal(url, sharedLinksUrl + nodeId + '/renditions/pdf/content?attachment=true');
    });
});

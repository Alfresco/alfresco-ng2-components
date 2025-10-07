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

import { TagBody } from '../model/tagBody';
import { TagEntry } from '../model/tagEntry';
import { TagPaging } from '../model/tagPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentIncludeQuery, ContentPagingQuery } from './types';

/**
 * Tags service.
 */
export class TagsApi extends BaseApi {
    /**
     * Create a tag for a node
     * @param nodeId The identifier of a node.
     * @param tagBodyCreate The new tag
     * @param opts Optional parameters
     * @returns Promise<TagEntry>
     */
    createTagForNode(nodeId: string, tagBodyCreate: TagBody[], opts?: ContentFieldsQuery): Promise<TagEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(tagBodyCreate, 'tagBodyCreate');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/tags',
            pathParams,
            queryParams,
            bodyParam: tagBodyCreate,
            returnType: TagEntry
        });
    }

    /**
     * Delete a tag from a node
     * @param nodeId The identifier of a node.
     * @param tagId The identifier of a tag.
     * @returns Promise<{}>
     */
    deleteTagFromNode(nodeId: string, tagId: string): Promise<void> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(tagId, 'tagId');

        const pathParams = {
            nodeId,
            tagId
        };

        return this.delete({
            path: '/nodes/{nodeId}/tags/{tagId}',
            pathParams
        });
    }

    /**
     * Get a tag
     * @param tagId The identifier of a tag.
     * @param opts Optional parameters
     * @returns Promise<TagEntry>
     */
    getTag(tagId: string, opts?: ContentFieldsQuery): Promise<TagEntry> {
        throwIfNotDefined(tagId, 'tagId');

        const pathParams = {
            tagId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/tags/{tagId}',
            pathParams,
            queryParams,
            returnType: TagEntry
        });
    }

    /**
     * List tags
     * @param opts Optional parameters
     * @param opts.tag Name or pattern for which tag is returned. Example of pattern: *test* which returns tags like 'my test 1'
     * @param opts.matching Switches filtering to pattern mode instead of exact mode.
     * @returns Promise<TagPaging>
     */
    listTags(opts?: { tag?: string; matching?: boolean } & ContentPagingQuery & ContentIncludeQuery & ContentFieldsQuery): Promise<TagPaging> {
        opts = opts || {};

        const pathParams = {};

        let where: string;
        if (opts?.tag) {
            where = opts.matching ? `(tag matches ('${opts.tag}'))` : `(tag='${opts.tag}')`;
        }
        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv'),
            include: buildCollectionParam(opts?.include, 'csv'),
            where
        };

        return this.get({
            path: '/tags',
            pathParams,
            queryParams,
            returnType: TagPaging
        });
    }

    /**
     * List tags for a node
     * @param nodeId The identifier of a node.
     * @param opts Optional parameters
     * @returns Promise<TagPaging>
     */
    listTagsForNode(nodeId: string, opts?: ContentPagingQuery & ContentFieldsQuery): Promise<TagPaging> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/tags',
            pathParams,
            queryParams,
            returnType: TagPaging
        });
    }

    /**
     * Update a tag
     * @param tagId The identifier of a tag.
     * @param tagBodyUpdate The updated tag
     * @param opts Optional parameters
     * @returns Promise<TagEntry>
     */
    updateTag(tagId: string, tagBodyUpdate: TagBody, opts?: ContentFieldsQuery): Promise<TagEntry> {
        throwIfNotDefined(tagId, 'tagId');
        throwIfNotDefined(tagBodyUpdate, 'tagBodyUpdate');

        const pathParams = {
            tagId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/tags/{tagId}',
            pathParams,
            queryParams,
            bodyParam: tagBodyUpdate,
            returnType: TagEntry
        });
    }

    /**
     * Deletes a tag by **tagId**. This will cause the tag to be removed from all nodes.
     * @param tagId The identifier of a tag.
     * @returns Promise<{}>
     */
    deleteTag(tagId: string): Promise<void> {
        throwIfNotDefined(tagId, 'tagId');

        const pathParams = {
            tagId
        };

        return this.delete({
            path: '/tags/{tagId}',
            pathParams
        });
    }

    /**
     * Create specified by **tags** list of tags.
     * @param tags List of tags to create.
     * @returns Promise<TagEntry | TagPaging>
     */
    createTags(tags: TagBody[]): Promise<TagEntry | TagPaging> {
        throwIfNotDefined(tags, 'tags');

        return this.post({
            path: '/tags',
            bodyParam: tags
        });
    }

    /**
     * Assign tags to node. If tag is new then tag is also created additionally, if tag already exists then it is just assigned.
     * @param nodeId Id of node to which tags should be assigned.
     * @param tags List of tags to create and assign or just assign if they already exist.
     * @returns Promise<TagPaging>
     */
    assignTagsToNode(nodeId: string, tags: TagBody[]): Promise<TagPaging> {
        return this.post({
            path: '/nodes/{nodeId}/tags',
            pathParams: { nodeId },
            bodyParam: tags,
            returnType: TagPaging
        });
    }

    /**
     * Assign tags to node. If tag is new then tag is also created additionally, if tag already exists then it is just assigned.
     * @param nodeId Id of node to which tags should be assigned.
     * @param tag List of tags to create and assign or just assign if they already exist.
     * @returns Promise<TagEntry>
     */
    assignTagToNode(nodeId: string, tag: TagBody): Promise<TagEntry> {
        return this.post({
            path: '/nodes/{nodeId}/tags',
            pathParams: { nodeId },
            bodyParam: tag,
            returnType: TagEntry
        });
    }
}

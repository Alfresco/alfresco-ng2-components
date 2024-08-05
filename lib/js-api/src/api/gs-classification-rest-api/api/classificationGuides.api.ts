/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    ClassificationGuideBody,
    ClassificationGuideEntry,
    ClassificationGuidePaging,
    InstructionEntry,
    SubtopicPaging,
    TopicBody,
    TopicEntry,
    TopicPaging
} from '../model';
import { BaseApi } from './base.api';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { throwIfNotDefined } from '../../../assert';
import { GsIncludeQuery, GsPagingQuery } from './types';

export interface CombinedInstructionsOpts {
    instructions?: any;
}

/**
 * ClassificationGuidesApi service.
 */
export class ClassificationGuidesApi extends BaseApi {
    /**
     * Combines instructions from the given topics and the user defined instruction, if any.
     *
     * @param opts Optional parameters
     * @param opts.instructions Instructions
     * @returns Promise<InstructionEntry>
     */
    combinedInstructions(opts?: CombinedInstructionsOpts): Promise<InstructionEntry> {
        return this.post({
            path: '/combined-instructions',
            bodyParam: opts?.instructions
        });
    }

    /**
     * Create a classification guide
     *
     * @param classificationGuide Classification guide
     * @returns Promise<ClassificationGuideEntry>
     */
    createClassificationGuide(classificationGuide: ClassificationGuideBody): Promise<ClassificationGuideEntry> {
        throwIfNotDefined(classificationGuide, 'classificationGuide');

        return this.post({
            path: '/classification-guides',
            bodyParam: classificationGuide
        });
    }

    /**
     * Create a subtopic
     *
     * @param topicId The identifier for the topic
     * @param topic Subtopic
     * @param opts Optional parameters
     * @returns Promise<TopicEntry>
     */
    createSubtopic(topicId: string, topic: TopicBody, opts?: GsIncludeQuery): Promise<TopicEntry> {
        throwIfNotDefined(topicId, 'topicId');
        throwIfNotDefined(topic, 'topic');

        const pathParams = {
            topicId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.post({
            path: '/topics/{topicId}/subtopics',
            pathParams,
            queryParams,
            bodyParam: topic,
            returnType: TopicEntry
        });
    }

    /**
     * Create a topic
     *
     * @param classificationGuideId The identifier for the classification guide
     * @param topic Topic
     * @param opts Optional parameters
     * @returns Promise<TopicEntry>
     */
    createTopic(classificationGuideId: string, topic: TopicBody, opts?: GsIncludeQuery): Promise<TopicEntry> {
        throwIfNotDefined(classificationGuideId, 'classificationGuideId');
        throwIfNotDefined(topic, 'topic');

        const pathParams = {
            classificationGuideId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.post({
            path: '/classification-guides/{classificationGuideId}/topics',
            pathParams,
            queryParams,
            bodyParam: topic,
            returnType: TopicEntry
        });
    }

    /**
     * Delete a classification guide
     *
     * @param classificationGuideId The identifier for the classification guide
     * @returns Promise<{ }>
     */
    deleteClassificationGuide(classificationGuideId: string): Promise<void> {
        throwIfNotDefined(classificationGuideId, 'classificationGuideId');

        const pathParams = {
            classificationGuideId
        };

        return this.delete({
            path: '/classification-guides/{classificationGuideId}',
            pathParams
        });
    }

    /**
     * Delete a topic
     *
     * @param topicId The identifier for the topic
     * @returns Promise<{ }>
     */
    deleteTopic(topicId: string): Promise<void> {
        throwIfNotDefined(topicId, 'topicId');

        const pathParams = {
            topicId
        };

        return this.delete({
            path: '/topics/{topicId}',
            pathParams
        });
    }

    /**
     * List all classification guides
     *
     * @param opts Optional parameters
     * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields.
     * Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
     * above to check if any fields used in this method have a descending default search order.
     * To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
     * @param opts.where A string to restrict the returned objects by using a predicate. Supported operations are AND, NOT, and OR. Fields to filter on:
     * enabled - e.g. (enabled = true OR enabled = false)
     * @returns Promise<ClassificationGuidePaging>
     */
    listClassificationGuides(opts?: { orderBy?: string[]; where?: string } & GsPagingQuery & GsIncludeQuery): Promise<ClassificationGuidePaging> {
        opts =
            opts ||
            {
                /* empty */
            };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            where: opts?.where
        };

        return this.get({
            path: '/classification-guides',
            queryParams
        });
    }

    /**
     * List all subtopics
     *
     * @param topicId The identifier for the topic
     * @param opts Optional parameters
     * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
     * sort the list by one or more fields.
     * Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
     * above to check if any fields used in this method have a descending default search order.
     * To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
     * @param opts.where A string to restrict the returned objects by using a predicate. Supported operations are AND, NOT, and OR. Fields to filter on:
     * - hasInstruction
     * - hasSubtopics
     * @param opts.includeSource Also include **source** in addition to **entries** with folder information on the parent guide/topic
     * @returns Promise<SubtopicPaging>
     */
    listSubtopics(
        topicId: string,
        opts?: {
            orderBy?: string[];
            where?: string;
            includeSource?: boolean;
        } & GsPagingQuery &
            GsIncludeQuery
    ): Promise<SubtopicPaging> {
        throwIfNotDefined(topicId, 'topicId');
        opts =
            opts ||
            {
                /* empty */
            };

        const pathParams = {
            topicId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            where: opts?.where,
            includeSource: opts?.includeSource
        };

        return this.get({
            path: '/topics/{topicId}/subtopics',
            pathParams,
            queryParams,
            returnType: SubtopicPaging
        });
    }

    /**
     * List all topics
     *
     * @param classificationGuideId The identifier for the classification guide
     * @param opts Optional parameters
     * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
     * sort the list by one or more fields.
     * Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
     * above to check if any fields used in this method have a descending default search order.
     * To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
     * @param opts.where A string to restrict the returned objects by using a predicate. Supported operations are AND, NOT, and OR e.g. (instruction=true and hasSubtopics=false). Fields to filter on:
     * - hasInstruction
     * - hasSubtopics
     * @param opts.includeSource Also include **source** in addition to **entries** with folder information on the parent guide/topic
     * @returns Promise<TopicPaging>
     */
    listTopics(
        classificationGuideId: string,
        opts?: {
            orderBy?: string[];
            where?: string;
            includeSource?: boolean;
        } & GsPagingQuery &
            GsIncludeQuery
    ): Promise<TopicPaging> {
        throwIfNotDefined(classificationGuideId, 'classificationGuideId');
        opts =
            opts ||
            {
                /* empty */
            };

        const pathParams = {
            classificationGuideId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            where: opts?.where,
            includeSource: opts?.includeSource
        };

        return this.get({
            path: '/classification-guides/{classificationGuideId}/topics',
            pathParams,
            queryParams,
            returnType: TopicPaging
        });
    }

    /**
     * Get classification guide information
     *
     * @param classificationGuideId The identifier for the classification guide
     * @returns Promise<ClassificationGuideEntry>
     */
    showClassificationGuideById(classificationGuideId: string): Promise<ClassificationGuideEntry> {
        throwIfNotDefined(classificationGuideId, 'classificationGuideId');

        const pathParams = {
            classificationGuideId
        };

        return this.get({
            path: '/classification-guides/{classificationGuideId}',
            pathParams
        });
    }

    /**
     * Get topic information
     *
     * @param topicId The identifier for the topic
     * @param opts Optional parameters
     * @returns Promise<TopicEntry>
     */
    showTopicById(topicId: string, opts?: GsIncludeQuery): Promise<TopicEntry> {
        throwIfNotDefined(topicId, 'topicId');

        const pathParams = {
            topicId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.post({
            path: '/topics/{topicId}',
            pathParams,
            queryParams,
            returnType: TopicEntry
        });
    }

    /**
     * Update a classification guide
     *
     * Updates the classification guide with id **classificationGuideId**. For example, you can rename a classification guide.
     *
     * @param classificationGuideId The identifier for the classification guide
     * @param classificationGuide Classification guide
     * @returns Promise<ClassificationGuideEntry>
     */
    updateClassificationGuide(classificationGuideId: string, classificationGuide: ClassificationGuideBody): Promise<ClassificationGuideEntry> {
        throwIfNotDefined(classificationGuideId, 'classificationGuideId');
        throwIfNotDefined(classificationGuide, 'classificationGuide');

        const pathParams = {
            classificationGuideId
        };

        return this.put({
            path: '/classification-guides/{classificationGuideId}',
            pathParams,
            bodyParam: classificationGuide
        });
    }

    /**
     * Update a topic
     *
     * Updates the topic with id **topicId**.
     * Use this to rename a topic or to add, edit, or remove the instruction associated with it.
     *
     * @param topicId The identifier for the topic
     * @param topic Topic
     * @param opts Optional parameters
     * @returns Promise<TopicEntry>
     */
    updateTopic(topicId: string, topic: TopicBody, opts?: GsIncludeQuery): Promise<TopicEntry> {
        throwIfNotDefined(topicId, 'topicId');
        throwIfNotDefined(topic, 'topic');

        const pathParams = {
            topicId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.put({
            path: '/topics/{topicId}',
            pathParams,
            queryParams,
            bodyParam: topic,
            returnType: TopicEntry
        });
    }
}

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

import { GroupBodyCreate, GroupBodyUpdate, GroupEntry, GroupMemberEntry, GroupMemberPaging, GroupMembershipBodyCreate, GroupPaging } from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentIncludeQuery, ContentPagingQuery } from './types';

export interface ListGroupMembershipsOpts {
    /**
     * A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
     * sort the list by one or more fields.
     *
     * Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
     * above to check if any fields used in this method have a descending default search order.
     *
     * To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field
     */
    orderBy?: string[];
    // A string to restrict the returned objects by using a predicate.
    where?: string;
}

export interface GroupPagingOpts {
    /**
     * A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
     * sort the list by one or more fields.
     *
     * Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
     * above to check if any fields used in this method have a descending default search order.
     *
     * To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
     */
    orderBy?: string[];
    /**
     * A string to restrict the returned objects by using a predicate.
     */
    where?: string;
}

export type DeleteGroupOpts = { cascade?: boolean };

/**
 * Groups service.
 */
export class GroupsApi extends BaseApi {
    /**
     * Create a group
     *
     * **Note:** this endpoint is available in Alfresco 5.2.1 and newer versions.
     *
     * Create a group.
     *
     * The group id must start with \"GROUP\\_\". If this is omitted it will be added automatically.
     * This format is also returned when listing groups or group memberships. It should be noted
     * that the other group-related operations also expect the id to start with \"GROUP\\_\".
     *
     * If one or more parentIds are specified then the group will be created and become a member of each of the specified parent groups.
     * If no parentIds are specified then the group will be created as a root group.
     * The group will be created in the **APP.DEFAULT** and **AUTH.ALF** zones.
     *
     * You must have admin rights to create a group.
     * @param groupBodyCreate The group to create.
     * @param opts Optional parameters
     * @returns Promise<GroupEntry>
     */
    createGroup(groupBodyCreate: GroupBodyCreate, opts?: ContentIncludeQuery & ContentFieldsQuery): Promise<GroupEntry> {
        throwIfNotDefined(groupBodyCreate, 'groupBodyCreate');

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/groups',
            queryParams,
            bodyParam: groupBodyCreate
        });
    }

    /**
     * Create a group membership
     *
     * **Note:** this endpoint is available in Alfresco 5.2.1 and newer versions.
     *
     * Create a group membership (for an existing person or group) within a group **groupId**.
     * If the added group was previously a root group then it becomes a non-root group since it now has a parent.
     * It is an error to specify an **id** that does not exist.
     * You must have admin rights to create a group membership.
     * @param groupId The identifier of a group.
     * @param groupMembershipBodyCreate The group membership to add (person or sub-group).
     * @param opts Optional parameters
     * @returns Promise<GroupMemberEntry>
     */
    createGroupMembership(
        groupId: string,
        groupMembershipBodyCreate: GroupMembershipBodyCreate,
        opts?: ContentFieldsQuery
    ): Promise<GroupMemberEntry> {
        throwIfNotDefined(groupId, 'groupId');
        throwIfNotDefined(groupMembershipBodyCreate, 'groupMembershipBodyCreate');

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/groups/{groupId}/members',
            pathParams: { groupId },
            queryParams,
            bodyParam: groupMembershipBodyCreate
        });
    }

    /**
     * Delete a group
     *
     * **Note:** this endpoint is available in Alfresco 5.2.1 and newer versions.
     *
     * Delete group **groupId**.
     * The option to cascade delete applies this recursively to any hierarchy of group members.
     * In this case, removing a group member does not delete the person or sub-group itself.
     * If a removed sub-group no longer has any parent groups then it becomes a root group.
     * You must have admin rights to delete a group.
     * @param groupId The identifier of a group.
     * @param opts Optional parameters
     * @returns Promise
     */
    deleteGroup(groupId: string, opts?: DeleteGroupOpts): Promise<void> {
        throwIfNotDefined(groupId, 'groupId');
        opts = opts || {};

        const cascadeDelete = opts['cascade'] ? opts['cascade'] : false;

        const pathParams = {
            groupId
        };

        const queryParams = {
            cascade: cascadeDelete
        };

        return this.delete({
            path: '/groups/{groupId}',
            pathParams,
            queryParams
        });
    }

    /**
     * Delete a group membership
     *
     * **Note:** this endpoint is available in Alfresco 5.2.1 and newer versions.
     *
     * Delete group member **groupMemberId** (person or sub-group) from group **groupId**.
     * Removing a group member does not delete the person or sub-group itself.\
     * If a removed sub-group no longer has any parent groups then it becomes a root group.
     * @param groupId The identifier of a group.
     * @param groupMemberId The identifier of a person or group.
     * @returns Promise<{}>
     */
    deleteGroupMembership(groupId: string, groupMemberId: string): Promise<void> {
        throwIfNotDefined(groupId, 'groupId');
        throwIfNotDefined(groupMemberId, 'groupMemberId');

        const pathParams = {
            groupId,
            groupMemberId
        };

        return this.delete({
            path: '/groups/{groupId}/members/{groupMemberId}',
            pathParams
        });
    }

    /**
     * Get group details
     *
     * **Note:** this endpoint is available in Alfresco 5.2.1 and newer versions.
     *
     * Get details for group **groupId**.
     * You can use the **include** parameter to return additional information.
     * @param groupId The identifier of a group.
     * @param opts Optional parameters
     * @returns Promise<GroupEntry>
     */
    getGroup(groupId: string, opts?: ContentIncludeQuery & ContentFieldsQuery): Promise<GroupEntry> {
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            groupId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/groups/{groupId}',
            pathParams,
            queryParams
        });
    }

    /**
     * List memberships of a group
     *
     * **Note:** this endpoint is available in Alfresco 5.2.1 and newer versions.
     *
     * Gets a list of the group memberships for the group **groupId**.
     *
     * You can use the **where** parameter to filter the returned groups by **memberType**.
     * Example to filter by **memberType**, use any one of:
     * - (memberType='GROUP')
     * - (memberType='PERSON')
     *
     * The default sort order for the returned list is for group members to be sorted by ascending displayName.
     * You can override the default by using the **orderBy** parameter. You can specify one of the following fields in the **orderBy** parameter:
     * - id
     * - displayName
     * @param groupId The identifier of a group.
     * @param opts Optional parameters
     * @returns Promise<GroupMemberPaging>
     */
    listGroupMemberships(groupId: string, opts?: ListGroupMembershipsOpts & ContentPagingQuery & ContentFieldsQuery): Promise<GroupMemberPaging> {
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            groupId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            where: opts?.where,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/groups/{groupId}/members',
            pathParams,
            queryParams,
            returnType: GroupMemberPaging
        });
    }

    /**
     * List group memberships
     *
     * **Note:** this endpoint is available in Alfresco 5.2.1 and newer versions.
     * @param personId The identifier of a person.
     * @param opts Optional parameters
     * @param opts.skipCount The number of entities that exist in the collection before those included in this list.
     * If not supplied then the default value is 0. (default to 0)
     * @param opts.maxItems The maximum number of items to return in the list. If not supplied then the default value is 100. (default to 100)
     * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
     * sort the list by one or more fields.
     * Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
     * above to check if any fields used in this method have a descending default search order.
     * To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
     * @param opts.include Returns additional information about the group. The following optional fields can be requested:
     * - parentIds
     * - zones
     * @param opts.where A string to restrict the returned objects by using a predicate.
     * @param opts.fields A list of field names.
     * You can use this parameter to restrict the fields
     * returned within a response if, for example, you want to save on overall bandwidth.
     * The list applies to a returned individual entity or entries within a collection.
     * If the API method also supports the **include** parameter, then the fields specified in the **include**
     * parameter are returned in addition to those specified in the **fields** parameter.
     * @returns Promise<GroupPaging>
     */
    listGroupMembershipsForPerson(
        personId: string,
        opts?: GroupPagingOpts & ContentPagingQuery & ContentIncludeQuery & ContentFieldsQuery
    ): Promise<GroupPaging> {
        throwIfNotDefined(personId, 'personId');

        const pathParams = {
            personId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            include: buildCollectionParam(opts?.include, 'csv'),
            where: opts?.where,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/groups',
            pathParams,
            queryParams,
            returnType: GroupPaging
        });
    }

    /**
     * List groups
     *
     * **Note:** this endpoint is available in Alfresco 5.2.1 and newer versions.
     * @param opts Optional parameters
     * @returns Promise<GroupPaging>
     */
    listGroups(opts?: GroupPagingOpts & ContentPagingQuery & ContentIncludeQuery & ContentFieldsQuery): Promise<GroupPaging> {
        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            include: buildCollectionParam(opts?.include, 'csv'),
            where: opts?.where,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/groups',
            queryParams,
            returnType: GroupPaging
        });
    }

    /**
     * Update group details
     *
     * **Note:** this endpoint is available in Alfresco 5.2.1 and newer versions.
     * You must have admin rights to update a group.
     * @param groupId The identifier of a group.
     * @param groupBodyUpdate The group information to update.
     * @param opts Optional parameters
     * @returns Promise<GroupEntry>
     */
    updateGroup(groupId: string, groupBodyUpdate: GroupBodyUpdate, opts?: ContentIncludeQuery & ContentFieldsQuery): Promise<GroupEntry> {
        throwIfNotDefined(groupId, 'groupId');
        throwIfNotDefined(groupBodyUpdate, 'groupBodyUpdate');

        const pathParams = {
            groupId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/groups/{groupId}',
            pathParams,
            queryParams,
            bodyParam: groupBodyUpdate
        });
    }
}

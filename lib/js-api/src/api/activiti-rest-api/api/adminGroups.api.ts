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
    AbstractGroupRepresentation,
    AddGroupCapabilitiesRepresentation,
    GroupRepresentation,
    LightGroupRepresentation,
    ResultListDataRepresentationLightUserRepresentation
} from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * AdminGroupsApi service.
 */
export class AdminGroupsApi extends BaseApi {
    /**
     * Activate a group
     *
     * @param groupId groupId
     * @return Promise<{ /* empty */ }>
     */
    activate(groupId: number): Promise<any> {
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            groupId
        };

        return this.post({
            path: '/api/enterprise/admin/groups/{groupId}/action/activate',
            pathParams
        });
    }

    /**
     * Add users to a group
     *
     * @param groupId groupId
     * @return Promise<{ /* empty */ }>
     */
    addAllUsersToGroup(groupId: number): Promise<any> {
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            groupId
        };

        return this.post({
            path: '/api/enterprise/admin/groups/{groupId}/add-all-users',
            pathParams
        });
    }

    /**
     * Add capabilities to a group
     *
     * @param groupId groupId
     * @param addGroupCapabilitiesRepresentation addGroupCapabilitiesRepresentation
     * @return Promise<{ /* empty */ }>
     */
    addGroupCapabilities(groupId: number, addGroupCapabilitiesRepresentation: AddGroupCapabilitiesRepresentation): Promise<any> {
        throwIfNotDefined(groupId, 'groupId');
        throwIfNotDefined(addGroupCapabilitiesRepresentation, 'addGroupCapabilitiesRepresentation');

        const pathParams = {
            groupId
        };

        return this.post({
            path: '/api/enterprise/admin/groups/{groupId}/capabilities',
            pathParams,
            bodyParam: addGroupCapabilitiesRepresentation
        });
    }

    /**
     * Add a user to a group
     *
     * @param groupId groupId
     * @param userId userId
     * @return Promise<{ /* empty */ }>
     */
    addGroupMember(groupId: number, userId: number): Promise<any> {
        throwIfNotDefined(groupId, 'groupId');
        throwIfNotDefined(userId, 'userId');

        const pathParams = {
            groupId,
            userId
        };

        return this.post({
            path: '/api/enterprise/admin/groups/{groupId}/members/{userId}',
            pathParams
        });
    }

    /**
     * Get a related group
     *
     * @param groupId groupId
     * @param relatedGroupId relatedGroupId
     * @param type type
     * @return Promise<{ /* empty */ }>
     */
    addRelatedGroup(groupId: number, relatedGroupId: number, type: string): Promise<any> {
        throwIfNotDefined(groupId, 'groupId');
        throwIfNotDefined(relatedGroupId, 'relatedGroupId');
        throwIfNotDefined(type, 'type');

        const pathParams = {
            groupId,
            relatedGroupId
        };

        const queryParams = {
            type
        };

        return this.post({
            path: '/api/enterprise/admin/groups/{groupId}/related-groups/{relatedGroupId}',
            pathParams,
            queryParams
        });
    }

    /**
     * Create a group
     *
     * @param groupRepresentation groupRepresentation
     * @return Promise<GroupRepresentation>
     */
    createNewGroup(groupRepresentation: GroupRepresentation): Promise<GroupRepresentation> {
        throwIfNotDefined(groupRepresentation, 'groupRepresentation');

        return this.post({
            path: '/api/enterprise/admin/groups',
            bodyParam: groupRepresentation,
            returnType: GroupRepresentation
        });
    }

    /**
     * Remove a capability from a group
     *
     * @param groupId groupId
     * @param groupCapabilityId groupCapabilityId
     * @return Promise<{ /* empty */ }>
     */
    deleteGroupCapability(groupId: number, groupCapabilityId: number): Promise<void> {
        throwIfNotDefined(groupId, 'groupId');
        throwIfNotDefined(groupCapabilityId, 'groupCapabilityId');

        const pathParams = {
            groupId,
            groupCapabilityId
        };

        return this.delete({
            path: '/api/enterprise/admin/groups/{groupId}/capabilities/{groupCapabilityId}',
            pathParams
        });
    }

    /**
     * Delete a member from a group
     *
     * @param groupId groupId
     * @param userId userId
     * @return Promise<{ /* empty */ }>
     */
    deleteGroupMember(groupId: number, userId: number): Promise<void> {
        throwIfNotDefined(groupId, 'groupId');
        throwIfNotDefined(userId, 'userId');

        const pathParams = {
            groupId,
            userId
        };

        return this.delete({
            path: '/api/enterprise/admin/groups/{groupId}/members/{userId}',
            pathParams
        });
    }

    /**
     * Delete a group
     *
     * @param groupId groupId
     * @return Promise<{ /* empty */ }>
     */
    deleteGroup(groupId: number): Promise<void> {
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            groupId
        };

        return this.delete({
            path: '/api/enterprise/admin/groups/{groupId}',
            pathParams
        });
    }

    /**
     * Delete a related group
     *
     * @param groupId groupId
     * @param relatedGroupId relatedGroupId
     * @return Promise<{ /* empty */ }>
     */
    deleteRelatedGroup(groupId: number, relatedGroupId: number): Promise<void> {
        throwIfNotDefined(groupId, 'groupId');
        throwIfNotDefined(relatedGroupId, 'relatedGroupId');

        const pathParams = {
            groupId,
            relatedGroupId
        };

        return this.delete({
            path: '/api/enterprise/admin/groups/{groupId}/related-groups/{relatedGroupId}',
            pathParams
        });
    }

    /**
     * List group capabilities
     *
     * @param groupId groupId
     * @return Promise<string>
     */
    getCapabilities(groupId: number): Promise<string> {
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            groupId
        };

        return this.get({
            path: '/api/enterprise/admin/groups/{groupId}/potential-capabilities',
            pathParams
        });
    }

    /**
     * Get group members
     *
     * @param groupId groupId
     * @param opts Optional parameters
     * @return Promise<ResultListDataRepresentationLightUserRepresentation>
     */
    getGroupUsers(
        groupId: number,
        opts?: { filter?: string; page?: number; pageSize?: number }
    ): Promise<ResultListDataRepresentationLightUserRepresentation> {
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            groupId
        };

        return this.get({
            path: '/api/enterprise/admin/groups/{groupId}/users',
            pathParams,
            queryParams: opts
        });
    }

    /**
     * Get a group
     *
     * @param groupId groupId
     * @param opts Optional parameters
     * @return Promise<AbstractGroupRepresentation>
     */
    getGroup(groupId: number, opts?: { includeAllUsers?: boolean; summary?: boolean }): Promise<AbstractGroupRepresentation> {
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            groupId
        };

        return this.get({
            path: '/api/enterprise/admin/groups/{groupId}',
            pathParams,
            queryParams: opts
        });
    }

    /**
     * Query groups
     *
     * @param opts Optional parameters
     * @return Promise<LightGroupRepresentation>
     */
    getGroups(opts?: { tenantId?: number; functional?: boolean; summary?: boolean }): Promise<LightGroupRepresentation> {
        return this.get({
            path: '/api/enterprise/admin/groups',
            queryParams: opts
        });
    }

    /**
     * Get related groups
     *
     * @param groupId groupId
     * @return Promise<LightGroupRepresentation>
     */
    getRelatedGroups(groupId: number): Promise<LightGroupRepresentation> {
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            groupId
        };

        return this.get({
            path: '/api/enterprise/admin/groups/{groupId}/related-groups',
            pathParams
        });
    }

    /**
     * Update a group
     *
     * @param groupId groupId
     * @param groupRepresentation groupRepresentation
     * @return Promise<GroupRepresentation>
     */
    updateGroup(groupId: number, groupRepresentation: GroupRepresentation): Promise<GroupRepresentation> {
        throwIfNotDefined(groupId, 'groupId');
        throwIfNotDefined(groupRepresentation, 'groupRepresentation');

        const pathParams = {
            groupId
        };

        return this.put({
            path: '/api/enterprise/admin/groups/{groupId}',
            pathParams,
            bodyParam: groupRepresentation,
            returnType: GroupRepresentation
        });
    }
}

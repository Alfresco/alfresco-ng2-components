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

import { AuditApp } from '../model/auditApp';
import { AuditAppPaging } from '../model/auditAppPaging';
import { AuditBodyUpdate } from '../model/auditBodyUpdate';
import { AuditEntryEntry } from '../model/auditEntryEntry';
import { AuditEntryPaging } from '../model/auditEntryPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentIncludeQuery, ContentPagingQuery } from './types';

/**
 * Audit service.
 * @module AuditApi
 */
export class AuditApi extends BaseApi {
    /**
    * Permanently delete audit entries for an audit application
    *
    * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.

Permanently delete audit entries for an audit application **auditApplicationId**.

The **where** clause must be specified, either with an inclusive time period or for
an inclusive range of ids. The delete is within the context of the given audit application.

For example:

*   where=(createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00' , '2017-06-04T10:05:16.536+01:00')
*   where=(id BETWEEN ('1234', '4321')

You must have admin rights to delete audit information.

    *
    * @param auditApplicationId The identifier of an audit application.
    * @param where Audit entries to permanently delete for an audit application, given an inclusive time period or range of ids. For example:

*   where=(createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00' , '2017-06-04T10:05:16.536+01:00')
*   where=(id BETWEEN ('1234', '4321')

    * @return Promise<{}>
    */
    deleteAuditEntriesForAuditApp(auditApplicationId: string, where: string): Promise<void> {
        throwIfNotDefined(auditApplicationId, 'auditApplicationId');
        throwIfNotDefined(where, 'where');

        const pathParams = {
            auditApplicationId
        };

        const queryParams = {
            where
        };

        return this.delete({
            path: '/audit-applications/{auditApplicationId}/audit-entries',
            pathParams,
            queryParams
        });
    }

    /**
     * Permanently delete an audit entry
     *
     * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.
     * You must have admin rights to delete audit information.
     *
     * @param auditApplicationId The identifier of an audit application.
     * @param auditEntryId The identifier of an audit entry.
     * @return Promise<{}>
     */
    deleteAuditEntry(auditApplicationId: string, auditEntryId: string): Promise<void> {
        throwIfNotDefined(auditApplicationId, 'auditApplicationId');
        throwIfNotDefined(auditEntryId, 'auditEntryId');

        const pathParams = {
            auditApplicationId,
            auditEntryId
        };

        return this.delete({
            path: '/audit-applications/{auditApplicationId}/audit-entries/{auditEntryId}',
            pathParams
        });
    }

    /**
     * Get audit application info
     *
     * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.
     * You must have admin rights to retrieve audit information.
     *
     * You can use the **include** parameter to return the minimum and/or maximum audit record id for the application.
     *
     * @param auditApplicationId The identifier of an audit application.
     * @param opts Optional parameters
     * @return Promise<AuditApp>
     */
    getAuditApp(auditApplicationId: string, opts?: ContentFieldsQuery & ContentIncludeQuery): Promise<AuditApp> {
        throwIfNotDefined(auditApplicationId, 'auditApplicationId');

        const pathParams = {
            auditApplicationId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv'),
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.get({
            path: '/audit-applications/{auditApplicationId}',
            pathParams,
            queryParams,
            returnType: AuditApp
        });
    }

    /**
     * Get audit entry
     *
     * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.
     * You must have admin rights to access audit information.
     *
     * @param auditApplicationId The identifier of an audit application.
     * @param auditEntryId The identifier of an audit entry.
     * @param opts Optional parameters
     * @return Promise<AuditEntryEntry>
     */
    getAuditEntry(auditApplicationId: string, auditEntryId: string, opts?: ContentFieldsQuery): Promise<AuditEntryEntry> {
        throwIfNotDefined(auditApplicationId, 'auditApplicationId');
        throwIfNotDefined(auditEntryId, 'auditEntryId');

        const pathParams = {
            auditApplicationId,
            auditEntryId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/audit-applications/{auditApplicationId}/audit-entries/{auditEntryId}',
            pathParams,
            queryParams,
            returnType: AuditEntryEntry
        });
    }

    /**
     * Gets a list of audit applications in this repository.
     *
     * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.
     *
     * This list may include pre-configured audit applications, if enabled, such as:
     *
     * - alfresco-access
     * - CMISChangeLog
     * - Alfresco Tagging Service
     * - Alfresco Sync Service (used by Enterprise Cloud Sync)
     *
     * You must have admin rights to retrieve audit information.
     *
     * @param opts Optional parameters
     * @return Promise<AuditAppPaging>
     */
    listAuditApps(opts?: ContentPagingQuery & ContentFieldsQuery): Promise<AuditAppPaging> {
        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/audit-applications',
            queryParams,
            returnType: AuditAppPaging
        });
    }

    /**
    * List audit entries for an audit application
    *
    * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.

Gets a list of audit entries for audit application **auditApplicationId**.

You can use the **include** parameter to return additional **values** information.

The list can be filtered by one or more of:
* **createdByUser** person id
* **createdAt** inclusive time period
* **id** inclusive range of ids
* **valuesKey** audit entry values contains the exact matching key
* **valuesValue** audit entry values contains the exact matching value

The default sort order is **createdAt** ascending, but you can use an optional **ASC** or **DESC**
modifier to specify an ascending or descending sort order.

For example, specifying orderBy=createdAt DESC returns audit entries in descending **createdAt** order.

You must have admin rights to retrieve audit information.

    *
    * @param auditApplicationId The identifier of an audit application.
    * @param opts Optional parameters
    * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
sort the list by one or more fields.

Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
above to check if any fields used in this method have a descending default search order.

To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.

    * @param opts.where Optionally filter the list. Here are some examples:

*   where=(createdByUser='jbloggs')

*   where=(id BETWEEN ('1234', '4321')

*   where=(createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00' , '2017-06-04T10:05:16.536+01:00')

*   where=(createdByUser='jbloggs' and createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00' , '2017-06-04T10:05:16.536+01:00')

*   where=(valuesKey='/alfresco-access/login/user')

*   where=(valuesKey='/alfresco-access/transaction/action' and valuesValue='DELETE')
    * @return Promise<AuditEntryPaging>
    */
    listAuditEntriesForAuditApp(
        auditApplicationId: string,
        opts?: {
            where?: string;
            orderBy?: string[];
        } & ContentPagingQuery &
            ContentFieldsQuery &
            ContentIncludeQuery
    ): Promise<AuditEntryPaging> {
        throwIfNotDefined(auditApplicationId, 'auditApplicationId');
        opts = opts || {};

        const pathParams = {
            auditApplicationId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            maxItems: opts?.maxItems,
            where: opts?.where,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/audit-applications/{auditApplicationId}/audit-entries',
            pathParams,
            queryParams,
            returnType: AuditEntryPaging
        });
    }

    /**
    * List audit entries for a node
    *
    * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.

Gets a list of audit entries for node **nodeId**.

The list can be filtered by **createdByUser** and for a given inclusive time period.

The default sort order is **createdAt** ascending, but you can use an optional **ASC** or **DESC**
modifier to specify an ascending or descending sort order.

For example, specifying orderBy=createdAt DESC returns audit entries in descending **createdAt** order.

This relies on the pre-configured 'alfresco-access' audit application.

    *
    * @param nodeId The identifier of a node.
    * @param opts Optional parameters
    * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
sort the list by one or more fields.

Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
above to check if any fields used in this method have a descending default search order.

To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.

    * @param opts.where Optionally filter the list. Here are some examples:

*   where=(createdByUser='-me-')

*   where=(createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00' , '2017-06-04T10:05:16.536+01:00')

*   where=(createdByUser='jbloggs' and createdAt BETWEEN ('2017-06-02T12:13:51.593+01:00' , '2017-06-04T10:05:16.536+01:00')
    * @return Promise<AuditEntryPaging>
    */
    listAuditEntriesForNode(
        nodeId: string,
        opts?: {
            orderBy?: string[];
            where?: string;
        } & ContentPagingQuery &
            ContentIncludeQuery &
            ContentFieldsQuery
    ): Promise<AuditEntryPaging> {
        throwIfNotDefined(nodeId, 'nodeId');
        opts = opts || {};

        const pathParams = {
            nodeId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            maxItems: opts?.maxItems,
            where: opts?.where,
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/audit-entries',
            pathParams,
            queryParams,
            returnType: AuditEntryPaging
        });
    }
    /**
    * Update audit application info
    *
    * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.

Disable or re-enable the audit application **auditApplicationId**.

New audit entries will not be created for a disabled audit application until
it is re-enabled (and system-wide auditing is also enabled).

Note, it is still possible to query &/or delete any existing audit entries even
if auditing is disabled for the audit application.

You must have admin rights to update audit application.

    *
    * @param auditApplicationId The identifier of an audit application.
    * @param auditAppBodyUpdate The audit application to update.
    * @param opts Optional parameters
    * @return Promise<AuditApp>
    */
    updateAuditApp(auditApplicationId: string, auditAppBodyUpdate: AuditBodyUpdate, opts?: ContentFieldsQuery): Promise<AuditApp> {
        throwIfNotDefined(auditApplicationId, 'auditApplicationId');
        throwIfNotDefined(auditAppBodyUpdate, 'auditAppBodyUpdate');

        const pathParams = {
            auditApplicationId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/audit-applications/{auditApplicationId}',
            pathParams,
            queryParams,
            bodyParam: auditAppBodyUpdate,
            returnType: AuditApp
        });
    }
}

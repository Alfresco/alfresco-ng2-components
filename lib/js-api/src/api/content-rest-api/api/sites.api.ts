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

import { SiteBodyCreate } from '../model/siteBodyCreate';
import { SiteBodyUpdate } from '../model/siteBodyUpdate';
import { SiteContainerEntry } from '../model/siteContainerEntry';
import { SiteContainerPaging } from '../model/siteContainerPaging';
import { SiteEntry } from '../model/siteEntry';
import { SiteMemberEntry } from '../model/siteMemberEntry';
import { SiteMemberPaging } from '../model/siteMemberPaging';
import { SiteMembershipBodyCreate } from '../model/siteMembershipBodyCreate';
import { SiteMembershipBodyUpdate } from '../model/siteMembershipBodyUpdate';
import { SiteMembershipRequestBodyCreate } from '../model/siteMembershipRequestBodyCreate';
import { SiteMembershipRequestBodyUpdate } from '../model/siteMembershipRequestBodyUpdate';
import { SiteMembershipRequestEntry } from '../model/siteMembershipRequestEntry';
import { SiteMembershipRequestPaging } from '../model/siteMembershipRequestPaging';
import { SiteMembershipRequestWithPersonPaging } from '../model/siteMembershipRequestWithPersonPaging';
import { SitePaging } from '../model/sitePaging';
import { SiteRoleEntry } from '../model/siteRoleEntry';
import { SiteRolePaging } from '../model/siteRolePaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { SiteGroupEntry } from '../model/siteGroupEntry';
import { SiteGroupPaging } from '../model/siteGroupPaging';
import { ContentFieldsQuery, ContentPagingQuery } from './types';

/**
 * Sites service.
 * @module SitesApi
 */
export class SitesApi extends BaseApi {
    /**
     * Approve a site membership request
     *
     * @param siteId The identifier of a site.
     * @param inviteeId The invitee username.
     * @param opts Optional parameters
     * @param opts.siteMembershipApprovalBody Accepting a request to join, optionally, allows assignment of a role to the user.
     * @return Promise<{}>
     */
    approveSiteMembershipRequest(siteId: string, inviteeId: string, opts?: { siteMembershipApprovalBody?: any }): Promise<any> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(inviteeId, 'inviteeId');

        const postBody = opts?.siteMembershipApprovalBody;

        const pathParams = {
            siteId,
            inviteeId
        };

        return this.post({
            path: '/sites/{siteId}/site-membership-requests/{inviteeId}/approve',
            pathParams,
            bodyParam: postBody
        });
    }
    /**
    * Create a site
    *
    * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Creates a default site with the given details.  Unless explicitly specified, the site id will be generated
from the site title. The site id must be unique and only contain alphanumeric and/or dash characters.

Note: the id of a site cannot be updated once the site has been created.

For example, to create a public site called \"Marketing\" the following body could be used:
JSON
{
  \"title\": \"Marketing\",
  \"visibility\": \"PUBLIC\"
}

The creation of the (surf) configuration files required by Share can be skipped via the **skipConfiguration** query parameter.

**Note:** if skipped then such a site will **not** work within Share.

The addition of the site to the user's site favorites can be skipped via the **skipAddToFavorites** query parameter.

The creator will be added as a member with Site Manager role.

When you create a site, a container called **documentLibrary** is created for you in the new site.
This container is the root folder for content stored in the site.

    *
    * @param siteBodyCreate The site details
    * @param opts Optional parameters
    * @param opts.skipConfiguration Flag to indicate whether the Share-specific (surf) configuration files for the site should not be created. (default to false)
    * @param opts.skipAddToFavorites Flag to indicate whether the site should not be added to the user's site favorites. (default to false)
    * @param opts.fields A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

    * @return Promise<SiteEntry>
    */
    createSite(siteBodyCreate: SiteBodyCreate, opts?: { skipConfiguration?: boolean; skipAddToFavorites?: boolean; fields?: string[] }): Promise<SiteEntry> {
        throwIfNotDefined(siteBodyCreate, 'siteBodyCreate');
        opts = opts || {};

        const queryParams = {
            skipConfiguration: opts?.skipConfiguration,
            skipAddToFavorites: opts?.skipAddToFavorites,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/sites',
            queryParams,
            bodyParam: siteBodyCreate,
            returnType: SiteEntry
        });
    }

    /**
    * Create a site membership
    *
    * Creates a site membership for person **personId** on site **siteId**.

You can set the **role** to one of four types:

* SiteConsumer
* SiteCollaborator
* SiteContributor
* SiteManager

**Note:** You can create more than one site membership by
specifying a list of people in the JSON body like this:

JSON
[
  {
    \"role\": \"SiteConsumer\",
    \"id\": \"joe\"
  },
  {
    \"role\": \"SiteConsumer\",
    \"id\": \"fred\"
  }
]

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

JSON
{
  \"list\": {
    \"pagination\": {
      \"count\": 2,
      \"hasMoreItems\": false,
      \"totalItems\": 2,
      \"skipCount\": 0,
      \"maxItems\": 100
    },
    \"entries\": [
      {
        \"entry\": {
          ...
        }
      },
      {
        \"entry\": {
          ...
        }
      }
    ]
  }
}

    *
    * @param siteId The identifier of a site.
    * @param siteMembershipBodyCreate The person to add and their role
    * @param opts Optional parameters
    * @param opts.fields A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

    * @return Promise<SiteMemberEntry>
    */
    createSiteMembership(siteId: string, siteMembershipBodyCreate: SiteMembershipBodyCreate, opts?: { fields?: string[] }): Promise<SiteMemberEntry> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(siteMembershipBodyCreate, 'siteMembershipBodyCreate');

        const pathParams = {
            siteId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/sites/{siteId}/members',
            pathParams,
            queryParams,
            bodyParam: siteMembershipBodyCreate,
            returnType: SiteMemberEntry
        });
    }

    /**
    * Create a site membership request
    *
    * Create a site membership request for yourself on the site with the identifier of **id**, specified in the JSON body.
The result of the request differs depending on the type of site.

* For a **public** site, you join the site immediately as a SiteConsumer.
* For a **moderated** site, your request is added to the site membership request list. The request waits for approval from the Site Manager.
* You cannot request membership of a **private** site. Members are invited by the site administrator.

You can use the -me- string in place of <personId> to specify the currently authenticated user.

 **Note:** You can create site membership requests for more than one site by
specifying a list of sites in the JSON body like this:

JSON
[
  {
    \"message\": \"Please can you add me\",
    \"id\": \"test-site-1\",
    \"title\": \"Request for test site 1\",
  },
  {
    \"message\": \"Please can you add me\",
    \"id\": \"test-site-2\",
    \"title\": \"Request for test site 2\",
  }
]

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

JSON
{
  \"list\": {
    \"pagination\": {
      \"count\": 2,
      \"hasMoreItems\": false,
      \"totalItems\": 2,
      \"skipCount\": 0,
      \"maxItems\": 100
    },
    \"entries\": [
      {
        \"entry\": {
          ...
        }
      },
      {
        \"entry\": {
          ...
        }
      }
    ]
  }
}

    *
    * @param personId The identifier of a person.
    * @param siteMembershipRequestBodyCreate Site membership request details
    * @param opts Optional parameters
    * @return Promise<SiteMembershipRequestEntry>
    */
    createSiteMembershipRequestForPerson(
        personId: string,
        siteMembershipRequestBodyCreate: SiteMembershipRequestBodyCreate,
        opts?: ContentFieldsQuery
    ): Promise<SiteMembershipRequestEntry> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(siteMembershipRequestBodyCreate, 'siteMembershipRequestBodyCreate');

        const pathParams = {
            personId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/people/{personId}/site-membership-requests',
            pathParams,
            queryParams,
            bodyParam: siteMembershipRequestBodyCreate,
            returnType: SiteMembershipRequestEntry
        });
    }

    /**
     * Delete a site
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * @param siteId The identifier of a site.
     * @param opts Optional parameters
     * @param opts.permanent Flag to indicate whether the site should be permanently deleted i.e. bypass the trashcan. (default to false)
     * @return Promise<{}>
     */
    deleteSite(siteId: string, opts?: { permanent?: boolean }): Promise<void> {
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            siteId
        };

        const queryParams = {
            permanent: opts?.permanent
        };

        return this.delete({
            path: '/sites/{siteId}',
            pathParams,
            queryParams
        });
    }

    /**
     * Delete a site membership
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param siteId The identifier of a site.
     * @param personId The identifier of a person.
     * @return Promise<{}>
     */
    deleteSiteMembership(siteId: string, personId: string): Promise<void> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(personId, 'personId');

        const pathParams = {
            siteId,
            personId
        };

        return this.delete({
            path: '/sites/{siteId}/members/{personId}',
            pathParams
        });
    }

    /**
     * Delete a site membership
     *
     * Deletes person **personId** as a member of site **siteId**.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param siteId The identifier of a site.
     * @return Promise<{}>
     */
    deleteSiteMembershipForPerson(personId: string, siteId: string): Promise<void> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            personId,
            siteId
        };

        return this.delete({
            path: '/people/{personId}/sites/{siteId}',
            pathParams
        });
    }

    /**
     * Delete a site membership request
     *
     * Deletes the site membership request to site **siteId** for person **personId**.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param siteId The identifier of a site.
     * @return Promise<{}>
     */
    deleteSiteMembershipRequestForPerson(personId: string, siteId: string): Promise<void> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            personId,
            siteId
        };

        return this.delete({
            path: '/people/{personId}/site-membership-requests/{siteId}',
            pathParams
        });
    }

    /**
     * Get a site
     *
     * Gets information for site **siteId**.
     *
     * You can use the **relations** parameter to include one or more related
     * entities in a single response and so reduce network traffic.
     *
     * The entity types in Alfresco are organized in a tree structure.
     * The **sites** entity has two children, **containers** and **members**.
     * The following relations parameter returns all the container and member
     * objects related to the site **siteId**:
     *
     * containers,members
     *
     * @param siteId The identifier of a site.
     * @param opts Optional parameters
     * @param opts.relations Use the relations parameter to include one or more related entities in a single response.
     * @return Promise<SiteEntry>
     */
    getSite(siteId: string, opts?: { relations?: string[] } & ContentFieldsQuery): Promise<SiteEntry> {
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            siteId
        };

        const queryParams = {
            relations: buildCollectionParam(opts?.relations, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/sites/{siteId}',
            pathParams,
            queryParams,
            returnType: SiteEntry
        });
    }

    /**
     * Get a site container
     *
     * Gets information on the container **containerId** in site **siteId**.
     *
     * @param siteId The identifier of a site.
     * @param containerId The unique identifier of a site container.
     * @param opts Optional parameters
     * @return Promise<SiteContainerEntry>
     */
    getSiteContainer(siteId: string, containerId: string, opts?: ContentFieldsQuery): Promise<SiteContainerEntry> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(containerId, 'containerId');

        const pathParams = {
            siteId,
            containerId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/sites/{siteId}/containers/{containerId}',
            pathParams,
            queryParams,
            returnType: SiteContainerEntry
        });
    }

    /**
     * Get a site membership
     *
     * Gets site membership information for person **personId** on site **siteId**.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param siteId The identifier of a site.
     * @param personId The identifier of a person.
     * @param opts Optional parameters
     * @return Promise<SiteMemberEntry>
     */
    getSiteMembership(siteId: string, personId: string, opts?: ContentFieldsQuery): Promise<SiteMemberEntry> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(personId, 'personId');

        const pathParams = {
            siteId,
            personId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/sites/{siteId}/members/{personId}',
            pathParams,
            queryParams,
            returnType: SiteMemberEntry
        });
    }

    /**
     * Get a site membership
     *
     * Gets site membership information for person **personId** on site **siteId**.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param siteId The identifier of a site.
     * @return Promise<SiteRoleEntry>
     */
    getSiteMembershipForPerson(personId: string, siteId: string): Promise<SiteRoleEntry> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            personId,
            siteId
        };

        return this.get({
            path: '/people/{personId}/sites/{siteId}',
            pathParams,
            returnType: SiteRoleEntry
        });
    }

    /**
     * Get a site membership request
     *
     * Gets the site membership request for site **siteId** for person **personId**, if one exists.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param siteId The identifier of a site.
     * @param opts Optional parameters
     * @return Promise<SiteMembershipRequestEntry>
     */
    getSiteMembershipRequestForPerson(personId: string, siteId: string, opts?: ContentFieldsQuery): Promise<SiteMembershipRequestEntry> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            personId,
            siteId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/site-membership-requests/{siteId}',
            pathParams,
            queryParams,
            returnType: SiteMembershipRequestEntry
        });
    }

    /**
     * Get site membership requests
     *
     * You can use the **where** parameter to filter the returned site membership requests by **siteId**. For example:
     *
     * (siteId=mySite)
     *
     * The **where** parameter can also be used to filter by ***personId***. For example:
     *
     * where=(personId=person)
     *
     * This may be combined with the siteId filter, as shown below:
     *
     * where=(siteId=mySite AND personId=person))
     *
     * @param opts Optional parameters
     * @param opts.where A string to restrict the returned objects by using a predicate.
     * @return Promise<SiteMembershipRequestWithPersonPaging>
     */
    getSiteMembershipRequests(opts?: { where?: string } & ContentPagingQuery & ContentFieldsQuery): Promise<SiteMembershipRequestWithPersonPaging> {
        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            where: opts?.where,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/site-membership-requests',
            queryParams,
            returnType: SiteMembershipRequestWithPersonPaging
        });
    }

    /**
     * List site containers
     *
     * Gets a list of containers for the site **siteId**.
     *
     * @param siteId The identifier of a site.
     * @param opts Optional parameters
     * @return Promise<SiteContainerPaging>
     */
    listSiteContainers(siteId: string, opts?: ContentPagingQuery & ContentFieldsQuery): Promise<SiteContainerPaging> {
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            siteId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/sites/{siteId}/containers',
            pathParams,
            queryParams,
            returnType: SiteContainerPaging
        });
    }

    /**
     * List site membership requests
     *
     * Gets a list of the current site membership requests for person **personId**.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param opts Optional parameters
     * @return Promise<SiteMembershipRequestPaging>
     */
    listSiteMembershipRequestsForPerson(personId: string, opts?: ContentPagingQuery & ContentFieldsQuery): Promise<SiteMembershipRequestPaging> {
        throwIfNotDefined(personId, 'personId');

        const pathParams = {
            personId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/site-membership-requests',
            pathParams,
            queryParams,
            returnType: SiteMembershipRequestPaging
        });
    }

    /**
     * List site memberships
     *
     * Gets a list of site memberships for site **siteId**.
     *
     * @param siteId The identifier of a site.
     * @param opts Optional parameters
     * @return Promise<SiteMemberPaging>
     */
    listSiteMemberships(siteId: string, opts?: { where?: string } & ContentPagingQuery & ContentFieldsQuery): Promise<SiteMemberPaging> {
        throwIfNotDefined(siteId, 'siteId');

        opts = opts || {};

        const pathParams = {
            siteId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            where: opts?.where,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/sites/{siteId}/members',
            pathParams,
            queryParams,
            returnType: SiteMemberPaging
        });
    }

    /**
    * List site memberships
    *
    * Gets a list of site membership information for person **personId**.
    * You can use the -me- string in place of <personId> to specify the currently authenticated user.
    *
    * You can use the **where** parameter to filter the returned sites by **visibility** or site **preset**.
    *
    * Example to filter by **visibility**, use any one of:
    * - (visibility='PRIVATE')
    * - (visibility='PUBLIC')
    * - (visibility='MODERATED')
    *
    * Example to filter by site **preset**:
    *
    * (preset='site-dashboard')
    *
    * The default sort order for the returned list is for sites to be sorted by ascending title.
    * You can override the default by using the **orderBy** parameter. You can specify one or more of the following fields in the **orderBy** parameter:
    * - id
    * - title
    * - role
    *
    * @param personId The identifier of a person.
    * @param opts Optional parameters
    * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
sort the list by one or more fields.

Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
above to check if any fields used in this method have a descending default search order.

To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.

    * @param opts.relations Use the relations parameter to include one or more related entities in a single response.
    * @param opts.where A string to restrict the returned objects by using a predicate.
    * @return Promise<SiteRolePaging>
    */
    listSiteMembershipsForPerson(
        personId: string,
        opts?: { where?: string; orderBy?: string[]; relations?: string[] } & ContentPagingQuery & ContentFieldsQuery
    ): Promise<SiteRolePaging> {
        throwIfNotDefined(personId, 'personId');
        opts = opts || {};

        const pathParams = {
            personId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            relations: buildCollectionParam(opts?.relations, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv'),
            where: opts?.where
        };

        return this.get({
            path: '/people/{personId}/sites',
            pathParams,
            queryParams,
            returnType: SiteRolePaging
        });
    }

    /**
    * List sites
    *
    * Gets a list of sites in this repository.
    *
    * You can use the **where** parameter to filter the returned sites by **visibility** or site **preset**.
    *
    * Example to filter by **visibility**, use any one of:
    *
    * (visibility='PRIVATE')
    * (visibility='PUBLIC')
    * (visibility='MODERATED')
    *
    * Example to filter by site **preset**:
    *
    * (preset='site-dashboard')
    *
    * The default sort order for the returned list is for sites to be sorted by ascending title.
    * You can override the default by using the **orderBy** parameter. You can specify one or more of the following fields in the **orderBy** parameter:
    * id
    * title
    * description
    *
    * You can use the **relations** parameter to include one or more related
    * entities in a single response and so reduce network traffic.
    *
    * The entity types in Alfresco are organized in a tree structure.
    * The **sites** entity has two children, **containers** and **members**.
    * The following relations parameter returns all the container and member
    * objects related to each site:
    *
    * containers,members
    *
    *
    * @param opts Optional parameters
    * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
sort the list by one or more fields.

Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
above to check if any fields used in this method have a descending default search order.

To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.

    * @param opts.relations Use the relations parameter to include one or more related entities in a single response.
    * @param opts.where A string to restrict the returned objects by using a predicate.
    * @return Promise<SitePaging>
    */
    listSites(
        opts?: {
            orderBy?: string[];
            relations?: string[];
            where?: string;
        } & ContentPagingQuery &
            ContentFieldsQuery
    ): Promise<SitePaging> {
        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            relations: buildCollectionParam(opts?.relations, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv'),
            where: opts?.where
        };

        return this.get({
            path: '/sites',
            queryParams,
            returnType: SitePaging
        });
    }

    /**
     * Reject a site membership request
     *
     * @param siteId The identifier of a site.
     * @param inviteeId The invitee username.
     * @param opts Optional parameters
     * @param opts.siteMembershipRejectionBody Rejecting a request to join, optionally, allows the inclusion of comment.
     * @return Promise<{}>
     */
    rejectSiteMembershipRequest(siteId: string, inviteeId: string, opts?: { siteMembershipRejectionBody?: any }): Promise<any> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(inviteeId, 'inviteeId');

        const postBody = opts?.siteMembershipRejectionBody;

        const pathParams = {
            siteId,
            inviteeId
        };

        return this.post({
            path: '/sites/{siteId}/site-membership-requests/{inviteeId}/reject',
            pathParams,
            bodyParam: postBody
        });
    }

    /**
     * Update a site
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Update the details for the given site **siteId**. Site Manager or otherwise a
     * (site) admin can update title, description or visibility.
     *
     * Note: the id of a site cannot be updated once the site has been created.
     *
     * @param siteId The identifier of a site.
     * @param siteBodyUpdate The site information to update.
     * @param opts Optional parameters
     * @return Promise<SiteEntry>
     */
    updateSite(siteId: string, siteBodyUpdate: SiteBodyUpdate, opts?: ContentFieldsQuery): Promise<SiteEntry> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(siteBodyUpdate, 'siteBodyUpdate');

        opts = opts || {};

        const pathParams = {
            siteId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/sites/{siteId}',
            pathParams,
            queryParams,
            bodyParam: siteBodyUpdate,
            returnType: SiteEntry
        });
    }

    /**
     * Update a site membership
     *
     * Update the membership of person **personId** in site **siteId**.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     * You can set the **role** to one of four types:
     * - SiteConsumer
     * - SiteCollaborator
     * - SiteContributor
     * - SiteManager
     *
     * @param siteId The identifier of a site.
     * @param personId The identifier of a person.
     * @param siteMembershipBodyUpdate The persons new role
     * @param opts Optional parameters
     * @return Promise<SiteMemberEntry>
     */
    updateSiteMembership(siteId: string, personId: string, siteMembershipBodyUpdate: SiteMembershipBodyUpdate, opts?: ContentFieldsQuery): Promise<SiteMemberEntry> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(siteMembershipBodyUpdate, 'siteMembershipBodyUpdate');

        const pathParams = {
            siteId,
            personId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/sites/{siteId}/members/{personId}',
            pathParams,
            queryParams,
            bodyParam: siteMembershipBodyUpdate,
            returnType: SiteMemberEntry
        });
    }

    /**
     * Update a site membership request
     *
     * Updates the message for the site membership request to site **siteId** for person **personId**.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param siteId The identifier of a site.
     * @param siteMembershipRequestBodyUpdate The new message to display
     * @param opts Optional parameters
     * @return Promise<SiteMembershipRequestEntry>
     */
    updateSiteMembershipRequestForPerson(
        personId: string,
        siteId: string,
        siteMembershipRequestBodyUpdate: SiteMembershipRequestBodyUpdate,
        opts?: ContentFieldsQuery
    ): Promise<SiteMembershipRequestEntry> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(siteMembershipRequestBodyUpdate, 'siteMembershipRequestBodyUpdate');

        const pathParams = {
            personId,
            siteId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/people/{personId}/site-membership-requests/{siteId}',
            pathParams,
            queryParams,
            bodyParam: siteMembershipRequestBodyUpdate,
            returnType: SiteMembershipRequestEntry
        });
    }

    /**
     * Create a site membership for group
     * Creates a site membership for group **groupId** on site **siteId**.
     *
     **Note:** this endpoint is available in Alfresco 7.0.0 and newer versions.
     * You can set the **role** to one of four types:
     * - SiteConsumer
     * - SiteCollaborator
     * - SiteContributor
     * - SiteManager
     *
     **Note:** You can create more than one site membership by
     specifying a list of group in the JSON body like this:

     ```JSON
     [
     {
             "role": "SiteConsumer",
             "id": "authorityId"
           },
     {
             "role": "SiteConsumer",
             "id": "authorityId"
           }
     ]
     ```
     If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:
     ```JSON
     {
            "list": {
              "pagination": {
                "count": 2,
                "hasMoreItems": false,
                "totalItems": 2,
                "skipCount": 0,
                "maxItems": 100
              },
              "entries": [
                {
                  "entry": {
                    ...
                  }
                },
                {
                  "entry": {
                    ...
                  }
                }
              ]
            }
     }
     *
     * @param siteId The identifier of a site.
     * @param siteMembershipBodyCreate The group to add and it role
     * @param opts Optional parameters
     * @return Promise<SiteGroupEntry>
     */
    createSiteGroupMembership(siteId: string, siteMembershipBodyCreate: SiteMembershipBodyCreate, opts?: ContentFieldsQuery): Promise<SiteGroupEntry> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(siteMembershipBodyCreate, 'siteMembershipBodyCreate');

        const pathParams = {
            siteId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/sites/{siteId}/group-members',
            pathParams,
            queryParams,
            bodyParam: siteMembershipBodyCreate,
            returnType: SiteGroupEntry
        });
    }

    /**
     * List group membership for site
     *
     * **Note:** this endpoint is available in Alfresco 7.0.0 and newer versions.
     *
     * @param siteId The identifier of a site.
     * @param opts Optional parameters
     * @return Promise<SiteGroupPaging>
     */
    listSiteGroups(siteId: string, opts?: ContentPagingQuery & ContentFieldsQuery): Promise<SiteGroupPaging> {
        throwIfNotDefined(siteId, 'siteId');

        const pathParams = {
            siteId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/sites/{siteId}/group-members',
            pathParams,
            queryParams,
            returnType: SiteGroupPaging
        });
    }

    /**
     * Get information about site membership of group
     * *Note:** this endpoint is available in Alfresco 7.0.0 and newer versions.
     * Gets site membership information for group **groupId** on site **siteId**.
     *
     * @param siteId The identifier of a site.
     * @param groupId The authorityId of a group.
     * @param opts Optional parameters
     * @return Promise<SiteGroupEntry>
     */
    getSiteGroupMembership(siteId: string, groupId: string, opts?: ContentFieldsQuery): Promise<SiteGroupEntry> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            siteId,
            groupId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/sites/{siteId}/group-members/{groupId}',
            pathParams,
            queryParams,
            returnType: SiteGroupEntry
        });
    }

    /**
     * Update site membership of group
     *
     * **Note:** this endpoint is available in Alfresco 7.0.0 and newer versions.
     *
     * You can set the **role** to one of four types:
     * - SiteConsumer
     * - SiteCollaborator
     * - SiteContributor
     * - SiteManager
     *
     * @param siteId The identifier of a site.
     * @param groupId The authorityId of a group.
     * @param siteMembershipBodyUpdate The group new role
     * @param opts Optional parameters
     * @return Promise<SiteGroupEntry>
     */
    updateSiteGroupMembership(siteId: string, groupId: string, siteMembershipBodyUpdate: SiteMembershipBodyUpdate, opts?: ContentFieldsQuery): Promise<SiteGroupEntry> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(groupId, 'groupId');
        throwIfNotDefined(siteMembershipBodyUpdate, 'siteMembershipBodyUpdate');

        const pathParams = {
            siteId,
            groupId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/sites/{siteId}/group-members/{groupId}',
            pathParams,
            queryParams,
            bodyParam: siteMembershipBodyUpdate,
            returnType: SiteGroupEntry
        });
    }

    /**
     * Delete a group membership for site
     *
     * @param siteId The identifier of a site.
     * @param groupId The authorityId of a group.
     * @return Promise<{}>
     */
    deleteSiteGroupMembership(siteId: string, groupId: string): Promise<void> {
        throwIfNotDefined(siteId, 'siteId');
        throwIfNotDefined(groupId, 'groupId');

        const pathParams = {
            siteId,
            groupId
        };

        return this.delete({
            path: '/sites/{siteId}/group-members/{groupId}',
            pathParams
        });
    }
}

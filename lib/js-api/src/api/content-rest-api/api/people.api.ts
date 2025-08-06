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

import { ClientBody, PasswordResetBody, PersonBodyCreate, PersonBodyUpdate, PersonEntry, PersonPaging } from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentIncludeQuery, ContentPagingQuery } from './types';

/**
 * People service.
 */
export class PeopleApi extends BaseApi {
    /**
     * Create person
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     * **Note:** setting properties of type d:content and d:category are not supported.
     * @param personBodyCreate The person details.
     * @param opts Optional parameters
     * @returns Promise<PersonEntry>
     */
    createPerson(personBodyCreate: PersonBodyCreate, opts?: ContentFieldsQuery): Promise<PersonEntry> {
        throwIfNotDefined(personBodyCreate, 'personBodyCreate');

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/people',
            queryParams,
            bodyParam: personBodyCreate,
            returnType: PersonEntry
        });
    }

    /**
     * Delete avatar image
     *
     * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.
     *
     * Deletes the avatar image related to person **personId**.
     * You must be the person or have admin rights to update a person's avatar.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     * @param personId The identifier of a person.
     * @returns Promise<{}>
     */
    deleteAvatarImage(personId: string): Promise<void> {
        throwIfNotDefined(personId, 'personId');

        const pathParams = {
            personId
        };

        return this.delete({
            path: '/people/{personId}/avatar',
            pathParams
        });
    }

    /**
     * Get avatar image
     *
     * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.
     *
     * Gets the avatar image related to the person **personId**. If the person has no related avatar then
     * the **placeholder** query parameter can be optionally used to request a placeholder image to be returned.
     *
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     * @param personId The identifier of a person.
     * @param opts Optional parameters
     * @param opts.attachment **true** enables a web browser to download the file as an attachment.
     * **false** means a web browser may preview the file in a new tab or window, but not download the file.
     * You can only set this parameter to **false** if the content type of the file is in the supported list;
     * for example, certain image files and PDF files.
     * If the content type is not supported for preview, then a value of **false**  is ignored, and
     * the attachment will be returned in the response. (default to true)
     * @param opts.ifModifiedSince Only returns the content if it has been modified since the date provided.
     * Use the date format defined by HTTP. For example, Wed, 09 Mar 2016 16:56:34 GMT.
     * @param opts.placeholder If **true** and there is no avatar for this **personId**
     * then the placeholder image is returned, rather than a 404 response. (default to true)
     * @returns Promise<Blob>
     */
    getAvatarImage(personId: string, opts?: { attachment?: boolean; placeholder?: boolean; ifModifiedSince?: string }): Promise<Blob> {
        throwIfNotDefined(personId, 'personId');

        const pathParams = {
            personId
        };

        const queryParams = {
            attachment: opts?.attachment,
            placeholder: opts?.placeholder
        };

        const headerParams = {
            'If-Modified-Since': opts?.ifModifiedSince
        };

        const accepts = ['application/octet-stream'];

        return this.get({
            path: '/people/{personId}/avatar',
            pathParams,
            queryParams,
            headerParams,
            accepts,
            returnType: 'blob'
        });
    }

    /**
     * Get a person
     *
     * You can use the `-me-` string in place of <personId> to specify the currently authenticated user.
     * @param personId The identifier of a person.
     * @param opts Optional parameters
     * @returns Promise<PersonEntry>
     */
    getPerson(personId: string, opts?: ContentFieldsQuery): Promise<PersonEntry> {
        throwIfNotDefined(personId, 'personId');

        const pathParams = {
            personId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}',
            pathParams,
            queryParams,
            returnType: PersonEntry
        });
    }

    /**
     * List people
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * List people.
     *
     * You can use the **include** parameter to return any additional information.
     *
     * The default sort order for the returned list is for people to be sorted by ascending id.
     * You can override the default by using the **orderBy** parameter.
     *
     * You can use any of the following fields to order the results:
     * - id
     * - firstName
     * - lastName
     * @param opts Optional parameters
     * @param opts.orderBy A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
     * sort the list by one or more fields.
     *
     * Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
     * above to check if any fields used in this method have a descending default search order.
     *
     * To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
     * @returns Promise<PersonPaging>
     */
    listPeople(
        opts?: {
            orderBy?: string[];
        } & ContentPagingQuery &
            ContentIncludeQuery &
            ContentFieldsQuery
    ): Promise<PersonPaging> {
        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            orderBy: buildCollectionParam(opts?.orderBy, 'csv'),
            include: buildCollectionParam(opts?.include, 'csv'),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people',
            queryParams,
            returnType: PersonPaging
        });
    }

    /**
     * Request password reset
     *
     * **Note:** this endpoint is available in Alfresco 5.2.1 and newer versions.
     * **Note:** No authentication is required to call this endpoint.
     * @param personId The identifier of a person.
     * @param clientBody The client name to send email with app-specific url.
     * @returns Promise<{}>
     */
    requestPasswordReset(personId: string, clientBody: ClientBody): Promise<any> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(clientBody, 'clientBody');

        const pathParams = {
            personId
        };

        return this.post({
            path: '/people/{personId}/request-password-reset',
            pathParams,
            bodyParam: clientBody
        });
    }

    /**
     * Reset password
     *
     * **Note:** this endpoint is available in Alfresco 5.2.1 and newer versions.
     * **Note:** No authentication is required to call this endpoint.
     * @param personId The identifier of a person.
     * @param passwordResetBody The reset password details
     * @returns Promise<{}>
     */
    resetPassword(personId: string, passwordResetBody: PasswordResetBody): Promise<any> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(passwordResetBody, 'passwordResetBody');

        const pathParams = {
            personId
        };

        return this.post({
            path: '/people/{personId}/reset-password',
            pathParams,
            bodyParam: passwordResetBody
        });
    }

    /**
     * Update avatar image
     *
     * **Note:** this endpoint is available in Alfresco 5.2.2 and newer versions.
     *
     * Updates the avatar image related to the person **personId**.
     *
     * The request body should be the binary stream for the avatar image. The content type of the file
     * should be an image file. This will be used to generate an \"avatar\" thumbnail rendition.
     *
     * You must be the person or have admin rights to update a person's avatar.
     *
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     * @param personId The identifier of a person.
     * @param contentBodyUpdate The binary content
     * @returns Promise<{}>
     */
    updateAvatarImage(personId: string, contentBodyUpdate: string): Promise<any> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(contentBodyUpdate, 'contentBodyUpdate');

        const pathParams = {
            personId
        };

        const contentTypes = ['application/octet-stream'];

        return this.put({
            path: '/people/{personId}/avatar',
            pathParams,
            bodyParam: contentBodyUpdate,
            contentTypes
        });
    }

    /**
     * Get avatar image URL
     *
     * Builds and returns the direct URL to fetch the avatar image for the person `personId`.
     * This includes the current authentication ticket in the URL to allow secure access.
     *
     * You can use the `-me-` string in place of <personId> to specify the currently authenticated user.
     * @param personId The identifier of a person.
     * @returns A string URL to the user's avatar image.
     */
    getAvatarImageUrl(personId: string): string {
        const ticket = this.alfrescoApi.contentClient.getAlfTicket(undefined);
        return `${this.apiClient.basePath}/people/${personId}/avatar?placeholder=true${ticket}`;
    }

    /**
     * Update person
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * You can use the `-me-` string in place of <personId> to specify the currently authenticated user.
     * If applicable, the given person's login access can also be optionally disabled or re-enabled.
     * You must have admin rights to update a person — unless updating your own details.
     * If you are changing your password, as a non-admin user, then the existing password must also
     * be supplied (using the oldPassword field in addition to the new password value).
     *
     * Admin users cannot be disabled by setting enabled to false.
     * Non-admin users may not disable themselves.
     * **Note:** setting properties of type d:content and d:category are not supported.
     * @param personId The identifier of a person.
     * @param personBodyUpdate The person details.
     * @param opts Optional parameters
     * @returns Promise<PersonEntry>
     */
    updatePerson(personId: string, personBodyUpdate: PersonBodyUpdate, opts?: ContentFieldsQuery): Promise<PersonEntry> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(personBodyUpdate, 'personBodyUpdate');

        const pathParams = {
            personId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/people/{personId}',
            pathParams,
            queryParams,
            bodyParam: personBodyUpdate,
            returnType: PersonEntry
        });
    }
}

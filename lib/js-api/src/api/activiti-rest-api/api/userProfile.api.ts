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

import { ChangePasswordRepresentation } from '../model/changePasswordRepresentation';
import { ImageUploadRepresentation } from '../model/imageUploadRepresentation';
import { UserRepresentation } from '../model/userRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
* Userprofile service.
* @module UserprofileApi
*/
export class UserProfileApi extends BaseApi {
    /**
    * Change user password
    *
    *
    *
    * @param changePasswordRepresentation changePasswordRepresentation
    * @return Promise<{}>
    */
    changePassword(changePasswordRepresentation: ChangePasswordRepresentation): Promise<any> {
        throwIfNotDefined(changePasswordRepresentation, 'changePasswordRepresentation');

        return this.post({
            path: '/api/enterprise/profile-password',
            bodyParam: changePasswordRepresentation
        });
    }
    /**
        * Retrieve user profile picture
        *
        * Generally returns an image file
        *
        * @return Promise<Blob>
        */
    getProfilePicture(): Promise<any> {
        return this.get({
            path:  '/api/enterprise/profile-picture',
            accepts: ['application/json', '*/*']
        });
    }

    /**
     * Retrieve user URL profile picture
     * Generally returns an image file
     */
    getProfilePictureUrl() {
        return this.apiClient.basePath + '/app/rest/admin/profile-picture';
    }

    /**
        * Get user profile
        *
        * This operation returns account information for the current user. This is useful to get the name, email, the groups that the user is part of, the user picture, etc.
        *
        * @return Promise<UserRepresentation>
        */
    getProfile(): Promise<UserRepresentation> {
        return this.get({
            path: '/api/enterprise/profile',
            returnType: UserRepresentation
        });
    }
    /**
        * Update user profile
        *
        * Only a first name, last name, email and company can be updated
        *
        * @param userRepresentation userRepresentation
        * @return Promise<UserRepresentation>
        */
    updateProfile(userRepresentation: UserRepresentation): Promise<UserRepresentation> {
        throwIfNotDefined(userRepresentation, 'userRepresentation');

        return this.post({
            path: '/api/enterprise/profile',
            bodyParam: userRepresentation,
            returnType: UserRepresentation
        });
    }
    /**
        * Change user profile picture
        *
        *
        *
        * @param file file
        * @return Promise<ImageUploadRepresentation>
        */
    uploadProfilePicture(file: any): Promise<ImageUploadRepresentation> {
        throwIfNotDefined(file, 'file');

        const formParams = {
            file
        };

        return this.post({
            path: '/api/enterprise/profile-picture',
            formParams,
            returnType:ImageUploadRepresentation
        });
    }

}

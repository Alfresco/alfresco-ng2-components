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

import { ClassDescription } from '../model/classDescription';
import { BaseApi } from './base.api';

/**
 * Constructs a new ClassesApi.
 * @alias module:api/ClassesApi
 * @class
 * @param {module:ApiClient} apiClient Optional API client implementation to use,
 * default to {@link module:ApiClient#instance} if unspecified.
 */
export class ClassesApi extends BaseApi {
    /**
     * Gets the class information for the specified className.
     * @param {String} className The identifier of the class.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/ClassDescription}
     * data is of type: {module:model/ClassDescription}
     */
    getClass(className: string): Promise<ClassDescription> {
        // verify the required parameter 'className' is set
        if (className === undefined || className === null) {
            throw 'Missing param \'className\' in getClass';
        }

        return this.get<ClassDescription>({
            path: '/api/classes/{className}',
            pathParams: { className },
            returnType: ClassDescription,
            contextRoot: this.apiClientPrivate.config.contextRoot + '/s'
        });
    }

    getSubclasses(className: string): Promise<ClassDescription[]> {
        // verify the required parameter 'className' is set
        if (className === undefined || className === null) {
            throw 'Missing param \'className\'';
        }

        return this.get({
            path: `/api/classes/{className}/subclasses`,
            pathParams: { className },
            returnType: ClassDescription,
            contextRoot: this.apiClientPrivate.config.contextRoot + '/s'
        });
    }
}

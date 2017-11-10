/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

/**
 * PaginationQueryParams object is used to emit events regarding pagination having two
 * properties from the Pagination interface found in AlfrescoJS API
 *
 * The two properties are "skipCount" and "maxItems" that are sent as query parameters
 * to server to paginate results
 *
 * @TODO Contribute this to AlfrescoJS API
 */

export interface PaginationQueryParams {
    skipCount: number;
    maxItems: number;
};

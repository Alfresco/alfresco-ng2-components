/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { QueryBody } from '@alfresco/js-api';

export interface SearchConfigurationInterface {

    /**
     * Generates a QueryBody object with custom search parameters.
     * @param searchTerm Term text to search for
     * @param maxResults Maximum number of search results to show in a page
     * @param skipCount The offset of the start of the page within the results list
     * @returns Query body defined by the parameters
     */
    generateQueryBody(searchTerm: string, maxResults: number, skipCount: number): QueryBody;

}

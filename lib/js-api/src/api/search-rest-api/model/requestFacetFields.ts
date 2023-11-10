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

import { RequestFacetField } from './requestFacetField';

/**
 * Simple facet fields to include
The Properties reflect the global properties related to field facts in SOLR.
They are described in detail by the SOLR documentation

 */
export class RequestFacetFields {
    /**
     * Define specific fields on which to facet (adds SOLR facet.field and f.<field>.facet.* options)

     */
    facets?: RequestFacetField[];

    constructor(input?: Partial<RequestFacetFields>) {
        if (input) {
            Object.assign(this, input);
            if (input.facets) {
                this.facets = input.facets.map((item) => {
                    return new RequestFacetField(item);
                });
            }
        }
    }
}

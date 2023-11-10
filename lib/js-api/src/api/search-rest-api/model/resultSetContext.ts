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

import { GenericFacetResponse } from './genericFacetResponse';
import { ResponseConsistency } from './responseConsistency';
import { ResultBuckets } from './resultBuckets';
import { ResultSetContextFacetQueries } from './resultSetContextFacetQueries';
import { ResultSetContextSpellcheck } from './resultSetContextSpellcheck';
import { SearchRequest } from './searchRequest';

/**
 * Context that applies to the whole result set
 */
export class ResultSetContext {
    consistency?: ResponseConsistency;
    request?: SearchRequest;
    /**
     * The counts from facet queries
     */
    facetQueries?: ResultSetContextFacetQueries[];
    /**
     * The counts from field facets
     */
    facetsFields?: ResultBuckets[];
    /**
     * The faceted response
     */
    facets?: GenericFacetResponse[];
    /**
     * Suggested corrections

If zero results were found for the original query then a single entry of type \"searchInsteadFor\" will be returned.
If alternatives were found that return more results than the original query they are returned as \"didYouMean\" options.
The highest quality suggestion is first.

     */
    spellcheck?: ResultSetContextSpellcheck[];

    constructor(input?: Partial<ResultSetContext>) {
        if (input) {
            Object.assign(this, input);
            this.consistency = input.consistency ? new ResponseConsistency(input.consistency) : undefined;
            this.request = input.request ? new SearchRequest(input.request) : undefined;
            if (input.facetQueries) {
                this.facetQueries = input.facetQueries.map((item) => {
                    return new ResultSetContextFacetQueries(item);
                });
            }
            if (input.facetsFields) {
                this.facetsFields = input.facetsFields.map((item) => {
                    return new ResultBuckets(item);
                });
            }
            if (input.facets) {
                this.facets = input.facets.map((item) => {
                    return new GenericFacetResponse(item);
                });
            }
            if (input.spellcheck) {
                this.spellcheck = input.spellcheck.map((item) => {
                    return new ResultSetContextSpellcheck(item);
                });
            }
        }
    }

}

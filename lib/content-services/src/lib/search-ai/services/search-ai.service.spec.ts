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

import { TestBed } from '@angular/core/testing';
import { KnowledgeRetrievalConfigEntry } from '@alfresco/js-api';
import { SearchAiService } from './search-ai.service';

describe('SearchAiService', () => {
    let service: SearchAiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: []
        });
        service = TestBed.inject(SearchAiService);
    });

    describe('getConfig', () => {
        it('should load knowledge retrieval configuration', (done) => {
            const config: KnowledgeRetrievalConfigEntry = {
                entry: {
                    knowledgeRetrievalUrl: 'https://some-url'
                }
            };
            spyOn(service.searchAiApi, 'getConfig').and.returnValue(Promise.resolve(config));

            service.getConfig().subscribe((configResponse) => {
                expect(configResponse).toBe(config);
                expect(service.searchAiApi.getConfig).toHaveBeenCalled();
                done();
            });
        });
    });
});

/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AgentService } from './agent.service';
import { TestBed } from '@angular/core/testing';
import { AgentPaging } from '@alfresco/js-api';
import { ContentTestingModule } from '../../testing/content.testing.module';

describe('AgentService', () => {
    let service: AgentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        service = TestBed.inject(AgentService);
        service.mocked = false;
    });

    describe('getAgents', () => {
        it('should load agents', (done) => {
            const paging: AgentPaging = {
                list: {
                    entries: [
                        {
                            entry: {
                                id: '1',
                                name: 'HR Agent'
                            }
                        },
                        {
                            entry: {
                                id: '2',
                                name: 'Policy Agent'
                            }
                        }
                    ]
                }
            };
            spyOn(service.agentsApi, 'getAgents').and.returnValue(Promise.resolve(paging));

            service.getAgents().subscribe((pagingResponse) => {
                expect(pagingResponse).toBe(paging);
                expect(service.agentsApi.getAgents).toHaveBeenCalled();
                done();
            });
        });
    });
});

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

import { Injectable } from '@angular/core';
import { AgentPaging, AgentsApi } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { from, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AgentService {
    private _agentsApi: AgentsApi;
    private _mocked = true;

    get agentsApi(): AgentsApi {
        this._agentsApi = this._agentsApi ?? new AgentsApi(this.apiService.getInstance());
        return this._agentsApi;
    }

    set mocked(mocked: boolean) {
        this._mocked = mocked;
    }

    constructor(private apiService: AlfrescoApiService) {}

    /**
     * Gets all agents.
     *
     * @returns AgentPaging object containing the agents.
     */
    getAgents(): Observable<AgentPaging> {
        return this._mocked
            ? of({
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
                          },
                          {
                              entry: {
                                  id: '3',
                                  name: 'Rules & Rates Agent'
                              }
                          }
                      ]
                  }
              })
            : from(this.agentsApi.getAgents());
    }
}

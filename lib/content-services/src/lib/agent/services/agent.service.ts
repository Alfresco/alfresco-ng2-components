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
import { AgentPaging, AgentsApi, AgentWithAvatar } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AgentService {
    private _agentsApi: AgentsApi;
    private _mocked = true;
    private agents = new BehaviorSubject<AgentWithAvatar[]>([]);

    get agentsApi(): AgentsApi {
        this._agentsApi = this._agentsApi ?? new AgentsApi(this.apiService.getInstance());
        return this._agentsApi;
    }

    set mocked(mocked: boolean) {
        this._mocked = mocked;
    }

    agents$ = this.agents.asObservable();

    constructor(private apiService: AlfrescoApiService) {}

    /**
     * Gets all agents from cache. If cache is empty, fetches agents from backend.
     *
     * @returns AgentWithAvatar[] list containing agents.
     */
    getAgents(): Observable<AgentWithAvatar[]> {
        return this.agents$.pipe(
            switchMap((agentsList) => {
                if (agentsList.length) {
                    return of(agentsList);
                }
                return this.getMockedAgents().pipe(
                    switchMap((paging) => {
                        const agents = paging.list.entries.map((agentEntry) => agentEntry.entry);
                        return forkJoin([of(agents), ...agents.map((agent) => this.getAgentAvatar(agent.id))]);
                    }),
                    switchMap(([agents, ...avatars]: [AgentWithAvatar[], string]) => {
                        const agentsWithAvatar = agents.map((agent, index) => ({ ...agent, avatar: avatars[index] }));
                        this.agents.next(agentsWithAvatar);
                        return of(agentsWithAvatar);
                    })
                );
            })
        );
    }

    /**
     * Gets all agents.
     *
     * @returns AgentPaging object containing the agents.
     */
    private getMockedAgents(): Observable<AgentPaging> {
        return this._mocked
            ? of({
                  list: {
                      entries: [
                          {
                              entry: {
                                  id: '1',
                                  name: 'HR Agent',
                                  description:
                                      'Your Claims Doc Agent streamlines the extraction, analysis, and management of data from insurance claims documents.'
                              }
                          },
                          {
                              entry: {
                                  id: '2',
                                  name: 'Policy Agent',
                                  description:
                                      'Your Claims Doc Agent streamlines the extraction, analysis, and management of data from insurance claims documents.'
                              }
                          }
                      ]
                  }
              })
            : from(this.agentsApi.getAgents());
    }

    /**
     * Gets agent avatar by agent id.
     *
     * @param agentId agent unique id.
     * @returns string with an image.
     */
    getAgentAvatar(agentId: string): Observable<string> {
        return this._mocked
            ? of('https://res.cloudinary.com/hyld/image/upload/f_auto,c_fill,g_auto,w_1400,h_730/v1/h2/hero/blue-shirt-woman')
            : from(this._agentsApi.getAgentAvatar(agentId));
    }
}

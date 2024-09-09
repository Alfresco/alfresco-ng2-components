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
import { AgentsApi, AgentWithAvatar } from '@alfresco/js-api';
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlfrescoApiService } from '../../services';

@Injectable({
    providedIn: 'root'
})
export class AgentService {
    private _agentsApi: AgentsApi;
    private agents = new BehaviorSubject<AgentWithAvatar[]>([]);

    get agentsApi(): AgentsApi {
        this._agentsApi = this._agentsApi ?? new AgentsApi(this.apiService.getInstance());
        return this._agentsApi;
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
                return from(this.agentsApi.getAgents()).pipe(
                    switchMap((paging) => {
                        const agents = paging.list.entries.map((agentEntry) => agentEntry.entry);
                        // TODO: fetch avatars https://hyland.atlassian.net/browse/ACS-8695
                        return forkJoin({ agents: of(agents), avatars: forkJoin(agents.map(() => of(``))) });
                    }),
                    switchMap(({ agents, avatars }) => {
                        const agentsWithAvatar = agents.map((agent, index) => ({ ...agent, avatar: avatars[index] }));
                        this.agents.next(agentsWithAvatar);
                        return of(agentsWithAvatar);
                    })
                );
            })
        );
    }

    /**
     * Gets agent avatar by agent id.
     *
     * @param agentId agent unique id.
     * @returns string with an image.
     */
    getAgentAvatar(agentId: string): Observable<string> {
        return from(this._agentsApi.getAgentAvatar(agentId));
    }
}

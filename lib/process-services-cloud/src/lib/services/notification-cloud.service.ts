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

import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Apollo } from 'apollo-angular';
import { DocumentNode, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { Injectable } from '@angular/core';
import { StorageService, AppConfigService, AlfrescoApiService, LogService } from '@alfresco/adf-core';
import { BaseCloudService } from './base-cloud.service';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationCloudService extends BaseCloudService {

    currentWebSocketAppName: string = '';

    constructor(apiService: AlfrescoApiService,
                appConfigService: AppConfigService,
                private apollo: Apollo,
                private http: HttpLink,
                private storageService: StorageService,
                private logService: LogService) {
        super(apiService, appConfigService);
    }

    private get urlDomain() {
        return this.getBasePath(this.currentWebSocketAppName).split('://')[1];
    }

    initNotificationsForAppName(appName: string) {
        if (appName && appName !== this.currentWebSocketAppName) {
            this.currentWebSocketAppName = appName;
            const httpLink = this.http.create({
                uri: `${this.getBasePath(appName)}/notifications/graphql`
            });

            const webSocketLink = new WebSocketLink({
                uri: `wss://${this.urlDomain}/notifications/ws/graphql`,
                options: {
                    reconnect: true,
                    lazy: true,
                    connectionParams: {
                        kaInterval: 2000,
                        'X-Authorization': 'Bearer ' + this.storageService.getItem('access_token')
                    }
                }
            });

            const link = split(
                ({ query }) => {
                    const definition = getMainDefinition(query);
                    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
                },
                webSocketLink,
                httpLink
            );

            this.apollo.create(<any> {
                link,
                cache: new InMemoryCache({})
            });
        } else if (!appName) {
            this.logService.error('AppName is mandatory');
            throwError('AppName not configured');
        }
    }

    makeGraphQLQuery(appName: string, query: DocumentNode) {
        this.initNotificationsForAppName(appName);
        return this.apollo.subscribe({ query });
    }
}

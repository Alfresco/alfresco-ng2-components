/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FetchResult, gql } from '@apollo/client/core';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';
@Injectable({
    providedIn: 'root'
})
export class NotificationCloudService {
    private readonly webSocketService = inject(WebSocketService);

    /**
     * Opens a GraphQL subscription over the notifications of an app.
     *
     * @param appName Name of the target app
     * @param gqlQuery Subscription to make
     * @returns Results of the subscription, holding the data the subscription selected
     */
    makeGQLQuery<T = unknown>(appName: string, gqlQuery: string): Observable<FetchResult<T>> {
        return this.webSocketService.getSubscription<T>({
            apolloClientName: appName,
            wsUrl: `${appName}/notifications`,
            httpUrl: `${appName}/notifications/v2/ws/graphql`,
            subscriptionOptions: {
                query: gql(gqlQuery)
            }
        });
    }
}

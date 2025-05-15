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

import { gql } from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
@Injectable({
    providedIn: 'root'
})
export class NotificationCloudService {
    constructor(private readonly webSocketService: WebSocketService) {}

    makeGQLQuery(appName: string, gqlQuery: string) {
        return this.webSocketService.getSubscription({
            apolloClientName: appName,
            // wsUrl: `wss://hxps-rc.studio.dev.experience.hyland.com/${appName}/notifications`,
            // httpUrl: `wss://hxps-rc.studio.dev.experience.hyland.com/${appName}/notifications/v2/ws/graphql`,
            wsUrl: `${appName}/notifications`,
            httpUrl: `${appName}/notifications/v2/ws/graphql`,
            subscriptionOptions: {
                query: gql(gqlQuery)
            }
        });
    }
}

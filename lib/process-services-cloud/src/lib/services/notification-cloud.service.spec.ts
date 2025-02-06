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
import { NotificationCloudService } from './notification-cloud.service';
import { provideMockFeatureFlags } from '@alfresco/adf-core/feature-flags';
import { WebSocketService } from './web-socket.service';
import { Apollo } from 'apollo-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';

describe('NotificationCloudService', () => {
    let service: NotificationCloudService;
    let wsService: WebSocketService;
    const apolloMock = jasmine.createSpyObj('Apollo', ['use', 'createNamed']);
    const onLogoutSubject: Subject<void> = new Subject<void>();

    const queryMock = `
        subscription {
            engineEvents(eventType: [
                MY_EVENT
            ]) {
                eventType
                entity
            }
        }
    `;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                WebSocketService,
                provideMockFeatureFlags({ ['studio-ws-graphql-subprotocol']: false }),
                {
                    provide: Apollo,
                    useValue: apolloMock
                },
                {
                    provide: AuthenticationService,
                    useValue: {
                        getToken: () => 'testToken',
                        onLogout: onLogoutSubject.asObservable()
                    }
                }
            ]
        });
        service = TestBed.inject(NotificationCloudService);
        wsService = TestBed.inject(WebSocketService);
    });

    it('should call getSubscription with the correct parameters', () => {
        const getSubscriptionSpy = spyOn(wsService, 'getSubscription').and.callThrough();

        service.makeGQLQuery('myAppName', queryMock);

        expect(getSubscriptionSpy).toHaveBeenCalledWith({
            apolloClientName: 'myAppName',
            wsUrl: 'myAppName/notifications',
            httpUrl: 'myAppName/notifications/graphql',
            subscriptionOptions: {
                query: jasmine.any(Object)
            }
        });
    });
});

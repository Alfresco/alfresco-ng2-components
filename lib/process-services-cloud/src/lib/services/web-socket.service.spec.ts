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
import { Apollo, gql } from 'apollo-angular';
import { lastValueFrom, of, Subject } from 'rxjs';
import { WebSocketService } from './web-socket.service';
import { SubscriptionOptions } from '@apollo/client/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService, AppConfigService } from '@alfresco/adf-core';

describe('WebSocketService', () => {
    let service: WebSocketService;
    const onLogoutSubject: Subject<void> = new Subject<void>();

    const apolloMock = jasmine.createSpyObj('Apollo', ['use', 'createNamed', 'removeClient']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: Apollo,
                    useValue: apolloMock
                },
                {
                    provide: AppConfigService,
                    useValue: {
                        get: () => 'wss://testHost'
                    }
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
        service = TestBed.inject(WebSocketService);
        apolloMock.use.and.returnValues(undefined, { subscribe: () => of({}) });
    });

    afterEach(() => {
        apolloMock.use.calls.reset();
        apolloMock.createNamed.calls.reset();
    });

    it('should not create a new Apollo client if it is already in use', async () => {
        const apolloClientName = 'testClient';
        const subscriptionOptions: SubscriptionOptions = { query: gql(`subscription {testQuery}`) };
        const wsOptions = { apolloClientName, wsUrl: 'testUrl', subscriptionOptions };

        apolloMock.use.and.returnValues(true, { subscribe: () => of({}) });

        await lastValueFrom(service.getSubscription(wsOptions));

        expect(apolloMock.use).toHaveBeenCalledTimes(2);
        expect(apolloMock.use).toHaveBeenCalledWith(apolloClientName);
        expect(apolloMock.createNamed).not.toHaveBeenCalled();
    });

    it('should subscribe to Apollo client if not already in use', async () => {
        const apolloClientName = 'testClient';
        const expectedApolloClientName = 'testClient';
        const subscriptionOptions: SubscriptionOptions = { query: gql(`subscription {testQuery}`) };
        const wsOptions = { apolloClientName, wsUrl: 'testUrl', subscriptionOptions };

        await lastValueFrom(service.getSubscription(wsOptions));

        expect(apolloMock.use).toHaveBeenCalledWith(expectedApolloClientName);
        expect(apolloMock.use).toHaveBeenCalledTimes(2);
        expect(apolloMock.createNamed).toHaveBeenCalledTimes(1);
        expect(apolloMock.createNamed).toHaveBeenCalledWith(expectedApolloClientName, jasmine.any(Object));
    });

    it('should create named client with the right authentication token when FF is on', async () => {
        let headers = {};
        const expectedHeaders = { Authorization: 'Bearer testToken' };
        const apolloClientName = 'testClient';
        const subscriptionOptions: SubscriptionOptions = { query: gql(`subscription {testQuery}`) };
        const wsOptions = { apolloClientName, wsUrl: 'testUrl', subscriptionOptions };
        apolloMock.createNamed.and.callFake((_, options) => {
            headers = options.headers;
        });

        await lastValueFrom(service.getSubscription(wsOptions));

        expect(apolloMock.use).toHaveBeenCalledTimes(2);
        expect(apolloMock.createNamed).toHaveBeenCalled();
        expect(headers).toEqual(expectedHeaders);
    });
});

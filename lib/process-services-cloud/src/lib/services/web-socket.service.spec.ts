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

import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { lastValueFrom, of, Subject } from 'rxjs';
import { WebSocketService } from './web-socket.service';
import { ApolloLink, execute, FetchResult, Observable as ApolloObservable, SubscriptionOptions } from '@apollo/client/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthenticationService, AppConfigService } from '@alfresco/adf-core';
import { Client, ClientOptions, Sink, SubscribePayload } from 'graphql-ws';
import { HttpLink } from 'apollo-angular/http';

@Injectable()
class TestWebSocketService extends WebSocketService {
    public capturedOnError: (() => void) | undefined;

    protected override createWsClient(clientOptions: ClientOptions): Client {
        this.capturedOnError = clientOptions.on?.error as (() => void) | undefined;

        return {
            on: () => () => undefined,
            subscribe: (_payload: SubscribePayload, _sink: Sink) => () => undefined,
            async *iterate() {},
            terminate: () => undefined,
            dispose: () => undefined
        };
    }
}

describe('WebSocketService', () => {
    let service: TestWebSocketService;
    const onLogoutSubject: Subject<void> = new Subject<void>();

    const apolloMock = jasmine.createSpyObj('Apollo', ['use', 'createNamed', 'removeClient']);
    const httpLinkMock = jasmine.createSpyObj('HttpLink', ['create']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClientTesting(),
                {
                    provide: Apollo,
                    useValue: apolloMock
                },
                {
                    provide: WebSocketService,
                    useClass: TestWebSocketService
                },
                {
                    provide: HttpLink,
                    useValue: httpLinkMock
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
        service = TestBed.inject(WebSocketService) as TestWebSocketService;
        apolloMock.use.and.returnValues(undefined, { subscribe: () => of({}) });
    });

    afterEach(() => {
        apolloMock.use.calls.reset();
        apolloMock.createNamed.calls.reset();
        apolloMock.removeClient.calls.reset();
        httpLinkMock.create.calls.reset();
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
        apolloMock.createNamed.and.callFake((_: any, options: { headers: {} }) => {
            headers = options.headers;
        });

        await lastValueFrom(service.getSubscription(wsOptions));

        expect(apolloMock.use).toHaveBeenCalledTimes(2);
        expect(apolloMock.createNamed).toHaveBeenCalled();
        expect(headers).toEqual(expectedHeaders);
    });

    it('should recreate the subscription client when the websocket connection errors', async () => {
        const apolloClientName = 'testClient';
        const subscriptionOptions: SubscriptionOptions = { query: gql(`subscription {testQuery}`) };
        const wsOptions = { apolloClientName, wsUrl: 'testUrl', subscriptionOptions };

        await lastValueFrom(service.getSubscription(wsOptions));

        expect(apolloMock.createNamed).toHaveBeenCalledTimes(1);
        expect(apolloMock.removeClient).not.toHaveBeenCalled();

        if (!service.capturedOnError) {
            fail('Expected websocket error handler to be registered');
            return;
        }

        service.capturedOnError();

        expect(apolloMock.removeClient).toHaveBeenCalledWith(apolloClientName);
        expect(apolloMock.createNamed).toHaveBeenCalledTimes(2);
        expect(apolloMock.createNamed).toHaveBeenCalledWith(apolloClientName, jasmine.any(Object));
    });

    it('should retry the operation when a GraphQL error is unauthenticated', async () => {
        const apolloClientName = 'testClient';
        const subscriptionOptions: SubscriptionOptions = { query: gql(`subscription {testQuery}`) };
        const wsOptions = { apolloClientName, wsUrl: 'testUrl', httpUrl: 'testHttpUrl', subscriptionOptions };
        const expectedResult: FetchResult = { data: { retried: true } };
        let createdLink: ApolloLink | undefined;
        let requestCount = 0;

        httpLinkMock.create.and.returnValue(
            new ApolloLink(
                () =>
                    new ApolloObservable<FetchResult>((observer) => {
                        requestCount++;

                        if (requestCount === 1) {
                            observer.next({
                                errors: [{ message: 'Unauthorized', extensions: { code: 'UNAUTHENTICATED' } }]
                            });
                        } else {
                            observer.next(expectedResult);
                        }

                        observer.complete();
                    })
            )
        );
        apolloMock.createNamed.and.callFake((_clientName: any, options: { link: ApolloLink | undefined }) => {
            createdLink = options.link;
        });

        await lastValueFrom(service.getSubscription(wsOptions));

        if (!createdLink) {
            fail('Expected Apollo link to be created');
            return;
        }

        const result = await new Promise<FetchResult>((resolve, reject) => {
            execute(createdLink!, { query: gql(`query { testQuery }`) }).subscribe({
                next: resolve,
                error: reject
            });
        });

        expect(requestCount).toBe(2);
        expect(result).toEqual(expectedResult);
    });
});

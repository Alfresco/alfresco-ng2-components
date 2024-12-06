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

import { TestBed } from '@angular/core/testing';
import { Apollo, gql } from 'apollo-angular';
import { of, Subject } from 'rxjs';
import { WebSocketService } from './web-socket.service';
import { SubscriptionOptions } from '@apollo/client/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService, AppConfigService } from '@alfresco/adf-core';
import { FeaturesServiceToken, IFeaturesService, provideMockFeatureFlags } from '@alfresco/adf-core/feature-flags';

describe('WebSocketService', () => {
    let service: WebSocketService;
    let featureService: IFeaturesService;
    const onLogoutSubject: Subject<void> = new Subject<void>();

    const apolloMock = jasmine.createSpyObj('Apollo', ['use', 'createNamed']);

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
                },
                provideMockFeatureFlags({ ['studio-ws-graphql-subprotocol']: true })
            ]
        });
        service = TestBed.inject(WebSocketService);
        featureService = TestBed.inject(FeaturesServiceToken);
        apolloMock.use.and.returnValues(undefined, { subscribe: () => of({}) });
    });

    afterEach(() => {
        apolloMock.use.calls.reset();
        apolloMock.createNamed.calls.reset();
    });

    it('should not create a new Apollo client if it is already in use', (done) => {
        const apolloClientName = 'testClient';
        const subscriptionOptions: SubscriptionOptions = { query: gql(`subscription {testQuery}`) };
        const wsOptions = { apolloClientName, wsUrl: 'testUrl', subscriptionOptions };

        apolloMock.use.and.returnValues(true, { subscribe: () => of({}) });

        service.getSubscription(wsOptions).subscribe(() => {
            expect(apolloMock.use).toHaveBeenCalledTimes(2);
            expect(apolloMock.use).toHaveBeenCalledWith(apolloClientName);
            expect(apolloMock.createNamed).not.toHaveBeenCalled();
            done();
        });
    });

    it('should subscribe to Apollo client if not already in use', (done) => {
        const apolloClientName = 'testClient';
        const expectedApolloClientName = 'testClient';
        const subscriptionOptions: SubscriptionOptions = { query: gql(`subscription {testQuery}`) };
        const wsOptions = { apolloClientName, wsUrl: 'testUrl', subscriptionOptions };

        service.getSubscription(wsOptions).subscribe(() => {
            expect(apolloMock.use).toHaveBeenCalledWith(expectedApolloClientName);
            expect(apolloMock.use).toHaveBeenCalledTimes(2);
            expect(apolloMock.createNamed).toHaveBeenCalledTimes(1);
            expect(apolloMock.createNamed).toHaveBeenCalledWith(expectedApolloClientName, jasmine.any(Object));
            done();
        });
    });

    it('should create named client with the right authentication token when FF is on', (done) => {
        let headers = {};
        const expectedHeaders = { Authorization: 'Bearer testToken' };
        const apolloClientName = 'testClient';
        const subscriptionOptions: SubscriptionOptions = { query: gql(`subscription {testQuery}`) };
        const wsOptions = { apolloClientName, wsUrl: 'testUrl', subscriptionOptions };
        apolloMock.createNamed.and.callFake((_, options) => {
            headers = options.headers;
        });

        service.getSubscription(wsOptions).subscribe(() => {
            expect(apolloMock.use).toHaveBeenCalledTimes(2);
            expect(apolloMock.createNamed).toHaveBeenCalled();
            expect(headers).toEqual(expectedHeaders);
            done();
        });
    });

    it('should create named client with the right authentication token when FF is off', (done) => {
        featureService.getFlags$ = jasmine.createSpy().and.returnValue(of({ 'studio-ws-graphql-subprotocol': { current: false } }));
        let headers = {};
        const expectedHeaders = { 'X-Authorization': 'Bearer testToken' };
        const apolloClientName = 'testClient';
        const subscriptionOptions: SubscriptionOptions = { query: gql(`subscription {testQuery}`) };
        const wsOptions = { apolloClientName, wsUrl: 'testUrl', subscriptionOptions };
        apolloMock.createNamed.and.callFake((_, options) => {
            headers = options.headers;
        });

        service.getSubscription(wsOptions).subscribe(() => {
            expect(apolloMock.use).toHaveBeenCalledTimes(2);
            expect(apolloMock.createNamed).toHaveBeenCalled();
            expect(headers).toEqual(expectedHeaders);
            done();
        });
    });
});

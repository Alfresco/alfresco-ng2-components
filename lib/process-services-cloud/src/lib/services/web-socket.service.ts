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

import { createClient } from 'graphql-ws';
import { Inject, Injectable } from '@angular/core';
import { AuthenticationService } from '@alfresco/adf-core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { WebSocketLink } from '@apollo/client/link/ws';
import {
    DefaultContext,
    FetchResult,
    from,
    HttpLink,
    InMemoryCache,
    InMemoryCacheConfig,
    NextLink,
    Operation,
    split,
    SubscriptionOptions
} from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
import { Apollo } from 'apollo-angular';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { FeaturesServiceToken, IFeaturesService } from '@alfresco/adf-core/feature-flags';

interface serviceOptions {
    apolloClientName: string;
    wsUrl: string;
    httpUrl?: string;
    subscriptionOptions: SubscriptionOptions;
}

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private host = '';
    private subscriptionProtocol: 'graphql-ws' | 'transport-ws' = 'transport-ws';
    private wsLink: GraphQLWsLink | WebSocketLink;
    private httpLink: HttpLink;

    constructor(
        private readonly apollo: Apollo,
        // private readonly appConfigService: AppConfigService,
        private readonly authService: AuthenticationService,
        @Inject(FeaturesServiceToken) private featuresService: IFeaturesService
    ) {
        this.host = 'https://aae-rc-apa.envalfresco.com';
        // this.host = this.appConfigService.get('bpmHost', '');
    }

    public getSubscription<T>(options: serviceOptions): Observable<FetchResult<T>> {
        const { apolloClientName, subscriptionOptions } = options;
        this.authService.onLogout.pipe(take(1)).subscribe(() => {
            if (this.apollo.use(apolloClientName)) {
                this.apollo.removeClient(apolloClientName);
            }
        });

        return this.featuresService.isOn$('studio-ws-graphql-subprotocol').pipe(
            tap((isOn) => {
                if (isOn) {
                    this.subscriptionProtocol = 'graphql-ws';
                }
            }),
            switchMap(() => {
                if (this.apollo.use(apolloClientName) === undefined) {
                    this.initSubscriptions(options);
                }
                return this.apollo.use(apolloClientName).subscribe<T>({ errorPolicy: 'all', ...subscriptionOptions });
            })
        );
    }

    private createWsUrl(serviceUrl: string): string {
        const url = new URL(serviceUrl, this.host);
        const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        url.protocol = protocol;

        return url.href;
    }

    private createHttpUrl(serviceUrl: string): string {
        const url = new URL(serviceUrl, this.host);

        return url.href;
    }

    private initSubscriptions(options: serviceOptions): void {
        switch (this.subscriptionProtocol) {
            case 'graphql-ws':
                this.createGraphQLWsLink(options);
                break;
            case 'transport-ws':
                this.createTransportWsLink(options);
                break;
            default:
                throw new Error('Unknown subscription protocol');
        }

        this.httpLink = options.httpUrl
            ? new HttpLink({
                  uri: this.createHttpUrl(options.httpUrl)
              })
            : undefined;

        const link = split(
            ({ query }) => {
                const definition = getMainDefinition(query);
                return definition.kind === Kind.OPERATION_DEFINITION && definition.operation === OperationTypeNode.SUBSCRIPTION;
            },
            this.wsLink,
            this.httpLink
        );

        const authLink = (operation: Operation, forward: NextLink) => {
            operation.setContext(({ headers }: DefaultContext) => ({
                headers: {
                    ...headers,
                    ...(this.subscriptionProtocol === 'graphql-ws' && { Authorization: `Bearer ${this.authService.getToken()}` }),
                    ...(this.subscriptionProtocol === 'transport-ws' && { 'X-Authorization': `Bearer ${this.authService.getToken()}` })
                }
            }));
            return forward(operation);
        };

        const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors) {
                for (const error of graphQLErrors) {
                    if (error.extensions && error.extensions['code'] === 'UNAUTHENTICATED') {
                        authLink(operation, forward);
                    }
                }
            }

            if (networkError) {
                console.error(`[Network error]: ${networkError}`);
            }
        });

        const retryLink = new RetryLink({
            delay: {
                initial: 300,
                max: Number.POSITIVE_INFINITY,
                jitter: true
            },
            attempts: {
                max: 5,
                retryIf: (error) => !!error
            }
        });

        this.apollo.createNamed(options.apolloClientName, {
            headers: {
                ...(this.subscriptionProtocol === 'graphql-ws' && { Authorization: `Bearer ${this.authService.getToken()}` }),
                ...(this.subscriptionProtocol === 'transport-ws' && { 'X-Authorization': `Bearer ${this.authService.getToken()}` })
            },
            link: from([authLink, retryLink, errorLink, link]),
            cache: new InMemoryCache({ merge: true } as InMemoryCacheConfig)
        });
    }

    private createTransportWsLink(options: serviceOptions) {
        this.wsLink = new WebSocketLink({
            uri: this.createWsUrl(options.wsUrl) + '/ws/graphql',
            options: {
                reconnect: true,
                lazy: true,
                connectionParams: {
                    kaInterval: 2000,
                    'X-Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        });
    }

    private createGraphQLWsLink(options: serviceOptions) {
        this.wsLink = new GraphQLWsLink(
            createClient({
                url: this.createWsUrl(options.wsUrl) + '/v2/ws/graphql',
                connectionParams: {
                    Authorization: 'Bearer ' + this.authService.getToken()
                },
                on: {
                    error: () => {
                        this.apollo.removeClient(options.apolloClientName);
                        this.initSubscriptions(options);
                    }
                },
                lazy: true
            })
        );
    }
}

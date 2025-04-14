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

import { createClient } from 'graphql-ws';
import { inject, Injectable } from '@angular/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { WebSocketLink } from '@apollo/client/link/ws';
import {
    DefaultContext,
    FetchResult,
    from,
    InMemoryCache,
    InMemoryCacheConfig,
    NextLink,
    Operation,
    split,
    SubscriptionOptions
} from '@apollo/client/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { HttpLink, HttpLinkHandler } from 'apollo-angular/http';
import { Kind, OperationTypeNode } from 'graphql';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { getMainDefinition } from '@apollo/client/utilities';
import { take } from 'rxjs/operators';
import { AppConfigService, AuthenticationService } from '@alfresco/adf-core';

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
    private appConfigService = inject(AppConfigService);
    private subscriptionProtocol = 'graphql-ws';
    private wsLink: GraphQLWsLink | WebSocketLink;
    private httpLinkHandler: HttpLinkHandler;

    constructor(private readonly apollo: Apollo, private readonly httpLink: HttpLink, private readonly authService: AuthenticationService) {}

    public getSubscription<T>(options: serviceOptions): Observable<FetchResult<T>> {
        const { apolloClientName, subscriptionOptions } = options;
        this.authService.onLogout.pipe(take(1)).subscribe(() => {
            if (this.apollo.use(apolloClientName)) {
                this.apollo.removeClient(apolloClientName);
            }
        });

        if (this.apollo.use(apolloClientName) === undefined) {
            this.initSubscriptions(options);
        }
        return this.apollo.use(apolloClientName).subscribe<T>({ errorPolicy: 'all', ...subscriptionOptions });
    }

    private removeApolloClientIfExists(apolloClientName: string) {
        if (this.apollo.use(apolloClientName)) {
            this.apollo.removeClient(apolloClientName);
        }
    }

    private get contextRoot() {
        return this.appConfigService.get('bpmHost', '');
    }

    private createWsUrl(serviceUrl: string): string {
        const url = new URL(serviceUrl, this.contextRoot);
        const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        url.protocol = protocol;

        return url.href;
    }

    private createHttpUrl(serviceUrl: string): string {
        const url = new URL(serviceUrl, this.contextRoot);

        return url.href;
    }

    private initSubscriptions(options: serviceOptions): void {
        this.createGraphQLWsLink(options);

        this.createHttpLinkHandler(options);

        const link = split(
            ({ query }) => {
                const definition = getMainDefinition(query);
                return definition.kind === Kind.OPERATION_DEFINITION && definition.operation === OperationTypeNode.SUBSCRIPTION;
            },
            this.wsLink,
            this.httpLinkHandler
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
            attempts: (count: number, _operation: Operation, error: any) => {
                if (!error) {
                    return false;
                }

                const isUnauthorizedError =
                    (Array.isArray(error) &&
                        error.some(
                            (err: any) =>
                                err?.extensions?.code === 'UNAUTHORIZED' ||
                                err?.message?.includes('4401') ||
                                err?.message?.toLowerCase().includes('unauthorized')
                        )) ||
                    (typeof error === 'string' && (error.includes('4401') || error.toLowerCase().includes('unauthorized'))) ||
                    (error?.message && (error.message.includes('4401') || error.message.toLowerCase().includes('unauthorized')));

                const shouldRetry = isUnauthorizedError ? this.authService.isLoggedIn() : count < 5;

                return shouldRetry;
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

    private createGraphQLWsLink(options: serviceOptions): void {
        this.wsLink = new GraphQLWsLink(
            createClient({
                url: this.createWsUrl(options.wsUrl) + '/v2/ws/graphql',
                connectionParams: () => ({
                    Authorization: 'Bearer ' + this.authService.getToken()
                }),
                on: {
                    closed: () => {
                        this.removeApolloClientIfExists(options.apolloClientName);
                    },
                    error: () => {
                        this.apollo.removeClient(options.apolloClientName);
                        this.initSubscriptions(options);
                    }
                },
                lazy: true
            })
        );
    }

    private createHttpLinkHandler(options: serviceOptions): void {
        this.httpLinkHandler = options.httpUrl
            ? this.httpLink.create({
                  uri: this.createHttpUrl(options.httpUrl)
              })
            : undefined;
    }
}

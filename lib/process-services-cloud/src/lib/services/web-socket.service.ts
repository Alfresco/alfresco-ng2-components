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
import { inject, Injectable, OnDestroy } from '@angular/core';
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
import { Observable, Subject, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { HttpLink, HttpLinkHandler } from 'apollo-angular/http';
import { Kind, OperationTypeNode } from 'graphql';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { getMainDefinition } from '@apollo/client/utilities';
import { take, takeUntil } from 'rxjs/operators';
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
export class WebSocketService implements OnDestroy {
    private appConfigService = inject(AppConfigService);
    private subscriptionProtocol = 'graphql-ws';
    private wsLink: GraphQLWsLink | WebSocketLink;
    private httpLinkHandler: HttpLinkHandler;
    private destroy$ = new Subject<void>();
    private tokenRefreshSubscription: Subscription;
    private clientTokenMap = new Map<string, string>();

    constructor(
        private readonly apollo: Apollo,
        private readonly httpLink: HttpLink,
        private readonly authService: AuthenticationService
    ) {
        this.setupTokenRefreshListener();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.tokenRefreshSubscription) {
            this.tokenRefreshSubscription.unsubscribe();
        }
    }

    public getSubscription<T>(options: serviceOptions): Observable<FetchResult<T>> {
        const uniqueClientName = this.generateUniqueClientName(options.apolloClientName);
        const modifiedOptions = { ...options, apolloClientName: uniqueClientName };

        this.authService.onLogout.pipe(take(1)).subscribe(() => {
            if (this.apollo.use(uniqueClientName)) {
                this.removeClient(uniqueClientName);
            }
        });

        const currentToken = this.authService.getToken();
        const storedToken = this.clientTokenMap.get(uniqueClientName);

        if (storedToken !== currentToken) {
            if (this.apollo.use(uniqueClientName)) {
                this.apollo.removeClient(uniqueClientName);
            }

            this.clientTokenMap.set(uniqueClientName, currentToken);
        }

        if (this.apollo.use(uniqueClientName) === undefined) {
            this.initSubscriptions(modifiedOptions);
        }

        return this.apollo.use(uniqueClientName).subscribe<T>({ errorPolicy: 'all', ...modifiedOptions.subscriptionOptions });
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

    private setupTokenRefreshListener(): void {
        if (this.authService.onTokenReceived) {
            this.tokenRefreshSubscription = this.authService.onTokenReceived.pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.handleTokenRefresh();
            });
        }
    }

    private handleTokenRefresh(): void {
        this.clientTokenMap.forEach((_, clientName) => {
            if (this.apollo.use(clientName)) {
                this.apollo.removeClient(clientName);
            }
        });
        this.clientTokenMap.clear();
    }

    private generateUniqueClientName(baseName: string): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        return `${baseName}_${timestamp}_${random}`;
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
                if (
                    networkError.message &&
                    (networkError.message.includes('Socket closed with event 4401') ||
                        networkError.message.includes('Unauthorized') ||
                        networkError.message.includes('4401') ||
                        networkError.message.includes('4403'))
                ) {
                    this.removeClient(options.apolloClientName);
                }
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

    private createGraphQLWsLink(options: serviceOptions): void {
        this.wsLink = new GraphQLWsLink(
            createClient({
                url: this.createWsUrl(options.wsUrl) + '/v2/ws/graphql',
                connectionParams: () => ({
                    Authorization: 'Bearer ' + this.authService.getToken()
                }),
                on: {
                    error: () => {
                        this.removeClient(options.apolloClientName);
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

    private removeClient(clientName: string): void {
        this.apollo.removeClient(clientName);
        this.clientTokenMap.delete(clientName);
    }
}

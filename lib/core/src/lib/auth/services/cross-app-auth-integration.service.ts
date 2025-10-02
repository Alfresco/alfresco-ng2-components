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

import { Injectable, inject } from '@angular/core';
import { CrossAppAuthSyncService, CrossAppAuthConfig } from './cross-app-auth-sync.service';
import { RedirectAuthService } from '../oidc/redirect-auth.service';

@Injectable()
export class CrossAppAuthIntegrationService {
    private readonly redirectAuthService = inject(RedirectAuthService);
    private readonly crossAppSyncService = inject(CrossAppAuthSyncService);

    private currentAppPrefix = '';

    /**
     * Initialize cross-application authentication synchronization
     *
     * @param config Configuration for cross-app sync. If not provided, reads from app.config.json
     * @param currentAppPrefix The prefix for the current application
     */
    async initialize(config?: CrossAppAuthConfig, currentAppPrefix = ''): Promise<void> {
        this.currentAppPrefix = currentAppPrefix;
        await this.crossAppSyncService.initialize(config || {});

        this.redirectAuthService.onLogout$.subscribe(() => {
            this.crossAppSyncService.clearTokensFromAllApps();
        });
    }

    /**
     * Check if user is authenticated in another app and attempt silent login
     * Uses OAuth prompt=none for true silent authentication
     *
     * @returns Promise resolving to true if silent login was attempted
     */
    async attemptSilentLoginFromLinkedApps(): Promise<boolean> {
        const isAlreadyAuthenticated = this.redirectAuthService.authenticated;
        if (isAlreadyAuthenticated) {
            return false;
        }

        const hasLinkedTokensFromOtherApps = this.crossAppSyncService.hasAuthTokensInLinkedApps(this.currentAppPrefix);

        if (hasLinkedTokensFromOtherApps) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const underlyingOAuthService = (this.redirectAuthService as any).oauthService;
                if (underlyingOAuthService?.initLoginFlow) {
                    const silentLoginParams = { prompt: 'none' };

                    const originalCustomQueryParams = underlyingOAuthService.customQueryParams;
                    underlyingOAuthService.customQueryParams = { ...originalCustomQueryParams, ...silentLoginParams };

                    await this.redirectAuthService.ensureDiscoveryDocument();
                    underlyingOAuthService.initLoginFlow();

                    underlyingOAuthService.customQueryParams = originalCustomQueryParams;

                    return true;
                } else {
                    const shouldFallbackToRegularLogin = true;
                    if (shouldFallbackToRegularLogin) {
                        this.redirectAuthService.login();
                    }
                    return true;
                }
            } catch {
                const silentLoginFailed = true;
                return !silentLoginFailed;
            }
        }

        return false;
    }

    /**
     * Clear authentication tokens from all configured applications
     */
    clearTokensFromAllApps(): void {
        this.crossAppSyncService.clearTokensFromAllApps();
    }

    /**
     * Get the underlying sync service for advanced usage
     *
     * @returns The CrossAppAuthSyncService instance
     */
    getSyncService(): CrossAppAuthSyncService {
        return this.crossAppSyncService;
    }
}

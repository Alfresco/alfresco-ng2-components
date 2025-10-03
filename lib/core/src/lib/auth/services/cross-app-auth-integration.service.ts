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
import { CrossAppTokenManager } from './cross-app-token-manager.service';
import { RedirectAuthService } from '../oidc/redirect-auth.service';

@Injectable()
export class CrossAppAuthIntegrationService {
    private readonly redirectAuthService = inject(RedirectAuthService);
    private readonly crossAppTokenManager = inject(CrossAppTokenManager);

    /**
     * Initializes the cross-app authentication integration service.
     *
     * This method performs the following actions:
     * - Awaits the initialization of the cross-app synchronization service.
     * - Subscribes to the logout event from the redirect authentication service.
     *   When a logout occurs, it clears authentication tokens from all applications.
     *
     * @returns A promise that resolves when initialization is complete.
     */
    async initialize(): Promise<void> {
        await this.crossAppTokenManager.initialize();

        this.redirectAuthService.onLogout$.subscribe(() => {
            this.crossAppTokenManager.clearTokensFromAllApps();
        });
    }

    /**
     * Process cross-app authentication request by detecting the crossAppAuth URL parameter.
     * If present, cleans up the URL parameter and clears authentication tokens to prepare
     * for a fresh authentication flow initiated by the redirect-auth service.
     *
     * @returns True if crossAppAuth parameter was present and processed
     */
    async processCrossAppAuthRequest(): Promise<boolean> {
        const shouldAttemptCrossAppAuth = this.hasCrossAppAuthParameter();

        if (shouldAttemptCrossAppAuth) {
            this.cleanupCrossAppAuthParameter();
            this.crossAppTokenManager.clearTokensFromAllApps();
            return true;
        }

        return false;
    }

    /**
     * Clear authentication tokens from all configured applications
     */
    clearTokensFromAllApps(): void {
        this.crossAppTokenManager.clearTokensFromAllApps();
    }

    private hasCrossAppAuthParameter(): boolean {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('crossAppAuth') === 'true';
    }

    private cleanupCrossAppAuthParameter(): void {
        const url = new URL(window.location.href);
        url.searchParams.delete('crossAppAuth');
        window.history.replaceState({}, '', url.toString());
    }
}

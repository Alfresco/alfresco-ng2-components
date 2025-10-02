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
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { firstValueFrom } from 'rxjs';

export interface CrossAppAuthConfig {
    appPrefixes?: string[];
}

@Injectable()
export class CrossAppAuthSyncService {
    private readonly appConfigService = inject(AppConfigService);

    private appPrefixes: string[] = [];

    /**
     * Initialize cross-app authentication synchronization
     *
     * @param config Configuration containing app prefixes. If not provided, reads from app.config.json
     */
    async initialize(config: CrossAppAuthConfig = {}): Promise<void> {
        await firstValueFrom(this.appConfigService.onLoad);
        this.appPrefixes = config.appPrefixes || this.getConfiguredPrefixes();

        if (this.appPrefixes.length === 0) {
            console.warn('CrossAppAuthSync: No app prefixes configured. Set appPrefixes or application.linkedStorageAuthPrefix in app.config.json');
        }
    }

    /**
     * Check if any linked application has authentication tokens
     * This indicates the user is likely authenticated with the identity provider
     *
     * @param excludePrefix Optional prefix to exclude from the check (current app)
     * @returns true if tokens are found in any linked app storage
     */
    hasAuthTokensInLinkedApps(excludePrefix?: string): boolean {
        const prefixesToCheck = excludePrefix ? this.appPrefixes.filter((prefix) => prefix !== excludePrefix) : this.appPrefixes;

        return prefixesToCheck.some((prefix) => {
            const accessTokenKey = this.buildStorageKey(prefix, 'access_token');
            return localStorage.getItem(accessTokenKey) !== null;
        });
    }

    /**
     * Clear authentication tokens from all configured prefixes
     * Called when user explicitly logs out
     */
    clearTokensFromAllApps(): void {
        const authKeys = [
            'access_token',
            'access_token_stored_at',
            'expires_at',
            'granted_scopes',
            'id_token',
            'id_token_claims_obj',
            'id_token_expires_at',
            'id_token_stored_at',
            'nonce',
            'PKCE_verifier',
            'refresh_token',
            'session_state'
        ];

        this.appPrefixes.forEach((prefix) => {
            authKeys.forEach((key) => {
                const storageKey = this.buildStorageKey(prefix, key);
                localStorage.removeItem(storageKey);
            });
        });
    }

    /**
     * Get the current sync configuration
     *
     * @returns Current app prefixes configuration
     */
    getConfiguration(): string[] {
        return [...this.appPrefixes];
    }

    private buildStorageKey(prefix: string, item: string): string {
        return prefix ? `${prefix}${item}` : item;
    }

    private getConfiguredPrefixes(): string[] {
        const linkedPrefixes = this.appConfigService.get<string[]>(AppConfigValues.LINKED_STORAGE_AUTH_PREFIX);
        return Array.isArray(linkedPrefixes) ? linkedPrefixes : [];
    }
}

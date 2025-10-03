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

@Injectable()
export class CrossAppTokenManager {
    private readonly appConfigService = inject(AppConfigService);

    private appPrefixes: string[] = [];

    /**
     * Initializes the CrossAppTokenManager by waiting for the application configuration to load,
     * then retrieves and sets the configured application prefixes.
     * If no prefixes are found, logs an error to the console.
     *
     * @returns A promise that resolves when initialization is complete.
     */
    async initialize(): Promise<void> {
        await firstValueFrom(this.appConfigService.onLoad);
        this.appPrefixes = this.getConfiguredPrefixes();

        if (this.appPrefixes.length === 0) {
            console.error(
                'CrossAppTokenManager: No app prefixes configured. Set appPrefixes or application.linkedStorageAuthPrefix in app.config.json'
            );
        }
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

    private buildStorageKey(prefix: string, item: string): string {
        return prefix ? `${prefix}${item}` : item;
    }

    private getConfiguredPrefixes(): string[] {
        const linkedPrefixes = this.appConfigService.get<string[]>(AppConfigValues.LINKED_STORAGE_AUTH_PREFIX) || [];
        const currentAppPrefix = this.appConfigService.get<string>(AppConfigValues.STORAGE_PREFIX);

        const formattedLinkedPrefixes = linkedPrefixes.map((prefix) => (prefix.endsWith('_') ? prefix : `${prefix}_`));
        const formattedCurrentAppPrefix = currentAppPrefix ? (currentAppPrefix.endsWith('_') ? currentAppPrefix : `${currentAppPrefix}_`) : '';

        if (formattedLinkedPrefixes.length === 0 && !formattedCurrentAppPrefix) {
            return [];
        }

        const allPrefixes = [...formattedLinkedPrefixes];
        if (formattedCurrentAppPrefix) {
            allPrefixes.push(formattedCurrentAppPrefix);
        } else {
            if (formattedLinkedPrefixes.length > 0) {
                allPrefixes.push('');
            }
        }

        return allPrefixes;
    }
}

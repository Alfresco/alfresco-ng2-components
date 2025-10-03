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
import { CrossAppAuthIntegrationService } from './cross-app-auth-integration.service';

/**
 * Service responsible for initializing cross-application authentication during app startup.
 * Handles timeout management and error handling for the initialization process.
 */
@Injectable()
export class CrossAppAuthInitializerService {
    private readonly crossAppIntegration = inject(CrossAppAuthIntegrationService);
    private readonly initializationTimeoutMs = 5000;

    /**
     * Initializes the cross-application login process.
     *
     * This method attempts to initialize the cross-app authentication flow with a timeout,
     * and then performs a cross-app authentication request. If any error occurs during
     * initialization or authentication, it handles the error and returns `false`.
     *
     * @returns A promise that resolves to `true` if cross-app login is successful, or `false` if an error occurs.
     */
    async initializeCrossAppLogin(): Promise<boolean> {
        try {
            await this.initializeWithTimeout();
            return await this.crossAppIntegration.processCrossAppAuthRequest();
        } catch (error) {
            this.handleInitializationError(error);
            return false;
        }
    }

    private async initializeWithTimeout(): Promise<void> {
        const initPromise = this.crossAppIntegration.initialize();
        const timeoutPromise = this.createTimeoutPromise();

        await Promise.race([initPromise, timeoutPromise]);
    }

    private createTimeoutPromise(): Promise<never> {
        return new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Cross-app auth initialization timed out')), this.initializationTimeoutMs)
        );
    }

    private handleInitializationError(error: unknown): void {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn('Cross-app auth initialization failed:', errorMessage);
    }
}

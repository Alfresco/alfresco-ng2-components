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

import { inject, Provider, EnvironmentProviders, provideAppInitializer } from '@angular/core';
import { CrossAppTokenManager } from './cross-app-token-manager.service';
import { CrossAppAuthIntegrationService } from './cross-app-auth-integration.service';
import { CrossAppAuthInitializerService } from './cross-app-auth-initializer.service';

/**
 * Factory function to create app initializer for cross-app authentication.
 * Detects crossAppAuth URL parameter and attempts silent SSO with OAuth prompt=none.
 * Handles the initialization process with proper error handling and timeout management.
 *
 * @returns Promise<boolean> indicating whether silent login was attempted
 */
export function crossAppAuthInitializerFactory(): () => Promise<boolean> {
    return () => {
        const initializer = inject(CrossAppAuthInitializerService);
        return initializer.initializeCrossAppLogin();
    };
}

/**
 * Provides all necessary services and initializers for cross-app authentication.
 * This includes the sync service, integration service, initializer service, and app initializer.
 *
 * @returns Array of providers for cross-app authentication
 */
export function provideCrossAppAuth(): (Provider | EnvironmentProviders)[] {
    return [
        CrossAppTokenManager,
        CrossAppAuthIntegrationService,
        CrossAppAuthInitializerService,
        provideAppInitializer(crossAppAuthInitializerFactory())
    ];
}

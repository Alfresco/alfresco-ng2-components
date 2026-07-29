/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { SESSION_TIMEOUT_OPTIONS, SessionTimeoutOptions } from './session-timeout.config';
import { IdleActivityTracker } from './idle-activity-tracker';
import { SessionTimeoutSyncChannel } from './session-timeout-sync-channel';
import { SessionTimeoutService } from './session-timeout.service';
import { filter, take } from 'rxjs/operators';

/**
 * Provides the session timeout feature: idle tracking, the countdown dialog and cross-tab sync.
 *
 * When the countdown dialog is not answered (or the user clicks "Log out"), the normal logout flow
 * runs and the user is redirected to the configured IdP/login page.
 *
 * @param options - Optional overrides that take precedence over the `sessionTimeout` app config block
 * @returns Environment providers that register the service and start it during app initialization
 */
export function provideSessionTimeout(options?: SessionTimeoutOptions): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: SESSION_TIMEOUT_OPTIONS, useValue: options ?? {} },
        IdleActivityTracker,
        SessionTimeoutSyncChannel,
        SessionTimeoutService,
        provideAppInitializer(() => {
            const sessionTimeoutService = inject(SessionTimeoutService);
            const sessionTimeoutOptions = inject(SESSION_TIMEOUT_OPTIONS);
            const startWhen$ = sessionTimeoutOptions.startWhen?.();

            if (!startWhen$) {
                sessionTimeoutService.start();
                return;
            }

            startWhen$.pipe(filter(Boolean), take(1)).subscribe(() => sessionTimeoutService.start());
        })
    ]);
}

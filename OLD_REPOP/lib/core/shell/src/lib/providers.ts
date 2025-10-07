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

import { EnvironmentProviders, Provider } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Routes } from '@angular/router';
import { AppShellRoutesConfig, provideShellRoutes } from './shell.routes';
import { SHELL_APP_SERVICE, SHELL_AUTH_TOKEN, SHELL_NAVBAR_MAX_WIDTH, SHELL_NAVBAR_MIN_WIDTH, ShellAppService } from './services/shell-app.service';

export interface ProvideShellOpts {
    routes: Routes | AppShellRoutesConfig;
    appService?: ShellAppService;
    authGuard?: CanActivateFn | CanActivateChildFn;
    navBar?: {
        minWidth: number;
        maxWidth: number;
    };
}

/**
 * Provides Shell-related api and providers
 *
 * @param opts Optional parameters
 * @returns list of Angular providers
 */
export function provideShell(opts?: ProvideShellOpts): (Provider | EnvironmentProviders)[] {
    const result: (Provider | EnvironmentProviders)[] = [provideShellRoutes(opts?.routes || [])];

    if (opts?.appService) {
        result.push({
            provide: SHELL_APP_SERVICE,
            useValue: opts.appService
        });
    }

    if (opts?.authGuard) {
        result.push({
            provide: SHELL_AUTH_TOKEN,
            useValue: opts.authGuard
        });
    }

    if (opts?.navBar) {
        result.push({
            provide: SHELL_NAVBAR_MIN_WIDTH,
            useValue: opts.navBar.minWidth ?? 70
        });
        result.push({
            provide: SHELL_NAVBAR_MAX_WIDTH,
            useValue: opts.navBar.maxWidth ?? 320
        });
    }

    return result;
}

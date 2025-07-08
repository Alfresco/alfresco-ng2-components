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

import { provideRouter, Route, Routes } from '@angular/router';
import { ShellLayoutComponent } from './components/shell/shell.component';
import { SHELL_AUTH_TOKEN } from './services/shell-app.service';
import { EnvironmentProviders } from '@angular/core';

export const SHELL_LAYOUT_ROUTE: Route = {
    path: '',
    component: ShellLayoutComponent,
    canActivate: [SHELL_AUTH_TOKEN],
    children: []
};

export interface AppShellRoutesConfig {
    shellParentRoute?: Route;
    shellChildren: Routes;
}

/**
 * Provides shell routes for the application.
 *
 * @param routes The routes configuration for the shell.
 * @returns An array of providers for the shell routes.
 */
export function provideShellRoutes(routes: Routes | AppShellRoutesConfig): EnvironmentProviders[] {
    const shellLayoutRoute = SHELL_LAYOUT_ROUTE;

    if (Array.isArray(routes)) {
        shellLayoutRoute.children.push(...routes);
        return [provideRouter([shellLayoutRoute])];
    }

    const shellChildrenRoutes = routes.shellChildren || [];
    if (shellChildrenRoutes.length > 0) {
        shellLayoutRoute.children.push(...shellChildrenRoutes);
    }

    const shellParentRoute = routes.shellParentRoute;
    const rootRoute = shellParentRoute || shellLayoutRoute;

    if (routes.shellParentRoute) {
        if (rootRoute.children === undefined) {
            rootRoute.children = [];
        }

        rootRoute.children.push(shellLayoutRoute);
    }

    return [provideRouter([rootRoute])];
}

/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, provideRoutes, RouterModule, Route } from '@angular/router';
import { SHELL_LAYOUT_ROUTE } from './shell.routes';
import { SidenavLayoutModule } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { ShellLayoutComponent } from './components/shell/shell.component';

export interface AppShellRoutesConfig {
  shellParentRoute?: Route;
  shellChildren: Routes;
}

@NgModule({
  imports: [SidenavLayoutModule, ExtensionsModule, RouterModule.forChild([]), CommonModule],
  exports: [ShellLayoutComponent],
  declarations: [ShellLayoutComponent]
})
export class ShellModule {
  static withRoutes(routes: Routes | AppShellRoutesConfig): ModuleWithProviders<ShellModule> {
    if (Array.isArray(routes)) {
      return getModuleForRoutes(routes);
    }

    return getModuleForRouteConfig(routes);
  }
}

function getModuleForRoutes(routes: Routes): ModuleWithProviders<ShellModule> {
  const shellLayoutRoute = SHELL_LAYOUT_ROUTE;

  routes.forEach((childRoute) => {
    shellLayoutRoute.children.push(childRoute);
  });

  return {
    ngModule: ShellModule,
    providers: provideRoutes([shellLayoutRoute])
  };
}

function getModuleForRouteConfig(config: AppShellRoutesConfig): ModuleWithProviders<ShellModule> {
  const shellLayoutRoute = SHELL_LAYOUT_ROUTE;

  const shellParentRoute = config.shellParentRoute;
  const shellChildrenRoutes = config.shellChildren;

  shellLayoutRoute.children.push(...shellChildrenRoutes);

  const rootRoute = shellParentRoute ? shellParentRoute : shellLayoutRoute;

  if (config.shellParentRoute) {
    if (rootRoute.children === undefined) {
      rootRoute.children = [];
    }

    rootRoute.children.push(shellLayoutRoute);
  }

  return {
    ngModule: ShellModule,
    providers: provideRoutes([rootRoute])
  };
}

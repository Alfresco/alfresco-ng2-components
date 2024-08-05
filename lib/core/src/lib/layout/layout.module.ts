/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NgModule } from '@angular/core';
import { SidenavLayoutContentDirective } from './directives/sidenav-layout-content.directive';
import { SidenavLayoutHeaderDirective } from './directives/sidenav-layout-header.directive';
import { SidenavLayoutNavigationDirective } from './directives/sidenav-layout-navigation.directive';
import { SidenavLayoutComponent } from './components/sidenav-layout/sidenav-layout.component';
import { LayoutContainerComponent } from './components/layout-container/layout-container.component';
import {
    SidebarActionMenuComponent,
    SidebarMenuDirective,
    SidebarMenuExpandIconDirective,
    SidebarMenuTitleIconDirective
} from './components/sidebar-action/sidebar-action-menu.component';
import { HeaderLayoutComponent } from './components/header/header.component';

export const LAYOUT_DIRECTIVES = [
    SidenavLayoutHeaderDirective,
    SidenavLayoutContentDirective,
    SidenavLayoutNavigationDirective,
    SidebarMenuDirective,
    SidebarMenuExpandIconDirective,
    SidebarMenuTitleIconDirective,
    HeaderLayoutComponent,
    SidebarActionMenuComponent,
    LayoutContainerComponent,
    SidenavLayoutComponent
] as const;

/** @deprecated Use `...LAYOUT_DIRECTIVES` instead, or import standalone components directly */
@NgModule({
    imports: [...LAYOUT_DIRECTIVES],
    exports: [...LAYOUT_DIRECTIVES]
})
export class SidenavLayoutModule { /* empty */ }

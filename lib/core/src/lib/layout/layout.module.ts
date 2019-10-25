/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { SidenavLayoutContentDirective } from './directives/sidenav-layout-content.directive';
import { SidenavLayoutHeaderDirective } from './directives/sidenav-layout-header.directive';
import { SidenavLayoutNavigationDirective } from './directives/sidenav-layout-navigation.directive';
import { SidenavLayoutComponent } from './components/sidenav-layout/sidenav-layout.component';
import { LayoutContainerComponent } from './components/layout-container/layout-container.component';
import { SidebarActionMenuComponent, SidebarMenuDirective,
    SidebarMenuExpandIconDirective, SidebarMenuTitleIconDirective } from './components/sidebar-action/sidebar-action-menu.component';
import { HeaderLayoutComponent } from './components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        TranslateModule
    ],
    exports: [
        SidenavLayoutHeaderDirective,
        SidenavLayoutContentDirective,
        SidenavLayoutNavigationDirective,
        SidenavLayoutComponent,
        LayoutContainerComponent,
        SidebarActionMenuComponent,
        SidebarMenuDirective,
        SidebarMenuExpandIconDirective,
        SidebarMenuTitleIconDirective,
        HeaderLayoutComponent
    ],
    declarations: [
        SidenavLayoutHeaderDirective,
        SidenavLayoutContentDirective,
        SidenavLayoutNavigationDirective,
        SidenavLayoutComponent,
        LayoutContainerComponent,
        SidebarActionMenuComponent,
        SidebarMenuDirective,
        SidebarMenuExpandIconDirective,
        SidebarMenuTitleIconDirective,
        HeaderLayoutComponent
    ]
})
export class LayoutModule {}
export { LayoutModule as SidenavLayoutModule };

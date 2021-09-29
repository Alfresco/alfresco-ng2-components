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

import { ChangeDetectionStrategy, Component, Directive, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'adf-sidebar-action-menu',
    templateUrl: './sidebar-action-menu.component.html',
    styleUrls: ['./sidebar-action-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-sidebar-action-menu' }
})

export class SidebarActionMenuComponent {

    /** The title of the sidebar action. */
    @Input()
    title: string;

    /** Toggle the sidebar action menu on expand. */
    @Input()
    expanded: boolean;

    /** Width in pixels for sidebar action menu options. */
    @Input()
    width: number = 272;

    isExpanded(): boolean {
        return this.expanded;
    }
}

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({ selector: '[adf-sidebar-menu-options], [sidebar-menu-options]' }) export class SidebarMenuDirective {}
@Directive({ selector: '[adf-sidebar-menu-title-icon], [sidebar-menu-title-icon]' }) export class SidebarMenuTitleIconDirective { }
@Directive({ selector: '[adf-sidebar-menu-expand-icon], [sidebar-menu-expand-icon]' }) export class SidebarMenuExpandIconDirective { }

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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { UserPreferencesService, AppConfigService, AlfrescoApiService, UserPreferenceValues } from '@alfresco/adf-core';
import { ThemePalette } from '@angular/material/core';

@Component({
    templateUrl: './app-layout.component.html',
    styleUrls: ['./app-layout.component.scss'],
    host: { class: 'app-layout' },
    encapsulation: ViewEncapsulation.None
})
export class AppLayoutComponent implements OnInit {
    links: Array<any> = [
        { href: '/home', icon: 'home', title: 'Home' },
        { href: '/files', icon: 'folder_open', title: 'Content Services' },
        { href: '/filtered-search', icon: 'rowing', title: 'Filter Header' },
        { href: '/breadcrumb', icon: 'label', title: 'Breadcrumb' },
        { href: '/card-view', icon: 'view_headline', title: 'CardView' },
        { href: '/confirm-dialog', icon: 'view_headline', title: 'Confirmation Dialog' },
        { href: '/node-selector', icon: 'attachment', title: 'Node Selector' },
        { href: '/task-list', icon: 'assignment', title: 'Task List' },
        {
            href: '/cloud', icon: 'cloud', title: 'Process Cloud', children: [
                { href: '/cloud/', icon: 'cloud', title: 'Home' },
                { href: '/cloud/community', icon: 'cloud', title: 'Community' },
                { href: '/form-cloud', icon: 'poll', title: 'Form' },
                { href: '/cloud/people-group-cloud', icon: 'group', title: 'People/Group Cloud' },
                { href: '/cloud/task-header-cloud', icon: 'cloud', title: 'Task Header Cloud' },
                { href: '/cloud/service-task-list', icon: 'cloud', title: 'Service Task List' }
            ]
        },
        { href: '/activiti', icon: 'device_hub', title: 'Process Services', children: [
            { href: '/activiti', icon: 'vpn_key', title: 'App' },
            { href: '/process-list', icon: 'assignment', title: 'Process List' },
            { href: '/form', icon: 'poll', title: 'Form' },
            { href: '/form-list', icon: 'library_books', title: 'Form List' },
            { href: '/form-loading', icon: 'cached', title: 'Form Loading' }
        ]},
        { href: '/login', icon: 'vpn_key', title: 'Login' },
        { href: '/trashcan', icon: 'delete', title: 'Trashcan' },
        { href: '/dl-custom-sources', icon: 'extension', title: 'Custom Sources' },
        { href: '/settings-layout', icon: 'settings', title: 'Settings' },
        { href: '/config-editor', icon: 'code', title: 'Configuration Editor' },
        { href: '/extendedSearch', icon: 'search', title: 'Extended Search' },
        /* cspell:disable-next-line */
        { href: '/overlay-viewer', icon: 'pageview', title: 'Overlay Viewer' },
        { href: '/treeview', icon: 'nature', title: 'Tree View' },
        { href: '/expandable-list', icon: 'hot_tub', title: 'Expandable item list' },
        { href: '/about', icon: 'info_outline', title: 'About' }
    ];

    expandedSidenav = false;

    position: 'start' | 'end' = 'start';
    direction = 'ltr';

    hideSidenav = false;
    showMenu = true;

    enableRedirect = true;
    color: ThemePalette = 'primary';
    title = 'ADF Demo Application';
    logo: string;
    redirectUrl: string | any[] = ['/home'];
    tooltip = 'ADF Demo Application';

    ngOnInit() {
        const expand = this.config.get<boolean>('sideNav.expandedSidenav');
        const preserveState = this.config.get('sideNav.preserveState');

        if (preserveState && expand) {
            this.expandedSidenav = (this.userPreferences.get('expandedSidenav', expand.toString()) === 'true');
        } else if (expand) {
            this.expandedSidenav = expand;
        }
    }

    constructor(
        private userPreferences: UserPreferencesService,
        private config: AppConfigService,
        private alfrescoApiService: AlfrescoApiService) {
        if (this.alfrescoApiService.getInstance().isOauthConfiguration()) {
            this.enableRedirect = false;
        }
    }

    setState(state) {
        if (this.config.get('sideNav.preserveState')) {
            this.userPreferences.set(UserPreferenceValues.ExpandedSideNavStatus, state);
        }
    }
}

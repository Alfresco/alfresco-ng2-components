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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { UserPreferencesService, AppConfigService, AlfrescoApiService, UserPreferenceValues } from '@alfresco/adf-core';
import { HeaderDataService } from '../header-data/header-data.service';

@Component({
    templateUrl: 'app-layout.component.html',
    styleUrls: ['app-layout.component.scss'],
    host: {
        'class': 'adf-app-layout'
    },
    encapsulation: ViewEncapsulation.None
})

export class AppLayoutComponent implements OnInit {

    links: Array<any> = [
        { href: '/home', icon: 'home', title: 'APP_LAYOUT.HOME' },
        {
            href: '/extensions', icon: 'extension', title: 'Extensions', children: [
                { href: '/extensions/document-list/presets', icon: 'extension', title: 'Document List' }
            ]
        },
        { href: '/files', icon: 'folder_open', title: 'APP_LAYOUT.CONTENT_SERVICES' },
        { href: '/breadcrumb', icon: 'label', title: 'APP_LAYOUT.BREADCRUMB' },
        { href: '/notifications', icon: 'alarm', title: 'APP_LAYOUT.NOTIFICATIONS' },
        { href: '/card-view', icon: 'view_headline', title: 'APP_LAYOUT.CARD_VIEW' },
        { href: '/confirm-dialog', icon: 'view_headline', title: 'APP_LAYOUT.CONFIRM-DIALOG' },
        { href: '/header-data', icon: 'edit', title: 'APP_LAYOUT.HEADER_DATA' },
        { href: '/node-selector', icon: 'attachment', title: 'APP_LAYOUT.NODE-SELECTOR' },
        { href: '/sites', icon: 'format_list_bulleted', title: 'APP_LAYOUT.SITES' },
        { href: '/task-list', icon: 'assignment', title: 'APP_LAYOUT.TASK_LIST' },
        { href: '/cloud', icon: 'cloud', title: 'APP_LAYOUT.PROCESS_CLOUD', children: [
            { href: '/cloud/', icon: 'cloud', title: 'APP_LAYOUT.HOME' },
            { href: '/cloud/community', icon: 'cloud', title: 'APP_LAYOUT.COMMUNITY' },
            { href: '/form-cloud', icon: 'poll', title: 'APP_LAYOUT.FORM' },
            { href: '/cloud/people-group-cloud', icon: 'group', title: 'APP_LAYOUT.PEOPLE_GROUPS_CLOUD' }
        ]},
        { href: '/activiti', icon: 'device_hub', title: 'APP_LAYOUT.PROCESS_SERVICES', children: [
            { href: '/activiti', icon: 'vpn_key', title: 'APP_LAYOUT.APP' },
            { href: '/process-list', icon: 'assignment', title: 'APP_LAYOUT.PROCESS_LIST' },
            { href: '/form', icon: 'poll', title: 'APP_LAYOUT.FORM' },
            { href: '/form-list', icon: 'library_books', title: 'APP_LAYOUT.FORM_LIST' },
            { href: '/form-loading', icon: 'cached', title: 'APP_LAYOUT.FORM_LOADING' }
        ]},
        { href: '/login', icon: 'vpn_key', title: 'APP_LAYOUT.LOGIN' },
        { href: '/trashcan', icon: 'delete', title: 'APP_LAYOUT.TRASHCAN' },
        { href: '/dl-custom-sources', icon: 'extension', title: 'APP_LAYOUT.CUSTOM_SOURCES' },
        { href: '/datatable', icon: 'view_module', title: 'APP_LAYOUT.DATATABLE', children: [
            { href: '/datatable', icon: 'view_module', title: 'APP_LAYOUT.DATATABLE' },
            { href: '/datatable-lazy', icon: 'view_module', title: 'APP_LAYOUT.DATATABLE_LAZY' },
            { href: '/datatable/dnd', icon: 'view_module', title: 'Drag and Drop' },
            { href: '/copy-content', icon: 'view_module', title: 'Copy Content' }
        ]},
        { href: '/template-list', icon: 'list_alt', title: 'APP_LAYOUT.TEMPLATE' },
        { href: '/webscript', icon: 'extension', title: 'APP_LAYOUT.WEBSCRIPT' },
        { href: '/tag', icon: 'local_offer', title: 'APP_LAYOUT.TAG' },
        { href: '/social', icon: 'thumb_up', title: 'APP_LAYOUT.SOCIAL' },
        { href: '/settings-layout', icon: 'settings', title: 'APP_LAYOUT.SETTINGS' },
        { href: '/config-editor', icon: 'code', title: 'APP_LAYOUT.CONFIG-EDITOR' },
        { href: '/extendedSearch', icon: 'search', title: 'APP_LAYOUT.SEARCH' },
        /* cspell:disable-next-line */
        { href: '/overlay-viewer', icon: 'pageview', title: 'APP_LAYOUT.OVERLAY_VIEWER' },
        { href: '/treeview', icon: 'nature', title: 'APP_LAYOUT.TREE_VIEW' },
        { href: '/icons', icon: 'tag_faces', title: 'APP_LAYOUT.ICONS' },
        { href: '/about', icon: 'info_outline', title: 'APP_LAYOUT.ABOUT' }
    ];

    expandedSidenav = false;

    position = 'start';
    direction = 'ltr';

    hideSidenav = false;
    showMenu = true;

    enableRedirect = true;
    color = 'primary';
    title = 'APP_LAYOUT.APP_NAME';
    logo: string;
    redirectUrl: string | any[] = ['/home'];
    tooltip = 'APP_LAYOUT.APP_NAME';

    ngOnInit() {
        const expand = this.config.get<boolean>('sideNav.expandedSidenav');
        const preserveState = this.config.get('sideNav.preserveState');

        if (preserveState && expand) {
            this.expandedSidenav = (this.userPreferences.get('expandedSidenav', expand.toString()) === 'true');
        } else if (expand) {
            this.expandedSidenav = expand;
        }

        this.headerService.hideMenu.subscribe((show) => this.showMenu = show);
        this.headerService.color.subscribe((color) => this.color = color);
        this.headerService.title.subscribe((title) => this.title = title);
        this.headerService.logo.subscribe((path) => this.logo = path);
        this.headerService.redirectUrl.subscribe((redirectUrl) => this.redirectUrl = redirectUrl);
        this.headerService.tooltip.subscribe((tooltip) => this.tooltip = tooltip);
        this.headerService.position.subscribe((position) => this.position = position);
        this.headerService.hideSidenav.subscribe((hideSidenav) => this.hideSidenav = hideSidenav);

        this.userPreferencesService.select('textOrientation').subscribe((textOrientation) => {
            this.direction = textOrientation;
        });
    }

    constructor(
        private userPreferences: UserPreferencesService,
        private config: AppConfigService,
        private alfrescoApiService: AlfrescoApiService,
        private userPreferencesService: UserPreferencesService,
        private headerService: HeaderDataService) {
        if (this.alfrescoApiService.getInstance().isOauthConfiguration()) {
            this.enableRedirect = false;
        }

        this.userPreferencesService.set('textOrientation', this.direction);
    }

    setState(state) {
        if (this.config.get('sideNav.preserveState')) {
            this.userPreferences.set(UserPreferenceValues.ExpandedSideNavStatus, state);
        }
    }
}

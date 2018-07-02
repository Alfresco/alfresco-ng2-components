/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { UserPreferencesService, AppConfigService, AlfrescoApiService } from '@alfresco/adf-core';

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
        { href: '/files', icon: 'folder_open', title: 'APP_LAYOUT.CONTENT_SERVICES' },
        { href: '/breadcrumb', icon: 'label', title: 'APP_LAYOUT.BREADCRUMB' },
        { href: '/notifications', icon: 'alarm', title: 'APP_LAYOUT.NOTIFICATIONS'},
        { href: '/node-selector', icon: 'attachment', title: 'APP_LAYOUT.NODE-SELECTOR' },
        { href: '/activiti', icon: 'device_hub', title: 'APP_LAYOUT.PROCESS_SERVICES' },
        { href: '/login', icon: 'vpn_key', title: 'APP_LAYOUT.LOGIN' },
        { href: '/trashcan', icon: 'delete', title: 'APP_LAYOUT.TRASHCAN' },
        { href: '/dl-custom-sources', icon: 'extension', title: 'APP_LAYOUT.CUSTOM_SOURCES' },
        { href: '/datatable', icon: 'view_module', title: 'APP_LAYOUT.DATATABLE' },
        { href: '/datatable-lazy', icon: 'view_module', title: 'APP_LAYOUT.DATATABLE_LAZY' },
        { href: '/form', icon: 'poll', title: 'APP_LAYOUT.FORM' },
        { href: '/form-list', icon: 'library_books', title: 'APP_LAYOUT.FORM_LIST' },
        { href: '/form-loading', icon: 'cached', title: 'APP_LAYOUT.FORM_LOADING' },
        { href: '/webscript', icon: 'extension', title: 'APP_LAYOUT.WEBSCRIPT' },
        { href: '/tag', icon: 'local_offer', title: 'APP_LAYOUT.TAG' },
        { href: '/social', icon: 'thumb_up', title: 'APP_LAYOUT.SOCIAL' },
        { href: '/settings-layout', icon: 'settings', title: 'APP_LAYOUT.SETTINGS' },
        { href: '/extendedSearch', icon: 'search', title: 'APP_LAYOUT.SEARCH' },
        { href: '/overlay-viewer', icon: 'pageview', title: 'APP_LAYOUT.OVERLAY_VIEWER' },
        { href: '/about', icon: 'info_outline', title: 'APP_LAYOUT.ABOUT' }
    ];

    expandedSidenav = false;

    hideSidenav = false;

    enabelRedirect = true;

    ngOnInit() {
        const expand = this.config.get<boolean>('sideNav.expandedSidenav');
        const preserveState = this.config.get('sideNav.preserveState');

        if (preserveState && expand) {
            this.expandedSidenav = (this.userpreference.get('expandedSidenav', expand.toString()) === 'true');
        } else if (expand) {
            this.expandedSidenav = expand;
        }
    }

    constructor(private userpreference: UserPreferencesService, private config: AppConfigService, private alfrescoApiService: AlfrescoApiService) {
        if (this.alfrescoApiService.getInstance().isOauthConfiguration()) {
            this.enabelRedirect = false;
        }
    }

    setState(state) {
        if (this.config.get('sideNav.preserveState')) {
            this.userpreference.set('expandedSidenav', state);
        }
    }
}

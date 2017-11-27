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

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    templateUrl: 'app-layout.component.html',
    styleUrls: ['app-layout.component.scss'],
    host: {
        'class': 'adf-app-layout'
    },
    encapsulation: ViewEncapsulation.None
})
export class AppLayoutComponent {

    links: Array<any> = [
        { href: '/home', icon: 'home', title: 'APP_LAYOUT.HOME' },
        { href: '/files', icon: 'folder_open', title: 'APP_LAYOUT.CONTENT_SERVICES' },
        { href: '/activiti', icon: 'device_hub', title: 'APP_LAYOUT.PROCESS_SERVICES' },
        { href: '/login', icon: 'vpn_key', title: 'APP_LAYOUT.LOGIN' },
        { href: '/dl-custom-sources', icon: 'extension', title: 'APP_LAYOUT.CUSTOM_SOURCES' },
        { href: '/datatable', icon: 'view_module', title: 'APP_LAYOUT.DATATABLE' },
        { href: '/form', icon: 'poll', title: 'APP_LAYOUT.FORM' },
        { href: '/form-list', icon: 'library_books', title: 'APP_LAYOUT.FORM_LIST' },
        { href: '/uploader', icon: 'file_upload', title: 'APP_LAYOUT.UPLOADER' },
        { href: '/webscript', icon: 'extension', title: 'APP_LAYOUT.WEBSCRIPT' },
        { href: '/tag', icon: 'local_offer', title: 'APP_LAYOUT.TAG' },
        { href: '/social', icon: 'thumb_up', title: 'APP_LAYOUT.SOCIAL' },
        { href: '/settings', icon: 'settings', title: 'APP_LAYOUT.SETTINGS' },
        { href: '/overlay-viewer', icon: 'pageview', title: 'APP_LAYOUT.OVERLAY_VIEWER' },
        { href: '/about', icon: 'info_outline', title: 'APP_LAYOUT.ABOUT' }
    ];

    constructor(){};
}

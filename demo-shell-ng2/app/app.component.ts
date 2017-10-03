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
import { AlfrescoSettingsService, AlfrescoTranslationService, PageTitle, StorageService } from 'ng2-alfresco-core';

@Component({
    selector: 'adf-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss', './theme.scss'],
    host: {
        'class': 'adf-app'
    },
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    searchTerm: string = '';

    links: Array<any> = [
        { href: '/home', icon: 'home', title: 'Home' },
        { href: '/files', icon: 'folder_open', title: 'Content Services' },
        { href: '/activiti', icon: 'device_hub', title: 'Process Services' },
        { href: '/login', icon: 'vpn_key', title: 'Login' },
        { href: '/dl-custom-sources', icon: 'extension', title: 'DL: Custom Sources' },
        { href: '/datatable', icon: 'view_module', title: 'DataTable' },
        { href: '/form', icon: 'poll', title: 'Form' },
        { href: '/form-list', icon: 'library_books', title: 'Form List' },
        { href: '/uploader', icon: 'file_upload', title: 'Uploader' },
        { href: '/webscript', icon: 'extension', title: 'Webscript' },
        { href: '/tag', icon: 'local_offer', title: 'Tag' },
        { href: '/social', icon: 'thumb_up', title: 'Social' },
        { href: '/settings', icon: 'settings', title: 'Settings' },
        { href: '/about', icon: 'info_outline', title: 'About' }
    ];

    constructor(private settingsService: AlfrescoSettingsService,
                private translateService: AlfrescoTranslationService,
                private storage: StorageService,
                pageTitle: PageTitle) {
        this.setProvider();
        pageTitle.setTitle();
    }

    isAPageWithHeaderBar(): boolean {
        return location.pathname === '/login' || location.pathname === '/settings';
    }

    changeLanguage(lang: string) {
        this.translateService.use(lang);
    }

    private setProvider() {
        if (this.storage.hasItem(`providers`)) {
            this.settingsService.setProviders(this.storage.getItem(`providers`));
        }
    }
}

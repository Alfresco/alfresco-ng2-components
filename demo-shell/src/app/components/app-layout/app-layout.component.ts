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

import { Component, ViewEncapsulation } from '@angular/core';
import {
    AvatarComponent,
    HeaderLayoutComponent,
    LogoutDirective,
    SidenavLayoutComponent,
    SidenavLayoutContentDirective,
    SidenavLayoutHeaderDirective,
    SidenavLayoutNavigationDirective
} from '@alfresco/adf-core';
import { SearchBarComponent } from '../search/search-bar.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLineModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AlfrescoApiService, FileUploadingDialogComponent } from '@alfresco/adf-content-services';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        SidenavLayoutComponent,
        SidenavLayoutHeaderDirective,
        HeaderLayoutComponent,
        SearchBarComponent,
        UserInfoComponent,
        AvatarComponent,
        MatMenuModule,
        SidenavLayoutNavigationDirective,
        MatListModule,
        TranslateModule,
        MatIconModule,
        MatLineModule,
        RouterLink,
        RouterLinkActive,
        LogoutDirective,
        SidenavLayoutContentDirective,
        RouterOutlet,
        FileUploadingDialogComponent
    ],
    templateUrl: './app-layout.component.html',
    styleUrls: ['./app-layout.component.scss'],
    host: { class: 'app-layout' },
    encapsulation: ViewEncapsulation.None
})
export class AppLayoutComponent {
    links: Array<any> = [
        { href: '/home', icon: 'home', title: 'Home' },
        { href: '/files', icon: 'folder_open', title: 'Content Services' },
        { href: '/card-view', icon: 'view_headline', title: 'CardView' },
        { href: '/task-list', icon: 'assignment', title: 'Task List' },
        {
            href: '/cloud',
            icon: 'cloud',
            title: 'Process Cloud',
            children: [
                { href: '/cloud/', icon: 'cloud', title: 'Home' },
                { href: '/form-cloud', icon: 'poll', title: 'Form' }
            ]
        },
        {
            href: '/activiti',
            icon: 'device_hub',
            title: 'Process Services',
            children: [
                { href: '/activiti', icon: 'vpn_key', title: 'App' },
                { href: '/process-list', icon: 'assignment', title: 'Process List' },
                { href: '/form', icon: 'poll', title: 'Form' }
            ]
        },
        { href: '/login', icon: 'vpn_key', title: 'Login' },
        { href: '/settings-layout', icon: 'settings', title: 'Settings' }
    ];

    enableRedirect = true;

    constructor(private alfrescoApiService: AlfrescoApiService) {
        if (this.alfrescoApiService.getInstance().isOauthConfiguration()) {
            this.enableRedirect = false;
        }
    }
}

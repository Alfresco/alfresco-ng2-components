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
import { UserInfoComponent } from './user-info/user-info.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLineModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FileUploadingDialogComponent } from '@alfresco/adf-content-services';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        SidenavLayoutComponent,
        SidenavLayoutHeaderDirective,
        HeaderLayoutComponent,
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
        { href: '/home', title: 'Home' },
        { href: '/files', title: 'Content Services' },
        {
            href: '/cloud',
            title: 'Process Cloud',
            children: [
                { href: '/cloud/', title: 'Home' },
                { href: '/form-cloud', title: 'Form' }
            ]
        },
        {
            href: '/activiti',
            title: 'Process Services',
            children: [
                { href: '/activiti', title: 'App' },
                { href: '/process-list', title: 'Process List' },
                { href: '/form', title: 'Form' }
            ]
        },
        { href: '/login', title: 'Login' },
        { href: '/settings-layout', title: 'Settings' }
    ];

    enableRedirect = true;

    constructor(private alfrescoApiService: AlfrescoApiService) {
        if (this.alfrescoApiService.getInstance().isOauthConfiguration()) {
            this.enableRedirect = false;
        }
    }
}

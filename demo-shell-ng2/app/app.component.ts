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

import { Component } from '@angular/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { FilesComponent } from './components/files/files.component';

import {
    MDL,
    AlfrescoSettingsService,
    AlfrescoTranslationService,
    AlfrescoPipeTranslate,
    AlfrescoAuthenticationService
} from 'ng2-alfresco-core';
import { UploadButtonComponent } from 'ng2-alfresco-upload';
import { DataTableDemoComponent } from './components/datatable/datatable-demo.component';
import { SearchComponent } from './components/search/search.component';
import { SearchBarComponent } from './components/search/search-bar.component';
import { LoginDemoComponent } from './components/login/login-demo.component';
import { TasksDemoComponent } from './components/tasks/tasks-demo.component';

declare var document: any;

@Component({
    selector: 'alfresco-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    directives: [SearchBarComponent, ROUTER_DIRECTIVES, MDL],
    pipes: [AlfrescoPipeTranslate]
})
@RouteConfig([
    {path: '/home', name: 'Home', component: FilesComponent},
    {path: '/files', name: 'Files', component: FilesComponent},
    {path: '/datatable', name: 'DataTable', component: DataTableDemoComponent},
    {path: '/', name: 'Login', component: LoginDemoComponent, useAsDefault: true},
    {path: '/uploader', name: 'Uploader', component: UploadButtonComponent},
    {path: '/login', name: 'Login', component: LoginDemoComponent},
    {path: '/search', name: 'Search', component: SearchComponent},
    {path: '/tasks', name: 'Tasks', component: TasksDemoComponent}
])
export class AppComponent {
    translate: AlfrescoTranslationService;
    searchTerm: string = '';

    constructor(public auth: AlfrescoAuthenticationService,
                public router: Router,
                translate: AlfrescoTranslationService,
                alfrescoSettingsService: AlfrescoSettingsService) {
        alfrescoSettingsService.host = 'http://192.168.99.100:8080';

        this.translate = translate;
        this.translate.addTranslationFolder();
    }

    isActive(instruction: any[]): boolean {
        return this.router.isRouteActive(this.router.generate(instruction));
    }

    isLoggedIn(): boolean {
        return this.auth.isLoggedIn();
    }

    onLogout(event) {
        event.preventDefault();
        this.auth.logout()
            .subscribe(
                () => this.router.navigate(['Login'])
            );
    }

    onToggleSearch(event) {
        let expandedHeaderClass = 'header-search-expanded',
            header = document.querySelector('header');
        if (event.expanded) {
            header.classList.add(expandedHeaderClass);
        } else {
            header.classList.remove(expandedHeaderClass);
        }
    }

    changeLanguage(lang: string) {
        this.translate.use(lang);
    }

    hideDrawer() {
        // todo: workaround for drawer closing
        document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
    }
}

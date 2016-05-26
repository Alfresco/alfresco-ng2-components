/**
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

import { Component } from 'angular2/core';
import { ControlGroup, FormBuilder, Validators } from 'angular2/common';
import { Router, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { MDL } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { FilesComponent } from './components/files/files.component';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-login/dist/ng2-alfresco-login';
import { AuthRouterOutlet } from './components/router/AuthRouterOutlet';
import { AlfrescoSettingsService, AlfrescoTranslationService, AlfrescoPipeTranslate } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { UploadButtonComponent } from 'ng2-alfresco-upload/dist/ng2-alfresco-upload';
import { DataTableDemoComponent } from './components/datatable/datatable-demo.component';
import { AlfrescoSearchComponent } from 'ng2-alfresco-search/dist/ng2-alfresco-search';
import { LoginDemoComponent } from './components/login/login-demo.component';
import { ViewerFileComponent } from './components/viewer/viewer.component';

declare var document: any;

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES, AuthRouterOutlet, MDL],
    pipes: [AlfrescoPipeTranslate]
})
@RouteConfig([
    {path: '/home', name: 'Home', component: FilesComponent},
    {path: '/', name: 'Files', component: FilesComponent, useAsDefault: true},
    {path: '/datatable', name: 'DataTable', component: DataTableDemoComponent},
    {path: '/uploader', name: 'Uploader', component: UploadButtonComponent},
    {path: '/login', name: 'Login', component: LoginDemoComponent},
    {path: '/search', name: 'Search', component: AlfrescoSearchComponent},
    {path: '/viewer', name: 'Viewer', component: ViewerFileComponent}
])
export class AppComponent {
    translate: AlfrescoTranslationService;
    searchForm: ControlGroup;

    constructor(private _fb: FormBuilder,
                public auth: AlfrescoAuthenticationService,
                public router: Router,
                translate: AlfrescoTranslationService,
                alfrescoSettingsService: AlfrescoSettingsService) {
        alfrescoSettingsService.host = 'http://192.168.99.100:8080';

        this.searchForm = this._fb.group({
            searchTerm: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
        });

        this.translate = translate;
        this.translate.translationInit();
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

    changeLanguage(lang: string) {
        this.translate.use(lang);
    }

    hideDrawer() {
        // todo: workaround for drawer closing
        document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
    }

    /**
     * Method called on submit form
     * @param value
     * @param event
     */
    onSearch(value: any, event) {
        if (event) {
            event.preventDefault();
        }
        this.router.navigate(['Search', value]);
    }
}

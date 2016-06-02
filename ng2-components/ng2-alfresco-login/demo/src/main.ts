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

import { bootstrap }    from 'angular2/platform/browser';
import { Component } from 'angular2/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { AlfrescoLoginComponent } from 'ng2-alfresco-login/dist/ng2-alfresco-login';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS }    from 'angular2/http';
import { ALFRESCO_CORE_PROVIDERS, AlfrescoTranslationService, AlfrescoTranslationLoader } from 'ng2-alfresco-core/dist/ng2-alfresco-core';


@RouteConfig([
    {path: '/', name: 'Login', component: AlfrescoLoginComponent, useAsDefault: true}
])
@Component({
    selector: 'my-app',
    template: `<label for="token"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="token" type="text" size="48" (change)="updateHost()" [(ngModel)]="host"><br><br>
               {{ status }}
               <hr>
               <alfresco-login method="POST" (onSuccess)="mySuccessMethod($event)" (onError)="myErrorMethod($event)"></alfresco-login>`,
    directives: [ROUTER_DIRECTIVES, AlfrescoLoginComponent]
})
export class AppComponent {

    public host: string = 'http://192.168.99.100:8080';

    public token: string;

    public status: string = '';

    constructor(public auth: AlfrescoAuthenticationService, public router: Router, private alfrescoSettingsService: AlfrescoSettingsService) {
        alfrescoSettingsService.host = this.host;
    }

    public updateHost(): void {
        this.alfrescoSettingsService.host = this.host;
    }

    mySuccessMethod($event) {
        console.log('Success Login EventEmitt called with: ' + $event.value);
        this.status = $event.value;
    }

    myErrorMethod($event) {
        console.log('Error Login EventEmitt called with: ' + $event.value);
        this.status = $event.value;
    }
}

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    AlfrescoTranslationLoader,
    AlfrescoTranslationService,
    AlfrescoAuthenticationService,
    ALFRESCO_CORE_PROVIDERS
]);

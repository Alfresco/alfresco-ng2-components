///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>

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
import { AlfrescoLoginComponent } from 'ng2-alfresco-login/ng2-alfresco-login';
import { Router, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { AlfrescoSettingsService } from 'ng2-alfresco-core/services';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-login/ng2-alfresco-login';


@Component({
    selector: 'my-login',
    template: '<alfresco-login method="POST" (onSuccess)="mySuccessMethod($event)" (onError)="myErrorMethod($event)"></alfresco-login>',
    directives: [ROUTER_DIRECTIVES, AlfrescoLoginComponent]
})

@RouteConfig([
    {path: '/', name: 'Login', component: AlfrescoLoginComponent, useAsDefault: true}
])
export class MyLoginComponent {

    constructor(public auth: AlfrescoAuthenticationService,
                public router: Router,
                alfrescoSettingsService: AlfrescoSettingsService) {
        alfrescoSettingsService.host = 'http://192.168.99.100:8080';

    }

    mySuccessMethod($event) {
        console.log('Success Login EventEmitt called with: ' + $event.value);
    }

    myErrorMethod($event) {
        console.log('Error Login EventEmitt called with: ' + $event.value);
    }

}

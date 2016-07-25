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
import { bootstrap } from '@angular/platform-browser-dynamic';
import { AlfrescoLoginComponent } from 'ng2-alfresco-login';
import { HTTP_PROVIDERS } from '@angular/http';
import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService
} from 'ng2-alfresco-core';


@Component({
    selector: 'my-app',
    template: `
    <label for="token"><b>Insert the ip of your Alfresco instance:</b></label><br>
       <input id="token" type="text" size="48" (change)="updateHost()" [(ngModel)]="host"><br><br>
       <div style="border-radius: 8px; position: absolute; background-color: papayawhip; color: cadetblue; left: 10px; top: 120px; z-index: 1;">
        <p style="width:120px;margin: 20px;">
        <label for="switch1" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
            <input type="checkbox" id="switch1" class="mdl-switch__input" checked
             (click)="toggleECM(ecm.checked)" #ecm>
            <span class="mdl-switch__label">ECM</span>
        </label>
        </p>
        <p style="width:120px;margin: 20px;">
            <label for="switch2" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                <input type="checkbox" id="switch2" class="mdl-switch__input"
                 (click)="toggleBPM(bpm.checked)" #bpm>
                <span class="mdl-switch__label">BPM</span>
            </label>
        </p>
        </div>
       {{ status }}
       <hr>

       <alfresco-login [providers]="providers" (onSuccess)="mySuccessMethod($event)"
       (onError)="myErrorMethod($event)"></alfresco-login>`,
    directives: [AlfrescoLoginComponent]
})
export class AppComponent {

    public ecmHost: string = 'http://devproducts-platform.alfresco.me';

    public token: string;

    public status: string = '';

    public providers: string [] = ['ECM'];

    constructor(public auth: AlfrescoAuthenticationService,
                private alfrescoSettingsService: AlfrescoSettingsService) {
        alfrescoSettingsService.ecmHost = this.ecmHost;
    }

    public updateHost(): void {
        this.alfrescoSettingsService.ecmHost = this.ecmHost;
    }

    mySuccessMethod($event) {
        console.log('Success Login EventEmitt called with: ' + $event.value);
        this.status = $event.value;
    }

    myErrorMethod($event) {
        console.log('Error Login EventEmitt called with: ' + $event.value);
        this.status = $event.value;
    }

    toggleECM(checked) {
        if (checked) {
            this.providers[0] = 'ECM';
        } else {
            this.providers[0] = '';
        }
    }

    toggleBPM(checked) {
        if (checked) {
            this.providers[1] = 'BPM';
        } else {
            this.providers[1] = '';
        }
    }
}

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);

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

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { LoginModule } from 'ng2-alfresco-login';

@Component({
    selector: 'my-app',
    template: `
    <label for="host"><b>Insert the ip of your Alfresco instance:</b></label><br>
       <input id="host" type="text" size="48" (change)="updateHost()" [(ngModel)]="ecmHost"><br><br>
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
       (onError)="myErrorMethod($event)"></alfresco-login>`
})
export class AppComponent {

    public ecmHost: string = 'http://devproducts-platform.alfresco.me';

    public ticket: string;

    public status: string = '';

    public providers: string = 'ECM';

    constructor(public auth: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = this.ecmHost;
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
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
        if (checked && this.providers === 'BPM') {
            this.providers = 'ALL';
        } else if (checked) {
            this.providers = 'ECM';
        } else {
            this.providers = undefined;
        }
    }

    toggleBPM(checked) {
        if (checked && this.providers === 'ECM') {
            this.providers = 'ALL';
        } else if (checked) {
            this.providers = 'BPM';
        } else {
            this.providers = undefined;
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        LoginModule
    ],
    declarations: [ AppComponent ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

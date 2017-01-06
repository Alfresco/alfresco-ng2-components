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

import { CoreModule, SettingsService, AuthService, StorageService, LogService } from 'ng2-alfresco-core';
import { LoginModule } from 'ng2-alfresco-login';

@Component({
    selector: 'alfresco-app-demo',
    template: `
    <label for="host"><b>Insert the ip of your Alfresco and Activiti instance:</b></label><br>
       ECM Host:  <input id="ecmHost" type="text" size="48" (change)="updateEcmHost()" [(ngModel)]="ecmHost"><br>
       BPM Host:  <input id="bpmHost" type="text" size="48" (change)="updateBpmHost()" [(ngModel)]="bpmHost"><br>
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
        <p style="width:120px;margin: 20px;">
            <label for="switch3" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                <input type="checkbox" id="switch3" class="mdl-switch__input" checked (click)="toggleCSRF()" #csrf>
                <span class="mdl-switch__label">CSRF</span>
            </label>
        </p>
        </div>
       {{ status }}
       <hr>

       <alfresco-login [providers]="providers"
                       [disableCsrf]="disableCsrf"
                       (onSuccess)="mySuccessMethod($event)"
                       (onError)="myErrorMethod($event)"></alfresco-login>`
})
export class AppComponent {

    ecmHost: string = 'http://localhost:8080';
    bpmHost: string = 'http://localhost:9999';
    ticket: string;
    status: string = '';
    providers: string = 'ECM';
    disableCsrf: boolean = false;

    constructor(private authService: AuthService,
                private settingsService: SettingsService,
                private storage: StorageService,
                private logService: LogService) {

        settingsService.ecmHost = this.ecmHost;
        settingsService.bpmHost = this.bpmHost;
    }

    updateEcmHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
    }

    updateBpmHost(): void {
        this.settingsService.bpmHost = this.bpmHost;
    }

    mySuccessMethod($event) {
        this.logService.info('Success Login EventEmitt called with: ' + $event.value);
        this.status = $event.value;
    }

    myErrorMethod($event) {
        this.logService.error('Error Login EventEmitt called with: ' + $event.value);
        this.status = $event.value;
    }

    toggleECM(checked) {
        if (checked && this.providers === 'BPM') {
            this.providers = 'ALL';
        } else if (checked) {
            this.providers = 'ECM';
        } else if (!checked && this.providers === 'ALL') {
            this.providers = 'BPM';
        }
    }

    toggleBPM(checked) {
        if (checked && this.providers === 'ECM') {
            this.providers = 'ALL';
        } else if (checked) {
            this.providers = 'BPM';
        } else if (!checked && this.providers === 'ALL') {
            this.providers = 'ECM';
        }
    }

    toggleCSRF() {
        this.disableCsrf = !this.disableCsrf;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        LoginModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);

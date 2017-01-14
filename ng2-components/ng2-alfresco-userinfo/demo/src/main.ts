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

import { NgModule, Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UserInfoComponentModule } from 'ng2-alfresco-userinfo';
import { CoreModule, AlfrescoAuthenticationService, AlfrescoSettingsService, LogService } from 'ng2-alfresco-core';
import { LoginModule } from 'ng2-alfresco-login';

@Component({
    selector: 'alfresco-app-demo',
    template: `
            <label for="host"><b>Insert the ip of your Alfresco and Activiti instance:</b></label><br>
               ECM Host:  <input id="ecmHost" type="text" size="48" (change)="updateEcmHost()" [(ngModel)]="ecmHost"><br>
               BPM Host:  <input id="bpmHost" type="text" size="48" (change)="updateBpmHost()" [(ngModel)]="bpmHost"><br>
               <div style="border-radius: 8px; position: absolute; background-color: papayawhip; color: cadetblue; right: 10px;
               top: 120px; z-index: 1;">

                <p style="width:120px;margin: 20px;">
                <label for="switch1" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                    <input type="checkbox" id="switch1" class="mdl-switch__input" [checked]="isECM"
                     (click)="toggleECM()" #ecm>
                    <span class="mdl-switch__label">ECM</span>
                </label>
                </p>
                <p style="width:120px;margin: 20px;">
                    <label for="switch2" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                        <input type="checkbox" id="switch2" class="mdl-switch__input" [checked]="isBPM"
                         (click)="toggleBPM()" #bpm>
                        <span class="mdl-switch__label">BPM</span>
                    </label>
                </p>
                <p style="width:120px;margin: 20px;">
                    <label for="switch3" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                        <input type="checkbox" id="switch3" class="mdl-switch__input" checked (click)="toggleCSRF()" #csrf>
                        <span class="mdl-switch__label">CSRF</span>
                    </label>
                </p>
                <p style="width:120px;margin: 20px;">
                    <button (click)="logout()" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">Logout</button>
                </p>
                </div>
               {{ status }}
               <hr>

               <!-- USER INFO COMPONENT -->
               <div style="position: absolute;z-index: 2;">
                    <ng2-alfresco-userinfo [menuOpenType]="left"></ng2-alfresco-userinfo>
               </div>

               <!-- LOGIN COMPONENT -->
                      <alfresco-login [providers]="providers"
                       [disableCsrf]="disableCsrf"></alfresco-login>`,
    styles: [
        ':host > .container {padding: 10px}',
        '.p-10 { padding: 10px; }'
    ]
})
class UserInfoDemo implements OnInit {

    ecmHost: string = 'http://localhost:8080';
    bpmHost: string = 'http://localhost:9999';
    userToLogin: string = 'admin';
    password: string = 'admin';
    loginErrorMessage: string;
    providers: string = 'ALL';

    private authenticated: boolean;
    private token: any;

    disableCsrf: boolean = false;
    isECM: boolean = true;
    isBPM: boolean = false;

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService,
                private logService: LogService) {
        settingsService.ecmHost = this.ecmHost;
        settingsService.bpmHost = this.bpmHost;
    }

    ngOnInit() {
        this.settingsService.setProviders(this.providers);
        this.initProviders();
    }

    logout() {
        this.authService.logout();
    }

    login(user, password) {
        this.settingsService.setProviders(this.providers);
        this.authService.login(user, password).subscribe(
            token => {
                this.logService.info(token);
                this.token = token;
                this.authenticated = true;
            },
            error => {
                this.logService.error(error);
                this.authenticated = false;
                this.loginErrorMessage = error;
            });
    }

    initProviders() {
        if (this.providers === 'BPM') {
            this.isECM = false;
            this.isBPM = true;
        } else if (this.providers === 'ECM') {
            this.isECM = true;
            this.isBPM = false;
        } else if (this.providers === 'ALL') {
            this.isECM = true;
            this.isBPM = true;
        }
    }

    toggleECM() {
        this.isECM = !this.isECM;
        this.settingsService.setProviders(this.updateProvider());
    }

    toggleBPM() {
        this.isBPM = !this.isBPM;
        this.settingsService.setProviders(this.updateProvider());
    }

    updateProvider() {
        if (this.isBPM && this.isECM) {
            this.providers = 'ALL';
            return this.providers;
        }

        if (this.isECM) {
            this.providers = 'ECM';
            return this.providers;
        }

        if (this.isBPM) {
            this.providers = 'BPM';
            return this.providers;
        }

        this.providers = '';
        return this.providers;
    };

    toggleCSRF() {
        this.disableCsrf = !this.disableCsrf;
    }

    updateEcmHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
    }

    updateBpmHost(): void {
        this.settingsService.bpmHost = this.bpmHost;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        UserInfoComponentModule.forRoot(),
        LoginModule
    ],
    declarations: [UserInfoDemo],
    bootstrap: [UserInfoDemo]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);

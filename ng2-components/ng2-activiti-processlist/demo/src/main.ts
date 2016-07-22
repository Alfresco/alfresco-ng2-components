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
import { Component, OnInit, Injectable, provide } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import {
    ACTIVITI_PROCESSLIST_PROVIDERS,
    ACTIVITI_PROCESSLIST_DIRECTIVES
} from 'ng2-activiti-processlist/dist/ng2-activiti-processlist';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    ALFRESCO_CORE_PROVIDERS
} from 'ng2-alfresco-core';
import { HTTP_PROVIDERS, BrowserXhr } from '@angular/http';

@Component({
  selector: 'my-app',
  template: `<activiti-processlist></activiti-processlist>`,
  providers: [ACTIVITI_PROCESSLIST_PROVIDERS],
  directives: [ACTIVITI_PROCESSLIST_DIRECTIVES]
})
class MyDemoApp implements OnInit {

    authenticated: boolean;
    host: string = 'http://127.0.0.1:9999';
    token: string;

    constructor(
        private authService: AlfrescoAuthenticationService,
        private alfrescoSettingsService: AlfrescoSettingsService
    ) {
        console.log('constructor');

        alfrescoSettingsService.host = this.host;
        if (this.authService.getTicket()) {
            this.token = this.authService.getTicket();
        }
    }

    ngOnInit() {
        this.login();
    }

    public updateToken(): void {
        localStorage.setItem('token', this.token);
    }

    public updateHost(): void {
        this.alfrescoSettingsService.host = this.host;
        this.login();
    }

    login() {
        this.authService.login('admin@app.activiti.com', 'admin', ['BPM']).subscribe(
            token => {
                console.log(token);
                this.token = token;
                this.authenticated = true;
            },
            error => {
                console.log(error);
                this.authenticated = false;
            });
    }
}

@Injectable()
export class CustomBrowserXhr extends BrowserXhr {
    constructor() {}
    build(): any {
        let xhr = super.build();
        xhr.withCredentials = true;
        return <any>(xhr);
    }
}

bootstrap(MyDemoApp, [
    ALFRESCO_CORE_PROVIDERS,
    HTTP_PROVIDERS,
    provide(BrowserXhr, { useClass: CustomBrowserXhr })
]);

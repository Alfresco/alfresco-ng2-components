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

import {Component} from '@angular/core';
import {AlfrescoLoginComponent} from 'ng2-alfresco-login';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'login-demo',
    templateUrl: './login-demo.component.html',
    directives: [ROUTER_DIRECTIVES, AlfrescoLoginComponent],
    pipes: []
})
export class LoginDemoComponent {

    providers: string = 'ECM';

    constructor(public router: Router) {
    }

    onLogin($event) {
        console.log($event);
        this.router.navigate(['/home']);
    }

    onError($event) {
        console.log($event);
    }

    toggleECM(checked) {
        if (checked && this.providers === 'BPM') {
            this.providers = 'ALL';
        } else if (checked) {
            this.providers = 'ECM';
        } else if (!checked && this.providers === 'ALL') {
            this.providers = 'BPM';
        } else {
            this.providers = undefined;
        }
    }

    toggleBPM(checked) {
        if (checked && this.providers === 'ECM') {
            this.providers = 'ALL';
        } else if (checked) {
            this.providers = 'BPM';
        } else if (!checked && this.providers === 'ALL') {
            this.providers = 'ECM';
        } else {
            this.providers = undefined;
        }
    }
}

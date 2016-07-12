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
import { AlfrescoLoginComponent } from 'ng2-alfresco-login';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'login-demo',
    templateUrl: './login-demo.component.html',
    directives: [ROUTER_DIRECTIVES, AlfrescoLoginComponent],
    pipes: []
})
export class LoginDemoComponent {

    constructor(public router: Router) {
    }

    providers: string [] = ['ECM'];

    onLogin($event) {
        console.log($event);
        this.router.navigate(['Home']);
    }

    onError($event) {
        console.log($event);
    }

    toggleECM(checked) {
        if (checked) {
            this.providers.push('ECM');
        } else {
            this.removeElement('ECM');
        }
    }

    toggleBPM(checked) {
        if (checked) {
            this.providers.push('BPM');
        } else {
            this.removeElement('BPM');
        }
    }

    removeElement(el: string) {
        for (let i = 0; i < this.providers.length; i++) {
            if (this.providers[i] === el) {
                this.providers.splice(i, 1);
                return false;
            }
        }
    }

}

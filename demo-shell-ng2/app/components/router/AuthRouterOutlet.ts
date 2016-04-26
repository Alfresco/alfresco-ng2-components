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
import { ElementRef, DynamicComponentLoader, Directive, Attribute } from 'angular2/core';
import { Router, RouterOutlet, ComponentInstruction } from 'angular2/router';
import {Authentication} from 'ng2-alfresco-login/ng2-alfresco-login';

@Directive({selector: 'auth-router-outlet'})
export class AuthRouterOutlet extends RouterOutlet {

    publicRoutes: Array<string>;
    private router: Router;

    constructor(
        _elementRef: ElementRef, _loader: DynamicComponentLoader,
        _parentRouter: Router, @Attribute('name') nameAttr: string,
        private authentication: Authentication
    ) {
        super(_elementRef, _loader, _parentRouter, nameAttr);

        this.router = _parentRouter;
        this.publicRoutes = [
            '', 'login', 'signup'
        ];
    }

    activate(instruction: ComponentInstruction) {
        if (this._canActivate(instruction.urlPath)) {
            return super.activate(instruction);
        }

        this.router.navigate(['Login']);
    }

    _canActivate(url) {
        return this.publicRoutes.indexOf(url) !== -1
            || this.authentication.isLoggedIn();
    }
}

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

import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthenticationSSOService } from '../services/authentication-sso.service';

@Directive({
    selector: '[adf-logout-sso]'
})
export class LogoutSSODirective implements OnInit {
    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private authSSOService: AuthenticationSSOService) {
    }

    ngOnInit() {
        if (this.elementRef.nativeElement) {
            this.renderer.listen(this.elementRef.nativeElement, 'click', (evt) => {
                evt.preventDefault();
                this.logout();
            });
        }
    }

    logout() {
        this.authSSOService.logOut();
    }

}

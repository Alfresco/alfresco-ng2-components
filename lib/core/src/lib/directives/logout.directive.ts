/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Input, Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from '../app-config/app-config.service';
import { AuthenticationService } from '../auth/services/authentication.service';

@Directive({
    selector: '[adf-logout]'
})
export class LogoutDirective implements OnInit {

    /** URI to redirect to after logging out. */
    @Input()
    redirectUri: string;

    /** Enable redirecting after logout */
    @Input()
    enableRedirect: boolean = true;

    constructor(private elementRef: ElementRef,
                private renderer: Renderer2,
                private router: Router,
                private appConfig: AppConfigService,
                private auth: AuthenticationService) {
    }

    ngOnInit() {

        if (this.elementRef.nativeElement) {
            this.renderer.listen(this.elementRef.nativeElement, 'click', (evt) => {
                evt.preventDefault();
                this.logout();
            });
        }
    }

    getRedirectUri() {
        if (this.redirectUri === undefined ) {
            return this.appConfig.get<string>('loginRoute', '/login');
        }
        return this.redirectUri;
    }

    logout() {
        this.auth.logout().subscribe(
            () => this.redirectToUri(),
            () => this.redirectToUri()
        );
    }

    redirectToUri() {
        if (this.enableRedirect && !this.auth.isOauth()) {
            const redirectRoute = this.getRedirectUri();
            this.router.navigate([redirectRoute]);
        }
    }
}

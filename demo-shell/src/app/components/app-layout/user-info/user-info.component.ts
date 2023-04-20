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

import { EcmUserModel, PeopleContentService } from '@alfresco/adf-content-services';
import { BpmUserModel, PeopleProcessService } from '@alfresco/adf-process-services';
import { AuthenticationService, IdentityUserModel, IdentityUserService, UserInfoMode } from '@alfresco/adf-core';
import { Component, OnInit, Input } from '@angular/core';
import { MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-shell-user-info',
    templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnInit {

    /** Custom choice for opening the menu at the bottom. Can be `before` or `after`. */
    @Input()
    menuPositionX: MenuPositionX = 'after';

    /** Custom choice for opening the menu at the bottom. Can be `above` or `below`. */
    @Input()
    menuPositionY: MenuPositionY = 'below';

    mode: UserInfoMode;
    ecmUser$: Observable<EcmUserModel>;
    bpmUser$: Observable<BpmUserModel>;
    identityUser$: Observable<IdentityUserModel>;
    selectedIndex: number;
    userInfoMode = UserInfoMode;

    constructor(private peopleContentService: PeopleContentService,
                private peopleProcessService: PeopleProcessService,
                private identityUserService: IdentityUserService,
                private authService: AuthenticationService) {
    }

    ngOnInit() {
        this.getUserInfo();
    }

    getUserInfo() {
        if (this.authService.isOauth()) {
            this.loadIdentityUserInfo();
            this.mode = UserInfoMode.SSO;

            if (this.authService.isECMProvider() && this.authService.isEcmLoggedIn()) {
                this.mode = UserInfoMode.CONTENT_SSO;
                this.loadEcmUserInfo();
            }

        } else if (this.isAllLoggedIn()) {
            this.loadEcmUserInfo();
            this.loadBpmUserInfo();
            this.mode = UserInfoMode.ALL;
        } else if (this.isEcmLoggedIn()) {
            this.loadEcmUserInfo();
            this.mode = UserInfoMode.CONTENT;
        } else if (this.isBpmLoggedIn()) {
            this.loadBpmUserInfo();
            this.mode = UserInfoMode.PROCESS;
        }
    }

    get isLoggedIn(): boolean {
        if (this.authService.isKerberosEnabled()) {
            return true;
        }
        return this.authService.isLoggedIn();
    }

    private loadEcmUserInfo(): void {
        this.ecmUser$ = this.peopleContentService.getCurrentUserInfo();
    }

    private loadBpmUserInfo() {
        this.bpmUser$ = this.peopleProcessService.getCurrentUserInfo();
    }

    private loadIdentityUserInfo() {
        this.identityUser$ = of(this.identityUserService.getCurrentUserInfo());
    }

    private isAllLoggedIn() {
        return (this.authService.isEcmLoggedIn() && this.authService.isBpmLoggedIn()) || (this.authService.isALLProvider() && this.authService.isKerberosEnabled());
    }

    private isBpmLoggedIn() {
        return this.authService.isBpmLoggedIn() || (this.authService.isECMProvider() && this.authService.isKerberosEnabled());
    }

    private isEcmLoggedIn() {
        return this.authService.isEcmLoggedIn() || (this.authService.isECMProvider() && this.authService.isKerberosEnabled());
    }
}


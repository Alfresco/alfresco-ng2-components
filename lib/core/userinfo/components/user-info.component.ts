/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, Input, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { BpmUserModel } from '../../models/bpm-user.model';
import { EcmUserModel } from '../../models/ecm-user.model';
import { IdentityUserModel } from '../../models/identity-user.model';
import { BpmUserService } from '../../services/bpm-user.service';
import { EcmUserService } from '../../services/ecm-user.service';
import { IdentityUserService } from '../../services/identity-user.service';
import { of, Observable } from 'rxjs';
import { MatMenuTrigger, MenuPositionX, MenuPositionY } from '@angular/material/menu';

@Component({
    selector: 'adf-userinfo',
    styleUrls: ['./user-info.component.scss'],
    templateUrl: './user-info.component.html',
    encapsulation: ViewEncapsulation.None
})
export class UserInfoComponent implements OnInit {

    @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;

    /** Custom path for the background banner image for ACS users. */
    @Input()
    ecmBackgroundImage: string = './assets/images/ecm-background.png';

    /** Custom path for the background banner image for APS users. */
    @Input()
    bpmBackgroundImage: string = './assets/images/bpm-background.png';

    /** Custom choice for opening the menu at the bottom. Can be `before` or `after`. */
    @Input()
    menuPositionX: MenuPositionX = 'after';

    /** Custom choice for opening the menu at the bottom. Can be `above` or `below`. */
    @Input()
    menuPositionY: MenuPositionY = 'below';

    /** Shows/hides the username next to the user info button. */
    @Input()
    showName: boolean = true;

    /** When the username is shown, this defines its position relative to the user info button.
     * Can be `right` or `left`.
     */
    @Input()
    namePosition: string = 'right';

    mode: string;

    ecmUser$: Observable<EcmUserModel>;
    bpmUser$: Observable<BpmUserModel>;
    identityUser$: Observable<IdentityUserModel>;
    selectedIndex: number;

    constructor(private ecmUserService: EcmUserService,
                private bpmUserService: BpmUserService,
                private identityUserService: IdentityUserService,
                private authService: AuthenticationService) {
    }

    ngOnInit() {
        this.getUserInfo();
    }

    getUserInfo() {
        if (this.authService.isOauth()) {
            this.loadIdentityUserInfo();
            this.mode = 'SSO';
        } else if (this.authService.isEcmLoggedIn() && this.authService.isBpmLoggedIn()) {
            this.loadEcmUserInfo();
            this.loadBpmUserInfo();
            this.mode = 'ALL';
        } else if (this.authService.isEcmLoggedIn()) {
            this.loadEcmUserInfo();
            this.mode = 'CONTENT';
        } else if (this.authService.isBpmLoggedIn()) {
            this.loadBpmUserInfo();
            this.mode = 'PROCESS';
        }
    }

    onKeyPress(event: KeyboardEvent) {
        this.closeUserModal(event);
    }

    private closeUserModal($event: KeyboardEvent) {
        if ($event.keyCode === 27) {
            this.trigger.closeMenu();
        }
    }

    get isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    private loadEcmUserInfo(): void {
        this.ecmUser$ = this.ecmUserService.getCurrentUserInfo();
    }

    private loadBpmUserInfo() {
        this.bpmUser$ = this.bpmUserService.getCurrentUserInfo();
    }

    private loadIdentityUserInfo() {
        this.identityUser$ = of(this.identityUserService.getCurrentUserInfo());
    }

    stopClosing(event: Event) {
        event.stopPropagation();
    }

    getEcmAvatar(avatarId: any): string {
        return this.ecmUserService.getUserProfileImage(avatarId);
    }

    getBpmUserImage(): string {
        return this.bpmUserService.getCurrentUserProfileImage();
    }

    get showOnRight(): boolean {
        return this.namePosition === 'right';
    }
}

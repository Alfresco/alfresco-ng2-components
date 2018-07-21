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

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { BpmUserModel } from './../models/bpm-user.model';
import { EcmUserModel } from './../models/ecm-user.model';
import { BpmUserService } from './../services/bpm-user.service';
import { EcmUserService } from './../services/ecm-user.service';

@Component({
    selector: 'adf-userinfo',
    styleUrls: ['./user-info.component.scss'],
    templateUrl: './user-info.component.html',
    encapsulation: ViewEncapsulation.None
})
export class UserInfoComponent implements OnInit {

    /** Custom path for the background banner image for ACS users. */
    @Input()
    ecmBackgroundImage: string = './assets/images/ecm-background.png';

    /** Custom path for the background banner image for APS users. */
    @Input()
    bpmBackgroundImage: string = './assets/images/bpm-background.png';

    /** Custom choice for opening the menu at the bottom. Can be `before` or `after`. */
    @Input()
    menuPositionX: string = 'after';

    /** Custom choice for opening the menu at the bottom. Can be `above` or `below`. */
    @Input()
    menuPositionY: string = 'below';

    /** Shows/hides the username next to the user info button. */
    @Input()
    showName: boolean = true;

    /** When the username is shown, this defines its position relative to the user info button.
     * Can be `right` or `left`.
     */
    @Input()
    namePosition: string = 'right';

    ecmUser: EcmUserModel;
    bpmUser: BpmUserModel;
    bpmUserImage: any;
    ecmUserImage: any;
    selectedIndex: number;

    constructor(private ecmUserService: EcmUserService,
                private bpmUserService: BpmUserService,
                private authService: AuthenticationService) {
    }

    ngOnInit() {
        this.getUserInfo();
    }

    getUserInfo() {
        this.loadEcmUserInfo();
        this.loadBpmUserInfo();
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    loadEcmUserInfo(): void {
        if (this.authService.isEcmLoggedIn()) {
            this.ecmUserService.getCurrentUserInfo()
                .subscribe((res) => {
                    this.ecmUser = new EcmUserModel(res);
                    this.getEcmAvatar();
                });
        } else {
            this.ecmUser = null;
            this.ecmUserImage = null;
        }
    }

    loadBpmUserInfo(): void {
        if (this.authService.isBpmLoggedIn()) {
            this.bpmUserService.getCurrentUserInfo()
                .subscribe((res) => {
                    this.bpmUser = new BpmUserModel(res);
                });
            this.bpmUserImage = this.bpmUserService.getCurrentUserProfileImage();
        } else {
            this.bpmUser = null;
            this.bpmUserImage = null;
        }
    }

    stopClosing(event) {
        event.stopPropagation();
    }

    private getEcmAvatar() {
        this.ecmUserImage = this.ecmUserService.getUserProfileImage(this.ecmUser.avatarId);
    }

    showOnRight() {
        return this.namePosition === 'right';
    }

    hasBpmUserPictureId(): boolean {
        return !!this.bpmUser.pictureId;
    }

    hasEcmUserAvatarId(): boolean {
        return !!this.ecmUser.avatarId;
    }

}

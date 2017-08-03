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

import { Component, Input, OnInit } from '@angular/core';
import { AlfrescoAuthenticationService, AlfrescoTranslationService } from 'ng2-alfresco-core';
import { BpmUserModel } from './../models/bpm-user.model';
import { EcmUserModel } from './../models/ecm-user.model';
import { BpmUserService } from './../services/bpm-user.service';
import { EcmUserService } from './../services/ecm-user.service';

declare var require: any;

@Component({
    selector: 'adf-userinfo, ng2-alfresco-userinfo',
    styleUrls: ['./user-info.component.css'],
    templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnInit {

    @Input()
    ecmBackgroundImage: string = require('../assets/images/ecm-background.png');

    @Input()
    bpmBackgroundImage: string = require('../assets/images/bpm-background.png');

    @Input()
    menuOpenType: string = 'right';

    @Input()
    fallBackThumbnailImage: string;

    ecmUser: EcmUserModel;
    bpmUser: BpmUserModel;
    anonymousImageUrl: string = require('../assets/images/anonymous.gif');
    bpmUserImage: any;
    ecmUserImage: any;

    constructor(private ecmUserService: EcmUserService,
                private bpmUserService: BpmUserService,
                private authService: AlfrescoAuthenticationService,
                translateService: AlfrescoTranslationService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-userinfo', 'assets/ng2-alfresco-userinfo');
        }
        authService.onLogin.subscribe((response) => {
            this.getUserInfo();
        });
    }

    ngOnInit() {
        this.getUserInfo();
    }

    getUserInfo() {
        this.getEcmUserInfo();
        this.getBpmUserInfo();
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    getEcmUserInfo(): void {
        if (this.authService.isEcmLoggedIn()) {
            this.ecmUserService.getCurrentUserInfo()
                .subscribe((res) => {
                        this.ecmUser = new EcmUserModel(res);
                        this.getEcmAvatar();
                    }
                );
        } else {
            this.ecmUser = null;
            this.ecmUserImage = null;
        }
    }

    getBpmUserInfo(): void {
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

    onImageLoadingError(event) {
        if (event) {
            let element = <any> event.target;
            element.src = this.fallBackThumbnailImage || this.anonymousImageUrl;
        }
    }

    stopClosing(event) {
        event.stopPropagation();
    }

    private getEcmAvatar() {
        this.ecmUserImage = this.ecmUserService.getUserProfileImage(this.ecmUser.avatarId);
    }

    getUserAvatar() {
        return this.ecmUserImage || this.bpmUserImage;
    }

    getBpmUserAvatar() {
        return this.bpmUserImage;
    }

    getEcmUserAvatar() {
        return this.ecmUserImage;
    }
}

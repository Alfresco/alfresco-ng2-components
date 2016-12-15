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

import { Component, OnInit, Input } from '@angular/core';
import { EcmUserModel } from './../models/ecm-user.model';
import { BpmUserModel } from './../models/bpm-user.model';
import { EcmUserService } from './../services/ecm-user.service';
import { BpmUserService } from './../services/bpm-user.service';
import { AlfrescoTranslationService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';

declare let componentHandler: any;

@Component({
    moduleId: module.id,
    selector: 'ng2-alfresco-userinfo',
    styleUrls: ['./user-info.component.css'],
    templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnInit {

    @Input()
    menuOpenType: string = 'right';

    ecmUser: EcmUserModel;
    bpmUser: BpmUserModel;

    bpmUserImage: string;
    ecmUserImage: string;

    constructor(private ecmUserService: EcmUserService,
                private bpmUserService: BpmUserService,
                private authService: AlfrescoAuthenticationService,
                private translate: AlfrescoTranslationService) {
        if (translate) {
            translate.addTranslationFolder('ng2-alfresco-userinfo', 'node_modules/ng2-alfresco-userinfo/dist/src');
        }
        authService.loginSubject.subscribe((response) => {
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
                        this.ecmUser = <EcmUserModel> res;
                        this.ecmUserImage = this.ecmUserService.getUserProfileImage(this.ecmUser.avatarId);
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
                    this.bpmUser = <BpmUserModel> res;
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

    getUserNameHeaderFor(env: string) {
        if (this.ecmUser && env === 'ECM') {
            return this.ecmUser.firstName || this.ecmUser.lastName;
        }

        if (this.bpmUser && env === 'BPM') {
            return this.formatValue(this.bpmUser.firstName) ||
                this.formatValue(this.bpmUser.lastName) ||
                this.formatValue(this.bpmUser.fullname);
        }
    }

    getUserAvatar() {
        return this.ecmUserImage || this.bpmUserImage;
    }

    formatValue(value: string) {
        return value === 'null' ? null : value;
    }
}

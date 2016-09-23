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

import { Component, OnInit } from '@angular/core';
import { ECMUserService } from './services/ecmUser.service';
import { BPMUserService } from './services/bpmUser.service';
import { EcmUserModel } from './models/ecmUser.model';
import { BpmUserModel } from './models/bpmUser.model';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';

declare let __moduleName: string;

@Component({
    selector: 'ng2-alfresco-userinfo',
    moduleId: __moduleName,
    styleUrls: ['./userinfo.component.css'],
    templateUrl: './userinfo.component.html',
    providers: [ECMUserService, BPMUserService, AlfrescoAuthenticationService]
})

export class UserInfoComponent implements OnInit {

    private  ecmUser: EcmUserModel;
    private  bpmUser: BpmUserModel;
    private baseComponentPath = __moduleName.replace('userinfo.component.js', '');
    private  anonymouseImageUrl: string = this.baseComponentPath + 'img/anonymous.gif';
    public   bpmUserImage: any;
    public   ecmUserImage: any;


    constructor(private ecmUserService: ECMUserService,
                private bpmUserService: BPMUserService,
                public authService: AlfrescoAuthenticationService) {
    }

    ngOnInit() {
        if (this.authService.getAlfrescoApi().ecmAuth.isLoggedIn()) {
            this.ecmUserService.getUserInfo('-me-')
                .subscribe(
                    (res) => {
                    this.ecmUser = <EcmUserModel> res;
                    this.getEcmUserProfileImage();
                }
            );
        }
        if (this.authService.getAlfrescoApi().bpmAuth.isLoggedIn()) {
            this.bpmUserService.getCurrentUserInfo()
                .subscribe(
                    (res) => {
                    this.bpmUser = <BpmUserModel> res;
                    this.getBpmUserProfileImage();
                }
            );
        }
    }

    private getBpmUserProfileImage() {
        this.bpmUserImage = this.bpmUserService.getCurrentUserProfileImage();
    }

    private getEcmUserProfileImage() {
        this.ecmUserImage = this.ecmUserService.getCurrentUserProfileImageUrl(this.ecmUser.avatarId);
    }

    public getUserAvatar() {
        return this.ecmUserImage || this.bpmUserImage ||  this.anonymouseImageUrl;
    }

    public getBpmUserDetailAvatarUrl() {
        return this.bpmUserImage || this.anonymouseImageUrl;
    }

    public getEcmUserDetailAvatarUrl() {
        return this.ecmUserImage || this.anonymouseImageUrl;
    }

    public formatValue(value: string) {
        return value === 'null' ? null : value;
    }

}

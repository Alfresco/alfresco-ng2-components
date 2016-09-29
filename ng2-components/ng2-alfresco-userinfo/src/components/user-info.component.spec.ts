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

import { UserInfoComponent } from './user-info.component';
import { EcmUserService } from '../services/ecm-user.service';
import { BpmUserService } from '../services/bpm-user.service';
import { AlfrescoAuthenticationService,
         AlfrescoApiService,
         AlfrescoSettingsService } from 'ng2-alfresco-core';

describe('User info component', () => {

    let userInfoComp: UserInfoComponent;
    let ecmUserService = new EcmUserService(null, null);
    let bpmUserService = new BpmUserService(null);
    let authService = new AlfrescoAuthenticationService(new AlfrescoSettingsService() ,
                                                        new AlfrescoApiService());

    beforeEach(() => {
        userInfoComp = new UserInfoComponent(ecmUserService, bpmUserService, authService);
    });

    it('should get the ecm user informations when is logged in', () => {
       spyOn(ecmUserService, 'getUserInfo');
       spyOn(bpmUserService, 'getCurrentUserInfo');
       spyOn(authService, 'getAlfrescoApi').and.callThrough();
       // spyOn(authService.getAlfrescoApi(), 'ecmAuth').and.callThrough();
       spyOn(authService, 'getAlfrescoApi().ecmAuth.isLoggedIn').and.returnValue(true);
       userInfoComp.ngOnInit();

       expect(ecmUserService.getUserInfo).toHaveBeenCalledWith('-me-');
       expect(bpmUserService.getCurrentUserInfo).not.toHaveBeenCalled();

    });

});

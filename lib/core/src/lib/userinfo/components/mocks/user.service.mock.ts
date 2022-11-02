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

import {
    BpmUserModel,
    EcmUserModel,
    IdentityUserModel
} from './../../../models';
import { of } from 'rxjs';

export class PeopleContentServiceMock {
    private fakeEcmUser = new EcmUserModel({
        firstName: 'John',
        lastName: 'Ecm',
        avatarId: 'fake-avatar-id',
        email: 'john.ecm@gmail.com',
        jobTitle: 'Product Manager'
    });

    getCurrentUserInfo = () => of(this.fakeEcmUser);

    getUserProfileImage = () => './assets/images/alfresco-logo.svg';
}

export class EcmUserServiceMock {
    private fakeEcmUser = new EcmUserModel({
        firstName: 'John',
        lastName: 'Ecm',
        avatarId: 'fake-avatar-id',
        email: 'john.ecm@gmail.com',
        jobTitle: 'Product Manager'
    });

    getCurrentUserInfo = () => of(this.fakeEcmUser);

    getUserProfileImage = () => './assets/images/alfresco-logo.svg';
}

export class BpmUserServiceMock {
    private fakeBpmUser = new BpmUserModel({
        email: 'john.bpm@gmail.com',
        firstName: 'John',
        lastName: 'Bpm',
        pictureId: 12,
        tenantName: 'Name of Tenant'
    });

    getCurrentUserInfo = () => of(this.fakeBpmUser);

    getCurrentUserProfileImage = () => './assets/images/alfresco-logo.svg';
}

export class IdentityUserServiceMock {
    private fakeIdentityUser = {
        familyName: 'Identity',
        givenName: 'John',
        email: 'john.identity@gmail.com',
        username: 'johnyIdentity99'
    };

    getCurrentUserInfo = (): IdentityUserModel => this.fakeIdentityUser;
}

import {
    BpmUserModel,
    EcmUserModel,
    IdentityUserModel
} from '@alfresco/adf-core';
import { of } from 'rxjs';

export class PeopleContentServiceStub {
    private fakeEcmUser = new EcmUserModel({
        firstName: 'John',
        lastName: 'Ecm',
        avatarId: 'fake-avatar-id',
        email: 'john.ecm@gmail.com',
        jobTitle: 'Product Manager'
    });

    getCurrentUserInfo = () => of(this.fakeEcmUser);

    getUserProfileImage = () => './assets/images/ecm-user-avatar.png';
}

export class EcmUserServiceStub {
    private fakeEcmUser = new EcmUserModel({
        firstName: 'John',
        lastName: 'Ecm',
        avatarId: 'fake-avatar-id',
        email: 'john.ecm@gmail.com',
        jobTitle: 'Product Manager'
    });

    getCurrentUserInfo = () => of(this.fakeEcmUser);

    getUserProfileImage = () => './assets/images/ecm-user-avatar.png';
}

export class BpmUserServiceStub {
    private fakeBpmUser = new BpmUserModel({
        email: 'john.bpm@gmail.com',
        firstName: 'John',
        lastName: 'Bpm',
        pictureId: 12,
        tenantName: 'Name of Tenant'
    });

    getCurrentUserInfo = () => of(this.fakeBpmUser);

    getCurrentUserProfileImage = () => './assets/images/bpm-user-avatar.png';
}

export class IdentityUserServiceStub {
    private fakeIdentityUser = {
        familyName: 'Identity',
        givenName: 'John',
        email: 'john.identity@gmail.com',
        username: 'johnyIdentity99'
    };

    getCurrentUserInfo = (): IdentityUserModel => this.fakeIdentityUser;
}

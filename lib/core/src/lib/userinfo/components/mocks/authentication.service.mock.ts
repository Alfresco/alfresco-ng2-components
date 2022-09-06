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

import { Inject, Injectable } from '@angular/core';
import { from, ReplaySubject, forkJoin, Observable } from 'rxjs';
import { AlfrescoApiService } from './../../../services/alfresco-api.service';
import {
    PeopleApi,
    UserProfileApi,
    UserRepresentation
} from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationServiceMock {
    onLogin: ReplaySubject<any> = new ReplaySubject<any>(1);

    onLogout: ReplaySubject<any> = new ReplaySubject<any>(1);

    _peopleApi: PeopleApi;
    get peopleApi(): PeopleApi {
        this._peopleApi =
            this._peopleApi ?? new PeopleApi(this.alfrescoApi.getInstance());
        return this._peopleApi;
    }

    _profileApi: UserProfileApi;
    get profileApi(): UserProfileApi {
        this._profileApi =
            this._profileApi ??
            new UserProfileApi(this.alfrescoApi.getInstance());
        return this._profileApi;
    }

    constructor(
        private alfrescoApi: AlfrescoApiService,
        @Inject('MODE') public loginMode: string
    ) {
        this.alfrescoApi.alfrescoApiInitialized.subscribe(() => {
            this.alfrescoApi.getInstance().reply('logged-in', () => {
                this.onLogin.next();
            });

            if (this.isKerberosEnabled()) {
                this.loadUserDetails();
            }
        });
    }

    private loadUserDetails() {
        const ecmUser$ = from(this.peopleApi.getPerson('-me-'));
        const bpmUser$ = this.getBpmLoggedUser();

        if (this.isALLProvider()) {
            forkJoin([ecmUser$, bpmUser$]).subscribe(() => this.onLogin.next());
        } else if (this.isECMProvider()) {
            ecmUser$.subscribe(() => this.onLogin.next());
        } else {
            bpmUser$.subscribe(() => this.onLogin.next());
        }
    }

    isLoggedIn(): boolean {
        return true;
    }

    isLoggedInWith(provider: string): boolean {
        if (provider === 'BPM') {
            return this.isBpmLoggedIn();
        } else if (provider === 'ECM') {
            return this.isEcmLoggedIn();
        } else {
            return this.isLoggedIn();
        }
    }

    isKerberosEnabled(): boolean {
        return this.loginMode === 'all';
    }

    isOauth(): boolean {
        return this.loginMode === 'default' || this.loginMode === 'defaultEcm';
    }

    isECMProvider(): boolean {
        return this.alfrescoApi.getInstance().isEcmConfiguration();
    }

    isBPMProvider(): boolean {
        return this.alfrescoApi.getInstance().isBpmConfiguration();
    }

    isALLProvider(): boolean {
        return this.loginMode === 'all';
    }

    isEcmLoggedIn(): boolean {
        return this.loginMode === 'ecm' || this.loginMode === 'defaultEcm';
    }

    isBpmLoggedIn(): boolean {
        return this.loginMode === 'bpm';
    }

    getBpmLoggedUser(): Observable<UserRepresentation> {
        return from(this.profileApi.getProfile());
    }
}

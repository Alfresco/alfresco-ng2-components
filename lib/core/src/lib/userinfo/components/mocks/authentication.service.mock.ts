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
import { ReplaySubject } from 'rxjs';
import { AlfrescoApiService } from './../../../services/alfresco-api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationServiceMock {
    onLogin: ReplaySubject<any> = new ReplaySubject<any>(1);

    onLogout: ReplaySubject<any> = new ReplaySubject<any>(1);

    constructor(
        private alfrescoApi: AlfrescoApiService,
        @Inject('MODE') public loginMode: string
    ) {}

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
}

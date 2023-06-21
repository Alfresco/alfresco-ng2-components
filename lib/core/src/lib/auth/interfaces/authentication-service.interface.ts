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

import { HttpHeaders } from '@angular/common/http';
import ee from 'event-emitter';

export interface AuthenticationServiceInterface {

    onError: any;
    onLogin: any;
    onLogout: any;

    on: ee.EmitterMethod;
    off: ee.EmitterMethod;
    once: ee.EmitterMethod;
    emit: (type: string, ...args: any[]) => void;

    getToken(): string;

    isLoggedIn(): boolean;

    isOauth(): boolean;

    logout(): any;

    isEcmLoggedIn(): boolean;

    isBpmLoggedIn(): boolean;

    isECMProvider(): boolean;

    isBPMProvider(): boolean;

    isALLProvider(): boolean;

    getEcmUsername(): string;

    getBpmUsername(): string;

    getAuthHeaders(requestUrl: string, header: HttpHeaders): HttpHeaders;

    reset(): void;
}

/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { AuthenticationServiceInterface } from '../../interfaces/authentication-service.interface';
import { EventEmitter } from 'eventemitter3';

export interface BffUserInfo {
    sub: string;
    email: string;
    hxp_account: string;
    name: string;
    email_verified: boolean;
    preferred_username: string;
    given_name: string;
    family_name: string;
    roles: string[];
    appKey: string;
}

export interface BffUserResponse {
    isAuthenticated: boolean;
    user: BffUserInfo;
}
type EventEmitterInstance = InstanceType<typeof EventEmitter>;

/* eslint-disable no-console */
@Injectable()
export class BffAuthService implements AuthenticationServiceInterface {
    isAuthenticated: boolean = false;
    username: string = '';

    userInfo: BffUserResponse;

    onError = new BehaviorSubject<any>(null);
    onLogin = new BehaviorSubject<boolean>(false);
    onLogout = new BehaviorSubject<boolean>(false);

    on: EventEmitterInstance['on'];
    off: EventEmitterInstance['off'];
    once: EventEmitterInstance['once'];
    emit: EventEmitterInstance['emit'];

    constructor(private http: HttpClient) {
        this.getUser()
            .pipe(filter((user) => user.isAuthenticated))
            .subscribe(() => {
                this.isAuthenticated = true;
                this.onLogin.next(this.isAuthenticated);
            });
        this.getUser().subscribe((userResponse) => {
            console.log('[BffAuthService] userResponse: ', userResponse);
            this.userInfo = userResponse;
        });
    }

    getToken(): string {
        return '';
    }
    isLoggedIn(): boolean {
        return this.isAuthenticated;
    }
    isOauth(): boolean {
        return true;
    }
    isECMProvider(): boolean {
        return false;
    }
    isBPMProvider(): boolean {
        return false;
    }
    isALLProvider(): boolean {
        return false;
    }
    getUsername(): string {
        return '';
    }
    getAuthHeaders(_requestUrl: string, header: HttpHeaders): HttpHeaders {
        return header;
    }
    addTokenToHeader(_requestUrl: string, headersArg?: HttpHeaders): Observable<HttpHeaders> {
        return new BehaviorSubject(headersArg ?? new HttpHeaders()).asObservable();
    }
    reset(): void {
        return;
    }

    getUser(): Observable<BffUserResponse> {
        const protocol = window.location.protocol;
        const host = window.location.host;
        console.log('[BffAuthService] getUser from ', `${protocol}//${host}/bff/user`);
        return this.http.get<BffUserResponse>(`${protocol}//${host}/bff/user`);
    }

    login(currentUrl?: string): Promise<void> | void {
        const protocol = window.location.protocol;
        const host = window.location.host;
        let url: string;
        if (!currentUrl || currentUrl === '/') {
            url = `${protocol}//${host}/bff/login`;
        } else {
            url = `${protocol}//${host}/bff/login?returnUrl=${encodeURIComponent(currentUrl ?? '')}`;
        }

        console.log('url: ', url);
        window.location.href = url;
    }

    logout(): Promise<void> | void {
        const protocol = window.location.protocol;
        const host = window.location.host;
        this.http.post<{ redirectTo?: string }>(`${protocol}//${host}/bff/logout`, {}).subscribe({
            next: (res) => {
                console.log('[BffAuthService] logout: ', res);
                const target = res.redirectTo || '/';
                window.location.href = target;
            },
            error: () => window.location.reload()
        });
    }
}

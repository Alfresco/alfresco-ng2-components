// /*!
//  * @license
//  * Copyright 2019 Alfresco Software, Ltd.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
//
// import { Injectable } from '@angular/core';
// import { Observable, from } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { AlfrescoApiService } from '../../services/alfresco-api.service';
// import { CookieService } from '../../common/services/cookie.service';
// import { LogService } from '../../common/services/log.service';
// import { AppConfigService } from '../../app-config/app-config.service';
// import { StorageService } from '../../common/services/storage.service';
// import { JwtHelperService } from './jwt-helper.service';
// import { BaseAuthenticationService } from './base-authentication.service';
// import { ContentAuth } from "../basic-auth/contentAuth";
//
// @Injectable({
//     providedIn: 'root'
// })
// export class AuthenticationService extends BaseAuthenticationService {
//     readonly supportCodeFlow = false;
//
//     constructor(
//         appConfig: AppConfigService,
//         cookie: CookieService,
//         logService: LogService,
//         contentAuth: ContentAuth,
//         private alfrescoApi: AlfrescoApiService,
//         private storageService: StorageService
//     ) {
//         super(appConfig, cookie, contentAuth, logService);
//         this.alfrescoApi.alfrescoApiInitialized.subscribe(() => {
//             this.alfrescoApi.getInstance().reply('logged-in', () => {
//                 this.onLogin.next();
//             });
//         });
//     }
//
//     /**
//      * Checks if the user logged in.
//      *
//      * @returns True if logged in, false otherwise
//      */
//     isLoggedIn(): boolean {
//         if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
//             return false;
//         }
//         return this.alfrescoApi.getInstance().isLoggedIn();
//     }
//
//     isLoggedInWith(provider: string): boolean {
//         if (provider === 'BPM') {
//             return this.isBpmLoggedIn();
//         } else if (provider === 'ECM') {
//             return this.isEcmLoggedIn();
//         } else {
//             return this.isLoggedIn();
//         }
//     }
//
//     /**
//      * Does the provider support OAuth?
//      *
//      * @returns True if supported, false otherwise
//      */
//     isOauth(): boolean {
//         return this.alfrescoApi.getInstance().isOauthConfiguration();
//     }
//
//     /**
//      * Logs the user in with SSO
//      */
//     ssoImplicitLogin() {
//         this.alfrescoApi.getInstance().implicitLogin();
//     }
//
//     /**
//      * Logs the user out.
//      *
//      * @returns Response event called when logout is complete
//      */
//     logout() {
//         return from(this.callApiLogout()).pipe(
//             tap((response) => {
//                 this.onLogout.next(response);
//                 return response;
//             }),
//             catchError((err) => this.handleError(err))
//         );
//     }
//
//     private callApiLogout(): Promise<any> {
//         if (this.alfrescoApi.getInstance()) {
//             return this.alfrescoApi.getInstance().logout();
//         }
//         return Promise.resolve();
//     }
//
//     /**
//      * Checks if the user is logged in on an ECM provider.
//      *
//      * @returns True if logged in, false otherwise
//      */
//     isEcmLoggedIn(): boolean {
//         if (this.isECMProvider() || this.isALLProvider()) {
//             if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
//                 return false;
//             }
//             return this.alfrescoApi.getInstance().isEcmLoggedIn();
//         }
//         return false;
//     }
//
//     /**
//      * Checks if the user is logged in on a BPM provider.
//      *
//      * @returns True if logged in, false otherwise
//      */
//     isBpmLoggedIn(): boolean {
//         if (this.isBPMProvider() || this.isALLProvider()) {
//             if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
//                 return false;
//             }
//             return this.alfrescoApi.getInstance().isBpmLoggedIn();
//         }
//         return false;
//     }
//
//     /**
//      * Gets the ECM username.
//      *
//      * @returns The ECM username
//      */
//     getEcmUsername(): string {
//         return this.alfrescoApi.getInstance().getEcmUsername();
//     }
//
//     /**
//      * Gets the BPM username
//      *
//      * @returns The BPM username
//      */
//     getBpmUsername(): string {
//         return this.alfrescoApi.getInstance().getBpmUsername();
//     }
//
//     /**
//      * Gets the auth token.
//      *
//      * @returns Auth token string
//      */
//     getToken(): string {
//         return this.storageService.getItem(JwtHelperService.USER_ACCESS_TOKEN);
//     }
//
//     reset() { }
//
//     once(event: string): Observable<any> {
//         return new Observable((subscriber) => {
//             this.alfrescoApi.getInstance().once(event, () => subscriber.next());
//         });
//     }
// }

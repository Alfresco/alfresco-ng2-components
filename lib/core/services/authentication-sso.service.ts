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

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import moment from 'moment-es6';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class AuthenticationSSOService {

  constructor(private http: HttpClient, private appConfig: AppConfigService) { }

  private bearerExcludedUrls: string[] =  ['app.config.json', 'assets/', 'assets/adf-core/i18n/',
  'auth/', 'resources/', 'assets/adf-process-services/i18n/', 'assets/adf-content-services/i18n/'];

  token: string;

  setToken(authResult) {
    const expiresAt = moment().add(authResult.expires_in, 'seconds');
    localStorage.setItem('id_token', authResult.access_token);
    localStorage.setItem('refresh_token', authResult.refresh_token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  refreshToken(): Observable<string> {
    const authHost = this.appConfig.get('oauth2.host');
    const authPath = this.appConfig.get('oauth2.authPath');

    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', this.getRefreshToken())
      .set('client_id', 'activiti');

    return this.http.post(`${authHost}${authPath}`,
      body,
      {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      }).do( (response: any) => {
        this.setToken(response);
      });
  }

  getToken(): string {
    return localStorage.getItem('id_token');
  }

  getRefreshToken(): string {
    return localStorage.getItem('refresh_token');
  }

   getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('refresh_token');
  }

  getBearerExcludedUrls(): string[] {
    return this.bearerExcludedUrls;
  }

  addTokenToHeader(headersArg?: HttpHeaders): Observable<HttpHeaders> {
    return Observable.create(async (observer: Observer<any>) => {
      let headers = headersArg;
      if (!headers) {
        headers = new HttpHeaders();
      }
      try {
        const token: string = this.getToken();
        headers = headers.set('Authorization', 'bearer ' + token);
        observer.next(headers);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

}

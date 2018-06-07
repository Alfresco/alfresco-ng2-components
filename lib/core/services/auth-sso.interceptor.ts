/*!
 * @license
 * Copyright 2018 Alfresco Software, Ltd.
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

import { Injectable, Injector } from '@angular/core';
import {
  HttpHandler, HttpInterceptor, HttpRequest,
  HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationSSOService } from './authentication-sso.service';

@Injectable()
export class AuthSSOInterceptor implements HttpInterceptor {
  private excludedUrlsRegex: RegExp[];
  private authService: AuthenticationSSOService;

  constructor(private injector: Injector) { }

  private loadExcludedUrlsRegex(): void {
    const excludedUrls: string[] = this.authService.getBearerExcludedUrls();
    this.excludedUrlsRegex = excludedUrls.map(urlPattern => new RegExp(urlPattern, 'gi')) || [];

  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    this.authService = this.injector.get(AuthenticationSSOService);

    if (!this.authService || !this.authService.getBearerExcludedUrls()) {
      return next.handle(req);
    }

    if (!this.excludedUrlsRegex) {
      this.loadExcludedUrlsRegex();
    }

    const urlRequest = req.url;
    const shallPass: boolean = !!this.excludedUrlsRegex.find(regex => regex.test(urlRequest));
    if (shallPass) {
      return next.handle(req).catch(error => {
        return Observable.throw(error);
      });
    }

    return this.authService.addTokenToHeader(req.headers).mergeMap(headersWithBearer => {
      const kcReq = req.clone({ headers: headersWithBearer });
      return next.handle(kcReq).catch( error => {
        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse> error).status) {
            case 401:
              return this.handle401Error(req, next);
            default:
                return Observable.throw(error);
          }
        } else {
          return Observable.throw(error);
        }
      });
    });
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return this.authService.refreshToken()
      .switchMap((newToken: string) => {
        if (newToken) {
          return this.authService.addTokenToHeader(req.headers).mergeMap(headersWithBearer => {
            const kcReq = req.clone({ headers: headersWithBearer });
            return next.handle(kcReq);
          });
        }
      }).catch((e) => {
        this.authService.logout();
        return next.handle(req);
      });
  }
}

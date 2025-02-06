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

import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpHandler, HttpInterceptor, HttpRequest,
  HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpHeaders
} from '@angular/common/http';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthBearerInterceptor implements HttpInterceptor {
    private _bearerExcludedUrls: readonly string[] = ['resources/', 'assets/', 'auth/realms', 'idp/'];

    private excludedUrlsRegex: RegExp[];

  constructor(private authenticationService: AuthenticationService) { }

  private loadExcludedUrlsRegex() {
    const excludedUrls = this.bearerExcludedUrls;
    this.excludedUrlsRegex = excludedUrls.map((urlPattern) => new RegExp(`^https?://[^/]+/${urlPattern}`, 'i')) || [];
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {


    if (!this.excludedUrlsRegex) {
      this.loadExcludedUrlsRegex();
    }

    const requestUrl = req.url;
    const shallPass: boolean = this.excludedUrlsRegex.some((regex) => regex.test(requestUrl));
    if (shallPass) {
      return next.handle(req)
        .pipe(
          catchError((error) => observableThrowError(error))
        );
    }

    return this.authenticationService.addTokenToHeader(requestUrl, req.headers)
      .pipe(
        mergeMap((headersWithBearer) => {
          const headerWithContentType = this.appendJsonContentType(headersWithBearer, req.body);
          const kcReq = req.clone({ headers: headerWithContentType});
          return next.handle(kcReq)
            .pipe(
              catchError((error) => observableThrowError(error))
           );
      })
      );
  }

  private appendJsonContentType(headers: HttpHeaders, reqBody: any): HttpHeaders {

    // prevent adding any content type, to properly handle formData with boundary browser generated value,
    // as adding any Content-Type its going to break the upload functionality

    if (headers.get('Content-Type') === 'multipart/form-data' && !(reqBody instanceof FormData)) {
        return headers.delete('Content-Type');
    }

    if (!headers.get('Content-Type') && !(reqBody instanceof FormData)) {
        return headers.set('Content-Type', 'application/json;charset=UTF-8');
    }

    return headers;
  }

    protected get bearerExcludedUrls(): readonly string[] {
        return this._bearerExcludedUrls;
    }

}

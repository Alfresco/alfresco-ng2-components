/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    HttpContextToken,
    HttpHandler,
    HttpHeaderResponse,
    HttpHeaders,
    HttpInterceptor,
    HttpProgressEvent,
    HttpRequest,
    HttpResponse,
    HttpSentEvent,
    HttpUserEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { Authentication } from '../authentication';

export const SHOULD_ADD_AUTH_TOKEN = new HttpContextToken<boolean>(() => false);

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor( private authService: Authentication) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
      Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

      if (req.context.get(SHOULD_ADD_AUTH_TOKEN)) {
          return this.authService.addTokenToHeader(req.headers).pipe(
              mergeMap((headersWithBearer) => {
                  const headerWithContentType = this.appendJsonContentType(headersWithBearer);
                  const kcReq = req.clone({ headers: headerWithContentType});
                  return next.handle(kcReq)
                  .pipe(
                      catchError((error) => observableThrowError(error))
                  );
              })
          );
      }

      return next.handle(req).pipe(catchError((error) => observableThrowError(error)));
    }

    private appendJsonContentType(headers: HttpHeaders): HttpHeaders {

      // prevent adding any content type, to properly handle formData with boundary browser generated value,
      // as adding any Content-Type its going to break the upload functionality

      if (headers.get('Content-Type') === 'multipart/form-data') {
          return headers.delete('Content-Type');
      }

      if (!headers.get('Content-Type')) {
          return headers.set('Content-Type', 'application/json;charset=UTF-8');
      }

      return headers;
    }

}

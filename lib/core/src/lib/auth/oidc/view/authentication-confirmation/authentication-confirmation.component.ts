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

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { AuthService } from '../../auth.service';

const ROUTE_DEFAULT = '/';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationConfirmationComponent {
  constructor(private auth: AuthService, private _router: Router) {
    const routeStored$ = from(this.auth.loginCallback()).pipe(
      map((route) => route || ROUTE_DEFAULT),
      catchError(() => of(ROUTE_DEFAULT))
    );

    routeStored$.pipe(first()).subscribe((route) => {
      this._router.navigateByUrl(route, { replaceUrl: true });
    });
  }
}

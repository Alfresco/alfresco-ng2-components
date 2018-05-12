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

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as _ from 'lodash';

@Injectable()
export class AuthTokenProcessorService {
  private helper;

  constructor() {
    this.helper = new JwtHelperService();
  }

  getRoles(): string[] {
    let roles = [];
    const token = localStorage.getItem('ticket-AUTH');
    if (token) {
      const tokenPayload = this.helper.decodeToken(token);
      roles = <string[]> tokenPayload.realm_access['roles'];
    }
    return roles;
  }

  hasToken() {
    return localStorage.getItem('ticket-AUTH');
  }

  hasRole(role: string): boolean {
    let hasRole = false;
    if (this.hasToken()) {
      const roles = this.getRoles();
      hasRole = _.indexOf(roles, role) >= 0;
    }
    return hasRole;
  }

  hasRoles(roles: string []): boolean {
    let hasRole = false;
    roles.forEach(r => {
      if (this.hasRole(r)) {
        hasRole = true;
        return;
      }
      });
    return hasRole;
  }
}

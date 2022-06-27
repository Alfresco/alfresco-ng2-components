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

import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { EcmUserModel } from '../models/ecm-user.model';
import { Observable } from 'rxjs';
import { PeopleContentService } from './people-content.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoResolverService implements Resolve<EcmUserModel> {
  constructor(private peopleContentService: PeopleContentService) {}

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<EcmUserModel> {
    return this.peopleContentService.getCurrentUserInfo();
  }

}

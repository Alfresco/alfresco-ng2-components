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

/**
 * This object represents details about create, release project and security.
 */
import { ROLES } from '../utils/constants';
import { browser } from 'protractor';

export class ProjectDetailsModel {

    projectResponse: any;
    releaseProjectResponse: any;
    security: any;

    constructor(security?: []) {
      this.security = security || [{
        role: ROLES.ACTIVITI_ADMIN,
        users: [browser.params.adminapp.superadmin],
        groups: []
      }];
    }
}

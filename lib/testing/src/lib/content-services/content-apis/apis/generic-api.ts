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

import { AlfrescoApi } from '@alfresco/js-api';
import { Logger } from '../../../core/utils/logger';

export class GenericApi {
    constructor(
        private username: string,
        private password: string,
        private alfrescoJsApi: AlfrescoApi
    ) {}

    getUsername(): string {
        return this.username;
    }

    async login(): Promise<any> {
        try {
            return await this.alfrescoJsApi.login(this.username, this.password);
        } catch (error) {
            this.handleError(`${this.constructor.name} ${this.login.name}`, error);
            throw error;
        }
    }

    async logout(): Promise<any> {
        try {
          return await this.alfrescoJsApi.logout();
        } catch (error) {
          this.handleError(`${this.constructor.name} ${this.logout.name}`, error);
          throw error;
        }
      }

    protected handleError(message: string, response: any): void {
      Logger.error(`\n--- ${message} error :`);
      Logger.error('\t>>> username: ', this.username);
      if ( response.status && response.response ) {
        try {
          Logger.error('\t>>> Status: ', response.status);
          Logger.error('\t>>> Text: ', response.response.text);
          Logger.error('\t>>> Method: ', response.response.error.method);
          Logger.error('\t>>> Path: ', response.response.error.path);
        } catch {
          Logger.error('\t>>> ', response);
        }
      } else {
          Logger.error('\t>>> ', response);
      }
    }
}

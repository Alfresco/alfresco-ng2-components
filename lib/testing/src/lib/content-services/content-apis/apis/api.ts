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

import { browser } from 'protractor';
import { AlfrescoApi } from '@alfresco/js-api';
import { Logger } from '../../../core/utils/logger';

export abstract class Api {
    alfrescoJsApi = new AlfrescoApi();

    constructor(
        private username: string,
        private password: string
    ) {
        this.alfrescoJsApi.setConfig({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    }

    async apiLogin(): Promise<any> {
        return this.alfrescoJsApi.login(this.username, this.password);
    }

    getUsername(): string {
        return this.username;
    }

    protected handleError(message: string, response: any) {
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

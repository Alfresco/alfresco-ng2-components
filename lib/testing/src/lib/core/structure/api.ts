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
import { browser } from 'protractor';

export abstract class Api {
  public api: AlfrescoApi;
  testConfig = browser.params;

  constructor(root: string) {
    this.api  = this.configureApi(root);
  }

  private configureApi(root: string): AlfrescoApi {
    const config = browser.params.adminapp.apiConfig;
    return new AlfrescoApi({
      provider: 'BPM',
      authType: config.authType,
      oauth2: config.oauth2,
      hostBpm: config.bpmHost  + '/' + root
    });
  }

  abstract setUp(): Promise<Api>;

  abstract tearDown();
}

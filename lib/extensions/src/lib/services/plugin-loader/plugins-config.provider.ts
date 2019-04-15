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

import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

interface PluginsConfig {
  [key: string]: {
    name: string;
    path: string;
    deps: string[];
  };
}

@Injectable()
export class PluginsConfigProvider {
  config: PluginsConfig;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: {},
    @Inject('APP_BASE_URL') @Optional() private readonly baseUrl: string
  ) {
    if (isPlatformBrowser(platformId)) {
      this.baseUrl = document.location.origin;
    }
  }

  loadConfig() {
    return this.http.get<PluginsConfig>(
      `${this.baseUrl}/assets/plugins/plugins-config.json`
    );
  }
}

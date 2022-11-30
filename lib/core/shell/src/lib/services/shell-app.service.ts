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

import { InjectionToken } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

export interface ShellPreferencesService {
  set(preferenceKey: string, value: any): void;
  get(preferenceKey: string, defaultValue: string): string;
}

export interface ShellAppService {
  pageHeading$: Observable<string>;
  hideSidenavConditions: string[];
  minimizeSidenavConditions: string[];
  preferencesService: ShellPreferencesService;
}

export const SHELL_APP_SERVICE = new InjectionToken<ShellAppService>('SHELL_APP_SERVICE');

export const SHELL_AUTH_TOKEN = new InjectionToken<CanActivate & CanActivateChild>('SHELL_AUTH_TOKEN');

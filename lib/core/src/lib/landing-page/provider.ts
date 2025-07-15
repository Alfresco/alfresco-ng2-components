/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { InjectionToken, Provider, Type } from '@angular/core';

export const LANDING_PAGE_TOKEN = new InjectionToken<Type<any>>('LANDING_PAGE_TOKEN');

/**
 *
 * @param componentClass The component class to be registered as the landing page.
 * @returns A provider that registers the landing page component class.
 */
export function provideLandingPage(componentClass: Type<any>): Provider {
    return {
        provide: LANDING_PAGE_TOKEN,
        useValue: componentClass
    };
}

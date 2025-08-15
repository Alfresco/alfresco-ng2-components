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

export interface CustomScreen {
    key: string;
    component: Type<any>;
}

/**
 * Injection token for custom screens.
 * This token can be used to inject custom screen components into the application.
 * It allows for multiple screen components to be registered and injected.
 */
export const APP_CUSTOM_SCREEN_TOKEN = new InjectionToken<CustomScreen>('Injection token for custom screens.');

/**
 * Provides a custom screen component to be used in the application.
 * This function allows you to register a custom screen component that can be injected
 * into the application using the `APP_CUSTOM_SCREEN_TOKEN`.
 *
 * @param key - A unique key to identify the screen component.
 * @param component - The screen component to be registered.
 * @returns A provider that can be used in the Angular dependency injection system.
 */
export function provideScreen(key: string, component: Type<any>): Provider {
    return {
        provide: APP_CUSTOM_SCREEN_TOKEN,
        multi: true,
        useValue: {
            key,
            component
        }
    };
}

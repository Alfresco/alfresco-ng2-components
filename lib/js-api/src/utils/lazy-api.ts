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

/**
 * LazyApi is a decorator that creates a lazy-loaded API instance.
 * @param factory - A function that creates the API instance.
 * @returns A decorator function that can be used to decorate a class property.
 */
export function LazyApi<T>(factory: (self: any) => T) {
    return function (target: any, propertyKey: string) {
        const cacheKey = `_${propertyKey}`;
        Object.defineProperty(target, propertyKey, {
            get() {
                if (!this[cacheKey]) {
                    this[cacheKey] = factory(this);
                }
                return this[cacheKey];
            },
            enumerable: true,
            configurable: true
        });
    };
}

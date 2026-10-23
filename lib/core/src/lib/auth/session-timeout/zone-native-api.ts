/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export const ZONE_NATIVE_PREFIX = '__zone_symbol__';

export interface NativeEventListenerApi {
    addEventListener: Document['addEventListener'];
    removeEventListener: Document['removeEventListener'];
}

export interface NativeTimerApi {
    setTimeout: (handler: () => void, timeout: number) => ReturnType<typeof setTimeout>;
    clearTimeout: (handle: ReturnType<typeof setTimeout>) => void;
}

/**
 * Resolves the listener API that zone.js parks under its own symbol when it patches the event target.
 *
 * @param target - Event target the listeners are registered on
 * @returns The unpatched listener API, or the standard one when zone.js is not loaded
 */
export const getNativeEventListenerApi = (target: Document): NativeEventListenerApi => {
    const nativeAddEventListener = Reflect.get(target, `${ZONE_NATIVE_PREFIX}addEventListener`) as Document['addEventListener'] | undefined;
    const nativeRemoveEventListener = Reflect.get(target, `${ZONE_NATIVE_PREFIX}removeEventListener`) as Document['removeEventListener'] | undefined;

    return typeof nativeAddEventListener === 'function' && typeof nativeRemoveEventListener === 'function'
        ? { addEventListener: nativeAddEventListener.bind(target), removeEventListener: nativeRemoveEventListener.bind(target) }
        : { addEventListener: target.addEventListener.bind(target), removeEventListener: target.removeEventListener.bind(target) };
};

/**
 * Resolves the timer API that zone.js parks under its own symbol when it patches the global timers.
 *
 * @param scope - Window the timers are scheduled on
 * @returns The unpatched timer API, or the standard one when zone.js is not loaded
 */
export const getNativeTimerApi = (scope: Window | null | undefined): NativeTimerApi => {
    const target = scope ?? globalThis;
    const nativeSetTimeout = Reflect.get(target, `${ZONE_NATIVE_PREFIX}setTimeout`) as NativeTimerApi['setTimeout'] | undefined;
    const nativeClearTimeout = Reflect.get(target, `${ZONE_NATIVE_PREFIX}clearTimeout`) as NativeTimerApi['clearTimeout'] | undefined;

    return typeof nativeSetTimeout === 'function' && typeof nativeClearTimeout === 'function'
        ? { setTimeout: nativeSetTimeout.bind(target), clearTimeout: nativeClearTimeout.bind(target) }
        : { setTimeout: (handler, timeout) => setTimeout(handler, timeout), clearTimeout: (handle) => clearTimeout(handle) };
};

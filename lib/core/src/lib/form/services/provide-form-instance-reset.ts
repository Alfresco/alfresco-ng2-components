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

import {
    DestroyRef,
    EnvironmentProviders,
    inject,
    InjectionToken,
    makeEnvironmentProviders,
    provideEnvironmentInitializer,
    Signal,
    signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { isObservable, map, Observable } from 'rxjs';
import { connectFormInstanceResetSwitch } from '../models/form-instance-reset-switch.model';

export const FORM_INSTANCE_RESET_ENABLED = new InjectionToken<Signal<boolean>>('FORM_INSTANCE_RESET_ENABLED');

const FORM_INSTANCE_RESET_DISABLED = signal(false).asReadonly();

const toEnabledSignal = (enabled: Observable<boolean> | boolean): Signal<boolean> => {
    if (isObservable(enabled)) {
        return toSignal(enabled.pipe(map((value) => value ?? false)), { initialValue: false });
    }
    return signal(enabled ?? false).asReadonly();
};

/**
 * Reads whether form instance reset and rules-only outcome execution are enabled. Must run in an injection context.
 *
 * @returns The host switch, or a switch that stays off when `provideFormInstanceReset` was not used
 */
export function injectFormInstanceResetEnabled(): Signal<boolean> {
    return inject(FORM_INSTANCE_RESET_ENABLED, { optional: true }) ?? FORM_INSTANCE_RESET_DISABLED;
}

/**
 * Enables form instance reset and rules-only outcome execution for the application.
 * Provide it in application or environment providers; while it is off, forms keep their previous behavior.
 *
 * @param isEnabled Runs in an injection context and returns the switch value, or an observable of it for a switch that changes at runtime
 * @returns Environment providers for the switch
 */
export function provideFormInstanceReset(isEnabled: () => Observable<boolean> | boolean = () => true): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: FORM_INSTANCE_RESET_ENABLED, useFactory: () => toEnabledSignal(isEnabled()) },
        provideEnvironmentInitializer(() => {
            const disconnect = connectFormInstanceResetSwitch(inject(FORM_INSTANCE_RESET_ENABLED));
            inject(DestroyRef).onDestroy(disconnect);
        })
    ]);
}

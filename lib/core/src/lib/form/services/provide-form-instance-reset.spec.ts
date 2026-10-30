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

import { EnvironmentInjector, Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { isFormInstanceResetEnabled } from '../models/form-instance-reset-switch.model';
import { injectFormInstanceResetEnabled, provideFormInstanceReset } from './provide-form-instance-reset';

describe('provideFormInstanceReset', () => {
    const useSwitch = (isEnabled?: () => Observable<boolean> | boolean) => {
        TestBed.configureTestingModule({ providers: [provideFormInstanceReset(isEnabled)] });
        TestBed.inject(EnvironmentInjector);
    };

    const readSwitch = () => TestBed.runInInjectionContext(() => injectFormInstanceResetEnabled());

    it('should stay off when the switch is not provided', () => {
        const enabled = runInInjectionContext(Injector.create({ providers: [] }), () => injectFormInstanceResetEnabled());

        expect(enabled()).toBeFalse();
    });

    it('should turn the switch on for components and form models by default', () => {
        useSwitch();

        expect(readSwitch()()).toBeTrue();
        expect(isFormInstanceResetEnabled()).toBeTrue();
    });

    it('should follow an observable switch at runtime and treat a missing value as off', () => {
        const source = new BehaviorSubject<boolean>(false);
        useSwitch(() => source);
        const enabled = readSwitch();

        expect(enabled()).toBeFalse();
        source.next(true);
        expect(enabled()).toBeTrue();
        expect(isFormInstanceResetEnabled()).toBeTrue();
        source.next(null);
        expect(enabled()).toBeFalse();
        expect(isFormInstanceResetEnabled()).toBeFalse();
    });

    it('should treat a missing switch value as off', () => {
        useSwitch(() => null);

        expect(readSwitch()()).toBeFalse();
        expect(isFormInstanceResetEnabled()).toBeFalse();
    });

    it('should disconnect form models when the application is destroyed', () => {
        useSwitch();
        expect(isFormInstanceResetEnabled()).toBeTrue();

        TestBed.resetTestingModule();

        expect(isFormInstanceResetEnabled()).toBeFalse();
    });
});

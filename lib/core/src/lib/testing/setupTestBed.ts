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

import { TestBed, TestModuleMetadata } from '@angular/core/testing';

interface DoneFn extends Function {
    (): void;
    fail: (message?: Error | string) => void;
}

declare function beforeAll(action: (done: DoneFn) => void, timeout?: number): void;
declare function afterAll(action: (done: DoneFn) => void, timeout?: number): void;

const resetTestingModule = TestBed.resetTestingModule;
const preventAngularFromResetting = () => (TestBed.resetTestingModule = () => TestBed);
const allowAngularToReset = () => (TestBed.resetTestingModule = resetTestingModule);

export const setupTestBed = (moduleDef: TestModuleMetadata) => {
    beforeAll((done) =>
        (async () => {
            localStorage.clear();
            sessionStorage.clear();
            resetTestingModule();
            preventAngularFromResetting();
            TestBed.configureTestingModule(moduleDef);
            await TestBed.compileComponents();

            // prevent Angular from resetting testing module
            TestBed.resetTestingModule = () => TestBed;
        })()
            .then(done)
            .catch(done.fail)
    );

    afterAll(() => allowAngularToReset());
};

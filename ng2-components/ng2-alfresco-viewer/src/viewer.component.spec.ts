/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import {describe, expect, it, injectAsync, TestComponentBuilder, setBaseTestProviders} from 'angular2/testing';
import {TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS} from 'angular2/platform/testing/browser';
import {ViewerComponent} from '../src/viewer.component';

describe('Basic Example test ng2-alfresco-viewer', () => {
    setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS);

    it('Test hello world', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(ViewerComponent)
            .then((fixture) => {
                let element = fixture.nativeElement;
                expect(element.querySelector('h1')).toBeDefined();
                expect(element.getElementsByTagName('h1')[0].innerHTML).toEqual('ng2-alfresco-viewer');
            });
    }));
});

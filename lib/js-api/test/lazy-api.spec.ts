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

import assert from 'assert';
import { LazyApi } from '../src/utils/lazy-api';

describe('LazyApi', () => {
    it('should create a lazy-loaded property on the target prototype', () => {
        class TestApi {
            @LazyApi(() => ({ value: 13 }))
            api: { value: number };
        }

        const instance = new TestApi();
        assert.deepStrictEqual(instance.api, { value: 13 });
    });

    it('should cache the instance of the property after first access', () => {
        let accessCount = 0;

        class TestApi {
            @LazyApi(() => {
                accessCount++;
                return { value: 'cached' };
            })
            api: { value: string };
        }

        const instance = new TestApi();
        const first = instance.api;
        const second = instance.api;

        assert.strictEqual(first, second);
        assert.strictEqual(accessCount, 1);
    });

    it('should pass the class instance as argument to the factory', () => {
        let receivedSelf: any;

        class TestApi {
            config = 'test-config';

            @LazyApi((self: any) => {
                receivedSelf = self;
                return { config: self.config };
            })
            api: { config: string };
        }

        const instance = new TestApi();
        const result = instance.api;

        assert.strictEqual(receivedSelf, instance);
        assert.deepStrictEqual(result, { config: 'test-config' });
    });

    it('should create separate cached instances per class instance', () => {
        let accessCount = 0;

        class TestApi {
            @LazyApi(() => {
                accessCount++;
                return { id: accessCount };
            })
            api: { id: number };
        }

        const instance1 = new TestApi();
        const instance2 = new TestApi();

        assert.strictEqual(instance1.api.id, 1);
        assert.strictEqual(instance2.api.id, 2);
        assert.strictEqual(accessCount, 2);
    });

    it('should define the property as enumerable and configurable', () => {
        class TestApi {
            @LazyApi(() => 'value')
            api: string;
        }

        const descriptor = Object.getOwnPropertyDescriptor(TestApi.prototype, 'api');
        assert.strictEqual(descriptor.enumerable, true);
        assert.strictEqual(descriptor.configurable, true);
    });

    it('should support multiple decorated properties on the same class', () => {
        class TestApi {
            @LazyApi(() => 'first')
            api1: string;

            @LazyApi(() => 'second')
            api2: string;
        }

        const instance = new TestApi();
        assert.strictEqual(instance.api1, 'first');
        assert.strictEqual(instance.api2, 'second');
    });

    it('should store cached value under _propertyKey on the instance', () => {
        class TestApi {
            @LazyApi(() => 'cached-value')
            myApi: string;
        }

        const instance = new TestApi();
        assert.strictEqual(instance['_myApi'], undefined);

        instance.myApi;

        assert.strictEqual(instance['_myApi'], 'cached-value');
    });
});

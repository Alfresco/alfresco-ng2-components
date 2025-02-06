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

import { FlagSetParser } from './flagset.parser';

describe('FlagSetParser', () => {
    describe('serialize', () => {
        it('should serialize flags correctly', () => {
            const flags = {
                feature1: {
                    current: true,
                    previous: null
                },
                feature2: {
                    current: false,
                    previous: true,
                    fictive: true
                }
            };

            const serializedFlags = FlagSetParser.serialize(flags);

            expect(serializedFlags).toEqual({
                feature1: { current: true, fictive: undefined },
                feature2: { current: false, fictive: true }
            });
        });

        it('should handle empty flags', () => {
            const flags = {};

            const serializedFlags = FlagSetParser.serialize(flags);

            expect(serializedFlags).toEqual({});
        });
    });

    describe('deserialize', () => {
        it('should deserialize flags correctly', () => {
            const serializedFlags = {
                feature1: { current: true },
                feature2: { current: false },
                feature3: { current: true }
            };

            const flags = FlagSetParser.deserialize(serializedFlags);

            expect(flags).toEqual({
                feature1: { current: true, previous: null },
                feature2: { current: false, previous: null },
                feature3: { current: true, previous: null }
            });
        });

        it('should handle empty serialized flags', () => {
            const serializedFlags = {};

            const flags = FlagSetParser.deserialize(serializedFlags);

            expect(flags).toEqual({});
        });
    });
});

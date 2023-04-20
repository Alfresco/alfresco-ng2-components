/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { every, not, some } from './core.evaluators';
import { RuleParameter } from '../config/rule.extensions';

describe('Core Evaluators', () => {

    const context: any = {
        getEvaluator: (key: string) => {
            switch (key) {
                case 'positive':
                    return () => true;
                case 'negative':
                    return () => false;
                default:
                    return null;
            }
        }
    };

    describe('not', () => {
        it('should evaluate a single rule to [true]', () => {
            const parameter: RuleParameter = {
                type: 'primitive',
                value: 'negative'
            };

            const result = not(context, parameter);
            expect(result).toBeTruthy();
        });

        it('should evaluate to [false] when no parameters provided', () => {
            const result = not(context);
            expect(result).toBeFalsy();
        });

        it('should evaluate to [false] when evaluator not available', () => {
            const parameter: RuleParameter = {
                type: 'primitive',
                value: 'missing'
            };

            const result = not(context, parameter);
            expect(result).toBeFalsy();
        });

        it('should evaluate a single rule to [false]', () => {
            const parameter: RuleParameter = {
                type: 'primitive',
                value: 'positive'
            };

            const result = not(context, parameter);
            expect(result).toBeFalsy();
        });

        it('should evaluate multiple rules to [true]', () => {
            const parameter1: RuleParameter = {
                type: 'primitive',
                value: 'negative'
            };

            const parameter2: RuleParameter = {
                type: 'primitive',
                value: 'negative'
            };

            const parameter3: RuleParameter = {
                type: 'primitive',
                value: 'negative'
            };

            const result = not(context, parameter1, parameter2, parameter3);
            expect(result).toBeTruthy();
        });

        it('should evaluate to [false] when one of the rules fails', () => {
            const parameter1: RuleParameter = {
                type: 'primitive',
                value: 'negative'
            };

            const parameter2: RuleParameter = {
                type: 'primitive',
                value: 'negative'
            };

            const parameter3: RuleParameter = {
                type: 'primitive',
                value: 'positive'
            };

            const result = not(context, parameter1, parameter2, parameter3);
            expect(result).toBeFalsy();
        });
    });

    describe('every', () => {
        it('should evaluate a single rule to [true]', () => {
            const parameter: RuleParameter = {
                type: 'primitive',
                value: 'positive'
            };

            const result = every(context, parameter);
            expect(result).toBeTruthy();
        });

        it('should evaluate to [false] when no parameters provided', () => {
            const result = every(context);
            expect(result).toBeFalsy();
        });

        it('should evaluate to [false] when evaluator not available', () => {
            const parameter: RuleParameter = {
                type: 'primitive',
                value: 'missing'
            };

            const result = every(context, parameter);
            expect(result).toBeFalsy();
        });

        it('should evaluate a single rule to [false]', () => {
            const parameter: RuleParameter = {
                type: 'primitive',
                value: 'negative'
            };

            const result = every(context, parameter);
            expect(result).toBeFalsy();
        });

        it('should evaluate multiple rules to [true]', () => {
            const parameter1: RuleParameter = {
                type: 'primitive',
                value: 'positive'
            };

            const parameter2: RuleParameter = {
                type: 'primitive',
                value: 'positive'
            };

            const parameter3: RuleParameter = {
                type: 'primitive',
                value: 'positive'
            };

            const result = every(context, parameter1, parameter2, parameter3);
            expect(result).toBeTruthy();
        });

        it('should evaluate to [false] when one of the rules fails', () => {
            const parameter1: RuleParameter = {
                type: 'primitive',
                value: 'positive'
            };

            const parameter2: RuleParameter = {
                type: 'primitive',
                value: 'positive'
            };

            const parameter3: RuleParameter = {
                type: 'primitive',
                value: 'negative'
            };

            const result = every(context, parameter1, parameter2, parameter3);
            expect(result).toBeFalsy();
        });
    });

    describe('some', () => {
        it('should evaluate a single rule to [true]', () => {
            const parameter: RuleParameter = {
                type: 'primitive',
                value: 'positive'
            };

            const result = some(context, parameter);
            expect(result).toBeTruthy();
        });

        it('should evaluate to [false] when no parameters provided', () => {
            const result = some(context);
            expect(result).toBeFalsy();
        });

        it('should evaluate to [false] when evaluator not available', () => {
            const parameter: RuleParameter = {
                type: 'primitive',
                value: 'missing'
            };

            const result = some(context, parameter);
            expect(result).toBeFalsy();
        });

        it('should evaluate to [true] if any rule succeeds', () => {
            const parameter1: RuleParameter = {
                type: 'primitive',
                value: 'negative'
            };

            const parameter2: RuleParameter = {
                type: 'primitive',
                value: 'positive'
            };

            const parameter3: RuleParameter = {
                type: 'primitive',
                value: 'negative'
            };

            const result = some(context, parameter1, parameter2, parameter3);
            expect(result).toBeTruthy();
        });
    });
});

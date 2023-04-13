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

import { RuleContext, RuleParameter } from '../config/rule.extensions';

export const not = (context: RuleContext, ...args: RuleParameter[]): boolean => {
    if (!args || args.length === 0) {
        return false;
    }

    return args
        .every((arg) => {
            const evaluator = context.getEvaluator(arg.value);
            if (!evaluator) {
                console.warn('evaluator not found: ' + arg.value);
                return false;
            }
            return !evaluator(context, ...(arg.parameters || []));
        });
};

export const every = (context: RuleContext, ...args: RuleParameter[]): boolean => {
    if (!args || args.length === 0) {
        return false;
    }

    return args
        .every((arg) => {
            const evaluator = context.getEvaluator(arg.value);
            if (!evaluator) {
                console.warn('evaluator not found: ' + arg.value);
                return false;
            }
            return evaluator(context, ...(arg.parameters || []));
        });
};

export const some = (context: RuleContext, ...args: RuleParameter[]): boolean => {
    if (!args || args.length === 0) {
        return false;
    }

    return args
        .some((arg) => {
            const evaluator = context.getEvaluator(arg.value);
            if (!evaluator) {
                console.warn('evaluator not found: ' + arg.value);
                return false;
            }
            return evaluator(context, ...(arg.parameters || []));
        });
};

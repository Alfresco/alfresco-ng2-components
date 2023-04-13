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

import { Injectable } from '@angular/core';
import { RuleRef, RuleContext, RuleEvaluator, RuleParameter } from '../config/rule.extensions';
import { ExtensionConfig } from '../config/extension.config';
import { ExtensionLoaderService } from './extension-loader.service';

@Injectable({
    providedIn: 'root'
})
export class RuleService {
    context: RuleContext = null;
    rules: Array<RuleRef> = [];
    evaluators: { [key: string]: RuleEvaluator } = {};

    constructor(protected loader: ExtensionLoaderService) {}

    setup(config: ExtensionConfig) {
        this.rules = this.loader.getRules(config);
    }

    /**
     * Adds one or more new rule evaluators to the existing set.
     *
     * @param values The new evaluators to add
     */
    setEvaluators(values: { [key: string]: RuleEvaluator }) {
        if (values) {
            this.evaluators = Object.assign({}, this.evaluators, values);
        }
    }

    /**
     * Retrieves a rule using its ID value.
     *
     * @param id The ID value to look for
     * @returns The rule or null if not found
     */
    getRuleById(id: string): RuleRef {
        return this.rules.find((ref) => ref.id === id);
    }

    /**
     * Retrieves a RuleEvaluator function using its key name.
     *
     * @param key Key name to look for
     * @returns RuleEvaluator or null if not found
     */
    getEvaluator(key: string): RuleEvaluator {
        if (key && key.startsWith('!')) {
            const fn = this.evaluators[key.substring(1)];
            return (context: RuleContext, ...args: RuleParameter[]): boolean => !fn(context, ...args);
        }
        return this.evaluators[key];
    }

    /**
     * Evaluates a rule.
     *
     * @param ruleId ID of the rule to evaluate
     * @param context Custom rule execution context.
     * @returns True if the rule passed, false otherwise
     */
    evaluateRule(ruleId: string, context?: RuleContext): boolean {
        const ruleRef = this.getRuleById(ruleId);
        context = context || this.context;

        if (ruleRef) {
            const evaluator = this.getEvaluator(ruleRef.type);
            if (evaluator) {
                return evaluator(context, ...ruleRef.parameters);
            }
        } else {
            const evaluator = this.getEvaluator(ruleId);
            if (evaluator) {
                return evaluator(context);
            }
        }
        return false;
    }
}

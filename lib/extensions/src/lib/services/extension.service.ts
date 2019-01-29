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

import { Injectable, Type } from '@angular/core';
import { RuleEvaluator, RuleRef, RuleContext, RuleParameter } from '../config/rule.extensions';
import { ExtensionConfig } from '../config/extension.config';
import { ExtensionLoaderService } from './extension-loader.service';
import { RouteRef } from '../config/routing.extensions';
import { ActionRef } from '../config/action.extensions';
import * as core from '../evaluators/core.evaluators';
import { ComponentRegisterService } from './component-register.service';

@Injectable({
    providedIn: 'root'
})
export class ExtensionService {
    configPath = 'assets/app.extensions.json';
    pluginsPath = 'assets/plugins';

    rules: Array<RuleRef> = [];
    routes: Array<RouteRef> = [];
    actions: Array<ActionRef> = [];
    features: Array<any> = [];

    authGuards: { [key: string]: Type<{}> } = {};
    evaluators: { [key: string]: RuleEvaluator } = {};

    constructor(
        private loader: ExtensionLoaderService,
        private componentRegister: ComponentRegisterService
    ) {
    }

    /**
     * Loads and registers an extension config file and plugins (specified by path properties).
     * @returns The loaded config data
     */
    async load(): Promise<ExtensionConfig> {
        const config = await this.loader.load(
            this.configPath,
            this.pluginsPath
        );
        this.setup(config);
        return config;
    }

    /**
     * Registers extensions from a config object.
     * @param config Object with config data
     */
    setup(config: ExtensionConfig) {
        if (!config) {
            console.warn('Extension configuration not found');
            return;
        }

        this.setEvaluators({
            'core.every': core.every,
            'core.some': core.some,
            'core.not': core.not
        });

        this.rules = this.loader.getRules(config);
        this.actions = this.loader.getActions(config);
        this.routes = this.loader.getRoutes(config);
        this.features = this.loader.getFeatures(config);
    }

    getFeature(key: string): any {
        let properties: string[] = Array.isArray(key) ? [key] : key.split('.');
        return properties.reduce((prev, curr) => prev && prev[curr], this.features);
    }

    /**
     * Adds one or more new rule evaluators to the existing set.
     * @param values The new evaluators to add
     */
    setEvaluators(values: { [key: string]: RuleEvaluator }) {
        if (values) {
            this.evaluators = Object.assign({}, this.evaluators, values);
        }
    }

    /**
     * Adds one or more new auth guards to the existing set.
     * @param values The new auth guards to add
     */
    setAuthGuards(values: { [key: string]: Type<{}> }) {
        if (values) {
            this.authGuards = Object.assign({}, this.authGuards, values);
        }
    }

    /**
     * Adds one or more new components to the existing set.
     * @param values The new components to add
     */
    setComponents(values: { [key: string]: Type<{}> }) {
        this.componentRegister.setComponents(values);
    }

    /**
     * Retrieves a route using its ID value.
     * @param id The ID value to look for
     * @returns The route or null if not found
     */
    getRouteById(id: string): RouteRef {
        return this.routes.find((route) => route.id === id);
    }

    /**
     * Retrieves one or more auth guards using an array of ID values.
     * @param ids Array of ID value to look for
     * @returns Array of auth guards or empty array if none were found
     */
    getAuthGuards(ids: string[]): Array<Type<{}>> {
        return (ids || [])
            .map((id) => this.authGuards[id])
            .filter((guard) => guard);
    }

    /**
     * Retrieves an action using its ID value.
     * @param id The ID value to look for
     * @returns Action or null if not found
     */
    getActionById(id: string): ActionRef {
        return this.actions.find((action) => action.id === id);
    }

    /**
     * Retrieves a RuleEvaluator function using its key name.
     * @param key Key name to look for
     * @returns RuleEvaluator or null if not found
     */
    getEvaluator(key: string): RuleEvaluator {
        if (key && key.startsWith('!')) {
            const fn = this.evaluators[key.substring(1)];
            return (context: RuleContext, ...args: RuleParameter[]): boolean => {
                return !fn(context, ...args);
            };
        }
        return this.evaluators[key];
    }

    /**
     * Evaluates a rule.
     * @param ruleId ID of the rule to evaluate
     * @param context Parameter object for the evaluator with details of app state
     * @returns True if the rule passed, false otherwise
     */
    evaluateRule(ruleId: string, context: RuleContext): boolean {
        const ruleRef = this.getRuleById(ruleId);

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

    /**
     * Retrieves a registered extension component using its ID value.
     * @param id The ID value to look for
     * @returns The component or null if not found
     */
    getComponentById<T>(id: string) {
        return this.componentRegister.getComponentById<T>(id);
    }

    /**
     * Retrieves a rule using its ID value.
     * @param id The ID value to look for
     * @returns The rule or null if not found
     */
    getRuleById(id: string): RuleRef {
        return this.rules.find((ref) => ref.id === id);
    }

    /**
     * Runs a lightweight expression stored in a string.
     * @param value String containing the expression or literal value
     * @param context Parameter object for the expression with details of app state
     * @returns Result of evaluated expression, if found, or the literal value otherwise
     */
    runExpression(value: string, context?: any) {
        const pattern = new RegExp(/\$\((.*\)?)\)/g);
        const matches = pattern.exec(value);

        if (matches && matches.length > 1) {
            const expression = matches[1];
            const fn = new Function('context', `return ${expression}`);
            const result = fn(context);

            return result;
        }

        return value;
    }
}
